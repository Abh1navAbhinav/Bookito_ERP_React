from django.contrib import admin

from .models import SubscriptionPlan


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
  list_display = ("id", "name", "popular", "sort_order", "is_deleted", "updated_at")
  list_filter = ("is_deleted", "popular")
  search_fields = ("id", "name")
