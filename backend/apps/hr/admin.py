from django.contrib import admin

from .models import Attendance, Employee, LeaveRequest, Payroll


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
  list_display = ("id", "first_name", "last_name", "email", "department", "designation", "status")
  list_filter = ("department", "designation", "status")
  search_fields = ("first_name", "last_name", "email")


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
  list_display = ("id", "employee", "date", "status")
  list_filter = ("status", "date")
  search_fields = ("employee__first_name", "employee__last_name")


@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
  list_display = ("id", "employee", "start_date", "end_date", "status")
  list_filter = ("status", "start_date")
  search_fields = ("employee__first_name", "employee__last_name", "reason")


@admin.register(Payroll)
class PayrollAdmin(admin.ModelAdmin):
  list_display = ("id", "employee", "month", "net_salary")
  list_filter = ("month",)
  search_fields = ("employee__first_name", "employee__last_name")

