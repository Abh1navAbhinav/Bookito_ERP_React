import { guardedFetch } from '@/lib/auth'
import { ensureOk } from '@/lib/apiErrors'

const apiBase =
  (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL ??
  'http://localhost:8000'

export interface CompanyOverview {
  total_properties: number
  active_properties: number
  total_revenue: string | number
  total_expenses: string | number
  net_revenue: string | number
  active_travel_agents: number
  total_employees: number
  present_today: number
  on_leave_today: number
  open_quotations: number
  closed_quotations: number
  sales_closings_this_month: number
  upcoming_plan_expiry: number
}

export interface DashboardCharts {
  revenue_chart_data: { month: string; revenue: number; target: number }[]
  property_distribution_data: { name: string; value: number; color: string }[]
  closing_vs_pending_data: { month: string; closed: number; pending: number }[]
  sales_performance_data: { name: string; closings: number; demos: number; trials: number; revenue: number }[]
}

export interface FinanceCharts {
  monthly_revenue_data: { month: string; revenue: number }[]
  expense_distribution_data: { name: string; value: number; color: string }[]
}

export interface Executive {
  id: number
  name: string
  email: string
  avatar: string
  role: string
  closings: number
  revenue_generated: string | number
  demos_given: number
  trials_provided: number
  target_closings: number
  monthly_performance: { month: string; closings: number; revenue: number; target: number }[]
  agenda: { time?: string; title?: string; location?: string; type?: string }[]
}

export async function fetchCompanyOverview(): Promise<CompanyOverview> {
  const res = await guardedFetch(`${apiBase}/api/reports/overview/`)
  await ensureOk(res, 'Reports request failed')
  return res.json() as Promise<CompanyOverview>
}

export interface FinanceSummary {
  total_closing_amount: string | number
  total_collected_amount: string | number
  total_pending_amount: string | number
}

export async function fetchFinanceSummary(): Promise<FinanceSummary> {
  const res = await guardedFetch(`${apiBase}/api/reports/finance-summary/`)
  await ensureOk(res, 'Reports request failed')
  return res.json() as Promise<FinanceSummary>
}

export async function fetchDashboardCharts(): Promise<DashboardCharts> {
  const res = await guardedFetch(`${apiBase}/api/reports/dashboard-charts/`)
  await ensureOk(res, 'Reports request failed')
  return res.json() as Promise<DashboardCharts>
}

export async function fetchFinanceCharts(): Promise<FinanceCharts> {
  const res = await guardedFetch(`${apiBase}/api/reports/finance-charts/`)
  await ensureOk(res, 'Reports request failed')
  return res.json() as Promise<FinanceCharts>
}

export async function fetchExecutives(): Promise<Executive[]> {
  const res = await guardedFetch(`${apiBase}/api/reports/executives/`)
  await ensureOk(res, 'Reports request failed')
  return res.json() as Promise<Executive[]>
}

export type FinanceReportId =
  | 'financeOverview'
  | 'revenueCollections'
  | 'expensesPayables'
  | 'profitability'
  | 'cashFlow'
  | 'taxCompliance'
  | 'audit'

export interface ReportCatalogItem {
  id: FinanceReportId
  label: string
  description: string
  count: number
}

export interface ReportMetricRow {
  name: string
  current: string
  previous: string
  change: string
  isPositive: boolean
}

export async function fetchReportCatalog(): Promise<{ reports: ReportCatalogItem[] }> {
  const res = await guardedFetch(`${apiBase}/api/reports/catalog/`)
  await ensureOk(res, 'Reports request failed')
  return res.json() as Promise<{ reports: ReportCatalogItem[] }>
}

export async function fetchReportMetrics(
  report: FinanceReportId
): Promise<{ reportId: string; metrics: ReportMetricRow[] }> {
  const q = new URLSearchParams({ report })
  const res = await guardedFetch(`${apiBase}/api/reports/metrics/?${q.toString()}`)
  await ensureOk(res, 'Reports request failed')
  return res.json() as Promise<{ reportId: string; metrics: ReportMetricRow[] }>
}

export interface HrReportCard {
  title: string
  value: string
  desc: string
  icon: string
}

export interface HrReportsAnalytics {
  cards: HrReportCard[]
  hiringTrend: { month: string; hires: number }[]
  attritionTrend: { month: string; rate: number }[]
}

export async function fetchHrReportsAnalytics(): Promise<HrReportsAnalytics> {
  const res = await guardedFetch(`${apiBase}/api/reports/hr-analytics/`)
  await ensureOk(res, 'Reports request failed')
  return res.json() as Promise<HrReportsAnalytics>
}


