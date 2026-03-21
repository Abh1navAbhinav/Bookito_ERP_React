from __future__ import annotations

from .models import SubscriptionPlan


def run() -> None:
  if SubscriptionPlan.objects.exists():
    return

  plans = [
    SubscriptionPlan(
      id="plan-standard",
      name="Bookito Standard",
      description="Core CRS + inventory + channel management for growing properties.",
      popular=False,
      promo="",
      color="from-blue-600 to-blue-800",
      footer_note="",
      sort_order=0,
      pricing=[
        {"rooms": "1-10", "six_months": 10000, "one_year": 18000},
        {"rooms": "11-20", "six_months": 16000, "one_year": 30000},
        {"rooms": "21-30", "six_months": 22000, "one_year": 40000},
        {"rooms": "30+", "six_months": 32000, "one_year": 60000},
      ],
      features=[
        {
          "title": "CRS (central reservation system)",
          "items": [
            "booking engine",
            "ota integration",
            "direct booking",
            "travel agent booking",
            "guest management",
          ],
        },
        {
          "title": "Inventory management",
          "items": [
            "extra bed pricing",
            "meal plan management",
            "Daily rate adjustment",
            "room configurations",
          ],
        },
        {
          "title": "Channel manager",
          "items": ["Manage OTA platforms in a single platform"],
        },
      ],
    ),
    SubscriptionPlan(
      id="plan-premium",
      name="Bookito Premium",
      description="Everything in Standard, plus banquet, store, KOT, finance, and advanced controls.",
      popular=True,
      promo="Best for Mid-size Hotels",
      color="from-indigo-600 to-purple-800",
      footer_note="",
      sort_order=1,
      pricing=[
        {"rooms": "1-10", "six_months": 16000, "one_year": 28000},
        {"rooms": "11-20", "six_months": 24000, "one_year": 45000},
        {"rooms": "21-30", "six_months": 32000, "one_year": 60000},
        {"rooms": "30+", "six_months": 45000, "one_year": 85000},
      ],
      features=[
        {"title": "Includes everything in Standard", "items": []},
        {"title": "CRS Upgrades", "items": ["Hold room facility", "Advanced guest profiles"]},
        {
          "title": "Banquet & Events",
          "items": ["Booking & Management", "Event-based pricing"],
        },
        {
          "title": "Store & Inventory",
          "items": [
            "Purchase orders/returns",
            "Department-wise stock issue",
            "Outlet sales tracking",
          ],
        },
        {
          "title": "KOT Management",
          "items": ["Instant order creation", "Table/room linking", "Kitchen communication"],
        },
        {
          "title": "Finance & Accounts",
          "items": ["Cash/bank entry", "Trial balance", "P&L reports"],
        },
      ],
    ),
    SubscriptionPlan(
      id="plan-pro",
      name="Bookito PRO",
      description="Includes everything in Premium plus PRO-grade integrations, reports, and support.",
      popular=False,
      promo="",
      color="from-slate-800 to-slate-950",
      footer_note="PRO includes all Premium modules, plus additional integrations and support.",
      sort_order=2,
      pricing=[
        {"rooms": "1-10", "six_months": 22000, "one_year": 40000},
        {"rooms": "11-20", "six_months": 32000, "one_year": 60000},
        {"rooms": "21-30", "six_months": 45000, "one_year": 85000},
        {"rooms": "30+", "six_months": 85000, "one_year": 120000},
      ],
      features=[
        {"title": "Includes everything in Premium", "items": []},
        {
          "title": "Advanced Operations",
          "items": ["Bar management", "POS integration", "Multi-property management"],
        },
        {
          "title": "Business Intelligence",
          "items": [
            "Advanced revenue management",
            "Advanced custom reports",
            "Dedicated support manager",
          ],
        },
        {
          "title": "Connectivity",
          "items": ["Full API access", "Third-party accounting integration"],
        },
      ],
    ),
  ]

  SubscriptionPlan.objects.bulk_create(plans)
