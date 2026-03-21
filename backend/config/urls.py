from django.contrib import admin
from django.urls import include, path

urlpatterns = [
  path("admin/", admin.site.urls),
  path("api/accounts/", include("apps.accounts.urls")),
  path("api/", include("apps.properties.urls")),
  path("api/finance/", include("apps.finance.urls")),
  path("api/hr/", include("apps.hr.urls")),
  path("api/sales/", include("apps.sales.urls")),
  path("api/partners/", include("apps.partners.urls")),
  path("api/reports/", include("apps.reports.urls")),
  path("api/subscriptions/", include("apps.subscriptions.urls")),
]

