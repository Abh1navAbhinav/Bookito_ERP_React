import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DashboardLayout } from './layout/DashboardLayout'
import DashboardPage from './pages/dashboard/DashboardPage'
import PropertiesPage from './pages/properties/PropertiesPage'
import FinancePage from './pages/finance/FinancePage'
import TravelAgentsPage from './pages/travelAgents/TravelAgentsPage'
import TradeFairsPage from './pages/tradeFairs/TradeFairsPage'
import SalesPage from './pages/sales/SalesPage'
import PricingPlanPage from './pages/pricingPlan/PricingPlanPage'
import ReportsPage from './pages/reports/ReportsPage'
import ExecutiveDashboardPage from './pages/dashboard/ExecutiveDashboardPage'
import AdminFeaturesPage from './pages/admin/AdminFeaturesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/executive-dashboard" element={<ExecutiveDashboardPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/travel-agents" element={<TravelAgentsPage />} />
          <Route path="/trade-fairs" element={<TradeFairsPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/pricing-plan" element={<PricingPlanPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/admin/features" element={<AdminFeaturesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
