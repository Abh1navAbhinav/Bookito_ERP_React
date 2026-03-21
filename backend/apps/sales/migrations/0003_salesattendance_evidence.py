from django.db import migrations, models


class Migration(migrations.Migration):

  dependencies = [
    ("sales", "0002_add_sales_record"),
  ]

  operations = [
    migrations.AddField(
      model_name="salesattendance",
      name="check_in_location",
      field=models.JSONField(blank=True, null=True),
    ),
    migrations.AddField(
      model_name="salesattendance",
      name="check_out_location",
      field=models.JSONField(blank=True, null=True),
    ),
    migrations.AddField(
      model_name="salesattendance",
      name="check_in_selfie",
      field=models.TextField(blank=True, default=""),
    ),
    migrations.AddField(
      model_name="salesattendance",
      name="check_out_selfie",
      field=models.TextField(blank=True, default=""),
    ),
  ]
