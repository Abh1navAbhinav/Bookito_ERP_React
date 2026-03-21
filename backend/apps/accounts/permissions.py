from __future__ import annotations

from typing import Iterable, Sequence
from functools import wraps

from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView

from .models import User


class RolePermission(BasePermission):
  """
  Generic role-based permission.

  Usage:
      class SomeViewSet(ModelViewSet):
          permission_classes = [IsAuthenticated, RolePermission]
          allowed_roles = [User.ROLE_MANAGER, User.ROLE_ACCOUNTANT]

      # or per-action using a custom mixin / decorator.
  """

  def has_permission(self, request: Request, view: APIView) -> bool:
    user = request.user
    if not user or not user.is_authenticated:
      return False

    # View can define `allowed_roles` as attribute or property.
    allowed_roles: Sequence[str] | None = getattr(view, "allowed_roles", None)
    if not allowed_roles:
      # If not specified, treat as open to any authenticated user.
      return True

    # System admin role can access any role-gated view (same as typical superuser UX).
    if user.role == User.ROLE_ADMIN:
      return True

    return user.role in allowed_roles


def roles_required(roles: Iterable[str]):
  """
  Decorator for function-based views or custom actions.

  Example:
      @action(detail=False, methods=["get"])
      @roles_required([User.ROLE_MANAGER, User.ROLE_ACCOUNTANT])
      def export(self, request, *args, **kwargs):
          ...
  """

  def decorator(view_func):
    @wraps(view_func)
    def _wrapped_view(self, request, *args, **kwargs):
      user: User = request.user
      if not user or not user.is_authenticated:
        from rest_framework.exceptions import NotAuthenticated

        raise NotAuthenticated()

      if user.role == User.ROLE_ADMIN:
        return view_func(self, request, *args, **kwargs)

      if user.role not in roles:
        from rest_framework.exceptions import PermissionDenied

        raise PermissionDenied("You do not have permission to perform this action.")

      return view_func(self, request, *args, **kwargs)

    return _wrapped_view

  return decorator

