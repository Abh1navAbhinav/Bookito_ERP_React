import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DashboardLayout } from './layout/DashboardLayout'
import DashboardPage from './pages/dashboard/DashboardPage'
import PropertiesPage from './pages/properties/PropertiesPage'
import PropertyDetailsPage from './pages/properties/PropertyDetailsPage'
import FinancePage from './pages/finance/FinancePage'
import TravelAgentsPage from './pages/travelAgents/TravelAgentsPage'
import TradeFairsPage from './pages/tradeFairs/TradeFairsPage'
import SalesPage from './pages/sales/SalesPage'
import PricingPlanPage from './pages/pricingPlan/PricingPlanPage'
import ReportsPage from './pages/reports/ReportsPage'
import ExecutiveDashboardPage from './pages/dashboard/ExecutiveDashboardPage'
import AdminFeaturesPage from './pages/admin/AdminFeaturesPage'
import FeatureDetailsPage from './pages/admin/FeatureDetailsPage'
import HrUsersPage from './pages/hr/HrUsersPage'
import HrAttendancePage from './pages/hr/HrAttendancePage'
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
          <Route path="/trade-fairs" element={<TradeFairsPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/pricing-plan" element={<PricingPlanPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/admin/features" element={<AdminFeaturesPage />} />
          <Route path="/admin/features/:id" element={<FeatureDetailsPage />} />
          <Route path="/hr/users" element={<HrUsersPage />} />
          <Route path="/hr/attendance" element={<HrAttendancePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
