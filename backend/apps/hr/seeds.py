from __future__ import annotations

from datetime import date, timedelta

from django.contrib.auth import get_user_model

from .models import (
  Attendance,
  Employee,
  EssLeaveRequest,
  EssPayslip,
  ExitRequest,
  JobPosting,
  LeaveRequest,
  Payroll,
  PerformanceReview,
  TrainingProgram,
)


def run() -> None:
  """
  Seed demo HR data: employees, attendance, leaves, payroll, and HR module rows.
  """

  today = date.today()

  if not Employee.objects.exists():
    employees = [
      Employee(
        id="emp1",
        first_name="Anita",
        last_name="Sharma",
        email="anita.sharma@bookito.com",
        phone="+91 90000 00001",
        department="HR",
        designation="HR Manager",
        date_of_joining=today - timedelta(days=365),
      ),
      Employee(
        id="emp2",
        first_name="Rahul",
        last_name="Verma",
        email="rahul.verma@bookito.com",
        phone="+91 90000 00002",
        department="Sales",
        designation="Sales Executive",
        date_of_joining=today - timedelta(days=200),
      ),
      Employee(
        id="emp3",
        first_name="Sara",
        last_name="Jain",
        email="sara.jain@bookito.com",
        phone="+91 90000 00003",
        department="Finance",
        designation="Accountant",
        date_of_joining=today - timedelta(days=150),
      ),
    ]
    Employee.objects.bulk_create(employees)

    for emp in Employee.objects.all():
      for offset in range(1, 8):
        day = today - timedelta(days=offset)
        Attendance.objects.create(
          id=f"att-{emp.id}-{day.isoformat()}",
          employee=emp,
          date=day,
          status=Attendance.STATUS_PRESENT if offset % 6 != 0 else Attendance.STATUS_ABSENT,
        )

    LeaveRequest.objects.create(
      id="leave1",
      employee=Employee.objects.get(pk="emp2"),
      start_date=today + timedelta(days=3),
      end_date=today + timedelta(days=5),
      reason="Family function",
    )

    payroll_month = today.replace(day=1)
    Payroll.objects.bulk_create(
      [
        Payroll(
          id="pay1",
          employee=Employee.objects.get(pk="emp1"),
          month=payroll_month,
          basic_salary=60000,
          allowances=10000,
          deductions=5000,
          net_salary=65000,
        ),
        Payroll(
          id="pay2",
          employee=Employee.objects.get(pk="emp2"),
          month=payroll_month,
          basic_salary=40000,
          allowances=8000,
          deductions=3000,
          net_salary=45000,
        ),
      ]
    )

  if not ExitRequest.objects.exists():
    ExitRequest.objects.create(
      id="exit-1",
      employee_name="Sarah Miller",
      employee_code="EMP042",
      resignation_date=today - timedelta(days=18),
      last_working_day=today + timedelta(days=12),
      status="Approved",
      reason="Better opportunity",
    )

  if not JobPosting.objects.exists():
    JobPosting.objects.bulk_create(
      [
        JobPosting(
          id="job-1",
          title="Senior Sales Executive",
          department="Sales",
          location="Remote / Dubai",
          employment_type="Full-time",
          applicants=45,
          posted_date=today - timedelta(days=18),
          status="Published",
        ),
        JobPosting(
          id="job-2",
          title="React Developer",
          department="Engineering",
          location="Bangalore Office",
          employment_type="Full-time",
          applicants=128,
          posted_date=today - timedelta(days=14),
          status="Published",
        ),
      ]
    )

  if not TrainingProgram.objects.exists():
    TrainingProgram.objects.bulk_create(
      [
        TrainingProgram(
          id="train-1",
          title="Advanced CRM Training",
          instructor="Alex Mercer",
          employees_enrolled=15,
          completion_rate="80%",
          start_date=today + timedelta(days=1),
          status="Published",
        ),
        TrainingProgram(
          id="train-2",
          title="Soft Skills & Communication",
          instructor="Jane Doe",
          employees_enrolled=25,
          completion_rate="0%",
          start_date=today + timedelta(days=13),
          status="Draft",
        ),
      ]
    )

  if not PerformanceReview.objects.exists():
    PerformanceReview.objects.bulk_create(
      [
        PerformanceReview(
          id="perf-1",
          employee_name="John Doe",
          employee_code="EMP001",
          review_period="Q1 2026",
          rating=4.5,
          reviewer="Manager Sarah",
          status="Completed",
        ),
        PerformanceReview(
          id="perf-2",
          employee_name="Jane Smith",
          employee_code="EMP002",
          review_period="Q1 2026",
          rating=0,
          reviewer="Manager Mike",
          status="In Progress",
        ),
      ]
    )

  # ESS demo data for every role tile user (same usernames as `create_demo_users_if_missing`).
  User = get_user_model()
  ess_profiles: dict[str, dict] = {
    "manager_demo": {
      "payslips": [
        ("Jan 2026", "₹75,000", "Paid"),
        ("Feb 2026", "₹76,500", "Paid"),
        ("Mar 2026", "₹78,200", "Processed"),
      ],
      "leave_start_offset": 6,
    },
    "sales_demo": {
      "payslips": [
        ("Jan 2026", "₹38,500", "Paid"),
        ("Feb 2026", "₹39,200", "Paid"),
        ("Mar 2026", "₹40,000", "Processed"),
      ],
      "leave_start_offset": 11,
    },
    "accountant_demo": {
      "payslips": [
        ("Jan 2026", "₹52,000", "Paid"),
        ("Feb 2026", "₹52,800", "Paid"),
        ("Mar 2026", "₹53,500", "Processed"),
      ],
      "leave_start_offset": 16,
    },
    "crm_demo": {
      "payslips": [
        ("Jan 2026", "₹45,000", "Paid"),
        ("Feb 2026", "₹45,600", "Paid"),
        ("Mar 2026", "₹46,200", "Processed"),
      ],
      "leave_start_offset": 21,
    },
    "hr_demo": {
      "payslips": [
        ("Jan 2026", "₹58,000", "Paid"),
        ("Feb 2026", "₹58,900", "Paid"),
        ("Mar 2026", "₹59,400", "Processed"),
      ],
      "leave_start_offset": 26,
    },
    "employee_demo": {
      "payslips": [
        ("Jan 2026", "₹42,000", "Paid"),
        ("Feb 2026", "₹42,500", "Paid"),
        ("Mar 2026", "₹43,000", "Processed"),
      ],
      "leave_start_offset": 31,
    },
  }

  for username, profile in ess_profiles.items():
    user = User.objects.filter(username=username).first()
    if not user:
      continue
    if not EssPayslip.objects.filter(user=user).exists():
      EssPayslip.objects.bulk_create(
        [
          EssPayslip(user=user, month_label=m, net_pay=amt, status=st)
          for m, amt, st in profile["payslips"]
        ]
      )
    if not EssLeaveRequest.objects.filter(user=user).exists():
      off = int(profile["leave_start_offset"])
      EssLeaveRequest.objects.create(
        user=user,
        leave_type="Casual Leave",
        start_date=today + timedelta(days=off),
        end_date=today + timedelta(days=off + 2),
        reason="Personal",
        status=EssLeaveRequest.STATUS_PENDING,
      )
