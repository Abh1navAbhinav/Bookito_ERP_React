from __future__ import annotations

from importlib import import_module

from django.core.management.base import BaseCommand


MODULES = [
  "apps.accounts",
  "apps.properties",
  "apps.finance",
  "apps.hr",
  "apps.sales",
  "apps.partners",
  "apps.subscriptions",
]


class Command(BaseCommand):
  help = "Seed demo data for all Bookito modules."

  def handle(self, *args, **options):
    for module in MODULES:
      try:
        seeds = import_module(f"{module}.seeds")
      except ModuleNotFoundError:
        self.stdout.write(self.style.WARNING(f"No seeds module for {module}, skipping."))
        continue

      if hasattr(seeds, "run"):
        self.stdout.write(self.style.NOTICE(f"Seeding data for {module}..."))
        seeds.run()
      else:
        self.stdout.write(
          self.style.WARNING(f"{module}.seeds has no `run` function, skipping.")
        )

    self.stdout.write(self.style.SUCCESS("Seeding completed."))

