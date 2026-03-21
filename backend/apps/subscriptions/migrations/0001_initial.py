# Generated manually for SubscriptionPlan

from django.db import migrations, models


class Migration(migrations.Migration):

  initial = True

  dependencies = []

  operations = [
    migrations.CreateModel(
      name="SubscriptionPlan",
      fields=[
        ("id", models.CharField(max_length=64, primary_key=True, serialize=False)),
        ("name", models.CharField(max_length=255)),
        ("description", models.TextField(blank=True)),
        ("popular", models.BooleanField(default=False)),
        ("promo", models.CharField(blank=True, max_length=255)),
        ("color", models.CharField(default="from-surface-700 to-surface-900", max_length=255)),
        ("footer_note", models.TextField(blank=True)),
        ("pricing", models.JSONField(default=list)),
        ("features", models.JSONField(default=list)),
        ("sort_order", models.PositiveIntegerField(default=0)),
        ("is_deleted", models.BooleanField(default=False)),
        ("deleted_at", models.DateTimeField(blank=True, null=True)),
        ("created_at", models.DateTimeField(auto_now_add=True)),
        ("updated_at", models.DateTimeField(auto_now=True)),
      ],
      options={
        "verbose_name": "Subscription plan",
        "verbose_name_plural": "Subscription plans",
        "ordering": ["sort_order", "name"],
      },
    ),
  ]
