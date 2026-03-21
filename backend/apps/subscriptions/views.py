from __future__ import annotations

from datetime import timedelta

from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from apps.accounts.models import User
from apps.accounts.permissions import RolePermission

from .models import SubscriptionPlan
from .serializers import SubscriptionPlanSerializer

_WRITE_ACTIONS = frozenset({"create", "update", "partial_update", "soft_delete", "restore"})


class SubscriptionPlanViewSet(viewsets.ModelViewSet):
  """
  Subscription plans for the Pricing Plan admin UI.

  - List: active plans (default) or ?trash=1 for soft-deleted (last 30 days).
  - Create / update / soft-delete / restore: manager or admin only.
  """

  serializer_class = SubscriptionPlanSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [
    User.ROLE_MANAGER,
    User.ROLE_SALES,
    User.ROLE_ACCOUNTANT,
    User.ROLE_CRM,
    User.ROLE_HR,
    User.ROLE_ADMIN,
  ]
  http_method_names = ["get", "post", "patch", "head", "options"]
  lookup_value_regex = r"[^/]+"

  def check_permissions(self, request):
    super().check_permissions(request)
    action_name = getattr(self, "action", None)
    if action_name in _WRITE_ACTIONS:
      user = request.user
      if not user.is_authenticated or user.role not in (User.ROLE_MANAGER, User.ROLE_ADMIN):
        raise PermissionDenied("Only managers and admins can modify subscription plans.")

  def get_queryset(self):
    return SubscriptionPlan.objects.all()

  def list(self, request, *args, **kwargs):
    trash = request.query_params.get("trash") in ("1", "true", "yes")
    cutoff = timezone.now() - timedelta(days=30)
    if trash:
      qs = (
        self.get_queryset()
        .filter(is_deleted=True, deleted_at__isnull=False, deleted_at__gte=cutoff)
        .order_by("-deleted_at", "sort_order", "name")
      )
    else:
      qs = self.get_queryset().filter(is_deleted=False).order_by("sort_order", "name")
    serializer = self.get_serializer(qs, many=True)
    return Response(serializer.data)

  @action(detail=True, methods=["post"], url_path="soft-delete")
  def soft_delete(self, request, pk=None):
    plan = self.get_object()
    plan.is_deleted = True
    plan.deleted_at = timezone.now()
    plan.save(update_fields=["is_deleted", "deleted_at", "updated_at"])
    return Response(status=status.HTTP_204_NO_CONTENT)

  @action(detail=True, methods=["post"], url_path="restore")
  def restore(self, request, pk=None):
    plan = self.get_object()
    plan.is_deleted = False
    plan.deleted_at = None
    plan.save(update_fields=["is_deleted", "deleted_at", "updated_at"])
    serializer = self.get_serializer(plan)
    return Response(serializer.data, status=status.HTTP_200_OK)
