from __future__ import annotations

from calendar import month_abbr
from datetime import date, timedelta
from decimal import Decimal

from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth
from django.utils import timezone

from apps.finance.models import Expense, FinanceRecord, Quotation, TaxRecord, Vendor
from apps.hr.models import Employee, ExitRequest, Payroll, TrainingProgram


def month_start(d: date) -> date:
  return d.replace(day=1)


def prev_month_window(ref: date) -> tuple[date, date]:
  first_this = month_start(ref)
  last_prev = first_this - timedelta(days=1)
  first_prev = month_start(last_prev)
  return first_prev, last_prev


def fmt_inr(value: Decimal | float | int) -> str:
  v = float(value)
  if v >= 100000:
    return f"₹{v / 100000:.2f}L"
  return f"₹{v:,.0f}"


def pct_change(curr: Decimal, prev: Decimal) -> tuple[str, bool]:
  c = float(curr)
  p = float(prev)
  if p == 0:
    if c == 0:
      return "0%", True
    return "100%", True
  ch = ((c - p) / p) * 100
  s = f"{abs(ch):.1f}%"
  return s, ch >= 0


def metric_row(name: str, curr: str, prev: str, change: str, is_positive: bool) -> dict:
  arrow = change
  return {
    "name": name,
    "current": curr,
    "previous": prev,
    "change": arrow,
    "isPositive": is_positive,
  }


def sum_collected(start: date, end: date) -> Decimal:
  v = (
    FinanceRecord.objects.filter(is_deleted=False, created_at__date__gte=start, created_at__date__lte=end)
    .aggregate(t=Sum("collected_amount"))
    .get("t")
  )
  return v or Decimal(0)


def sum_closing(start: date, end: date) -> Decimal:
  v = (
    FinanceRecord.objects.filter(is_deleted=False, created_at__date__gte=start, created_at__date__lte=end)
    .aggregate(t=Sum("closing_amount"))
    .get("t")
  )
  return v or Decimal(0)


def sum_pending_outstanding() -> Decimal:
  v = FinanceRecord.objects.filter(is_deleted=False).aggregate(t=Sum("pending_amount")).get("t")
  return v or Decimal(0)


def sum_operating_expenses(start: date, end: date) -> Decimal:
  v = (
    Expense.objects.filter(
      is_deleted=False,
      date__gte=start,
      date__lte=end,
    )
    .exclude(category=Expense.CATEGORY_INCOME)
    .aggregate(t=Sum("amount"))
    .get("t")
  )
  return v or Decimal(0)


def sum_office_expenses(start: date, end: date) -> Decimal:
  v = (
    Expense.objects.filter(
      is_deleted=False,
      category=Expense.CATEGORY_OFFICE,
      date__gte=start,
      date__lte=end,
    )
    .aggregate(t=Sum("amount"))
    .get("t")
  )
  return v or Decimal(0)


def sum_income_category(start: date, end: date) -> Decimal:
  v = (
    Expense.objects.filter(
      is_deleted=False,
      category=Expense.CATEGORY_INCOME,
      date__gte=start,
      date__lte=end,
    )
    .aggregate(t=Sum("amount"))
    .get("t")
  )
  return v or Decimal(0)


def build_finance_overview_metrics(today: date) -> list[dict]:
  t0, t1 = month_start(today), today
  p0, p1 = prev_month_window(today)

  rev_c = sum_collected(t0, t1)
  rev_p = sum_collected(p0, p1)
  exp_c = sum_operating_expenses(t0, t1)
  exp_p = sum_operating_expenses(p0, p1)
  net_c = rev_c - exp_c
  net_p = rev_p - exp_p
  margin_c = (net_c / rev_c * 100) if rev_c else Decimal(0)
  margin_p = (net_p / rev_p * 100) if rev_p else Decimal(0)

  ch_rev, pos_rev = pct_change(rev_c, rev_p)
  ch_exp, pos_exp = pct_change(exp_c, exp_p)
  ch_net, pos_net = pct_change(net_c, net_p)
  ch_mar, pos_mar = pct_change(margin_c, margin_p)

  return [
    metric_row("Total Revenue", fmt_inr(rev_c), fmt_inr(rev_p), ch_rev, pos_rev),
    metric_row("Total Expenses", fmt_inr(exp_c), fmt_inr(exp_p), ch_exp, not pos_exp),
    metric_row("Net Profit", fmt_inr(net_c), fmt_inr(net_p), ch_net, pos_net),
    metric_row("Profit Margin", f"{float(margin_c):.1f}%", f"{float(margin_p):.1f}%", ch_mar, pos_mar),
    metric_row(
      "Open Quotations",
      str(Quotation.objects.filter(is_deleted=False).count()),
      "—",
      "—",
      True,
    ),
  ]


