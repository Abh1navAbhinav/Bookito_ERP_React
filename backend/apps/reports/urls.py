from django.urls import path

from .views import (
  CompanyOverviewView,
  ConfigView,
  DashboardChartsView,
  ExecutivesView,
  FinanceChartsView,
  FinanceSummaryView,
  HrReportsAnalyticsView,
  ReportCatalogView,
  ReportMetricsView,
)

urlpatterns = [
  path("overview/", CompanyOverviewView.as_view(), name="company-overview"),
  path("finance-summary/", FinanceSummaryView.as_view(), name="finance-summary"),
  path("dashboard-charts/", DashboardChartsView.as_view(), name="dashboard-charts"),
  path("finance-charts/", FinanceChartsView.as_view(), name="finance-charts"),
  path("executives/", ExecutivesView.as_view(), name="executives"),
  path("config/", ConfigView.as_view(), name="config"),
  path("catalog/", ReportCatalogView.as_view(), name="report-catalog"),
  path("metrics/", ReportMetricsView.as_view(), name="report-metrics"),
  path("hr-analytics/", HrReportsAnalyticsView.as_view(), name="hr-reports-analytics"),
]


