from __future__ import annotations

from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from apps.accounts.models import User
from apps.accounts.permissions import RolePermission, roles_required

from .models import Property
from .serializers import PropertySerializer


class PropertyViewSet(viewsets.ModelViewSet):
  """
  Properties API with filtering, search, pagination and soft delete.

  RBAC:
    - manager, sales, crm can list/retrieve
    - manager, sales, crm can create/update
    - manager, sales, crm can soft delete / restore
  """

  queryset = Property.objects.filter(is_deleted=False)
  serializer_class = PropertySerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_SALES, User.ROLE_CRM]

  filterset_fields = {
    "state": ["exact"],
    "district": ["exact"],
    "tenure": ["exact"],
    "property_type": ["exact"],
    "property_class": ["exact"],
    "room_category": ["exact"],
    "second_visit_status": ["exact"],
    "is_draft": ["exact"],
  }
  search_fields = ["name", "place", "contact_person_name", "location"]
  ordering_fields = ["slno", "name", "plan_start_date", "plan_expiry_date"]
  filter_backends = [
    DjangoFilterBackend,
    filters.SearchFilter,
    filters.OrderingFilter,
  ]

  def perform_create(self, serializer: PropertySerializer) -> None:
    user = self.request.user
    serializer.save(created_by=user, updated_by=user)

  def perform_update(self, serializer: PropertySerializer) -> None:
    user = self.request.user
    serializer.save(updated_by=user)

  def destroy(self, request: Request, *args: list[any], **kwargs: dict[any, any]) -> Response:
    """
    Standard DELETE method now performs a permanent hard delete.
    Use the /soft-delete/ endpoint for moving to trash.
    """
    instance = self.get_object()
    instance.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

  @action(detail=True, methods=["post"], url_path="soft-delete")
  @roles_required([User.ROLE_MANAGER, User.ROLE_SALES, User.ROLE_CRM])
  def soft_delete(self, request: Request, pk: str | None = None) -> Response:
    prop = self.get_object()
    prop.soft_delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

  @action(detail=True, methods=["post"], url_path="restore")
  @roles_required([User.ROLE_MANAGER, User.ROLE_SALES, User.ROLE_CRM])
  def restore(self, request: Request, pk: str | None = None) -> Response:
    prop = self.get_object()
    prop.is_deleted = False
    prop.deleted_at = None
    prop.save(update_fields=["is_deleted", "deleted_at"])
    return Response(self.get_serializer(prop).data, status=status.HTTP_200_OK)

  @action(detail=False, methods=["get"], url_path="deleted")
  @roles_required([User.ROLE_MANAGER, User.ROLE_SALES, User.ROLE_CRM])
  def list_deleted(self, request: Request) -> Response:
    """
    List soft-deleted properties (for trash view).
    """
    # Optional: apply a 30-day retention window similar to frontend behavior.
    cutoff_days = int(request.query_params.get("retention_days", "30"))
    cutoff = timezone.now() - timezone.timedelta(days=cutoff_days)
    # Exclude drafts from the trash view
    qs = Property.objects.filter(is_deleted=True, is_draft=False, deleted_at__gte=cutoff)
    page = self.paginate_queryset(qs)
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      return self.get_paginated_response(serializer.data)
    serializer = self.get_serializer(qs, many=True)
    return Response(serializer.data)

