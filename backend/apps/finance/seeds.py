from __future__ import annotations

from datetime import date, timedelta

from apps.properties.models import Property

from .models import Expense, FinanceRecord, Quotation, TaxRecord, Vendor


def run() -> None:
  """
  Seed demo data for quotations, finance records, expenses, vendors, and tax rows.
  """

  today = date.today()

  if not (
    Quotation.objects.exists()
    or FinanceRecord.objects.exists()
    or Expense.objects.exists()
  ):
    props = list(Property.objects.all()[:4])
    if props:
      p1 = props[0]
      p2 = props[1] if len(props) > 1 else props[0]

      quotations = [
        Quotation(
          id="q1",
          property=p1,
          recipient_name="Abhilash Manager",
          date=today - timedelta(days=9),
          room_category="11-20 rooms",
          standard_price=35000,
          selling_price=30000,
          tenure="1 Year",
          status=Quotation.STATUS_SENT,
          executive="Ashmi Sajeevan K K",
        ),
        Quotation(
          id="q2",
          property=p2,
          recipient_name="Team Kappad",
          date=today - timedelta(days=7),
          room_category="21-30 rooms",
          standard_price=85000,
          selling_price=78000,
          tenure="6 Months",
          status=Quotation.STATUS_DOWNLOADED,
          executive="Ashmi Sajeevan K K",
        ),
      ]
      Quotation.objects.bulk_create(quotations)

      finance_records = [
        FinanceRecord(
          id="f1",
          property=p1,
          closing_amount=135000,
          pending_amount=0,
          collected_amount=135000,
          invoice_uploaded=True,
          invoice_date=today - timedelta(days=70),
          last_payment_date=today - timedelta(days=65),
          executive="Anil Menon",
        ),
        FinanceRecord(
          id="f2",
          property=p2,
          closing_amount=78000,
          pending_amount=28000,
          collected_amount=50000,
          invoice_uploaded=True,
          invoice_date=today - timedelta(days=60),
          last_payment_date=today - timedelta(days=45),
          executive="Deepa S",
        ),
      ]
      FinanceRecord.objects.bulk_create(finance_records)

      expenses = [
        Expense(
          id="e1",
          category=Expense.CATEGORY_OFFICE,
          description="Office rent - March",
          amount=45000,
          date=today.replace(day=1),
        ),
        Expense(
          id="e2",
          category=Expense.CATEGORY_OFFICE,
          description="Internet & utilities",
          amount=8500,
          date=today - timedelta(days=10),
        ),
        Expense(
          id="e3",
          category=Expense.CATEGORY_OTHER,
          description="Travel reimbursement - Anil",
          amount=12000,
          date=today - timedelta(days=8),
        ),
        Expense(
          id="e4",
          category=Expense.CATEGORY_OTHER,
          description="Trade fair booth - Kerala Tourism",
          amount=25000,
          date=today - timedelta(days=6),
        ),
        Expense(
          id="e5",
          category=Expense.CATEGORY_INCOME,
          description="Subscription - Ocean Breeze Resort",
          amount=135000,
          date=today - timedelta(days=18),
        ),
        Expense(
          id="e6",
          category=Expense.CATEGORY_INCOME,
          description="Subscription - Kappad Heritage Inn",
          amount=50000,
          date=today - timedelta(days=45),
        ),
      ]
      Expense.objects.bulk_create(expenses)

  if not Vendor.objects.exists():
    Vendor.objects.bulk_create(
      [
        Vendor(
          id="v-1",
          name="Albin Joseph",
          company="Kerala Travels",
          email="albin@example.com",
          phone="9847123456",
          category="Transportation",
          outstanding_amount=15000,
          status="active",
        ),
        Vendor(
          id="v-2",
          name="Sarah Khan",
          company="Swift Solutions",
          email="sarah@swift.in",
          phone="7012345678",
          category="Marketing",
          outstanding_amount=5000,
          status="active",
        ),
        Vendor(
          id="v-3",
          name="John Doe",
          company="Apex Real Estate",
          email="john@apex.com",
          phone="9988776655",
          category="Services",
          outstanding_amount=0,
          status="active",
        ),
        Vendor(
          id="v-4",
          name="Meera Nair",
          company="Green Office",
          email="meera@green.in",
          phone="8877665544",
          category="Supplies",
          outstanding_amount=2500,
          status="active",
        ),
      ]
    )

  if not TaxRecord.objects.exists():
    TaxRecord.objects.bulk_create(
      [
        TaxRecord(
          id="t-1",
          transaction_type=TaxRecord.TRANSACTION_SALE,
          invoice_no="INV/2026/001",
          date=today - timedelta(days=9),
          base_amount=120000,
          tax_rate=18,
          tax_amount=21600,
        ),
        TaxRecord(
          id="t-2",
          transaction_type=TaxRecord.TRANSACTION_SALE,
          invoice_no="INV/2026/002",
          date=today - timedelta(days=7),
          base_amount=85000,
          tax_rate=18,
          tax_amount=15300,
        ),
        TaxRecord(
          id="t-3",
          transaction_type=TaxRecord.TRANSACTION_PURCHASE,
          invoice_no="SW/2234/A",
          date=today - timedelta(days=5),
          base_amount=45000,
          tax_rate=12,
          tax_amount=5400,
        ),
        TaxRecord(
          id="t-4",
          transaction_type=TaxRecord.TRANSACTION_SALE,
          invoice_no="INV/2026/003",
          date=today - timedelta(days=4),
          base_amount=25000,
          tax_rate=18,
          tax_amount=4500,
        ),
      ]
    )
