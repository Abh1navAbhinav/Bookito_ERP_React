from __future__ import annotations

from django.db import models


class SubscriptionPlan(models.Model):
  """
  Product subscription tier with JSON pricing slabs and feature groups.
  Matches the Pricing Plan UI (room slabs × 6m/annual + feature library).
  """

  id = models.CharField(max_length=64, primary_key=True)
  name = models.CharField(max_length=255)
  description = models.TextField(blank=True)
  popular = models.BooleanField(default=False)
  promo = models.CharField(max_length=255, blank=True)
  color = models.CharField(max_length=255, default="from-surface-700 to-surface-900")
  footer_note = models.TextField(blank=True)
  pricing = models.JSONField(default=list)
  features = models.JSONField(default=list)
  sort_order = models.PositiveIntegerField(default=0)
  is_deleted = models.BooleanField(default=False)
  deleted_at = models.DateTimeField(null=True, blank=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    ordering = ["sort_order", "name"]
    verbose_name = "Subscription plan"
    verbose_name_plural = "Subscription plans"

  def __str__(self) -> str:
    return self.name
