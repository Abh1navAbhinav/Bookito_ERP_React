from __future__ import annotations

from decimal import Decimal
from datetime import date

from .models import TradeFairAgent, TradeFairProperty, TradeFairVenue, TravelAgent


def run() -> None:
  if TravelAgent.objects.exists():
    return

  agents = [
    TravelAgent(
      id="ta1",
      slno=1,
      agent_name="Kerala Holidays Pvt Ltd",
      contact_number="+91 94567 12345",
      email="contact@keralaholidays.com",
      trial_status=False,
      trial_remaining_days=0,
      plan_start_date=date(2025, 6, 1),
      plan_end_date=date(2026, 5, 31),
      pending_amount=Decimal("15000"),
      collected_amount=Decimal("85000"),
      contract_type=TravelAgent.CONTRACT_PLATINUM,
      state="Kerala",
      district="Kozhikode",
      location="Calicut Beach",
    ),
    TravelAgent(
      id="ta2",
      slno=2,
      agent_name="Malabar Travels",
      contact_number="+91 85678 23456",
      email="info@malabartravels.in",
      trial_status=True,
      trial_remaining_days=12,
      plan_start_date=date(2026, 3, 1),
      plan_end_date=date(2026, 3, 31),
      pending_amount=Decimal("0"),
      collected_amount=Decimal("0"),
      contract_type=TravelAgent.CONTRACT_BRONZE,
      state="Kerala",
      district="Kozhikode",
      location="Kappad",
    ),
    TravelAgent(
      id="ta3",
      slno=3,
      agent_name="Cochin Adventures",
      contact_number="+91 76789 34567",
      email="book@cochinadventures.com",
      trial_status=False,
      trial_remaining_days=0,
      plan_start_date=date(2025, 9, 15),
      plan_end_date=date(2026, 9, 14),
      pending_amount=Decimal("25000"),
      collected_amount=Decimal("75000"),
      contract_type=TravelAgent.CONTRACT_GOLD,
      state="Kerala",
      district="Ernakulam",
      location="Fort Kochi",
    ),
    TravelAgent(
      id="ta4",
      slno=4,
      agent_name="South India Tours",
      contact_number="+91 98901 45678",
      email="hello@southindiatours.com",
      trial_status=True,
      trial_remaining_days=5,
      plan_start_date=date(2026, 2, 20),
      plan_end_date=date(2026, 3, 20),
      pending_amount=Decimal("0"),
      collected_amount=Decimal("0"),
      contract_type=TravelAgent.CONTRACT_SILVER,
      state="Kerala",
      district="Thiruvananthapuram",
      location="Kovalam",
    ),
    TravelAgent(
      id="ta5",
      slno=5,
      agent_name="Goa Beach Holidays",
      contact_number="+91 87012 56789",
      email="info@goabeachholidays.com",
      trial_status=False,
      trial_remaining_days=0,
      plan_start_date=date(2025, 12, 1),
      plan_end_date=date(2026, 11, 30),
      pending_amount=Decimal("30000"),
      collected_amount=Decimal("70000"),
      contract_type=TravelAgent.CONTRACT_GOLD,
      state="Goa",
      district="North Goa",
      location="Baga",
    ),
    TravelAgent(
      id="ta6",
      slno=6,
      agent_name="KTM Holidays",
      contact_number="+91 94432 11223",
      email="ops@ktmholidays.in",
      trial_status=True,
      trial_remaining_days=20,
      plan_start_date=date(2026, 3, 10),
      plan_end_date=date(2026, 4, 10),
      pending_amount=Decimal("0"),
      collected_amount=Decimal("0"),
      contract_type=TravelAgent.CONTRACT_BRONZE,
      state="Kerala",
      district="Ernakulam",
      location="Marine Drive",
    ),
  ]
  TravelAgent.objects.bulk_create(agents)

  venues = [
    TradeFairVenue(id="tf1", location="Kerala", city="Kochi", venue="Lulu Convention Centre", date=date(2026, 4, 15)),
    TradeFairVenue(id="tf2", location="Goa", city="Panaji", venue="Kala Academy", date=date(2026, 5, 10)),
    TradeFairVenue(id="tf3", location="Karnataka", city="Bangalore", venue="BIEC", date=date(2026, 6, 20)),
  ]
  TradeFairVenue.objects.bulk_create(venues)

  v1, v2, v3 = TradeFairVenue.objects.filter(id__in=["tf1", "tf2", "tf3"]).order_by("id")

  TradeFairProperty.objects.bulk_create([
    TradeFairProperty(id="tfp1", fair=v1, property_name="Alleppey Houseboat Resort", contact_person="Manoj V", contact_number="+91 94567 88001", email="info@alleppeyhouseboat.com", location="Alleppey", status=TradeFairProperty.STATUS_CLOSED),
    TradeFairProperty(id="tfp2", fair=v1, property_name="Wayanad Hill Retreat", contact_person="Asha Mohan", contact_number="+91 85678 77002", email="reservations@wayanadhill.com", location="Wayanad", status=TradeFairProperty.STATUS_REQUESTED_DEMO),
    TradeFairProperty(id="tfp3", fair=v1, property_name="Thekkady Spice Village", contact_person="George K", contact_number="+91 76789 66003", email="stay@spicevillage.in", location="Thekkady", status=TradeFairProperty.STATUS_CONNECTED),
    TradeFairProperty(id="tfp4", fair=v2, property_name="Goa Heritage Villa", contact_person="Maria F", contact_number="+91 83214 55004", email="book@goaheritage.com", location="Old Goa", status=TradeFairProperty.STATUS_INTERESTED),
    TradeFairProperty(id="tfp5", fair=v3, property_name="Coorg Coffee Estate Stay", contact_person="Kavitha R", contact_number="+91 94321 44005", email="stay@coorgcoffee.com", location="Coorg", status=TradeFairProperty.STATUS_PAYMENT_DONE),
  ])

  TradeFairAgent.objects.bulk_create([
    TradeFairAgent(id="tfa1", fair=v1, agent_name="Thomas Cook India", contact_number="+91 98765 11001", email="info@thomascook.in", location="Mumbai", is_dmc=True, status=TradeFairAgent.STATUS_CONNECTED),
    TradeFairAgent(id="tfa2", fair=v1, agent_name="MakeMyTrip B2B", contact_number="+91 87654 22002", email="b2b@makemytrip.com", location="Delhi", is_dmc=False, status=TradeFairAgent.STATUS_INTERESTED),
    TradeFairAgent(id="tfa3", fair=v2, agent_name="Goa Concierge", contact_number="+91 76543 33003", email="team@goaconcierge.com", location="Panaji", is_dmc=True, status=TradeFairAgent.STATUS_CLOSED),
    TradeFairAgent(id="tfa4", fair=v3, agent_name="Karnataka Tours", contact_number="+91 94432 44004", email="ops@karnataka-tours.com", location="Bangalore", is_dmc=False, status=TradeFairAgent.STATUS_REQUESTED_DEMO),
  ])
