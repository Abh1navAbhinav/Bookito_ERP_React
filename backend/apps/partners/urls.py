from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
  TradeFairAgentViewSet,
  TradeFairPropertyViewSet,
  TradeFairVenueViewSet,
  TravelAgentViewSet,
)

router = DefaultRouter()
router.register("agents", TravelAgentViewSet, basename="travel-agent")
router.register("venues", TradeFairVenueViewSet, basename="trade-fair-venue")
router.register("fair-properties", TradeFairPropertyViewSet, basename="trade-fair-property")
router.register("fair-agents", TradeFairAgentViewSet, basename="trade-fair-agent")

urlpatterns = [
  path("", include(router.urls)),
]
