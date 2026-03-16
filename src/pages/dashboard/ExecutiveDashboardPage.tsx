import { useState } from 'react'
import {
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Bug,
  Zap,
  Clock,
  ChevronRight,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { StatsCard } from '@/components/StatsCard'
import { ChartCard } from '@/components/ChartCard'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button, Modal, FormField, Input, Textarea, Select } from '@/components/FormElements'
import { StatusBadge } from '@/components/StatusBadge'
import { executives, features, notifications } from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'

export default function ExecutiveDashboardPage() {
  const [showBugModal, setShowBugModal] = useState(false)
  const executive = executives[0] // Mocking the logged-in executive (Anil Menon)

  const performanceData = [
    { name: 'Closings', value: executive.closings, target: 30 },
    { name: 'Demos', value: executive.demosGiven, target: 50 },
    { name: 'Trials', value: executive.trialsProvided, target: 20 },
  ]

  const agendaItems = [
    { title: 'Visit: Ocean Breeze Resort', time: '10:00 AM', location: 'Calicut Beach', type: 'Follow-up' },
    { title: 'Demo: Kappad Inn', time: '02:30 PM', location: 'Kappad', type: 'New Demo' },
    { title: 'Payment Collection: Heritage Suites', time: '04:00 PM', location: 'City Center', type: 'Closing' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">
            Welcome back, {executive.name.split(' ')[0]}!
          </h1>
          <p className="mt-1 text-sm text-surface-500">
            {executive.role} • Here is your performance overview for today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowBugModal(true)}>
            <Bug className="h-4 w-4" />
            Report Bug
          </Button>
          <Button variant="primary">
            <Zap className="h-4 w-4" />
            Product Updates
          </Button>
        </div>
      </div>

      {/* Today's Agenda Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Today's Visits"
          value={executive.todayVisits}
          icon={Calendar}
          variant="primary"
        />
        <StatsCard
          title="Today's Revenue"
          value={formatCurrency(executive.todayRevenue)}
          icon={DollarSign}
          variant="accent"
        />
        <StatsCard
          title="Today's Closings"
          value={executive.todayClosings}
          icon={CheckCircle2}
          variant="success"
        />
        <StatsCard
          title="My Closings (MTD)"
          value={executive.closings}
          icon={TrendingUp}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Performance Metrics"
            subtitle="Your progress vs monthly targets"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" name="Achieved" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Today's Agenda */}
        <div className="space-y-6">
          <div className="rounded-xl border border-surface-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-surface-200 bg-surface-50 px-5 py-3">
              <h3 className="text-sm font-semibold text-surface-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary-600" />
                Today's Agenda
              </h3>
            </div>
            <div className="divide-y divide-surface-100">
              {agendaItems.map((item, i) => (
                <div key={i} className="px-5 py-4 hover:bg-surface-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-surface-800">{item.title}</p>
                    <span className="text-[10px] font-bold text-primary-600 uppercase bg-primary-50 px-1.5 py-0.5 rounded">
                      {item.time}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-surface-500">
                    <AlertCircle className="h-3 w-3" />
                    {item.location} • {item.type}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Feature Updates */}
          <div className="rounded-xl border border-surface-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-surface-200 bg-surface-50 px-5 py-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-900 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                News & Updates
              </h3>
              <StatusBadge label="New" variant="warning" />
            </div>
            <div className="p-4 space-y-4">
              {features.slice(0, 2).map((feat) => (
                <div key={feat.id} className="group cursor-pointer">
                  <p className="text-xs font-bold text-surface-900 group-hover:text-primary-600 transition-colors">
                    {feat.name}
                  </p>
                  <p className="text-[11px] text-surface-500 mt-0.5 line-clamp-2">
                    {feat.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] text-surface-400">{feat.date}</span>
                    <ChevronRight className="h-3 w-3 text-surface-300 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bug Report Modal */}
      <Modal
        isOpen={showBugModal}
        onClose={() => setShowBugModal(false)}
        title="Submit Bug Report"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-surface-500">
            Reporting a technical issue helps our engineering team fix it quickly.
          </p>
          <FormField label="Module">
            <Select
              options={[
                { label: 'Properties', value: 'properties' },
                { label: 'Booking', value: 'booking' },
                { label: 'Finance', value: 'finance' },
                { label: 'Channel Manager', value: 'channel-manager' },
                { label: 'Other', value: 'other' },
              ]}
              placeholder="Where did the bug occur?"
            />
          </FormField>
          <FormField label="Severity">
            <Select
              options={[
                { label: 'Critical (System Down)', value: 'critical' },
                { label: 'Major (Feature Broken)', value: 'major' },
                { label: 'Minor (UI/UX Glitch)', value: 'minor' },
              ]}
              placeholder="Select severity"
            />
          </FormField>
          <FormField label="Description">
            <Textarea rows={4} placeholder="Describe what happened and what you expected..." />
          </FormField>
          <FormField label="Screenshots (Optional)">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-surface-300 rounded-lg cursor-pointer bg-surface-50 hover:bg-surface-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Bug className="w-8 h-8 mb-3 text-surface-400" />
                  <p className="mb-2 text-sm text-surface-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-surface-400">PNG, JPG or PDF (MAX. 5MB)</p>
                </div>
                <input type="file" className="hidden" />
              </label>
            </div>
          </FormField>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowBugModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => setShowBugModal(false)}>
            Submit Report
          </Button>
        </div>
      </Modal>
    </div>
  )
}
