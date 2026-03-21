from __future__ import annotations

from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CatalogueFeature, Notification, User


class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = [
      "id",
      "username",
      "email",
      "first_name",
      "last_name",
      "role",
      "is_active",
    ]


class CatalogueFeatureSerializer(serializers.ModelSerializer):
  class Meta:
    model = CatalogueFeature
    fields = [
      "id",
      "name",
      "version",
      "release_date",
      "description",
      "category",
      "status",
      "icon_key",
      "created_at",
      "updated_at",
    ]


class UserAccountSerializer(serializers.ModelSerializer):
  """Shape aligned with HR Users page (name + status labels)."""

  name = serializers.SerializerMethodField()
  status = serializers.SerializerMethodField()

  class Meta:
    model = User
    fields = ["id", "name", "email", "role", "status", "is_deleted", "deleted_at"]

  def get_name(self, obj: User) -> str:
    full = f"{obj.first_name} {obj.last_name}".strip()
    return full or obj.username

  def get_status(self, obj: User) -> str:
    if obj.is_deleted or not obj.is_active:
      return "inactive"
    return "active"


class UserAccountWriteSerializer(serializers.ModelSerializer):
  name = serializers.CharField(write_only=True, required=False, allow_blank=True)
  password = serializers.CharField(write_only=True, required=False, min_length=8, allow_blank=False)
  status = serializers.ChoiceField(
    choices=["active", "inactive"], write_only=True, required=False, default="active"
  )

  class Meta:
    model = User
    fields = ["name", "email", "role", "status", "password"]

  def validate(self, attrs):
    attrs = super().validate(attrs)
    if "status" in attrs:
      attrs["is_active"] = attrs.pop("status") == "active"
    elif self.instance is None:
      attrs["is_active"] = True
    return attrs

  def validate_email(self, value: str) -> str:
    qs = User.objects.filter(email__iexact=value)
    if self.instance:
      qs = qs.exclude(pk=self.instance.pk)
    if qs.exists():
      raise serializers.ValidationError("A user with this email already exists.")
    return value.lower()

  def create(self, validated_data):
    password = validated_data.pop("password", None)
    if not password:
      raise serializers.ValidationError({"password": "This field is required when creating a user."})
    name = (validated_data.pop("name", None) or "").strip()
    if not name:
      raise serializers.ValidationError({"name": "This field is required."})
    parts = name.split(None, 1)
    first = parts[0] if parts else "User"
    last = parts[1] if len(parts) > 1 else ""
    email = validated_data.get("email", "")
    local = email.split("@")[0].replace(".", "_") if "@" in email else "user"
    base = local[:30] or "user"
    username = base
    i = 0
    while User.objects.filter(username=username).exists():
      i += 1
      username = f"{base}{i}"[:150]

    role = validated_data.get("role", User.ROLE_SALES)
    user = User(
      username=username,
      email=email,
      first_name=first[:150],
      last_name=last[:150],
      role=role,
      is_active=validated_data.pop("is_active", True),
      is_staff=role in (User.ROLE_MANAGER, User.ROLE_HR, User.ROLE_ADMIN),
    )
    user.set_password(password)
    user.save()
    return user

  def update(self, instance, validated_data):
    password = validated_data.pop("password", None)
    name = validated_data.pop("name", None)
    if name is not None:
      name = name.strip()
      parts = name.split(None, 1)
      if parts:
        instance.first_name = parts[0][:150]
        instance.last_name = (parts[1] if len(parts) > 1 else "")[:150]
    for attr in ("email", "role", "is_active"):
      if attr in validated_data:
        setattr(instance, attr, validated_data[attr])
    if "role" in validated_data:
      r = validated_data["role"]
      instance.is_staff = r in (User.ROLE_MANAGER, User.ROLE_HR, User.ROLE_ADMIN)
    if password:
      instance.set_password(password)
    instance.save()
    return instance


class LoginSerializer(serializers.Serializer):
  """
  Email + password login that returns JWTs and role information.
  """

  email = serializers.EmailField()
  password = serializers.CharField(write_only=True)

  def validate(self, attrs):
    email = (attrs.get("email") or "").strip().lower()
    password = attrs.get("password")

    try:
      user_obj = User.objects.get(email__iexact=email, is_deleted=False)
    except User.DoesNotExist:
      raise serializers.ValidationError("Invalid credentials", code="authorization")

    user = authenticate(username=user_obj.username, password=password)
    if not user:
      raise serializers.ValidationError("Invalid credentials", code="authorization")

    if not user.is_active:
      raise serializers.ValidationError("User account is disabled", code="authorization")

    attrs["user"] = user
    return attrs


class BookitoTokenObtainPairSerializer(TokenObtainPairSerializer):
  """
  Custom token serializer that injects role and basic user info into the JWT payload.
  """

  @classmethod
  def get_token(cls, user):
    token = super().get_token(user)
    token["role"] = user.role
    token["username"] = user.username
    token["email"] = user.email
    return token

  def validate(self, attrs):
    data = super().validate(attrs)
    data["user"] = UserSerializer(self.user).data
    return data


class NotificationSerializer(serializers.ModelSerializer):
  class Meta:
    model = Notification
    fields = ["id", "title", "message", "notification_type", "read", "created_at"]