def build_revenue_collections_metrics(today: date) -> list[dict]:
  t0, t1 = month_start(today), today
  p0, p1 = prev_month_window(today)
  close_c = sum_closing(t0, t1)
  close_p = sum_closing(p0, p1)
  coll_c = sum_collected(t0, t1)
  coll_p = sum_collected(p0, p1)
  pend = sum_pending_outstanding()
  ch_cl, pos_cl = pct_change(close_c, close_p)
  ch_co, pos_co = pct_change(coll_c, coll_p)
  return [
    metric_row("Closing Amount (period)", fmt_inr(close_c), fmt_inr(close_p), ch_cl, pos_cl),
    metric_row("Total Collections", fmt_inr(coll_c), fmt_inr(coll_p), ch_co, pos_co),
    metric_row("Pending Receivables", fmt_inr(pend), fmt_inr(pend), "0%", True),
    metric_row(
      "Active Payment Records",
      str(FinanceRecord.objects.filter(is_deleted=False).count()),
      "—",
      "—",
      True,
    ),
    metric_row(
      "Quotations (open)",
      str(
        Quotation.objects.filter(
          is_deleted=False,
          status__in=[Quotation.STATUS_DRAFT, Quotation.STATUS_SENT],
        ).count()
      ),
      "—",
      "—",
      True,
    ),
  ]


def build_expenses_payables_metrics(today: date) -> list[dict]:
  t0, t1 = month_start(today), today
  p0, p1 = prev_month_window(today)
  op_c = sum_operating_expenses(t0, t1)
  op_p = sum_operating_expenses(p0, p1)
  of_c = sum_office_expenses(t0, t1)
  of_p = sum_office_expenses(p0, p1)
  vend = Vendor.objects.filter(is_deleted=False).aggregate(t=Sum("outstanding_amount")).get("t") or Decimal(0)
  ch_op, pos_op = pct_change(op_c, op_p)
  ch_of, pos_of = pct_change(of_c, of_p)
  return [
    metric_row("Total Operating Expenses", fmt_inr(op_c), fmt_inr(op_p), ch_op, not pos_op),
    metric_row("Office Expenses", fmt_inr(of_c), fmt_inr(of_p), ch_of, not pos_of),
    metric_row("Vendor Payables (outstanding)", fmt_inr(vend), fmt_inr(vend), "0%", True),
    metric_row(
      "Expense Records",
      str(Expense.objects.filter(is_deleted=False).exclude(category=Expense.CATEGORY_INCOME).count()),
      "—",
      "—",
      True,
    ),
    metric_row("Active Vendors", str(Vendor.objects.filter(is_deleted=False).count()), "—", "—", True),
  ]


def build_profitability_metrics(today: date) -> list[dict]:
  from apps.properties.models import Property

  props = Property.objects.filter(is_deleted=False).count()
  t0, t1 = month_start(today), today
  p0, p1 = prev_month_window(today)
  net_c = sum_collected(t0, t1) - sum_operating_expenses(t0, t1)
  net_p = sum_collected(p0, p1) - sum_operating_expenses(p0, p1)
  ch, pos = pct_change(net_c, net_p)
  return [
    metric_row("Properties (active)", str(props), "—", "—", True),
    metric_row("Period Net (collections − opex)", fmt_inr(net_c), fmt_inr(net_p), ch, pos),
    metric_row("Total Collected (all time)", fmt_inr(sum_collected(date(2000, 1, 1), today)), "—", "—", True),
    metric_row("Finance Records", str(FinanceRecord.objects.filter(is_deleted=False).count()), "—", "—", True),
    metric_row("Tax Records", str(TaxRecord.objects.filter(is_deleted=False).count()), "—", "—", True),
  ]


