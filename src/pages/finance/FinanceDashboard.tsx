import { useEffect, useState } from 'react'
import {
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Receipt,
  Building2,
  Users,
  AlertTriangle,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
} from 'recharts'
import { StatsCard } from '@/components/StatsCard'
import { ChartCard } from '@/components/ChartCard'
import { formatCurrency, formatNumber } from '@/lib/utils'
import {
  fetchCompanyOverview,
  fetchFinanceCharts,
  fetchFinanceSummary,
  fetchDashboardCharts,
  type CompanyOverview,
  type FinanceCharts,
  type FinanceSummary,
  type DashboardCharts,
} from '@/lib/reportsApi'

export default function FinanceDashboard() {
  const [summary, setSummary] = useState<FinanceSummary | null>(null)
  const [overview, setOverview] = useState<CompanyOverview | null>(null)
  const [financeCharts, setFinanceCharts] = useState<FinanceCharts | null>(null)
  const [dashboardCharts, setDashboardCharts] = useState<DashboardCharts | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([
      fetchFinanceSummary(),
      fetchCompanyOverview(),
      fetchFinanceCharts(),
      fetchDashboardCharts(),
    ])
      .then(([s, o, fc, dc]) => {
        if (!cancelled) {
          setSummary(s)
          setOverview(o)
          setFinanceCharts(fc)
          setDashboardCharts(dc)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load finance dashboard')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const monthlyRevenueData = financeCharts?.monthly_revenue_data ?? []
  const expenseDistribution = financeCharts?.expense_distribution_data ?? []
  const salesPerformanceData = dashboardCharts?.sales_performance_data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Finance Dashboard</h1>
          <p className="text-sm text-surface-500">Real-time financial overview and performance metrics.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-surface-500 bg-white border border-surface-200 px-3 py-1.5 rounded-full shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Data
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-surface-200 bg-surface-50 p-8 text-center text-surface-500">
          Loading finance dashboard…
        </div>
      )}

      {!loading && summary && (
        <>
      {/* Financial Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(Number(summary.total_closing_amount))}
          icon={DollarSign}
          variant="primary"
          trend={{ value: 15.2, isPositive: true }}
        />
        <StatsCard
          title="Total Collected"
          value={formatCurrency(Number(summary.total_collected_amount))}
          icon={TrendingUp}
          variant="accent"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="Pending Receivables"
          value={formatCurrency(Number(summary.total_pending_amount))}
          icon={Clock}
          variant="warning"
          trend={{ value: 5.4, isPositive: false }}
        />
        <StatsCard
          title="Net Profit"
          value={formatCurrency(Number(summary.total_collected_amount) - (360000))}
          icon={PieChart}
          variant="success"
          trend={{ value: 8.1, isPositive: true }}
        />
      </div>

      {/* Operational Overview */}
      {overview && (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Properties"
          value={overview.total_properties}
          icon={Building2}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Agents"
          value={overview.active_travel_agents}
          icon={Users}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Sales This Month"
          value={overview.sales_closings_this_month}
          icon={TrendingUp}
          trend={{ value: 18, isPositive: true }}
        />
        <StatsCard
          title="Expiring Plans"
          value={overview.upcoming_plan_expiry}
          icon={AlertTriangle}
          variant="danger"
        />
      </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Revenue Chart - monthly from API */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Revenue Trend"
            subtitle="Monthly revenue"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="financeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatNumber(v)}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                  formatter={(value: unknown) => [formatCurrency(Number(value)), 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#financeGrad)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Expense Breakdown */}
        <ChartCard title="Expense Categorization" subtitle="Top expenditure categories this month">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={expenseDistribution} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                axisLine={false} 
                tickLine={false}
                width={80}
              />
              <Tooltip 
                 formatter={(value: any) => formatCurrency(Number(value))}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                {expenseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {expenseDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-surface-600">{item.name}</span>
                </div>
                <span className="font-semibold text-surface-900">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
         {/* Sales Performance (Incorporated from Main Dashboard) */}
         <ChartCard
          title="Sales Performance"
          subtitle="Executive-wise performance metrics"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesPerformanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="closings" fill="#6366f1" radius={[0, 4, 4, 0]} name="Closings" barSize={12} />
              <Bar dataKey="demos" fill="#a5b4fc" radius={[0, 4, 4, 0]} name="Demos" barSize={12} />
              <Bar dataKey="trials" fill="#10b981" radius={[0, 4, 4, 0]} name="Trials" barSize={12} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Cash Flow (Monthly) */}
        <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-surface-900 mb-4">Cash Flow (Monthly)</h3>
            <div className="flex items-center justify-around h-[300px]">
               <div className="text-center">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                     <ArrowUpRight className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-surface-500">Inflow</p>
                  <p className="text-xl font-bold text-emerald-600">{formatCurrency(850000)}</p>
               </div>
               <div className="h-12 w-px bg-surface-200"></div>
               <div className="text-center">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                     <ArrowDownRight className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-surface-500">Outflow</p>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(360000)}</p>
               </div>
               <div className="h-12 w-px bg-surface-200"></div>
               <div className="text-center">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
                     <TrendingUp className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-surface-500">Net Flow</p>
                  <p className="text-xl font-bold text-primary-600">{formatCurrency(490000)}</p>
               </div>
            </div>
         </div>
      </div>
      
      {/* Financial Alerts */}
      <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-surface-900 mb-4">Financial Alerts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Tax Filling Deadline', date: 'In 3 days', type: 'urgent', icon: Clock },
                { title: 'New Vendor Invoice', date: 'Today, 2:30 PM', type: 'info', icon: Receipt },
                { title: 'Pending Approval (Salary)', date: 'Yesterday', type: 'warning', icon: DollarSign },
              ].map((alert, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-surface-50 border border-surface-100">
                  <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${
                    alert.type === 'urgent' ? 'bg-red-100 text-red-600' :
                    alert.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                      <alert.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                      <h4 className="text-sm font-semibold text-surface-900">{alert.title}</h4>
                      <p className="text-xs text-surface-500">{alert.date}</p>
                  </div>
                  <button className="text-xs font-bold text-primary-600 hover:text-primary-700">View</button>
                </div>
              ))}
          </div>
      </div>
        </>
      )}
    </div>
  )
}
