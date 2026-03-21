from __future__ import annotations

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets
from rest_framework.response import Response

from apps.accounts.models import User
from apps.accounts.permissions import RolePermission

from .models import SalesAttendance, SalesRecord
from .serializers import SalesAttendanceSerializer, SalesRecordSerializer


class SalesAttendanceViewSet(viewsets.ModelViewSet):
  """
  Sales attendance: sales users see only their rows; manager/HR see all sales punches.
  Filter: ?date=YYYY-MM-DD or ?month=YYYY-MM.
  """
  serializer_class = SalesAttendanceSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_SALES, User.ROLE_HR]

  def get_queryset(self):
    user = self.request.user
    if user.role in (User.ROLE_MANAGER, User.ROLE_HR):
      qs = SalesAttendance.objects.select_related("user").all()
    else:
      qs = SalesAttendance.objects.select_related("user").filter(user=user)

    date = self.request.query_params.get("date")
    if date:
      qs = qs.filter(date=date)

    month = self.request.query_params.get("month")
    if month:
      parts = month.split("-", 1)
      if len(parts) == 2 and parts[0].isdigit() and parts[1].isdigit():
        qs = qs.filter(date__year=int(parts[0]), date__month=int(parts[1]))

    return qs.order_by("-date", "-created_at")

  def perform_create(self, serializer):
    data = serializer.validated_data
    date_val = data["date"]
    pk = data.get("id") or f"sales-att-{self.request.user.id}-{date_val}"
    serializer.save(user=self.request.user, id=pk)

  def list(self, request, *args, **kwargs):
    queryset = self.filter_queryset(self.get_queryset())
    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data)


class SalesRecordViewSet(viewsets.ModelViewSet):
  """
  Sales pipeline records. List/retrieve; filter by ?executive=.
  """
  queryset = SalesRecord.objects.filter(is_deleted=False)
  serializer_class = SalesRecordSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_SALES, User.ROLE_CRM]
  filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
  filterset_fields = ["executive", "status"]
  search_fields = ["property_name", "executive", "location"]
  ordering_fields = ["slno", "created_at"]
