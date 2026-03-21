from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import SalesAttendanceViewSet, SalesRecordViewSet

router = DefaultRouter()
router.register("attendance", SalesAttendanceViewSet, basename="sales-attendance")
router.register("records", SalesRecordViewSet, basename="sales-record")

urlpatterns = [
  path("", include(router.urls)),
]
