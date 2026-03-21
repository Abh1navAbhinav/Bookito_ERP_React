from django.contrib import admin

from .models import Expense, FinanceRecord, Quotation


@admin.register(Quotation)
class QuotationAdmin(admin.ModelAdmin):
  list_display = ("id", "property", "recipient_name", "date", "selling_price", "status", "executive", "is_deleted")
  list_filter = ("status", "is_deleted", "date")
  search_fields = ("id", "property__name", "recipient_name", "executive")


@admin.register(FinanceRecord)
class FinanceRecordAdmin(admin.ModelAdmin):
  list_display = (
    "id",
    "property",
    "closing_amount",
    "pending_amount",
    "collected_amount",
    "invoice_uploaded",
    "invoice_date",
    "last_payment_date",
    "executive",
    "is_deleted",
  )
  list_filter = ("invoice_uploaded", "is_deleted")
  search_fields = ("id", "property__name", "executive")


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
  list_display = ("id", "category", "description", "amount", "date", "is_deleted")
  list_filter = ("category", "is_deleted", "date")
  search_fields = ("description",)