def build_cash_flow_metrics(today: date) -> list[dict]:
  t0, t1 = month_start(today), today
  p0, p1 = prev_month_window(today)
  in_c = sum_collected(t0, t1)
  in_p = sum_collected(p0, p1)
  out_c = sum_operating_expenses(t0, t1)
  out_p = sum_operating_expenses(p0, p1)
  inc_c = sum_income_category(t0, t1)
  inc_p = sum_income_category(p0, p1)
  net_c = in_c - out_c
  net_p = in_p - out_p
  ch_i, pos_i = pct_change(in_c, in_p)
  ch_o, _ = pct_change(out_c, out_p)
  ch_n, pos_n = pct_change(net_c, net_p)
  ch_inc, pos_inc = pct_change(inc_c, inc_p)
  return [
    metric_row("Cash Inflows (collections)", fmt_inr(in_c), fmt_inr(in_p), ch_i, pos_i),
    metric_row("Cash Outflows (opex)", fmt_inr(out_c), fmt_inr(out_p), ch_o, False),
    metric_row("Net Cash Position", fmt_inr(net_c), fmt_inr(net_p), ch_n, pos_n),
    metric_row("Pending Collections", fmt_inr(sum_pending_outstanding()), "—", "—", True),
    metric_row("Income-category credits", fmt_inr(inc_c), fmt_inr(inc_p), ch_inc, pos_inc),
  ]


def build_tax_compliance_metrics(today: date) -> list[dict]:
  t0, t1 = month_start(today), today
  tax_c = (
    TaxRecord.objects.filter(is_deleted=False, date__gte=t0, date__lte=t1).aggregate(t=Sum("tax_amount")).get("t")
    or Decimal(0)
  )
  tax_p = (
    TaxRecord.objects.filter(
      is_deleted=False,
      date__gte=prev_month_window(today)[0],
      date__lte=prev_month_window(today)[1],
    )
    .aggregate(t=Sum("tax_amount"))
    .get("t")
    or Decimal(0)
  )
  ch, pos = pct_change(tax_c, tax_p)
  return [
    metric_row("Tax Amount (period)", fmt_inr(tax_c), fmt_inr(tax_p), ch, not pos),
    metric_row("Tax Records", str(TaxRecord.objects.filter(is_deleted=False).count()), "—", "—", True),
    metric_row("GST / compliance rows", str(TaxRecord.objects.filter(is_deleted=False).count()), "—", "—", True),
    metric_row("Vendors tracked", str(Vendor.objects.filter(is_deleted=False).count()), "—", "—", True),
    metric_row("Expense documents", str(Expense.objects.filter(is_deleted=False).count()), "—", "—", True),
  ]


def build_audit_metrics(today: date) -> list[dict]:
  from apps.hr.models import LeaveRequest

  leaves = LeaveRequest.objects.filter(is_deleted=False).count()
  emps = Employee.objects.filter(is_deleted=False).count()
  exits = ExitRequest.objects.filter(is_deleted=False).count()
  return [
    metric_row("Employees", str(emps), "—", "—", True),
    metric_row("Leave Requests (total)", str(leaves), "—", "—", True),
    metric_row("Exit Requests", str(exits), "—", "—", exits == 0),
    metric_row("Finance Records", str(FinanceRecord.objects.filter(is_deleted=False).count()), "—", "—", True),
    metric_row("Quotations", str(Quotation.objects.filter(is_deleted=False).count()), "—", "—", True),
  ]


REPORT_BUILDERS = {
  "financeOverview": build_finance_overview_metrics,
  "revenueCollections": build_revenue_collections_metrics,
  "expensesPayables": build_expenses_payables_metrics,
  "profitability": build_profitability_metrics,
  "cashFlow": build_cash_flow_metrics,
  "taxCompliance": build_tax_compliance_metrics,
  "audit": build_audit_metrics,
}


