import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DashboardLayout } from './layout/DashboardLayout'
import DashboardPage from './pages/dashboard/DashboardPage'
import PropertiesPage from './pages/properties/PropertiesPage'
import PropertyDetailsPage from './pages/properties/PropertyDetailsPage'
import FinancePage from './pages/finance/FinancePage'
import TravelAgentsPage from './pages/travelAgents/TravelAgentsPage'
import TravelAgentDetailsPage from './pages/travelAgents/TravelAgentDetailsPage'
import TradeFairsPage from './pages/tradeFairs/TradeFairsPage'
import TradeFairPropertyDetailsPage from './pages/tradeFairs/TradeFairPropertyDetailsPage'
import TradeFairAgentDetailsPage from './pages/tradeFairs/TradeFairAgentDetailsPage'
import SalesPage from './pages/sales/SalesPage'
import PricingPlanPage from './pages/pricingPlan/PricingPlanPage'
import ReportsPage from './pages/reports/ReportsPage'
import ExecutiveDashboardPage from './pages/dashboard/ExecutiveDashboardPage'
import AdminFeaturesPage from './pages/admin/AdminFeaturesPage'
import FeatureDetailsPage from './pages/admin/FeatureDetailsPage'
import HrUsersPage from './pages/hr/HrUsersPage'
import HrAttendancePage from './pages/hr/HrAttendancePage'
import HrDashboard from './pages/hr/HrDashboard'
import EmployeeListPage from './pages/hr/EmployeeManagement/EmployeeListPage'
import AttendanceDashboard from './pages/hr/Attendance/AttendanceDashboard'
import LeaveRequestsPage from './pages/hr/Leaves/LeaveRequestsPage'
import PayrollProcessingPage from './pages/hr/Payroll/PayrollProcessingPage'
import JobPostingsPage from './pages/hr/Recruitment/JobPostingsPage'
import PerformanceReviewsPage from './pages/hr/Performance/PerformanceReviewsPage'
import TrainingProgramsPage from './pages/hr/Training/TrainingProgramsPage'
import ExitManagementPage from './pages/hr/Exit/ExitManagementPage'
import EmployeeSelfServicePage from './pages/hr/ESS/EmployeeSelfServicePage'
import HrReportsPage from './pages/hr/HrReportsPage'
import LoginPage from './pages/auth/LoginPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/executive-dashboard" element={<ExecutiveDashboardPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/travel-agents" element={<TravelAgentsPage />} />
          <Route path="/travel-agents/:id" element={<TravelAgentDetailsPage />} />
          <Route path="/trade-fairs" element={<TradeFairsPage />} />
          <Route path="/trade-fairs/property/:id" element={<TradeFairPropertyDetailsPage />} />
          <Route path="/trade-fairs/agent/:id" element={<TradeFairAgentDetailsPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/pricing-plan" element={<PricingPlanPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/admin/features" element={<AdminFeaturesPage />} />
          <Route path="/admin/features/:id" element={<FeatureDetailsPage />} />
          <Route path="/hr/dashboard" element={<HrDashboard />} />
          <Route path="/hr/employees" element={<EmployeeListPage />} />
          <Route path="/hr/attendance-v2" element={<AttendanceDashboard />} />
          <Route path="/hr/leaves" element={<LeaveRequestsPage />} />
          <Route path="/hr/payroll" element={<PayrollProcessingPage />} />
          <Route path="/hr/recruitment" element={<JobPostingsPage />} />
          <Route path="/hr/performance" element={<PerformanceReviewsPage />} />
          <Route path="/hr/training" element={<TrainingProgramsPage />} />
          <Route path="/hr/exit" element={<ExitManagementPage />} />
          <Route path="/hr/ess" element={<EmployeeSelfServicePage />} />
          <Route path="/hr/reports" element={<HrReportsPage />} />
          <Route path="/hr/users" element={<HrUsersPage />} />
          <Route path="/hr/attendance" element={<HrAttendancePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
