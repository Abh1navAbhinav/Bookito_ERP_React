from __future__ import annotations

from django.contrib.auth import get_user_model
from django.db import OperationalError
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenRefreshView

from .models import CatalogueFeature, Notification
from .permissions import RolePermission, roles_required
from .serializers import (
  BookitoTokenObtainPairSerializer,
  CatalogueFeatureSerializer,
  LoginSerializer,
  NotificationSerializer,
  UserAccountSerializer,
  UserAccountWriteSerializer,
  UserSerializer,
)

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
  """
  User listing + CRUD + soft-delete for HR / manager admin screens.
  """

  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_HR, User.ROLE_ADMIN]
  filterset_fields = ["role", "is_active"]
  search_fields = ["username", "email", "first_name", "last_name"]
  ordering_fields = ["id", "username", "email"]

  def get_queryset(self):
    qs = User.objects.all().order_by("id")
    if self.action == "list":
      if self.request.query_params.get("trash") == "1":
        return qs.filter(is_deleted=True)
      return qs.filter(is_deleted=False)
    return qs

  def get_serializer_class(self):
    if self.action in ("create", "update", "partial_update"):
      return UserAccountWriteSerializer
    return UserAccountSerializer

  def create(self, request: Request, *args, **kwargs) -> Response:
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response(UserAccountSerializer(user).data, status=status.HTTP_201_CREATED)

  def update(self, request: Request, *args, **kwargs) -> Response:
    partial = kwargs.pop("partial", False)
    instance = self.get_object()
    serializer = self.get_serializer(instance, data=request.data, partial=partial)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response(UserAccountSerializer(user).data)

  def partial_update(self, request: Request, *args, **kwargs) -> Response:
    kwargs["partial"] = True
    return self.update(request, *args, **kwargs)

  @action(detail=True, methods=["post"], url_path="soft-delete")
  @roles_required([User.ROLE_MANAGER, User.ROLE_HR, User.ROLE_ADMIN])
  def soft_delete_user(self, request: Request, pk: str | None = None) -> Response:
    u = self.get_object()
    u.soft_delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

  @action(detail=True, methods=["post"], url_path="restore")
  @roles_required([User.ROLE_MANAGER, User.ROLE_HR, User.ROLE_ADMIN])
  def restore_user(self, request: Request, pk: str | None = None) -> Response:
    u = self.get_object()
    u.is_deleted = False
    u.deleted_at = None
    u.is_active = True
    u.save(update_fields=["is_deleted", "deleted_at", "is_active"])
    return Response(UserAccountSerializer(u).data, status=status.HTTP_200_OK)


class CatalogueFeatureViewSet(viewsets.ModelViewSet):
  queryset = CatalogueFeature.objects.all()
  serializer_class = CatalogueFeatureSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_ADMIN]
  search_fields = ["name", "description", "category"]
  ordering_fields = ["release_date", "name", "created_at"]


class LoginView(generics.GenericAPIView):
  """
  Email + password login that returns JWTs and user info.
  """

  serializer_class = LoginSerializer
  permission_classes = [permissions.AllowAny]

  def post(self, request: Request, *args, **kwargs) -> Response:
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data["user"]

    # Reuse the custom token serializer to keep payloads consistent.
    token_serializer = BookitoTokenObtainPairSerializer(
      data={"username": user.username, "password": request.data.get("password")}
    )
    token_serializer.is_valid(raise_exception=True)
    return Response(token_serializer.validated_data, status=status.HTTP_200_OK)


class LogoutView(generics.GenericAPIView):
  """
  Stateless logout for JWT-based auth.
  """

  permission_classes = [permissions.IsAuthenticated]

  def post(self, request: Request, *args, **kwargs) -> Response:
    # For simplicity we do not maintain a token blacklist here; frontend can
    # simply drop tokens from storage.
    return Response(status=status.HTTP_204_NO_CONTENT)


class BookitoTokenRefreshView(TokenRefreshView):
  """
  Wrapper around SimpleJWT's TokenRefreshView to keep URL structure explicit.
  """

  permission_classes = [permissions.AllowAny]


class NotificationListView(generics.ListAPIView):
  """
  List notifications for the current user (for Topbar).
  """

  serializer_class = NotificationSerializer
  permission_classes = [permissions.IsAuthenticated]

  def get_queryset(self):
    return Notification.objects.filter(user=self.request.user)

  def list(self, request: Request, *args, **kwargs):
    """
    Avoid 500 when the notifications table is missing (migration not applied yet).
    """
    try:
      return super().list(request, *args, **kwargs)
    except OperationalError:
      return Response([], status=status.HTTP_200_OK)

