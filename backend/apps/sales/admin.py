from django.contrib import admin

from .models import SalesAttendance


@admin.register(SalesAttendance)
class SalesAttendanceAdmin(admin.ModelAdmin):
  list_display = ("id", "user", "date", "check_in_time", "check_out_time")
  list_filter = ("date",)
  search_fields = ("user__username", "user__email")
