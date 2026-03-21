from __future__ import annotations

from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from apps.accounts.models import User
from apps.accounts.permissions import RolePermission, roles_required

from .models import (
  Attendance,
  Employee,
  EssLeaveRequest,
  EssPayslip,
  ExitRequest,
  JobPosting,
  LeaveRequest,
  Payroll,
  PerformanceReview,
  TrainingProgram,
)
from .serializers import (
  AttendanceSerializer,
  EmployeeSerializer,
  EssLeaveRequestSerializer,
  EssPayslipSerializer,
  ExitRequestSerializer,
  JobPostingSerializer,
  LeaveRequestSerializer,
  PayrollSerializer,
  PerformanceReviewSerializer,
  TrainingProgramSerializer,
)


class BaseHrSoftDeleteViewSet(viewsets.ModelViewSet):
  @action(detail=True, methods=["post"], url_path="soft-delete")
  @roles_required([User.ROLE_MANAGER, User.ROLE_HR])
  def soft_delete(self, request: Request, pk: str | None = None) -> Response:
    obj = self.get_object()
    obj.soft_delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

  @action(detail=True, methods=["post"], url_path="restore")
  @roles_required([User.ROLE_MANAGER, User.ROLE_HR])
  def restore(self, request: Request, pk: str | None = None) -> Response:
    obj = self.get_object()
    obj.is_deleted = False
    obj.deleted_at = None
    obj.save(update_fields=["is_deleted", "deleted_at"])
    serializer = self.get_serializer(obj)
    return Response(serializer.data)

  @action(detail=False, methods=["get"], url_path="deleted")
  @roles_required([User.ROLE_MANAGER, User.ROLE_HR])
  def list_deleted(self, request: Request) -> Response:
    qs = self.get_queryset().filter(is_deleted=True)
    page = self.paginate_queryset(qs)
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      return self.get_paginated_response(serializer.data)
    serializer = self.get_serializer(qs, many=True)
    return Response(serializer.data)


class EmployeeViewSet(BaseHrSoftDeleteViewSet):
  queryset = Employee.objects.filter(is_deleted=False)
  serializer_class = EmployeeSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_HR]
  filter_backends = [filters.SearchFilter, filters.OrderingFilter]
  search_fields = ["first_name", "last_name", "email", "department", "designation"]
  ordering_fields = ["date_of_joining", "first_name", "last_name"]


class AttendanceViewSet(BaseHrSoftDeleteViewSet):
  queryset = Attendance.objects.filter(is_deleted=False).select_related("employee")
  serializer_class = AttendanceSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_HR, User.ROLE_SALES]
  filter_backends = [filters.SearchFilter, filters.OrderingFilter]
  search_fields = ["employee__first_name", "employee__last_name", "employee__department"]
  ordering_fields = ["date", "created_at"]


class LeaveRequestViewSet(BaseHrSoftDeleteViewSet):
  queryset = LeaveRequest.objects.filter(is_deleted=False).select_related("employee")
  serializer_class = LeaveRequestSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_HR]
  filter_backends = [filters.SearchFilter, filters.OrderingFilter]
  search_fields = ["employee__first_name", "employee__last_name", "reason"]
  ordering_fields = ["start_date", "end_date", "created_at"]


class PayrollViewSet(BaseHrSoftDeleteViewSet):
  queryset = Payroll.objects.filter(is_deleted=False).select_related("employee")
  serializer_class = PayrollSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_HR]
  filter_backends = [filters.SearchFilter, filters.OrderingFilter]
  search_fields = ["employee__first_name", "employee__last_name", "employee__department"]
  ordering_fields = ["month", "net_salary", "created_at"]


class ExitRequestViewSet(BaseHrSoftDeleteViewSet):
  queryset = ExitRequest.objects.filter(is_deleted=False)
  serializer_class = ExitRequestSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_HR]
  filter_backends = [filters.SearchFilter, filters.OrderingFilter]
  search_fields = ["employee_name", "employee_code", "reason"]
  ordering_fields = ["resignation_date", "last_working_day", "created_at"]


class JobPostingViewSet(BaseHrSoftDeleteViewSet):
  queryset = JobPosting.objects.filter(is_deleted=False)
  serializer_class = JobPostingSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_HR]
  filter_backends = [filters.SearchFilter, filters.OrderingFilter]
  search_fields = ["title", "department", "location"]
  ordering_fields = ["posted_date", "applicants", "created_at"]


class TrainingProgramViewSet(BaseHrSoftDeleteViewSet):
  queryset = TrainingProgram.objects.filter(is_deleted=False)
  serializer_class = TrainingProgramSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_HR]
  filter_backends = [filters.SearchFilter, filters.OrderingFilter]
  search_fields = ["title", "instructor"]
  ordering_fields = ["start_date", "employees_enrolled", "created_at"]


class PerformanceReviewViewSet(BaseHrSoftDeleteViewSet):
  queryset = PerformanceReview.objects.filter(is_deleted=False)
  serializer_class = PerformanceReviewSerializer
  permission_classes = [permissions.IsAuthenticated, RolePermission]
  allowed_roles = [User.ROLE_MANAGER, User.ROLE_HR]
  filter_backends = [filters.SearchFilter, filters.OrderingFilter]
  search_fields = ["employee_name", "employee_code", "reviewer", "review_period"]
  ordering_fields = ["created_at", "rating"]


class EssPayslipViewSet(viewsets.ReadOnlyModelViewSet):
  serializer_class = EssPayslipSerializer
  permission_classes = [permissions.IsAuthenticated]

  def get_queryset(self):
    return EssPayslip.objects.filter(user=self.request.user)


class EssLeaveRequestViewSet(viewsets.ModelViewSet):
  serializer_class = EssLeaveRequestSerializer
  permission_classes = [permissions.IsAuthenticated]
  http_method_names = ["get", "post", "patch", "head", "options"]

  def get_queryset(self):
    return EssLeaveRequest.objects.filter(user=self.request.user)

  def get_serializer_context(self):
    ctx = super().get_serializer_context()
    ctx["request"] = self.request
    return ctx

  def perform_create(self, serializer):
    serializer.save(user=self.request.user)

