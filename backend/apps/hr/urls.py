from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
  AttendanceViewSet,
  EmployeeViewSet,
  EssLeaveRequestViewSet,
  EssPayslipViewSet,
  ExitRequestViewSet,
  JobPostingViewSet,
  LeaveRequestViewSet,
  PayrollViewSet,
  PerformanceReviewViewSet,
  TrainingProgramViewSet,
)

router = DefaultRouter()
router.register("employees", EmployeeViewSet, basename="employee")
router.register("attendance", AttendanceViewSet, basename="attendance")
router.register("leaves", LeaveRequestViewSet, basename="leave-request")
router.register("payroll", PayrollViewSet, basename="payroll")
router.register("exit-requests", ExitRequestViewSet, basename="exit-request")
router.register("job-postings", JobPostingViewSet, basename="job-posting")
router.register("training-programs", TrainingProgramViewSet, basename="training-program")
router.register("performance-reviews", PerformanceReviewViewSet, basename="performance-review")
router.register("ess/payslips", EssPayslipViewSet, basename="ess-payslip")
router.register("ess/leaves", EssLeaveRequestViewSet, basename="ess-leave")

urlpatterns = [
  path("", include(router.urls)),
]

