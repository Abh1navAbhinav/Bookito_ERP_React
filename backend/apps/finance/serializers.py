from __future__ import annotations

from rest_framework import serializers

from apps.properties.models import Property

from .models import Expense, FinanceRecord, Quotation, TaxRecord, Vendor


class PropertySummarySerializer(serializers.ModelSerializer):
  class Meta:
    model = Property
    fields = ["id", "name", "state", "district", "location"]


class QuotationSerializer(serializers.ModelSerializer):
  property_name = serializers.CharField(source="property.name", read_only=True)

  class Meta:
    model = Quotation
    fields = [
      "id",
      "property",
      "property_name",
      "recipient_name",
      "date",
      "room_category",
      "standard_price",
      "selling_price",
      "tenure",
      "status",
      "executive",
      "is_deleted",
      "deleted_at",
      "created_at",
    ]


class FinanceRecordSerializer(serializers.ModelSerializer):
  property_name = serializers.CharField(source="property.name", read_only=True)
  state = serializers.CharField(source="property.state", read_only=True)
  district = serializers.CharField(source="property.district", read_only=True)
  location = serializers.CharField(source="property.location", read_only=True)

  class Meta:
    model = FinanceRecord
    fields = [
      "id",
      "property",
      "property_name",
      "state",
      "district",
      "location",
      "closing_amount",
      "pending_amount",
      "collected_amount",
      "invoice_uploaded",
      "invoice_date",
      "last_payment_date",
      "executive",
      "is_deleted",
      "deleted_at",
      "created_at",
    ]


class ExpenseSerializer(serializers.ModelSerializer):
  class Meta:
    model = Expense
    fields = [
      "id",
      "category",
      "description",
      "amount",
      "date",
      "is_deleted",
      "deleted_at",
      "created_at",
    ]


class VendorSerializer(serializers.ModelSerializer):
  class Meta:
    model = Vendor
    fields = [
      "id",
      "name",
      "company",
      "email",
      "phone",
      "category",
      "outstanding_amount",
      "status",
      "is_deleted",
      "deleted_at",
      "created_at",
    ]


class TaxRecordSerializer(serializers.ModelSerializer):
  class Meta:
    model = TaxRecord
    fields = [
      "id",
      "transaction_type",
      "invoice_no",
      "date",
      "base_amount",
      "tax_rate",
      "tax_amount",
      "is_deleted",
      "deleted_at",
      "created_at",
    ]


class FinanceSummarySerializer(serializers.Serializer):
  total_closing_amount = serializers.DecimalField(max_digits=14, decimal_places=2)
  pending_amount = serializers.DecimalField(max_digits=14, decimal_places=2)
  collected_amount = serializers.DecimalField(max_digits=14, decimal_places=2)

