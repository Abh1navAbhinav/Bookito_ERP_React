from __future__ import annotations

from rest_framework import serializers

from .models import TradeFairAgent, TradeFairProperty, TradeFairVenue, TravelAgent


class TravelAgentSerializer(serializers.ModelSerializer):
  class Meta:
    model = TravelAgent
    fields = [
      "id",
      "slno",
      "agent_name",
      "contact_number",
      "email",
      "trial_status",
      "trial_remaining_days",
      "plan_start_date",
      "plan_end_date",
      "pending_amount",
      "collected_amount",
      "contract_type",
      "state",
      "district",
      "location",
      "is_deleted",
      "deleted_at",
      "created_at",
      "updated_at",
    ]
    extra_kwargs = {"id": {"read_only": False, "required": False}}


class TradeFairVenueSerializer(serializers.ModelSerializer):
  class Meta:
    model = TradeFairVenue
    fields = [
      "id",
      "location",
      "city",
      "venue",
      "date",
      "is_deleted",
      "deleted_at",
      "created_at",
      "updated_at",
    ]


class TradeFairPropertySerializer(serializers.ModelSerializer):
  fair_id = serializers.PrimaryKeyRelatedField(
    source="fair", queryset=TradeFairVenue.objects.all(), write_only=True
  )
  fair_venue = serializers.CharField(source="fair.venue", read_only=True)
  fair_date = serializers.DateField(source="fair.date", read_only=True)

  class Meta:
    model = TradeFairProperty
    fields = [
      "id",
      "fair",
      "fair_id",
      "fair_venue",
      "fair_date",
      "property_name",
      "contact_person",
      "contact_number",
      "email",
      "location",
      "status",
      "is_deleted",
      "deleted_at",
      "created_at",
      "updated_at",
    ]
    extra_kwargs = {"fair": {"read_only": True}, "id": {"read_only": False, "required": False}}


class TradeFairAgentSerializer(serializers.ModelSerializer):
  fair_id = serializers.PrimaryKeyRelatedField(
    source="fair", queryset=TradeFairVenue.objects.all(), write_only=True
  )
  fair_venue = serializers.CharField(source="fair.venue", read_only=True)
  fair_date = serializers.DateField(source="fair.date", read_only=True)

  class Meta:
    model = TradeFairAgent
    fields = [
      "id",
      "fair",
      "fair_id",
      "fair_venue",
      "fair_date",
      "agent_name",
      "contact_number",
      "email",
      "location",
      "is_dmc",
      "status",
      "is_deleted",
      "deleted_at",
      "created_at",
      "updated_at",
    ]
    extra_kwargs = {"fair": {"read_only": True}, "id": {"read_only": False, "required": False}}
