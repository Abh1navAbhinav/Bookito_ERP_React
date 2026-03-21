from django.contrib import admin
from .models import TradeFairAgent, TradeFairProperty, TradeFairVenue, TravelAgent


@admin.register(TravelAgent)
class TravelAgentAdmin(admin.ModelAdmin):
  list_display = ["id", "agent_name", "contract_type", "state", "district", "email"]


@admin.register(TradeFairVenue)
class TradeFairVenueAdmin(admin.ModelAdmin):
  list_display = ["id", "venue", "city", "date"]


@admin.register(TradeFairProperty)
class TradeFairPropertyAdmin(admin.ModelAdmin):
  list_display = ["id", "property_name", "fair", "status"]


@admin.register(TradeFairAgent)
class TradeFairAgentAdmin(admin.ModelAdmin):
  list_display = ["id", "agent_name", "fair", "is_dmc", "status"]
