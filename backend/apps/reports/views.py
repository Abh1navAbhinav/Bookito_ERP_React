from __future__ import annotations

from datetime import timedelta
from decimal import Decimal

from django.db import models
from django.db.models import Sum
from django.utils import timezone
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import User
from apps.accounts.permissions import RolePermission
from apps.finance.models import Expense, FinanceRecord, Quotation
from apps.hr.models import Attendance, Employee
from apps.partners.models import TravelAgent
from apps.properties.models import Property
from apps.sales.models import SalesRecord

from .location_config import load_location_hierarchy
from .report_helpers import (
  REPORT_BUILDERS,
  attrition_trend_months,
  catalog_counts,
  hiring_trend_months,
  hr_report_cards,
)
from .serializers import (
  CompanyOverviewSerializer,
  DashboardChartsSerializer,
  ExecutiveSerializer,
  FinanceChartsSerializer,
  FinanceSummarySerializer,
)

REPORT_CATALOG_META = [
  {
    "id": "financeOverview",
    "label": "Finance Overview",
    "description": "High-level revenue, expenses, and profit summary",
  },
  {
    "id": "revenueCollections",
    "label": "Revenue & Collections",
    "description": "Closing amounts, collections, and pending receivables",
  },
  {
    "id": "expensesPayables",
    "label": "Expenses & Payables",
    "description": "Operating expenses, vendor payments, and approvals",
  },
  {
    "id": "profitability",
    "label": "Profitability Analysis",
    "description": "Property-wise and segment-wise profit & loss",
  },
  {
    "id": "cashFlow",
    "label": "Cash Flow",
    "description": "Inflow / outflow trends and cash position",
  },
  {
    "id": "taxCompliance",
    "label": "Tax & Compliance",
    "description": "GST, TDS, and statutory payment summaries",
  },
  {
    "id": "audit",
    "label": "Audit Report",
    "description": "Audit trail, control checks, and exception logs",
  },
]


class CompanyOverviewView(APIView):
  """
  Aggregated KPIs for dashboards.

  GET /api/reports/overview/
  """

  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [
    User.ROLE_MANAGER,
    User.ROLE_SALES,
    User.ROLE_ACCOUNTANT,
    User.ROLE_HR,
    User.ROLE_CRM,
    User.ROLE_ADMIN,
  ]

  def get(self, request, *args, **kwargs):
    today = timezone.localdate()

    total_properties = Property.objects.filter(is_deleted=False).count()
    active_properties = total_properties

    total_revenue = (
      FinanceRecord.objects.filter(is_deleted=False)
      .aggregate(total=models.Sum("collected_amount"))
      .get("total")
      or 0
    )
    expense_qs = Expense.objects.filter(is_deleted=False)
    total_expenses = (
      expense_qs.exclude(category=Expense.CATEGORY_INCOME)
      .aggregate(total=models.Sum("amount"))
      .get("total")
      or 0
    )
    net_revenue = total_revenue - total_expenses

    active_travel_agents = TravelAgent.objects.filter(is_deleted=False).count()

    total_employees = Employee.objects.filter(is_deleted=False).count()
    present_today = Attendance.objects.filter(
      is_deleted=False, date=today, status=Attendance.STATUS_PRESENT
    ).count()
    on_leave_today = Attendance.objects.filter(
      is_deleted=False, date=today, status=Attendance.STATUS_LEAVE
    ).count()

    open_quotations = Quotation.objects.filter(
      is_deleted=False, status__in=[Quotation.STATUS_DRAFT, Quotation.STATUS_SENT]
    ).count()
    closed_quotations = Quotation.objects.filter(
      is_deleted=False, status=Quotation.STATUS_DOWNLOADED
    ).count()

    month_start = today.replace(day=1)
    sales_closings_this_month = SalesRecord.objects.filter(
      is_deleted=False,
      status=SalesRecord.STATUS_CLOSED,
      updated_at__date__gte=month_start,
    ).count()

    expiry_end = today + timedelta(days=7)
    upcoming_plan_expiry = Property.objects.filter(
      is_deleted=False,
      plan_expiry_date__gte=today,
      plan_expiry_date__lte=expiry_end,
    ).count()

    payload = {
      "total_properties": total_properties,
      "active_properties": active_properties,
      "total_revenue": total_revenue,
      "total_expenses": total_expenses,
      "net_revenue": net_revenue,
      "active_travel_agents": active_travel_agents,
      "total_employees": total_employees,
      "present_today": present_today,
      "on_leave_today": on_leave_today,
      "open_quotations": open_quotations,
      "closed_quotations": closed_quotations,
      "sales_closings_this_month": sales_closings_this_month,
      "upcoming_plan_expiry": upcoming_plan_expiry,
    }
    serializer = CompanyOverviewSerializer(payload)
    return Response(serializer.data)


