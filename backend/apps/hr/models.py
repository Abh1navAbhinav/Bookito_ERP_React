from __future__ import annotations

from django.conf import settings
from django.db import models
from django.utils import timezone


class SoftDeleteModel(models.Model):
  is_deleted = models.BooleanField(default=False)
  deleted_at = models.DateTimeField(null=True, blank=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    abstract = True

  def soft_delete(self) -> None:
    self.is_deleted = True
    self.deleted_at = timezone.now()
    self.save(update_fields=["is_deleted", "deleted_at"])


class Employee(SoftDeleteModel):
  STATUS_ACTIVE = "active"
  STATUS_INACTIVE = "inactive"

  STATUS_CHOICES = [
    (STATUS_ACTIVE, "Active"),
    (STATUS_INACTIVE, "Inactive"),
  ]

  id = models.CharField(primary_key=True, max_length=64)
  first_name = models.CharField(max_length=100)
  last_name = models.CharField(max_length=100)
  email = models.EmailField(unique=True)
  phone = models.CharField(max_length=20, blank=True)
  department = models.CharField(max_length=100)
  designation = models.CharField(max_length=100)
  date_of_joining = models.DateField()
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_ACTIVE)

  def __str__(self) -> str:
    return f"{self.first_name} {self.last_name}"


class Attendance(SoftDeleteModel):
  STATUS_PRESENT = "present"
  STATUS_ABSENT = "absent"
  STATUS_LEAVE = "leave"

  STATUS_CHOICES = [
    (STATUS_PRESENT, "Present"),
    (STATUS_ABSENT, "Absent"),
    (STATUS_LEAVE, "On Leave"),
  ]

  id = models.CharField(primary_key=True, max_length=64)
  employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="attendance_records")
  date = models.DateField()
  status = models.CharField(max_length=20, choices=STATUS_CHOICES)
  check_in_time = models.TimeField(null=True, blank=True)
  check_out_time = models.TimeField(null=True, blank=True)
  notes = models.CharField(max_length=255, blank=True)

  class Meta:
    unique_together = ("employee", "date")
    ordering = ["-date"]


class LeaveRequest(SoftDeleteModel):
  STATUS_PENDING = "pending"
  STATUS_APPROVED = "approved"
  STATUS_REJECTED = "rejected"

  STATUS_CHOICES = [
    (STATUS_PENDING, "Pending"),
    (STATUS_APPROVED, "Approved"),
    (STATUS_REJECTED, "Rejected"),
  ]

  id = models.CharField(primary_key=True, max_length=64)
  employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="leave_requests")
  start_date = models.DateField()
  end_date = models.DateField()
  reason = models.CharField(max_length=255)
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
  approved_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="approved_leaves",
  )

  class Meta:
    ordering = ["-start_date"]


class Payroll(SoftDeleteModel):
  id = models.CharField(primary_key=True, max_length=64)
  employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="payroll_records")
  month = models.DateField(help_text="Any date within the payroll month")
  basic_salary = models.DecimalField(max_digits=12, decimal_places=2)
  allowances = models.DecimalField(max_digits=12, decimal_places=2, default=0)
  deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
  net_salary = models.DecimalField(max_digits=12, decimal_places=2)
  processed_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="processed_payrolls",
  )

  class Meta:
    ordering = ["-month"]


class ExitRequest(SoftDeleteModel):
  id = models.CharField(primary_key=True, max_length=64)
  employee_name = models.CharField(max_length=255)
  employee_code = models.CharField(max_length=64)
  resignation_date = models.DateField()
  last_working_day = models.DateField()
  status = models.CharField(max_length=20, default="Pending")
  reason = models.CharField(max_length=500, blank=True)

  class Meta:
    ordering = ["-resignation_date"]


class JobPosting(SoftDeleteModel):
  id = models.CharField(primary_key=True, max_length=64)
  title = models.CharField(max_length=255)
  department = models.CharField(max_length=100)
  location = models.CharField(max_length=255)
  employment_type = models.CharField(max_length=32, default="Full-time")
  applicants = models.PositiveIntegerField(default=0)
  posted_date = models.DateField()
  status = models.CharField(max_length=20, default="Published")

  class Meta:
    ordering = ["-posted_date"]


class TrainingProgram(SoftDeleteModel):
  id = models.CharField(primary_key=True, max_length=64)
  title = models.CharField(max_length=255)
  instructor = models.CharField(max_length=255)
  employees_enrolled = models.PositiveIntegerField(default=0)
  completion_rate = models.CharField(max_length=16, default="0%")
  start_date = models.DateField()
  status = models.CharField(max_length=20, default="Draft")

  class Meta:
    ordering = ["-start_date"]


class PerformanceReview(SoftDeleteModel):
  id = models.CharField(primary_key=True, max_length=64)
  employee_name = models.CharField(max_length=255)
  employee_code = models.CharField(max_length=64)
  review_period = models.CharField(max_length=64)
  rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
  reviewer = models.CharField(max_length=255)
  status = models.CharField(max_length=32, default="Scheduled")

  class Meta:
    ordering = ["-created_at"]


class EssPayslip(models.Model):
  user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ess_payslips")
  month_label = models.CharField(max_length=64)
  net_pay = models.CharField(max_length=64)
  status = models.CharField(max_length=32, default="Paid")
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    ordering = ["-created_at"]
    unique_together = ("user", "month_label")


class EssLeaveRequest(models.Model):
  STATUS_PENDING = "Pending"
  STATUS_APPROVED = "Approved"
  STATUS_REJECTED = "Rejected"
  STATUS_REVOKED = "Revoked"
  STATUS_CHOICES = [
    (STATUS_PENDING, "Pending"),
    (STATUS_APPROVED, "Approved"),
    (STATUS_REJECTED, "Rejected"),
    (STATUS_REVOKED, "Revoked"),
  ]

  user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ess_leave_requests")
  leave_type = models.CharField(max_length=100)
  start_date = models.DateField()
  end_date = models.DateField()
  reason = models.CharField(max_length=500, blank=True)
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
  hr_comment = models.CharField(max_length=500, blank=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    ordering = ["-created_at"]

