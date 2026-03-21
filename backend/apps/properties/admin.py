from django.contrib import admin

from .models import Property


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
  list_display = (
    "slno",
    "name",
    "property_type",
    "property_class",
    "room_category",
    "number_of_rooms",
    "state",
    "district",
    "plan_type",
    "plan_start_date",
    "plan_expiry_date",
    "is_deleted",
  )
  list_filter = (
    "property_type",
    "property_class",
    "room_category",
    "tenure",
    "state",
    "district",
    "is_deleted",
  )
  search_fields = ("name", "place", "contact_person_name", "email")
  ordering = ("slno",)

