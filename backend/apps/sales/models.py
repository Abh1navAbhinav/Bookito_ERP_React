from __future__ import annotations

from django.conf import settings
from django.db import models


class SalesAttendance(models.Model):
  """
  Daily check-in/check-out for sales staff. One record per user per date.
  """
  id = models.CharField(primary_key=True, max_length=64)
  user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name="sales_attendance_records",
  )
  date = models.DateField()
  check_in_time = models.TimeField(null=True, blank=True)
  check_out_time = models.TimeField(null=True, blank=True)
  notes = models.CharField(max_length=255, blank=True)
  check_in_location = models.JSONField(null=True, blank=True)
  check_out_location = models.JSONField(null=True, blank=True)
  check_in_selfie = models.TextField(blank=True)
  check_out_selfie = models.TextField(blank=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    unique_together = ("user", "date")
    ordering = ["-date"]


class SalesRecord(models.Model):
  """
  Sales pipeline record: property deal with status, executive, visit history.
  """

  STATUS_CLOSED = "Closed"
  STATUS_INSTALLATION_PENDING = "Installation Pending"
  STATUS_INTERESTED = "Interested"
  STATUS_NOT_INTERESTED = "Not Interested"
  STATUS_RESCHEDULED = "Rescheduled"
  STATUS_UNDER_MAINTENANCE = "Under Maintenance"

  STATUS_CHOICES = [
    (STATUS_CLOSED, "Closed"),
    (STATUS_INSTALLATION_PENDING, "Installation Pending"),
    (STATUS_INTERESTED, "Interested"),
    (STATUS_NOT_INTERESTED, "Not Interested"),
    (STATUS_RESCHEDULED, "Rescheduled"),
    (STATUS_UNDER_MAINTENANCE, "Under Maintenance"),
  ]

  PLAN_6_MONTH = "6 Month"
  PLAN_1_YEAR = "1 Year"
  PLAN_CHOICES = [(PLAN_6_MONTH, "6 Month"), (PLAN_1_YEAR, "1 Year")]

  id = models.CharField(primary_key=True, max_length=64)
  slno = models.PositiveIntegerField()
  property = models.ForeignKey(
    "properties.Property",
    on_delete=models.CASCADE,
    related_name="sales_records",
    null=True,
    blank=True,
  )
  property_name = models.CharField(max_length=255)
  number_of_rooms = models.PositiveIntegerField(default=0)
  email = models.EmailField(blank=True)
  primary_contact_person = models.CharField(max_length=255)
  designation = models.CharField(max_length=100, blank=True)
  proposed_price = models.DecimalField(max_digits=12, decimal_places=2)
  plan_type = models.CharField(max_length=20, choices=PLAN_CHOICES)
  status = models.CharField(max_length=32, choices=STATUS_CHOICES)
  comments = models.TextField(blank=True)
  demo_provided = models.BooleanField(default=False)
  trial_provided = models.BooleanField(default=False)
  installed = models.BooleanField(default=False)
  executive = models.CharField(max_length=255)
  state = models.CharField(max_length=100)
  district = models.CharField(max_length=100)
  location = models.CharField(max_length=255)
  location_link = models.URLField(blank=True)
  is_live = models.BooleanField(default=False)
  visit_history = models.JSONField(default=list)  # list of {date, time, status, comment}
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  is_deleted = models.BooleanField(default=False)
  deleted_at = models.DateTimeField(null=True, blank=True)

  class Meta:
    ordering = ["slno"]

  def soft_delete(self) -> None:
    from django.utils import timezone
    self.is_deleted = True
    self.deleted_at = timezone.now()
    self.save(update_fields=["is_deleted", "deleted_at"])
