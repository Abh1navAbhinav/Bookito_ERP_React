from __future__ import annotations

from django.conf import settings
from django.db import models
from django.utils import timezone

from apps.properties.models import Property


class TimestampedSoftDeleteModel(models.Model):
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  is_deleted = models.BooleanField(default=False)
  deleted_at = models.DateTimeField(null=True, blank=True)

  class Meta:
    abstract = True

  def soft_delete(self) -> None:
    self.is_deleted = True
    self.deleted_at = timezone.now()
    self.save(update_fields=["is_deleted", "deleted_at"])


class Quotation(TimestampedSoftDeleteModel):
  STATUS_DRAFT = "Draft"
  STATUS_SENT = "Sent"
  STATUS_DOWNLOADED = "Downloaded"

  STATUS_CHOICES = [
    (STATUS_DRAFT, "Draft"),
    (STATUS_SENT, "Sent"),
    (STATUS_DOWNLOADED, "Downloaded"),
  ]

  id = models.CharField(primary_key=True, max_length=64)
  property = models.ForeignKey(
    Property, on_delete=models.CASCADE, related_name="quotations"
  )
  recipient_name = models.CharField(max_length=255)
  date = models.DateField()
  room_category = models.CharField(max_length=100)
  standard_price = models.DecimalField(max_digits=12, decimal_places=2)
  selling_price = models.DecimalField(max_digits=12, decimal_places=2)
  tenure = models.CharField(max_length=50)
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT)
  executive = models.CharField(max_length=255)
  created_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="created_quotations",
  )

  class Meta:
    ordering = ["-date", "-created_at"]


class FinanceRecord(TimestampedSoftDeleteModel):
  """
  Aggregated financial record for a property's subscription / billing.
  """

  id = models.CharField(primary_key=True, max_length=64)
  property = models.ForeignKey(
    Property, on_delete=models.CASCADE, related_name="finance_records"
  )
  closing_amount = models.DecimalField(max_digits=12, decimal_places=2)
  pending_amount = models.DecimalField(max_digits=12, decimal_places=2)
  collected_amount = models.DecimalField(max_digits=12, decimal_places=2)
  invoice_uploaded = models.BooleanField(default=False)
  invoice_date = models.DateField(null=True, blank=True)
  last_payment_date = models.DateField(null=True, blank=True)
  executive = models.CharField(max_length=255)

  class Meta:
    ordering = ["-created_at"]


class Vendor(TimestampedSoftDeleteModel):
  id = models.CharField(primary_key=True, max_length=64)
  name = models.CharField(max_length=255)
  company = models.CharField(max_length=255)
  email = models.EmailField()
  phone = models.CharField(max_length=32, blank=True)
  category = models.CharField(max_length=100)
  outstanding_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
  status = models.CharField(max_length=16, default="active")

  class Meta:
    ordering = ["name"]


class TaxRecord(TimestampedSoftDeleteModel):
  TRANSACTION_SALE = "Sale"
  TRANSACTION_PURCHASE = "Purchase"
  TRANSACTION_CHOICES = [
    (TRANSACTION_SALE, "Sale"),
    (TRANSACTION_PURCHASE, "Purchase"),
  ]

  id = models.CharField(primary_key=True, max_length=64)
  transaction_type = models.CharField(max_length=16, choices=TRANSACTION_CHOICES)
  invoice_no = models.CharField(max_length=64)
  date = models.DateField()
  base_amount = models.DecimalField(max_digits=12, decimal_places=2)
  tax_rate = models.DecimalField(max_digits=5, decimal_places=2)
  tax_amount = models.DecimalField(max_digits=12, decimal_places=2)

  class Meta:
    ordering = ["-date"]


class Expense(TimestampedSoftDeleteModel):
  CATEGORY_OFFICE = "Office Expenses"
  CATEGORY_OTHER = "Other Expenses"
  CATEGORY_INCOME = "Income"

  CATEGORY_CHOICES = [
    (CATEGORY_OFFICE, "Office Expenses"),
    (CATEGORY_OTHER, "Other Expenses"),
    (CATEGORY_INCOME, "Income"),
  ]

  id = models.CharField(primary_key=True, max_length=64)
  category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
  description = models.CharField(max_length=255)
  amount = models.DecimalField(max_digits=12, decimal_places=2)
  date = models.DateField()
  created_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="created_expenses",
  )

  class Meta:
    ordering = ["-date", "-created_at"]

