from __future__ import annotations

from django.contrib.auth import get_user_model
from django.db import transaction

from datetime import date, timedelta

from .models import CatalogueFeature, Notification, User
from .services import create_demo_users_if_missing


@transaction.atomic
def run() -> None:
  """
  Seed base users for the accounts module.

  - Bootstrap superuser admin (admin@bookito.com / admin123) with role **HR** so the
    first login sees HR navigation (Roles & permissions, employees, etc.).
  - Demo users for other roles (optional dev accounts)
  """

  UserModel = get_user_model()

  # Superuser used as initial HR bootstrap (not ROLE_ADMIN, so sidebar matches HR UX)
  if not UserModel.objects.filter(username="admin").exists():
    admin_user = UserModel.objects.create_superuser(
      username="admin",
      email="admin@bookito.com",
      password="admin123",
    )
    admin_user.role = User.ROLE_HR
    admin_user.save(update_fields=["role"])
  else:
    au = UserModel.objects.filter(username="admin").first()
    if au and au.role == User.ROLE_ADMIN:
      au.role = User.ROLE_HR
      au.save(update_fields=["role"])

  # Demo users for each role used by the current frontend
  create_demo_users_if_missing()

  # Seed a couple of notifications for the manager user (for Topbar demo)
  manager = UserModel.objects.filter(role=User.ROLE_MANAGER, is_deleted=False).first()
  if manager and not Notification.objects.filter(user=manager).exists():
    Notification.objects.bulk_create([
      Notification(user=manager, title="Welcome", message="Your dashboard is ready.", notification_type=Notification.TYPE_INFO),
      Notification(user=manager, title="New Vendor Invoice", message="Pending approval (Salary).", notification_type=Notification.TYPE_WARNING, read=True),
    ])

  if not CatalogueFeature.objects.exists():
    today = date.today()
    CatalogueFeature.objects.bulk_create(
      [
        CatalogueFeature(
          id="feat-ota",
          name="Channel Manager & OTA sync",
          version="2.4.0",
          release_date=today - timedelta(days=14),
          description="Two-way rates, inventory, and restrictions across major OTAs.",
          category="Distribution",
          status=CatalogueFeature.STATUS_STABLE,
          icon_key="Globe",
        ),
        CatalogueFeature(
          id="feat-inv",
          name="Inventory & housekeeping",
          version="1.9.2",
          release_date=today - timedelta(days=7),
          description="Room status, tasks, and linen workflows.",
          category="Operations",
          status=CatalogueFeature.STATUS_UPDATED,
          icon_key="Database",
        ),
        CatalogueFeature(
          id="feat-fin",
          name="Finance & billing",
          version="1.2.0",
          release_date=today - timedelta(days=30),
          description="Invoices, receivables, and payout reconciliation.",
          category="Finance",
          status=CatalogueFeature.STATUS_STABLE,
          icon_key="BarChart3",
        ),
        CatalogueFeature(
          id="feat-rbac",
          name="Roles & access control",
          version="1.0.0",
          release_date=today - timedelta(days=60),
          description="Granular permissions for staff and partners.",
          category="Security",
          status=CatalogueFeature.STATUS_STABLE,
          icon_key="Users",
        ),
      ]
    )

