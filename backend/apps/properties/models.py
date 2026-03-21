from __future__ import annotations

from django.conf import settings
from django.db import models
from django.utils import timezone


class Property(models.Model):
  """
  Core property model roughly aligned with the frontend's `Property` type.
  Some highly UI-specific/computed fields remain frontend-only for now.
  """

  TYPE_HOTEL = "Hotel"
  TYPE_RESORT = "Resort"
  TYPE_COTTAGE = "Cottage"
  TYPE_VILLA = "Villa"
  TYPE_GUEST_HOUSE = "Guest House"

  CLASS_ECONOMY = "Economy"
  CLASS_STANDARD = "Standard"
  CLASS_PREMIUM = "Premium"
  CLASS_LUXURY = "Luxury"

  ROOM_1_10 = "1-10 rooms"
  ROOM_11_20 = "11-20 rooms"
  ROOM_21_30 = "21-30 rooms"
  ROOM_30_PLUS = "30+ rooms"

  TENURE_1_YEAR = "1 Year"
  TENURE_2_YEARS = "2 Years"
  TENURE_3_YEARS = "3 Years"

  id = models.CharField(primary_key=True, max_length=64, blank=True)
  slno = models.PositiveIntegerField(blank=True, null=True)
  name = models.CharField(max_length=255)
  property_type = models.CharField(max_length=50, blank=True, null=True)
  property_class = models.CharField(max_length=50, blank=True, null=True)
  room_category = models.CharField(max_length=50, blank=True, null=True)
  number_of_rooms = models.PositiveIntegerField(default=0)
  has_multiple_property = models.BooleanField(default=False)
  number_of_properties = models.PositiveIntegerField(null=True, blank=True)

  email = models.EmailField(blank=True, null=True)
  proposed_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
  final_committed_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
  tenure = models.CharField(max_length=50, blank=True, null=True)
  place = models.CharField(max_length=255, blank=True, null=True)
  primary_contact_person = models.CharField(max_length=100, blank=True, null=True)
  contact_person_name = models.CharField(max_length=100, blank=True, null=True)
  contact_number = models.CharField(max_length=32, blank=True, null=True)
  primary_person_position = models.CharField(max_length=100, null=True, blank=True)
  executive_name = models.CharField(max_length=100, null=True, blank=True)

  first_visit_date = models.DateField(blank=True, null=True)
  first_visit_status = models.CharField(max_length=100, blank=True, null=True)
  committed_proposed_rate = models.CharField(max_length=100, null=True, blank=True)
  comments = models.TextField(blank=True)
  rescheduled_date = models.DateField(null=True, blank=True)
  rescheduled_comment = models.TextField(null=True, blank=True)
  second_visit_executive = models.CharField(max_length=100, null=True, blank=True)
  second_visit_date = models.DateField(null=True, blank=True)
  second_visit_status = models.CharField(max_length=100, null=True, blank=True)
  second_visit_comments = models.TextField(null=True, blank=True)
  currently_assigned_to = models.CharField(max_length=100, null=True, blank=True)

  plan_type = models.CharField(max_length=100, null=True, blank=True)
  closing_amount = models.DecimalField(
    max_digits=12, decimal_places=2, null=True, blank=True
  )
  plan_start_date = models.DateField(blank=True, null=True)
  plan_expiry_date = models.DateField(blank=True, null=True)

  location_link = models.URLField(blank=True, null=True)
  current_pms = models.CharField(max_length=100, blank=True, null=True)
  connected_ota_platforms = models.JSONField(default=list)

  state = models.CharField(max_length=100, blank=True, null=True)
  district = models.CharField(max_length=100, blank=True, null=True)
  location = models.CharField(max_length=255, blank=True, null=True)

  created_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="created_properties",
  )
  updated_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="updated_properties",
  )
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  is_deleted = models.BooleanField(default=False)
  deleted_at = models.DateTimeField(null=True, blank=True)

  is_draft = models.BooleanField(default=False)

  class Meta:
    ordering = ["-created_at"]

  def save(self, *args, **kwargs) -> None:
    if not self.id:
      import uuid
      self.id = str(uuid.uuid4())
    if self.slno is None:
      last = Property.objects.order_by("-slno").first()
      self.slno = (last.slno + 1) if last and last.slno else 1
    super().save(*args, **kwargs)

  def soft_delete(self) -> None:
    self.is_deleted = True
    self.deleted_at = timezone.now()
    self.save(update_fields=["is_deleted", "deleted_at"])

