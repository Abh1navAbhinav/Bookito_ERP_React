import { useState } from 'react'
import {
  FileBarChart,
  Download,
  Building2,
  TrendingUp,
  Wallet,
  Users,
  CalendarDays,
  FileSpreadsheet,
  FileText,
} from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button, Input, Select } from '@/components/FormElements'
import { DataTable } from '@/components/DataTable'
import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'

type ReportType = 'properties' | 'sales' | 'finance' | 'travelAgents' | 'tradeFairs'
type DateFilter = 'daily' | 'weekly' | 'monthly' | 'custom'

const reportTypes = [
  { id: 'properties' as ReportType, label: 'Properties', icon: Building2, description: 'Property listing and performance reports', count: 248 },
  { id: 'sales' as ReportType, label: 'Sales', icon: TrendingUp, description: 'Sales pipeline, closings, and executive performance', count: 156 },
  { id: 'finance' as ReportType, label: 'Finance', icon: Wallet, description: 'Revenue, payments, and expense reports', count: 89 },
  { id: 'travelAgents' as ReportType, label: 'Travel Agents', icon: Users, description: 'Agent contracts, trials, and payments', count: 87 },
  { id: 'tradeFairs' as ReportType, label: 'Trade Fairs', icon: CalendarDays, description: 'Trade fair leads and conversions', count: 32 },
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null)
  const [dateFilter, setDateFilter] = useState<DateFilter>('monthly')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">Reports</h1>
        <div className="mt-2">
          <Breadcrumb
            items={[
              {
                label: 'Reports',
                ...(selectedReport ? { onClick: () => setSelectedReport(null) } : {}),
              },
              ...(selectedReport
                ? [{ label: reportTypes.find((r) => r.id === selectedReport)!.label }]
                : []),
            ]}
          />
        </div>
      </div>

      {!selectedReport ? (
        /* Report Type Selection */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((report) => {
            const Icon = report.icon
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className="group rounded-xl border border-surface-200 bg-white p-6 text-left transition-all duration-200 hover:border-primary-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-primary-50 p-2.5 text-primary-600 transition-colors group-hover:bg-primary-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-semibold text-surface-600">
                    {report.count} records
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-surface-900">{report.label}</h3>
                <p className="mt-1 text-sm text-surface-500">{report.description}</p>
              </button>
            )
          })}
        </div>
      ) : (
        /* Report Detail */
        <div className="space-y-6">
          {/* Date Filters */}
          <div className="rounded-xl border border-surface-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-surface-900 mb-4">Filter by Date Range</h3>
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex rounded-lg border border-surface-200 p-0.5">
                {(['daily', 'weekly', 'monthly', 'custom'] as DateFilter[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setDateFilter(filter)}
                    className={cn(
                      'rounded-md px-4 py-2 text-sm font-medium transition-all',
                      dateFilter === filter
                        ? 'bg-primary-600 text-white'
                        : 'text-surface-500 hover:text-surface-700'
                    )}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              {dateFilter === 'custom' && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-surface-500">From</label>
                    <Input
                      type="date"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-surface-500">To</label>
                    <Input
                      type="date"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                    />
                  </div>
                </>
              )}

              <Button>
                <FileBarChart className="h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Report Preview */}
          <div className="rounded-xl border border-surface-200 bg-white">
            <div className="border-b border-surface-200 px-5 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-surface-900">
                  {reportTypes.find((r) => r.id === selectedReport)!.label} Report
                </h3>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    Export Excel
                  </Button>
                  <Button variant="secondary" size="sm">
                    <FileText className="h-3.5 w-3.5" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </div>

            {/* Sample Report Table */}
            <div className="p-5">
              <DataTable
                data={getReportMetrics(selectedReport)}
                columns={[
                  {
                    accessorKey: 'name',
                    header: 'Metric',
                    cell: ({ row }) => <span className="font-medium text-surface-900">{row.original.name}</span>
                  },
                  {
                    accessorKey: 'current',
                    header: 'This Period',
                    cell: ({ row }) => <span className="text-surface-700">{row.original.current}</span>
                  },
                  {
                    accessorKey: 'previous',
                    header: 'Last Period',
                    cell: ({ row }) => <span className="text-surface-500">{row.original.previous}</span>
                  },
                  {
                    accessorKey: 'change',
                    header: 'Change',
                    cell: ({ row }) => (
                      <span className={cn('font-medium', row.original.isPositive ? 'text-accent-600' : 'text-red-500')}>
                        {row.original.isPositive ? '↑' : '↓'} {row.original.change}
                      </span>
                    )
                  },
                ]}
                searchPlaceholder="Search metrics..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getReportMetrics(type: ReportType) {
  const metrics: Record<ReportType, { name: string; current: string; previous: string; change: string; isPositive: boolean }[]> = {
    properties: [
      { name: 'Total Properties', current: '248', previous: '221', change: '12.2%', isPositive: true },
      { name: 'New Properties Added', current: '27', previous: '18', change: '50%', isPositive: true },
      { name: 'Active Properties', current: '198', previous: '185', change: '7%', isPositive: true },
      { name: 'Properties Under Maintenance', current: '12', previous: '15', change: '20%', isPositive: true },
      { name: 'Average Rooms per Property', current: '24', previous: '22', change: '9%', isPositive: true },
    ],
    sales: [
      { name: 'Total Closings', current: '14', previous: '11', change: '27.3%', isPositive: true },
      { name: 'Revenue Generated', current: '₹14,50,000', previous: '₹11,20,000', change: '29.5%', isPositive: true },
      { name: 'Demos Given', current: '38', previous: '35', change: '8.6%', isPositive: true },
      { name: 'Trials Provided', current: '12', previous: '10', change: '20%', isPositive: true },
      { name: 'Conversion Rate', current: '36.8%', previous: '31.4%', change: '5.4%', isPositive: true },
    ],
    finance: [
      { name: 'Total Revenue', current: '₹12,45,000', previous: '₹10,80,000', change: '15.3%', isPositive: true },
      { name: 'Collections', current: '₹4,50,000', previous: '₹3,90,000', change: '15.4%', isPositive: true },
      { name: 'Pending Payments', current: '₹2,93,000', previous: '₹3,40,000', change: '13.8%', isPositive: true },
      { name: 'Office Expenses', current: '₹53,500', previous: '₹48,000', change: '11.5%', isPositive: false },
      { name: 'Net Profit', current: '₹3,96,500', previous: '₹3,42,000', change: '15.9%', isPositive: true },
    ],
    travelAgents: [
      { name: 'Total Agents', current: '87', previous: '72', change: '20.8%', isPositive: true },
      { name: 'Active Contracts', current: '65', previous: '58', change: '12.1%', isPositive: true },
      { name: 'Trial Agents', current: '22', previous: '14', change: '57.1%', isPositive: true },
      { name: 'Contract Renewals', current: '8', previous: '5', change: '60%', isPositive: true },
      { name: 'Agent Revenue', current: '₹8,50,000', previous: '₹6,40,000', change: '32.8%', isPositive: true },
    ],
    tradeFairs: [
      { name: 'Fairs Attended', current: '3', previous: '2', change: '50%', isPositive: true },
      { name: 'Leads Generated', current: '45', previous: '28', change: '60.7%', isPositive: true },
      { name: 'Conversions', current: '8', previous: '5', change: '60%', isPositive: true },
      { name: 'Demos Booked', current: '15', previous: '10', change: '50%', isPositive: true },
      { name: 'Fair Expenses', current: '₹75,000', previous: '₹50,000', change: '50%', isPositive: false },
    ],
  }
  return metrics[type]
}
