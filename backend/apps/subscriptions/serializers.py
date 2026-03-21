from __future__ import annotations

import uuid

from rest_framework import serializers

from .models import SubscriptionPlan

ROOM_SLABS = {"1-10", "11-20", "21-30", "30+"}


class SubscriptionPlanSerializer(serializers.ModelSerializer):
  class Meta:
    model = SubscriptionPlan
    fields = [
      "id",
      "name",
      "description",
      "popular",
      "promo",
      "color",
      "footer_note",
      "pricing",
      "features",
      "sort_order",
      "is_deleted",
      "deleted_at",
      "created_at",
      "updated_at",
    ]
    read_only_fields = ["is_deleted", "deleted_at", "created_at", "updated_at"]

  def validate_pricing(self, value: list) -> list:
    if not isinstance(value, list) or len(value) != 4:
      raise serializers.ValidationError("pricing must be a list of exactly 4 slabs.")
    seen: set[str] = set()
    normalized: list[dict] = []
    for row in value:
      if not isinstance(row, dict):
        raise serializers.ValidationError("Each pricing row must be an object.")
      rooms = row.get("rooms")
      if rooms not in ROOM_SLABS:
        raise serializers.ValidationError(f"Invalid rooms slab: {rooms}")
      if rooms in seen:
        raise serializers.ValidationError(f"Duplicate rooms slab: {rooms}")
      seen.add(rooms)
      try:
        six_m = int(row["six_months"])
        one_y = int(row["one_year"])
      except (KeyError, TypeError, ValueError) as e:
        raise serializers.ValidationError("six_months and one_year must be integers.") from e
      if six_m < 0 or one_y < 0:
        raise serializers.ValidationError("Prices must be non-negative.")
      normalized.append({"rooms": rooms, "six_months": six_m, "one_year": one_y})
    if seen != ROOM_SLABS:
      raise serializers.ValidationError("pricing must include slabs 1-10, 11-20, 21-30, 30+.")
    return normalized

  def validate_features(self, value: list) -> list:
    if not isinstance(value, list):
      raise serializers.ValidationError("features must be a list.")
    out = []
    for group in value:
      if not isinstance(group, dict):
        continue
      title = (group.get("title") or "").strip()
      items_raw = group.get("items") or []
      if not title and not items_raw:
        continue
      items = [str(i).strip() for i in items_raw if str(i).strip()]
      out.append({"title": title or "Features", "items": items})
    return out

  def create(self, validated_data: dict) -> SubscriptionPlan:
    if not validated_data.get("id"):
      validated_data["id"] = f"plan-{uuid.uuid4().hex[:12]}"
    return super().create(validated_data)
