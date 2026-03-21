from __future__ import annotations

from rest_framework import serializers

from apps.accounts.models import User

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


class EmployeeSerializer(serializers.ModelSerializer):
  class Meta:
    model = Employee
    fields = [
      "id",
      "first_name",
      "last_name",
      "email",
      "phone",
      "department",
      "designation",
      "date_of_joining",
      "status",
      "is_deleted",
      "deleted_at",
      "created_at",
    ]


class AttendanceSerializer(serializers.ModelSerializer):
  employee_name = serializers.CharField(source="employee.__str__", read_only=True)

  class Meta:
    model = Attendance
    fields = [
      "id",
      "employee",
      "employee_name",
      "date",
      "status",
      "check_in_time",
      "check_out_time",
      "notes",
      "is_deleted",
      "deleted_at",
      "created_at",
    ]


class LeaveRequestSerializer(serializers.ModelSerializer):
  employee_name = serializers.CharField(source="employee.__str__", read_only=True)

  class Meta:
    model = LeaveRequest
    fields = [
      "id",
      "employee",
      "employee_name",
      "start_date",
      "end_date",
      "reason",
      "status",
      "approved_by",
      "is_deleted",
      "deleted_at",
      "created_at",
    ]


class PayrollSerializer(serializers.ModelSerializer):
  employee_name = serializers.CharField(source="employee.__str__", read_only=True)

  class Meta:
    model = Payroll
    fields = [
      "id",
      "employee",
      "employee_name",
      "month",
      "basic_salary",
      "allowances",
      "deductions",
      "net_salary",
      "processed_by",
      "is_deleted",
      "deleted_at",
      "created_at",
    ]


class ExitRequestSerializer(serializers.ModelSerializer):
  class Meta:
    model = ExitRequest
    fields = [
      "id",
      "employee_name",
      "employee_code",
      "resignation_date",
      "last_working_day",
      "status",
      "reason",
      "is_deleted",
      "deleted_at",
      "created_at",
    ]


class JobPostingSerializer(serializers.ModelSerializer):
  class Meta:
    model = JobPosting
    fields = [
      "id",
      "title",
      "department",
      "location",
      "employment_type",
      "applicants",
      "posted_date",
      "status",
      "is_deleted",
      "deleted_at",
      "created_at",
    ]


class TrainingProgramSerializer(serializers.ModelSerializer):
  class Meta:
    model = TrainingProgram
    fields = [
      "id",
      "title",
      "instructor",
      "employees_enrolled",
      "completion_rate",
      "start_date",
      "status",
      "is_deleted",
      "deleted_at",
      "created_at",
    ]


class PerformanceReviewSerializer(serializers.ModelSerializer):
  class Meta:
    model = PerformanceReview
    fields = [
      "id",
      "employee_name",
      "employee_code",
      "review_period",
      "rating",
      "reviewer",
      "status",
      "is_deleted",
      "deleted_at",
      "created_at",
    ]


class EssPayslipSerializer(serializers.ModelSerializer):
  class Meta:
    model = EssPayslip
    fields = ["id", "month_label", "net_pay", "status", "created_at"]


class EssLeaveRequestSerializer(serializers.ModelSerializer):
  class Meta:
    model = EssLeaveRequest
    fields = [
      "id",
      "leave_type",
      "start_date",
      "end_date",
      "reason",
      "status",
      "hr_comment",
      "created_at",
      "updated_at",
    ]

  def validate_status(self, value: str) -> str:
    inst = self.instance
    req = self.context.get("request")
    if not inst:
      if value and value != EssLeaveRequest.STATUS_PENDING:
        raise serializers.ValidationError("New requests must start as Pending.")
      return EssLeaveRequest.STATUS_PENDING
    if value == inst.status:
      return value
    user = getattr(req, "user", None)
    if user and user.role in (User.ROLE_HR, User.ROLE_MANAGER, User.ROLE_ADMIN):
      return value
    if value == EssLeaveRequest.STATUS_REVOKED and inst.status == EssLeaveRequest.STATUS_PENDING:
      return value
    raise serializers.ValidationError("You cannot change this status.")