class FinanceSummaryView(APIView):
  """
  Aggregated finance stats for FinanceDashboard.

  GET /api/reports/finance-summary/
  """

  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [
    User.ROLE_MANAGER,
    User.ROLE_ACCOUNTANT,
  ]

  def get(self, request, *args, **kwargs):
    qs = FinanceRecord.objects.filter(is_deleted=False)
    totals = qs.aggregate(
      total_closing=models.Sum("closing_amount"),
      total_pending=models.Sum("pending_amount"),
      total_collected=models.Sum("collected_amount"),
    )
    payload = {
      "total_closing_amount": totals.get("total_closing") or 0,
      "total_collected_amount": totals.get("total_collected") or 0,
      "total_pending_amount": totals.get("total_pending") or 0,
    }
    serializer = FinanceSummarySerializer(payload)
    return Response(serializer.data)


def _month_name(d):
  return d.strftime("%b")


class DashboardChartsView(APIView):
  """
  Chart data for main dashboard: revenue, property distribution, closing vs pending, sales performance.
  GET /api/reports/dashboard-charts/
  """

  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [
    User.ROLE_MANAGER,
    User.ROLE_SALES,
    User.ROLE_ACCOUNTANT,
    User.ROLE_HR,
    User.ROLE_CRM,
    User.ROLE_ADMIN,
  ]

  def get(self, request, *args, **kwargs):
    today = timezone.localdate()

    # Revenue by month (last 12 months from FinanceRecord collected_amount)
    revenue_by_month = []
    for i in range(11, -1, -1):
      month_date = today - timedelta(days=30 * i)
      month_start = month_date.replace(day=1)
      if month_date.month == 12:
        month_end = month_date.replace(year=month_date.year + 1, month=1, day=1) - timedelta(days=1)
      else:
        month_end = month_date.replace(month=month_date.month + 1, day=1) - timedelta(days=1)
      total = (
        FinanceRecord.objects.filter(
          is_deleted=False,
          created_at__date__gte=month_start,
          created_at__date__lte=month_end,
        ).aggregate(s=Sum("collected_amount"))
      ).get("s") or Decimal("0")
      revenue_by_month.append({
        "month": _month_name(month_date),
        "revenue": float(total),
        "target": float(total) * 1.1 if total else 0,
      })
    if not revenue_by_month:
      revenue_by_month = [{"month": _month_name(today), "revenue": 0, "target": 0}]

    # Property distribution by property_type
    from django.db.models import Count
    dist = (
      Property.objects.filter(is_deleted=False)
      .values("property_type")
      .annotate(count=Count("id"))
    )
    colors = ["#6366f1", "#818cf8", "#a5b4fc", "#10b981", "#34d399", "#6ee7b7"]
    property_distribution_data = [
      {"name": d["property_type"], "value": d["count"], "color": colors[i % len(colors)]}
      for i, d in enumerate(dist)
    ]
    if not property_distribution_data:
      property_distribution_data = [{"name": "No data", "value": 0, "color": "#94a3b8"}]

    # Closing vs pending by month (from FinanceRecord: closed = with collected; pending = pending_amount)
    closing_pending = []
    for i in range(5, -1, -1):
      month_date = today - timedelta(days=30 * i)
      month_start = month_date.replace(day=1)
      if month_date.month == 12:
        month_end = month_date.replace(year=month_date.year + 1, month=1, day=1) - timedelta(days=1)
      else:
        month_end = month_date.replace(month=month_date.month + 1, day=1) - timedelta(days=1)
      qs = FinanceRecord.objects.filter(
        is_deleted=False,
        created_at__date__gte=month_start,
        created_at__date__lte=month_end,
      )
      closed = qs.filter(pending_amount=0).count()
      pending = qs.exclude(pending_amount=0).count()
      closing_pending.append({
        "month": _month_name(month_date),
        "closed": closed,
        "pending": pending,
      })
    if not closing_pending:
      closing_pending = [{"month": _month_name(today), "closed": 0, "pending": 0}]

    # Sales performance by executive (from SalesRecord)
    exec_agg = (
      SalesRecord.objects.filter(is_deleted=False)
      .values("executive")
      .annotate(
        closings=models.Count("id", filter=models.Q(status=SalesRecord.STATUS_CLOSED)),
        demos=models.Count("id", filter=models.Q(demo_provided=True)),
        trials=models.Count("id", filter=models.Q(trial_provided=True)),
      )
    )
    rev_by_exec = (
      FinanceRecord.objects.filter(is_deleted=False)
      .values("executive")
      .annotate(revenue=Sum("collected_amount"))
    )
    rev_map = {r["executive"]: float(r["revenue"] or 0) for r in rev_by_exec}
    sales_performance_data = [
      {
        "name": e["executive"],
        "closings": e["closings"],
        "demos": e["demos"],
        "trials": e["trials"],
        "revenue": rev_map.get(e["executive"], 0),
      }
      for e in exec_agg
    ]
    if not sales_performance_data:
      sales_performance_data = [{"name": "No data", "closings": 0, "demos": 0, "trials": 0, "revenue": 0}]

    payload = {
      "revenue_chart_data": revenue_by_month,
      "property_distribution_data": property_distribution_data,
      "closing_vs_pending_data": closing_pending,
      "sales_performance_data": sales_performance_data,
    }
    return Response(payload)


