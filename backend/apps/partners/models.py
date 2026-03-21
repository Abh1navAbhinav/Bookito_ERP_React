from __future__ import annotations

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


class TravelAgent(SoftDeleteModel):
  CONTRACT_PLATINUM = "Platinum"
  CONTRACT_GOLD = "Gold"
  CONTRACT_SILVER = "Silver"
  CONTRACT_BRONZE = "Bronze"

  CONTRACT_CHOICES = [
    (CONTRACT_PLATINUM, "Platinum"),
    (CONTRACT_GOLD, "Gold"),
    (CONTRACT_SILVER, "Silver"),
    (CONTRACT_BRONZE, "Bronze"),
  ]

  id = models.CharField(primary_key=True, max_length=64)
  slno = models.PositiveIntegerField()
  agent_name = models.CharField(max_length=255)
  contact_number = models.CharField(max_length=32)
  email = models.EmailField()
  trial_status = models.BooleanField(default=False)
  trial_remaining_days = models.PositiveIntegerField(default=0)
  plan_start_date = models.DateField()
  plan_end_date = models.DateField()
  pending_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
  collected_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
  contract_type = models.CharField(max_length=32, choices=CONTRACT_CHOICES)
  state = models.CharField(max_length=100)
  district = models.CharField(max_length=100)
  location = models.CharField(max_length=255)

  class Meta:
    ordering = ["slno"]


class TradeFairVenue(SoftDeleteModel):
  id = models.CharField(primary_key=True, max_length=64)
  location = models.CharField(max_length=255)
  city = models.CharField(max_length=100)
  venue = models.CharField(max_length=255)
  date = models.DateField()

  class Meta:
    ordering = ["-date"]


class TradeFairProperty(SoftDeleteModel):
  STATUS_INTERESTED = "Interested"
  STATUS_REQUESTED_DEMO = "Requested Demo"
  STATUS_CONNECTED = "Connected"
  STATUS_CLOSED = "Closed"
  STATUS_PAYMENT_DONE = "Payment Done"

  STATUS_CHOICES = [
    (STATUS_INTERESTED, "Interested"),
    (STATUS_REQUESTED_DEMO, "Requested Demo"),
    (STATUS_CONNECTED, "Connected"),
    (STATUS_CLOSED, "Closed"),
    (STATUS_PAYMENT_DONE, "Payment Done"),
  ]

  id = models.CharField(primary_key=True, max_length=64)
  fair = models.ForeignKey(
    TradeFairVenue, on_delete=models.CASCADE, related_name="properties"
  )
  property_name = models.CharField(max_length=255)
  contact_person = models.CharField(max_length=100)
  contact_number = models.CharField(max_length=32)
  email = models.EmailField()
  location = models.CharField(max_length=255)
  status = models.CharField(max_length=32, choices=STATUS_CHOICES)

  class Meta:
    ordering = ["property_name"]


class TradeFairAgent(SoftDeleteModel):
  STATUS_INTERESTED = "Interested"
  STATUS_REQUESTED_DEMO = "Requested Demo"
  STATUS_CONNECTED = "Connected"
  STATUS_CLOSED = "Closed"
  STATUS_PAYMENT_DONE = "Payment Done"

  STATUS_CHOICES = [
    (STATUS_INTERESTED, "Interested"),
    (STATUS_REQUESTED_DEMO, "Requested Demo"),
    (STATUS_CONNECTED, "Connected"),
    (STATUS_CLOSED, "Closed"),
    (STATUS_PAYMENT_DONE, "Payment Done"),
  ]

  id = models.CharField(primary_key=True, max_length=64)
  fair = models.ForeignKey(
    TradeFairVenue, on_delete=models.CASCADE, related_name="agents"
  )
  agent_name = models.CharField(max_length=255)
  contact_number = models.CharField(max_length=32)
  email = models.EmailField()
  location = models.CharField(max_length=255)
  is_dmc = models.BooleanField(default=False)
  status = models.CharField(max_length=32, choices=STATUS_CHOICES)

  class Meta:
    ordering = ["agent_name"]
