import { useState } from 'react'
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
import {
  financeStats,
  dailyRevenueData,
  weeklyRevenueData,
  monthlyRevenueData,
  dashboardStats,
  salesPerformanceData,
} from '@/data/mockData'
import { formatCurrency, formatNumber } from '@/lib/utils'

type RevenueView = 'daily' | 'weekly' | 'monthly'

const expenseDistribution = [
  { name: 'Office Rent', value: 45000, color: '#6366f1' },
  { name: 'Salaries', value: 250000, color: '#10b981' },
  { name: 'Marketing', value: 35000, color: '#f59e0b' },
  { name: 'Utilities', value: 12000, color: '#ef4444' },
  { name: 'Other', value: 18000, color: '#8b5cf6' },
]

export default function FinanceDashboard() {
  const [revenueView, setRevenueView] = useState<RevenueView>('monthly')

  const revenueDataMap = {
    daily: { data: dailyRevenueData, key: 'day' },
    weekly: { data: weeklyRevenueData, key: 'week' },
    monthly: { data: monthlyRevenueData, key: 'month' },
  }

  const activeData = revenueDataMap[revenueView]

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

      {/* Financial Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(financeStats.totalClosingAmount)}
          icon={DollarSign}
          variant="primary"
          trend={{ value: 15.2, isPositive: true }}
        />
        <StatsCard
          title="Total Collected"
          value={formatCurrency(financeStats.collectedAmount)}
          icon={TrendingUp}
          variant="accent"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="Pending Receivables"
          value={formatCurrency(financeStats.pendingAmount)}
          icon={Clock}
          variant="warning"
          trend={{ value: 5.4, isPositive: false }}
        />
        <StatsCard
          title="Net Profit"
          value={formatCurrency(financeStats.collectedAmount - 360000)}
          icon={PieChart}
          variant="success"
          trend={{ value: 8.1, isPositive: true }}
        />
      </div>

      {/* Operational Overview (Incorporated from Main Dashboard) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Properties"
          value={dashboardStats.totalProperties}
          icon={Building2}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Agents"
          value={dashboardStats.activeTravelAgents}
          icon={Users}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Sales This Month"
          value={dashboardStats.salesClosingsThisMonth}
          icon={TrendingUp}
          trend={{ value: 18, isPositive: true }}
        />
        <StatsCard
          title="Expiring Plans"
          value={dashboardStats.upcomingPlanExpiry}
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Revenue Trend"
            subtitle="Historical revenue breakdown by period"
            action={
              <div className="flex rounded-lg border border-surface-200 p-0.5 bg-surface-50">
                {(['daily', 'weekly', 'monthly'] as RevenueView[]).map((view) => (
                  <button
                    key={view}
                    onClick={() => setRevenueView(view)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                      revenueView === view
                        ? 'bg-white text-primary-600 shadow-sm border border-surface-200'
                        : 'text-surface-500 hover:text-surface-700'
                    }`}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={activeData.data as any[]}>
                <defs>
                  <linearGradient id="financeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey={activeData.key} 
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
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Revenue']}
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
    </div>
  )
}