class FinanceChartsView(APIView):
  """
  Chart data for finance dashboard: monthly revenue, expense by category.
  GET /api/reports/finance-charts/
  """

  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_ACCOUNTANT]

  def get(self, request, *args, **kwargs):
    today = timezone.localdate()

    monthly = []
    for i in range(5, -1, -1):
      month_date = today - timedelta(days=30 * i)
      month_start = month_date.replace(day=1)
      if month_date.month == 12:
        month_end = month_date.replace(year=month_date.year + 1, month=1, day=1) - timedelta(days=1)
      else:
        month_end = month_date.replace(month=month_date.month + 1, day=1) - timedelta(days=1)
      total = (
        FinanceRecord.objects.filter(
          is_deleted=False,
          created_at__date__gte=month_start,
          created_at__date__lte=month_end,
        ).aggregate(s=Sum("collected_amount"))
      ).get("s") or Decimal("0")
      monthly.append({"month": _month_name(month_date), "revenue": float(total)})
    if not monthly:
      monthly = [{"month": _month_name(today), "revenue": 0}]

    from django.db.models import Sum as SumAgg
    exp_by_cat = (
      Expense.objects.filter(is_deleted=False)
      .exclude(category=Expense.CATEGORY_INCOME)
      .values("category")
      .annotate(total=SumAgg("amount"))
    )
    colors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
    expense_distribution_data = [
      {"name": e["category"], "value": float(e["total"] or 0), "color": colors[i % len(colors)]}
      for i, e in enumerate(exp_by_cat)
    ]
    if not expense_distribution_data:
      expense_distribution_data = [{"name": "No expenses", "value": 0, "color": "#94a3b8"}]

    payload = {
      "monthly_revenue_data": monthly,
      "expense_distribution_data": expense_distribution_data,
    }
    return Response(payload)


class ExecutivesView(APIView):
  """
  List executives with aggregated stats (from SalesRecord + FinanceRecord).
  GET /api/reports/executives/
  """

  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [
    User.ROLE_MANAGER,
    User.ROLE_SALES,
    User.ROLE_CRM,
    User.ROLE_ADMIN,
  ]

  def get(self, request, *args, **kwargs):
    today = timezone.localdate()
    # Build list from User (sales/manager) + distinct executives from SalesRecord
    user_execs = list(
      User.objects.filter(role__in=[User.ROLE_MANAGER, User.ROLE_SALES])
      .values_list("id", "first_name", "last_name", "email")
    )
    name_from_record = set(
      SalesRecord.objects.filter(is_deleted=False).values_list("executive", flat=True).distinct()
    )
    name_from_finance = set(
      FinanceRecord.objects.filter(is_deleted=False).values_list("executive", flat=True).distinct()
    )
    all_names = name_from_record | name_from_finance
    for uid, first, last, email in user_execs:
      all_names.add(f"{first} {last}".strip() or email)

    executives_payload = []
    for idx, name in enumerate(sorted(all_names)):
      if not name:
        continue
      closings = SalesRecord.objects.filter(
        is_deleted=False, executive=name, status=SalesRecord.STATUS_CLOSED
      ).count()
      demos = SalesRecord.objects.filter(is_deleted=False, executive=name, demo_provided=True).count()
      trials = SalesRecord.objects.filter(is_deleted=False, executive=name, trial_provided=True).count()
      revenue = (
        FinanceRecord.objects.filter(is_deleted=False, executive=name).aggregate(
          s=Sum("collected_amount")
        )
      ).get("s") or Decimal("0")
      initials = "".join(w[0] for w in name.split()[:2]).upper() if name else "?"
      user = User.objects.filter(first_name__icontains=name.split()[0] if name else "").first()
      email = user.email if user else f"{name.lower().replace(' ', '.')}@bookito.in"
      role = "Senior Sales Executive" if closings > 20 else "Sales Executive"
      monthly_performance = []
      for i in range(5, -1, -1):
        month_date = today - timedelta(days=30 * i)
        month_start = month_date.replace(day=1)
        if month_date.month == 12:
          month_end = month_date.replace(year=month_date.year + 1, month=1, day=1) - timedelta(days=1)
        else:
          month_end = month_date.replace(month=month_date.month + 1, day=1) - timedelta(days=1)
        m_closings = SalesRecord.objects.filter(
          is_deleted=False,
          executive=name,
          status=SalesRecord.STATUS_CLOSED,
          updated_at__date__gte=month_start,
          updated_at__date__lte=month_end,
        ).count()
        m_rev = (
          FinanceRecord.objects.filter(
            is_deleted=False,
            executive=name,
            created_at__date__gte=month_start,
            created_at__date__lte=month_end,
          ).aggregate(s=Sum("collected_amount"))
        ).get("s") or Decimal("0")
        monthly_performance.append({
          "month": _month_name(month_date),
          "closings": m_closings,
          "revenue": float(m_rev),
          "target": 40,
        })
      executives_payload.append({
        "id": idx + 1,
        "name": name,
        "email": email,
        "avatar": initials[:2],
        "role": role,
        "closings": closings,
        "revenue_generated": revenue,
        "demos_given": demos,
        "trials_provided": trials,
        "target_closings": 40,
        "monthly_performance": monthly_performance,
        "agenda": [],
      })

    serializer = ExecutiveSerializer(executives_payload, many=True)
    return Response(serializer.data)


