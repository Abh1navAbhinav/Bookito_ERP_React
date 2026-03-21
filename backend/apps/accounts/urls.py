from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import BookitoTokenObtainPairSerializer
from .views import (
  BookitoTokenRefreshView,
  CatalogueFeatureViewSet,
  LoginView,
  LogoutView,
  NotificationListView,
  UserViewSet,
)


class BookitoTokenObtainPairView(TokenObtainPairView):
  serializer_class = BookitoTokenObtainPairSerializer


router = DefaultRouter()
router.register("users", UserViewSet, basename="user")
router.register("catalogue-features", CatalogueFeatureViewSet, basename="catalogue-feature")

urlpatterns = [
  # JWT endpoints
  path("token/", BookitoTokenObtainPairView.as_view(), name="token_obtain_pair"),
  path("token/refresh/", BookitoTokenRefreshView.as_view(), name="token_refresh"),
  # Higher-level auth flows
  path("login/", LoginView.as_view(), name="login"),
  path("logout/", LogoutView.as_view(), name="logout"),
  path("notifications/", NotificationListView.as_view(), name="notification_list"),
  # User listing
  path("", include(router.urls)),
]

