import {
  Building2,
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { StatsCard } from '@/components/StatsCard'
import { ChartCard } from '@/components/ChartCard'
import {
  dashboardStats,
  revenueChartData,
  salesPerformanceData,
  propertyDistributionData,
  closingVsPendingData,
} from '@/data/mockData'
import { formatCurrency, formatNumber } from '@/lib/utils'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-surface-500">
          Real-time overview of properties, sales, and financial performance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          title="Total Properties"
          value={dashboardStats.totalProperties}
          icon={Building2}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(dashboardStats.totalRevenue)}
          icon={DollarSign}
          trend={{ value: 8.5, isPositive: true }}
          variant="accent"
        />
        <StatsCard
          title="Pending Payments"
          value={formatCurrency(dashboardStats.pendingPayments)}
          icon={Clock}
          trend={{ value: 3.2, isPositive: false }}
          variant="warning"
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
          subtitle="Within 7 days"
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <ChartCard
          title="Revenue Overview"
          subtitle="Monthly revenue vs target"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueChartData as any[]}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatNumber(v)}
              />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                formatter={(value: any) => [formatCurrency(Number(value)), 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#revenueGrad)"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#targetGrad)"
                name="Target"
              />
              <Legend iconType="line" wrapperStyle={{ fontSize: '12px' }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Sales Performance */}
        <ChartCard
          title="Sales Performance"
          subtitle="Executive-wise performance"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salesPerformanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
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
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Bar dataKey="closings" fill="#6366f1" radius={[0, 4, 4, 0]} name="Closings" barSize={14} />
              <Bar dataKey="demos" fill="#a5b4fc" radius={[0, 4, 4, 0]} name="Demos" barSize={14} />
              <Bar dataKey="trials" fill="#10b981" radius={[0, 4, 4, 0]} name="Trials" barSize={14} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Property Distribution */}
        <ChartCard
          title="Property Distribution"
          subtitle="By property type"
        >
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={propertyDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {propertyDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: '12px' }}
                formatter={(value) => <span className="text-surface-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Closing vs Pending */}
        <ChartCard
          title="Closing vs Pending"
          subtitle="Monthly comparison"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={closingVsPendingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Bar dataKey="closed" fill="#6366f1" radius={[4, 4, 0, 0]} name="Closed" barSize={24} />
              <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" barSize={24} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
