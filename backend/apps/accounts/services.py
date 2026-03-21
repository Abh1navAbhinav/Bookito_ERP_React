from __future__ import annotations

from typing import Tuple

from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


@transaction.atomic
def create_demo_users_if_missing() -> None:
  """
  Ensure a set of demo users exists that map 1:1 to the frontend login tiles.
  """
  demo_definitions = [
    {
      "username": "manager_demo",
      "email": "manager@bookito.com",
      "first_name": "Manager",
      "last_name": "Demo",
      "role": User.ROLE_MANAGER,
    },
    {
      "username": "sales_demo",
      "email": "sales@bookito.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": User.ROLE_SALES,
    },
    {
      "username": "accountant_demo",
      "email": "accountant@bookito.com",
      "first_name": "Accountant",
      "last_name": "Demo",
      "role": User.ROLE_ACCOUNTANT,
    },
    {
      "username": "crm_demo",
      "email": "crm@bookito.com",
      "first_name": "CRM",
      "last_name": "Agent",
      "role": User.ROLE_CRM,
    },
    {
      "username": "hr_demo",
      "email": "hr@bookito.com",
      "first_name": "HR",
      "last_name": "Demo",
      "role": User.ROLE_HR,
    },
    {
      "username": "employee_demo",
      "email": "employee@bookito.com",
      "first_name": "Employee",
      "last_name": "Self-Service",
      "role": User.ROLE_EMPLOYEE,
    },
  ]

  for demo in demo_definitions:
    user, created = User.objects.get_or_create(
      username=demo["username"],
      defaults={
        "email": demo["email"],
        "first_name": demo["first_name"],
        "last_name": demo["last_name"],
        "role": demo["role"],
        # Simple, shared password for demos; in production this would be unique/secure.
        "is_staff": True
        if demo["role"] in {User.ROLE_MANAGER, User.ROLE_HR}
        else False,
      },
    )
    if created:
      user.set_password("password123")
      user.save()
    else:
      # Keep demo profile labels in sync with the frontend login tiles
      if demo["username"] == "sales_demo" and (
        user.first_name == "Sales" and user.last_name == "Executive"
      ):
        user.first_name = demo["first_name"]
        user.last_name = demo["last_name"]
        user.save(update_fields=["first_name", "last_name"])


def issue_tokens_for_user(user: User) -> Tuple[str, str]:
  """
  Helper to generate (access, refresh) token pair for a user.
  """
  refresh = RefreshToken.for_user(user)
  return str(refresh.access_token), str(refresh)

