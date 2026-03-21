from __future__ import annotations

from django.core.exceptions import FieldDoesNotExist
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from apps.accounts.models import User
from apps.accounts.permissions import RolePermission, roles_required

from .models import TradeFairAgent, TradeFairProperty, TradeFairVenue, TravelAgent
from .serializers import (
  TradeFairAgentSerializer,
  TradeFairPropertySerializer,
  TradeFairVenueSerializer,
  TravelAgentSerializer,
)


class PartnersSoftDeleteViewSetMixin:
  def _deleted_queryset(self):
    """
    Base viewset querysets exclude is_deleted=True, so we must not chain
    .filter(is_deleted=True) on get_queryset() — that always returns nothing.
    """
    model = self.queryset.model
    qs = model.objects.filter(is_deleted=True)
    try:
      model._meta.get_field("fair")
    except FieldDoesNotExist:
      return qs
    return qs.select_related("fair")

  @action(detail=True, methods=["post"], url_path="soft-delete")
  @roles_required([User.ROLE_MANAGER, User.ROLE_SALES, User.ROLE_CRM])
  def soft_delete(self, request: Request, pk: str | None = None) -> Response:
    obj = self.get_object()
    obj.soft_delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

  @action(detail=True, methods=["post"], url_path="restore")
  @roles_required([User.ROLE_MANAGER, User.ROLE_SALES, User.ROLE_CRM])
  def restore(self, request: Request, pk: str | None = None) -> Response:
    model = self.queryset.model
    try:
      obj = model.objects.get(pk=pk)
    except model.DoesNotExist:
      return Response(status=status.HTTP_404_NOT_FOUND)
    self.check_object_permissions(request, obj)
    if not obj.is_deleted:
      serializer = self.get_serializer(obj)
      return Response(serializer.data)
    obj.is_deleted = False
    obj.deleted_at = None
    obj.save(update_fields=["is_deleted", "deleted_at"])
    serializer = self.get_serializer(obj)
    return Response(serializer.data)

  @action(detail=False, methods=["get"], url_path="deleted")
  @roles_required([User.ROLE_MANAGER, User.ROLE_SALES, User.ROLE_CRM])
  def list_deleted(self, request: Request) -> Response:
    qs = self._deleted_queryset()
    serializer = self.get_serializer(qs, many=True)
    return Response(serializer.data)


class TravelAgentViewSet(PartnersSoftDeleteViewSetMixin, viewsets.ModelViewSet):
  queryset = TravelAgent.objects.filter(is_deleted=False)
  serializer_class = TravelAgentSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_SALES, User.ROLE_CRM]
  filter_backends = [filters.SearchFilter, filters.OrderingFilter]
  search_fields = ["agent_name", "email", "contact_number", "state", "district", "location"]
  ordering_fields = ["slno", "agent_name", "plan_start_date"]

  def perform_create(self, serializer):
    data = serializer.validated_data
    last = TravelAgent.objects.order_by("-slno").first()
    next_slno = (last.slno + 1) if last else 1
    pk = data.get("id") or f"ta-{next_slno}"
    slno = data.get("slno") or next_slno
    serializer.save(id=pk, slno=slno)


class TradeFairVenueViewSet(PartnersSoftDeleteViewSetMixin, viewsets.ModelViewSet):
  queryset = TradeFairVenue.objects.filter(is_deleted=False)
  serializer_class = TradeFairVenueSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_SALES, User.ROLE_CRM]
  filter_backends = [filters.SearchFilter, filters.OrderingFilter]
  search_fields = ["venue", "city", "location"]
  ordering_fields = ["date", "venue"]


class TradeFairPropertyViewSet(PartnersSoftDeleteViewSetMixin, viewsets.ModelViewSet):
  queryset = TradeFairProperty.objects.filter(is_deleted=False).select_related("fair")
  serializer_class = TradeFairPropertySerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_SALES, User.ROLE_CRM]
  filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
  filterset_fields = ["fair"]
  search_fields = ["property_name", "contact_person", "email", "location"]
  ordering_fields = ["property_name", "status"]


class TradeFairAgentViewSet(PartnersSoftDeleteViewSetMixin, viewsets.ModelViewSet):
  queryset = TradeFairAgent.objects.filter(is_deleted=False).select_related("fair")
  serializer_class = TradeFairAgentSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_SALES, User.ROLE_CRM]
  filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
  filterset_fields = ["fair"]
  search_fields = ["agent_name", "email", "contact_number", "location"]
  ordering_fields = ["agent_name", "status"]
