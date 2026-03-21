from __future__ import annotations

from decimal import Decimal

from django.db.models import Sum
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from apps.accounts.models import User
from apps.accounts.permissions import RolePermission, roles_required

from .models import Expense, FinanceRecord, Quotation, TaxRecord, Vendor
from .serializers import (
  ExpenseSerializer,
  FinanceRecordSerializer,
  FinanceSummarySerializer,
  QuotationSerializer,
  TaxRecordSerializer,
  VendorSerializer,
)


class BaseSoftDeleteViewSet(viewsets.ModelViewSet):
  """
  Shared soft-delete/restore endpoints for finance-like resources.
  """

  @action(detail=True, methods=["post"], url_path="soft-delete")
  @roles_required([User.ROLE_MANAGER, User.ROLE_ACCOUNTANT])
  def soft_delete(self, request: Request, pk: str | None = None) -> Response:
    obj = self.get_object()
    obj.soft_delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

  @action(detail=True, methods=["post"], url_path="restore")
  @roles_required([User.ROLE_MANAGER, User.ROLE_ACCOUNTANT])
  def restore(self, request: Request, pk: str | None = None) -> Response:
    obj = self.get_object()
    obj.is_deleted = False
    obj.deleted_at = None
    obj.save(update_fields=["is_deleted", "deleted_at"])
    serializer = self.get_serializer(obj)
    return Response(serializer.data, status=status.HTTP_200_OK)

  @action(detail=False, methods=["get"], url_path="deleted")
  @roles_required([User.ROLE_MANAGER, User.ROLE_ACCOUNTANT])
  def list_deleted(self, request: Request) -> Response:
    qs = self.get_queryset().filter(is_deleted=True)
    page = self.paginate_queryset(qs)
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      return self.get_paginated_response(serializer.data)
    serializer = self.get_serializer(qs, many=True)
    return Response(serializer.data)


class QuotationViewSet(BaseSoftDeleteViewSet):
  queryset = Quotation.objects.filter(is_deleted=False)
  serializer_class = QuotationSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_ACCOUNTANT, User.ROLE_SALES]

  filter_backends = [filters.SearchFilter, filters.OrderingFilter]
  search_fields = ["property__name", "recipient_name", "executive"]
  ordering_fields = ["date", "created_at", "selling_price"]

  def perform_create(self, serializer: QuotationSerializer) -> None:
    serializer.save(created_by=self.request.user)


class FinanceRecordViewSet(BaseSoftDeleteViewSet):
  queryset = FinanceRecord.objects.filter(is_deleted=False).select_related("property")
  serializer_class = FinanceRecordSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_ACCOUNTANT]

  filter_backends = [filters.SearchFilter, filters.OrderingFilter]
  search_fields = ["property__name", "property__state", "property__district"]
  ordering_fields = ["created_at", "closing_amount", "pending_amount", "collected_amount"]


class ExpenseViewSet(BaseSoftDeleteViewSet):
  queryset = Expense.objects.filter(is_deleted=False)
  serializer_class = ExpenseSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_ACCOUNTANT]

  filter_backends = [filters.SearchFilter, filters.OrderingFilter]
  search_fields = ["description", "category"]
  ordering_fields = ["date", "amount", "created_at"]

  def perform_create(self, serializer: ExpenseSerializer) -> None:
    serializer.save(created_by=self.request.user)


class VendorViewSet(BaseSoftDeleteViewSet):
  queryset = Vendor.objects.filter(is_deleted=False)
  serializer_class = VendorSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_ACCOUNTANT]

  filter_backends = [filters.SearchFilter, filters.OrderingFilter]
  search_fields = ["name", "company", "email", "category"]
  ordering_fields = ["name", "outstanding_amount", "created_at"]


class TaxRecordViewSet(BaseSoftDeleteViewSet):
  queryset = TaxRecord.objects.filter(is_deleted=False)
  serializer_class = TaxRecordSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_ACCOUNTANT]

  filter_backends = [filters.SearchFilter, filters.OrderingFilter]
  search_fields = ["invoice_no", "transaction_type"]
  ordering_fields = ["date", "base_amount", "created_at"]


class FinanceSummaryViewSet(viewsets.ViewSet):
  """
  Simple viewset to expose aggregate finance stats for dashboards.
  """

  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_ACCOUNTANT]

  def list(self, request: Request) -> Response:
    agg = FinanceRecord.objects.filter(is_deleted=False).aggregate(
      total_closing_amount=Sum("closing_amount"),
      total_collected_amount=Sum("collected_amount"),
    )
    total_closing = agg.get("total_closing_amount") or Decimal("0")
    collected = agg.get("total_collected_amount") or Decimal("0")
    pending = total_closing - collected

    serializer = FinanceSummarySerializer(
      {
        "total_closing_amount": total_closing,
        "pending_amount": pending,
        "collected_amount": collected,
      }
    )
    return Response(serializer.data)

