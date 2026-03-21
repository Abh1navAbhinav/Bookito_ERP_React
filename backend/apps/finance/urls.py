from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
  ExpenseViewSet,
  FinanceRecordViewSet,
  FinanceSummaryViewSet,
  QuotationViewSet,
  TaxRecordViewSet,
  VendorViewSet,
)

router = DefaultRouter()
router.register("quotations", QuotationViewSet, basename="quotation")
router.register("payments", FinanceRecordViewSet, basename="finance-record")
router.register("expenses", ExpenseViewSet, basename="expense")
router.register("vendors", VendorViewSet, basename="vendor")
router.register("tax-records", TaxRecordViewSet, basename="tax-record")
router.register("summary", FinanceSummaryViewSet, basename="finance-summary")

urlpatterns = [
  path("", include(router.urls)),
]

