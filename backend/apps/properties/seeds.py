from __future__ import annotations

from datetime import date

from django.utils import timezone

from .models import Property


def run() -> None:
  """
  Seed a realistic set of property records (10+) based loosely on the frontend mock data.
  """

  if Property.objects.exists():
    return

  today = date.today()

  seed_data = [
    {
      "id": "p1",
      "slno": 1,
      "name": "Ocean Breeze Resort",
      "property_type": "Resort",
      "property_class": "Luxury",
      "room_category": "30+ rooms",
      "number_of_rooms": 45,
      "has_multiple_property": True,
      "number_of_properties": 2,
      "email": "info@oceanbreeze.com",
      "proposed_price": 150000,
      "final_committed_price": 135000,
      "tenure": "1 Year",
      "place": "Calicut Beach",
      "primary_contact_person": "Manager",
      "contact_person_name": "Rajesh Kumar",
      "contact_number": "+91 98765 43210",
      "first_visit_date": today.replace(year=today.year - 1),
      "first_visit_status": "Completed",
      "comments": "Very interested in premium plan with OTA integration.",
      "second_visit_executive": "Anil Menon",
      "second_visit_date": today.replace(year=today.year - 1, month=max(1, today.month - 11)),
      "second_visit_status": "Closed",
      "closing_amount": 135000,
      "plan_type": "Premium",
      "plan_start_date": today.replace(month=1, day=1),
      "plan_expiry_date": today.replace(month=12, day=31),
      "location_link": "https://maps.google.com/?q=11.2588,75.7804",
      "current_pms": "None",
      "connected_ota_platforms": ["Booking.com", "MakeMyTrip", "Goibibo"],
      "state": "Kerala",
      "district": "Kozhikode",
      "location": "Calicut Beach",
    },
    {
      "id": "p2",
      "slno": 2,
      "name": "Kappad Heritage Inn",
      "property_type": "Hotel",
      "property_class": "Premium",
      "room_category": "11-20 rooms",
      "number_of_rooms": 18,
      "has_multiple_property": False,
      "email": "book@kappadinn.in",
      "proposed_price": 85000,
      "final_committed_price": 78000,
      "tenure": "1 Year",
      "place": "Kappad",
      "primary_contact_person": "Owner",
      "contact_person_name": "Priya Nair",
      "contact_number": "+91 87654 32109",
      "first_visit_date": today.replace(year=today.year - 1, month=max(1, today.month - 4)),
      "first_visit_status": "Completed",
      "comments": "Wants channel manager integration.",
      "second_visit_executive": "Deepa S",
      "second_visit_date": today.replace(year=today.year - 1, month=max(1, today.month - 3)),
      "second_visit_status": "Closed",
      "closing_amount": 78000,
      "plan_type": "Standard",
      "plan_start_date": today.replace(month=1, day=10),
      "plan_expiry_date": today.replace(year=today.year + 1, month=1, day=9),
      "location_link": "https://maps.google.com/?q=11.3850,75.7217",
      "current_pms": "eZee",
      "connected_ota_platforms": ["OYO", "Agoda"],
      "state": "Kerala",
      "district": "Kozhikode",
      "location": "Kappad",
    },
  ]

  # Add additional generic properties to reach 10+ records.
  for i in range(3, 13):
    seed_data.append(
      {
        "id": f"p{i}",
        "slno": i,
        "name": f"Demo Property {i}",
        "property_type": "Hotel" if i % 2 == 0 else "Resort",
        "property_class": "Standard" if i % 3 == 0 else "Premium",
        "room_category": "21-30 rooms" if i % 2 == 0 else "11-20 rooms",
        "number_of_rooms": 20 + i,
        "has_multiple_property": False,
        "email": f"demo{i}@bookito.com",
        "proposed_price": 50000 + i * 2000,
        "final_committed_price": 45000 + i * 1800,
        "tenure": "1 Year",
        "place": "Demo City",
        "primary_contact_person": "Owner",
        "contact_person_name": f"Contact {i}",
        "contact_number": f"+91 90000 00{i:03d}",
        "first_visit_date": today.replace(year=today.year - 1),
        "first_visit_status": "Completed",
        "comments": "Demo seeded property.",
        "second_visit_executive": "Demo Executive",
        "second_visit_date": today.replace(year=today.year - 1, month=max(1, today.month - 1)),
        "second_visit_status": "Interested" if i % 2 == 0 else "Closed",
        "closing_amount": 45000 + i * 1800,
        "plan_type": "Basic" if i % 2 == 0 else "Premium",
        "plan_start_date": today.replace(month=1, day=15),
        "plan_expiry_date": today.replace(year=today.year + 1, month=1, day=14),
        "location_link": "https://maps.google.com/?q=10.0000,76.0000",
        "current_pms": "None",
        "connected_ota_platforms": ["Booking.com"],
        "state": "Kerala",
        "district": "Kozhikode",
        "location": "Demo Area",
      }
    )

  for payload in seed_data:
    Property.objects.create(**payload)