class ConfigView(APIView):
  """
  Static config for frontend: location hierarchy, dropdown options.
  GET /api/reports/config/
  """

  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [
    User.ROLE_MANAGER,
    User.ROLE_SALES,
    User.ROLE_ACCOUNTANT,
    User.ROLE_HR,
    User.ROLE_CRM,
    User.ROLE_ADMIN,
  ]

  def get(self, request, *args, **kwargs):
    location_hierarchy = load_location_hierarchy()
    if not location_hierarchy:
      location_hierarchy = [
        {
          "id": "kerala",
          "name": "Kerala",
          "children": [
            {"id": "kerala__kozhikode", "name": "Kozhikode", "children": []},
            {"id": "kerala__ernakulam", "name": "Ernakulam", "children": []},
          ],
        },
      ]
    payload = {
      "location_hierarchy": location_hierarchy,
      "property_types": ["Resort", "Hotel", "Homestay", "Business Class Hotel", "Lodging", "Cottage"],
      "property_classes": ["Luxury", "Premium", "Standard", "Average"],
      "room_categories": ["1-10 rooms", "11-20 rooms", "21-30 rooms", "30+ rooms"],
      "tenure_options": ["6 Months", "1 Year"],
      "primary_contact_options": ["Owner", "Manager", "Front Office", "HR"],
      "visit_status_options": ["Interested", "Not Interested", "Requested Demo", "Rescheduled", "Closed"],
      "first_visit_status_options": ["Interested", "Not Interested", "Requested Demo", "Rescheduled"],
      "plan_type_options": ["6 Month", "1 Year"],
    }
    return Response(payload)


class ReportCatalogView(APIView):
  """
  Finance report tiles with live counts from finance/HR aggregates.

  GET /api/reports/catalog/
  """

  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [
    User.ROLE_MANAGER,
    User.ROLE_ACCOUNTANT,
    User.ROLE_ADMIN,
  ]

  def get(self, request, *args, **kwargs):
    today = timezone.localdate()
    counts = catalog_counts(today)
    reports = [{**meta, "count": counts.get(meta["id"], 0)} for meta in REPORT_CATALOG_META]
    return Response({"reports": reports})


class ReportMetricsView(APIView):
  """
  Metrics table for a selected finance report (this month vs last month).

  GET /api/reports/metrics/?report=financeOverview
  """

  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [
    User.ROLE_MANAGER,
    User.ROLE_ACCOUNTANT,
    User.ROLE_ADMIN,
  ]

  def get(self, request, *args, **kwargs):
    report_id = request.query_params.get("report")
    if not report_id or report_id not in REPORT_BUILDERS:
      return Response({"detail": "Invalid or missing report query parameter."}, status=400)
    today = timezone.localdate()
    metrics = REPORT_BUILDERS[report_id](today)
    return Response({"reportId": report_id, "metrics": metrics})


class HrReportsAnalyticsView(APIView):
  """
  HR dashboard cards and hiring/attrition series.

  GET /api/reports/hr-analytics/
  """

  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [
    User.ROLE_HR,
    User.ROLE_MANAGER,
    User.ROLE_ADMIN,
  ]

  def get(self, request, *args, **kwargs):
    return Response(
      {
        "cards": hr_report_cards(),
        "hiringTrend": hiring_trend_months(6),
        "attritionTrend": attrition_trend_months(6),
      }
    )

