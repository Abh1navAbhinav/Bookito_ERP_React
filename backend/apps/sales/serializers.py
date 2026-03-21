from __future__ import annotations

from rest_framework import serializers

from .models import SalesAttendance, SalesRecord


class SalesAttendanceSerializer(serializers.ModelSerializer):
  user_name = serializers.CharField(source="user.get_full_name", read_only=True)
  username = serializers.CharField(source="user.username", read_only=True)

  class Meta:
    model = SalesAttendance
    fields = [
      "id",
      "user",
      "user_name",
      "username",
      "date",
      "check_in_time",
      "check_out_time",
      "notes",
      "check_in_location",
      "check_out_location",
      "check_in_selfie",
      "check_out_selfie",
      "created_at",
      "updated_at",
    ]
    read_only_fields = ["user", "user_name", "username", "created_at", "updated_at"]
    extra_kwargs = {"id": {"read_only": False, "required": False}}


class SalesRecordSerializer(serializers.ModelSerializer):
  class Meta:
    model = SalesRecord
    fields = [
      "id",
      "slno",
      "property",
      "property_name",
      "number_of_rooms",
      "email",
      "primary_contact_person",
      "designation",
      "proposed_price",
      "plan_type",
      "status",
      "comments",
      "demo_provided",
      "trial_provided",
      "installed",
      "executive",
      "state",
      "district",
      "location",
      "location_link",
      "is_live",
      "visit_history",
      "created_at",
      "updated_at",
      "is_deleted",
      "deleted_at",
    ]
    extra_kwargs = {"id": {"read_only": False, "required": False}}