def catalog_counts(today: date) -> dict[str, int]:
  return {
    "financeOverview": Quotation.objects.filter(is_deleted=False).count()
    + FinanceRecord.objects.filter(is_deleted=False).count()
    + Expense.objects.filter(is_deleted=False).count(),
    "revenueCollections": FinanceRecord.objects.filter(is_deleted=False).count(),
    "expensesPayables": Expense.objects.filter(is_deleted=False).count() + Vendor.objects.filter(is_deleted=False).count(),
    "profitability": FinanceRecord.objects.filter(is_deleted=False).count(),
    "cashFlow": FinanceRecord.objects.filter(is_deleted=False).count(),
    "taxCompliance": TaxRecord.objects.filter(is_deleted=False).count(),
    "audit": Employee.objects.filter(is_deleted=False).count() + ExitRequest.objects.filter(is_deleted=False).count(),
  }


def hiring_trend_months(months: int = 6) -> list[dict]:
  today = timezone.localdate()
  start = today.replace(day=1) - timedelta(days=32 * months)
  qs = (
    Employee.objects.filter(is_deleted=False, date_of_joining__gte=start)
    .annotate(m=TruncMonth("date_of_joining"))
    .values("m")
    .annotate(hires=Count("id"))
    .order_by("m")
  )
  out = []
  for row in qs:
    m = row["m"]
    if m is None:
      continue
    d = m.date() if hasattr(m, "date") else m
    label = month_abbr[d.month] if getattr(d, "month", None) else ""
    out.append({"month": label, "hires": row["hires"]})
  if len(out) < 2:
    return [
      {"month": "Jan", "hires": Employee.objects.filter(is_deleted=False).count() or 0},
      {"month": "Feb", "hires": 0},
      {"month": "Mar", "hires": 0},
    ]
  return out[-months:]


def attrition_trend_months(months: int = 6) -> list[dict]:
  today = timezone.localdate()
  start = today.replace(day=1) - timedelta(days=32 * months)
  qs = (
    ExitRequest.objects.filter(is_deleted=False, resignation_date__gte=start)
    .annotate(m=TruncMonth("resignation_date"))
    .values("m")
    .annotate(exits=Count("id"))
    .order_by("m")
  )
  emps = max(Employee.objects.filter(is_deleted=False).count(), 1)
  out = []
  for row in qs:
    m = row["m"]
    if m is None:
      continue
    d = m.date() if hasattr(m, "date") else m
    label = month_abbr[d.month] if getattr(d, "month", None) else ""
    rate = min(99.0, round(100.0 * row["exits"] / emps, 1))
    out.append({"month": label, "rate": rate})
  if len(out) < 2:
    return [
      {"month": "Jan", "rate": 0.0},
      {"month": "Feb", "rate": 0.0},
      {"month": "Mar", "rate": 0.0},
    ]
  return out[-months:]


def hr_report_cards() -> list[dict]:
  today = timezone.localdate()
  emps = Employee.objects.filter(is_deleted=False).count()
  exits_90 = ExitRequest.objects.filter(
    is_deleted=False,
    resignation_date__gte=today - timedelta(days=90),
  ).count()
  turnover = min(99.0, round(100.0 * exits_90 / max(emps, 1), 1))
  training = TrainingProgram.objects.filter(is_deleted=False, status="Published").count()
  payroll_month = today.replace(day=1)
  payroll_total = (
    Payroll.objects.filter(is_deleted=False, month__year=payroll_month.year, month__month=payroll_month.month)
    .aggregate(t=Sum("net_salary"))
    .get("t")
    or Decimal(0)
  )
  return [
    {
      "title": "Active Employees",
      "value": str(emps),
      "desc": "Headcount from HR employee directory",
      "icon": "users",
    },
    {
      "title": "Turnover (90d)",
      "value": f"{turnover}%",
      "desc": "Exit requests vs active employees",
      "icon": "trending",
    },
    {
      "title": "Published Training",
      "value": str(training),
      "desc": "Training programs marked published",
      "icon": "file",
    },
    {
      "title": "Payroll (this month)",
      "value": fmt_inr(payroll_total),
      "desc": "Sum of net salary rows for current month",
      "icon": "dollar",
    },
  ]
