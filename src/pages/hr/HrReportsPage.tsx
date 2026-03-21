import { useEffect, useState } from 'react'
import { FileText, Download, TrendingUp, Users, DollarSign, Filter, Search } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button, FormField, Input, Select } from '@/components/FormElements'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts'
import { downloadCsv } from '@/lib/exportUtils'
import { fetchHrReportsAnalytics, type HrReportsAnalytics } from '@/lib/reportsApi'

const HR_ICON_MAP: Record<string, LucideIcon> = {
  users: Users,
  trending: TrendingUp,
  file: FileText,
  dollar: DollarSign,
}

const CARD_STYLES = [
  { color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { color: 'text-blue-600', bg: 'bg-blue-50' },
  { color: 'text-purple-600', bg: 'bg-purple-50' },
  { color: 'text-amber-600', bg: 'bg-amber-50' },
]

export default function HrReportsPage() {
  const [analytics, setAnalytics] = useState<HrReportsAnalytics | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchHrReportsAnalytics()
      .then((d) => {
        if (!cancelled) {
          setAnalytics(d)
          setError(null)
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(e.message ?? 'Failed to load HR analytics')
          setAnalytics(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const hiringTrend = analytics?.hiringTrend ?? []
  const attritionTrend = analytics?.attritionTrend ?? []
  const reportCards = analytics?.cards ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">HR Reports & Analytics</h1>
          {error ? <p className="mt-1 text-sm text-amber-700">{error}</p> : null}
          {loading ? <p className="mt-1 text-sm text-surface-500">Loading…</p> : null}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={() => alert('Filters panel coming soon.')}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              window.print()
            }}
          >
            <Download className="h-4 w-4" />
            Export Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reportCards.map((card, i) => {
          const Icon = HR_ICON_MAP[card.icon] ?? Users
          const style = CARD_STYLES[i % CARD_STYLES.length]
          return (
            <div key={card.title} className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
              <div className={`mb-4 w-fit rounded-lg ${style.bg} p-2 ${style.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold text-surface-900">{card.value}</h3>
              <p className="text-sm font-semibold text-surface-700">{card.title}</p>
              <p className="mt-1 text-xs text-surface-500">{card.desc}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-semibold text-surface-900">Hiring Pipeline Growth</h2>
            <Select
              options={[
                { label: 'Past 6 Months', value: '6m' },
                { label: 'Past Year', value: '1y' },
              ]}
              className="w-32 py-1 text-xs"
            />
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hiringTrend.length ? hiringTrend : [{ month: '—', hires: 0 }]}>
                <defs>
                  <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="hires"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorHires)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-semibold text-surface-900">Monthly Attrition Rate (%)</h2>
            <Select
              options={[
                { label: 'Direct Hires', value: 'direct' },
                { label: 'Referrals', value: 'ref' },
              ]}
              className="w-32 py-1 text-xs"
            />
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attritionTrend.length ? attritionTrend : [{ month: '—', rate: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#ef4444' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 font-semibold text-surface-900">Custom Reports Generation</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField label="Report Type">
            <Select
              options={[
                { label: 'Attendance Summary', value: 'att' },
                { label: 'Payroll Distribution', value: 'pay' },
                { label: 'Leave Utilization', value: 'leave' },
              ]}
            />
          </FormField>
          <FormField label="Date Range">
            <Input type="month" />
          </FormField>
          <FormField label="Department">
            <Select
              options={[
                { label: 'All Departments', value: 'all' },
                { label: 'Sales', value: 'sales' },
                { label: 'Engineering', value: 'eng' },
              ]}
            />
          </FormField>
          <div className="flex items-end">
            <Button
              className="w-full flex items-center gap-2"
              onClick={() => {
                downloadCsv(
                  'hr-custom-report.csv',
                  hiringTrend.map((item) => ({
                    period: item.month,
                    hires: item.hires,
                  })),
                  [
                    { key: 'period', label: 'Period' },
                    { key: 'hires', label: 'New Hires' },
                  ]
                )
              }}
            >
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
