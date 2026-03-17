import { useMemo } from 'react'
import { FileText, Download, TrendingUp, Users, Calendar, DollarSign, Filter, Search } from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
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
  Area
} from 'recharts'

const hiringTrend = [
  { month: 'Oct', hires: 4 },
  { month: 'Nov', hires: 6 },
  { month: 'Dec', hires: 2 },
  { month: 'Jan', hires: 8 },
  { month: 'Feb', hires: 5 },
  { month: 'Mar', hires: 12 },
]

const attritionTrend = [
  { month: 'Oct', rate: 2.1 },
  { month: 'Nov', rate: 1.8 },
  { month: 'Dec', rate: 2.5 },
  { month: 'Jan', rate: 1.2 },
  { month: 'Feb', rate: 1.5 },
  { month: 'Mar', rate: 1.1 },
]

export default function HrReportsPage() {
  const reportCards = [
    { title: 'Employee Growth', value: '+18%', desc: 'Hired 12 new members this quarter', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Turnover Rate', value: '3.2%', desc: 'Lower than industry average (8%)', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Training ROI', value: '4.8/5', desc: 'Average feedback for Q1 programs', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Payroll Budget', value: '₹4.2M', desc: 'Within 5% of monthly projection', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">HR Reports & Analytics</h1>
          <div className="mt-2">
            <Breadcrumb items={[{ label: 'HR' }, { label: 'Reports' }]} />
          </div>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="secondary" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
            </Button>
            <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Dashboard
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reportCards.map((card) => (
          <div key={card.title} className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
            <div className={`mb-4 w-fit rounded-lg ${card.bg} p-2 ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-bold text-surface-900">{card.value}</h3>
            <p className="text-sm font-semibold text-surface-700">{card.title}</p>
            <p className="mt-1 text-xs text-surface-500">{card.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Hiring Trend */}
        <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-semibold text-surface-900">Hiring Pipeline Growth</h2>
            <Select 
                options={[
                    { label: 'Past 6 Months', value: '6m' },
                    { label: 'Past Year', value: '1y' }
                ]} 
                className="w-32 py-1 text-xs"
            />
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hiringTrend}>
                <defs>
                    <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip />
                <Area type="monotone" dataKey="hires" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorHires)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attrition Trend */}
        <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-semibold text-surface-900">Monthly Attrition Rate (%)</h2>
             <Select 
                options={[
                    { label: 'Direct Hires', value: 'direct' },
                    { label: 'Referrals', value: 'ref' }
                ]} 
                className="w-32 py-1 text-xs"
            />
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attritionTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 font-semibold text-surface-900">Custom Reports Generation</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField label="Report Type">
                  <Select options={[
                      { label: 'Attendance Summary', value: 'att' },
                      { label: 'Payroll Distribution', value: 'pay' },
                      { label: 'Leave Utilization', value: 'leave' },
                  ]} />
              </FormField>
              <FormField label="Date Range">
                  <Input type="month" />
              </FormField>
              <FormField label="Department">
                   <Select options={[
                      { label: 'All Departments', value: 'all' },
                      { label: 'Sales', value: 'sales' },
                      { label: 'Engineering', value: 'eng' },
                  ]} />
              </FormField>
              <div className="flex items-end">
                  <Button className="w-full flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Generate Report
                  </Button>
              </div>
          </div>
      </div>
    </div>
  )
}
