from __future__ import annotations

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
  """
  Custom user model with role-based access.

  Roles are kept in sync with the frontend's `bookito_demo_user.role` values.
  We support a superset of roles so future backend-only roles (like `admin`)
  can coexist with current frontend roles.
  """

  ROLE_MANAGER = "manager"
  ROLE_SALES = "sales"
  ROLE_ACCOUNTANT = "accountant"
  ROLE_CRM = "crm"
  ROLE_HR = "hr"
  ROLE_ADMIN = "admin"
  ROLE_EMPLOYEE = "employee"

  ROLE_CHOICES = [
    (ROLE_MANAGER, "Manager"),
    (ROLE_SALES, "Sales"),
    (ROLE_ACCOUNTANT, "Accountant"),
    (ROLE_CRM, "CRM"),
    (ROLE_HR, "HR"),
    (ROLE_ADMIN, "Admin"),
    (ROLE_EMPLOYEE, "Employee"),
  ]

  role = models.CharField(max_length=32, choices=ROLE_CHOICES, default=ROLE_MANAGER)

  # Soft delete flags for consistency with the rest of the system
  is_deleted = models.BooleanField(default=False)
  deleted_at = models.DateTimeField(null=True, blank=True)

  def soft_delete(self) -> None:
    from django.utils import timezone

    self.is_deleted = True
    self.deleted_at = timezone.now()
    self.is_active = False
    self.save(update_fields=["is_deleted", "deleted_at", "is_active"])

  class Meta:
    verbose_name = "User"
    verbose_name_plural = "Users"


class CatalogueFeature(models.Model):
  """
  PMS feature library rows (Admin Features UI). Icon is a Lucide icon name for the frontend.
  """

  STATUS_NEW = "New"
  STATUS_UPDATED = "Updated"
  STATUS_STABLE = "Stable"
  STATUS_CHOICES = [
    (STATUS_NEW, "New"),
    (STATUS_UPDATED, "Updated"),
    (STATUS_STABLE, "Stable"),
  ]

  id = models.CharField(primary_key=True, max_length=64)
  name = models.CharField(max_length=255)
  version = models.CharField(max_length=64)
  release_date = models.DateField()
  description = models.TextField(blank=True)
  category = models.CharField(max_length=64, default="Operations")
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_STABLE)
  icon_key = models.CharField(max_length=64, default="Layers")
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    ordering = ["-release_date", "name"]


class Notification(models.Model):
  """In-app notification for a user (shown in Topbar)."""

  TYPE_INFO = "info"
  TYPE_WARNING = "warning"
  TYPE_SUCCESS = "success"
  TYPE_ERROR = "error"
  TYPE_CHOICES = [
    (TYPE_INFO, "Info"),
    (TYPE_WARNING, "Warning"),
    (TYPE_SUCCESS, "Success"),
    (TYPE_ERROR, "Error"),
  ]

  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
  title = models.CharField(max_length=255)
  message = models.TextField(blank=True)
  notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default=TYPE_INFO)
  read = models.BooleanField(default=False)
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    ordering = ["-created_at"]

