from __future__ import annotations

from rest_framework import serializers

from .models import Property


class PropertySerializer(serializers.ModelSerializer):
  """
  Serializer closely mirroring the frontend's Property type.
  """

  class Meta:
    model = Property
    fields = [
      "id",
      "slno",
      "name",
      "property_type",
      "property_class",
      "room_category",
      "number_of_rooms",
      "has_multiple_property",
      "number_of_properties",
      "email",
      "proposed_price",
      "final_committed_price",
      "tenure",
      "place",
      "primary_contact_person",
      "contact_person_name",
      "contact_number",
      "primary_person_position",
      "executive_name",
      "first_visit_date",
      "first_visit_status",
      "committed_proposed_rate",
      "comments",
      "rescheduled_date",
      "rescheduled_comment",
      "second_visit_executive",
      "second_visit_date",
      "second_visit_status",
      "second_visit_comments",
      "currently_assigned_to",
      "plan_type",
      "closing_amount",
      "plan_start_date",
      "plan_expiry_date",
      "location_link",
      "current_pms",
      "connected_ota_platforms",
      "state",
      "district",
      "location",
      "created_at",
      "updated_at",
      "is_deleted",
      "deleted_at",
      "is_draft",
    ]

