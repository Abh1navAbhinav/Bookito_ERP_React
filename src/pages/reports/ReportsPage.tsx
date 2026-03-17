import { useState } from 'react'
import { FileBarChart, Download, Wallet, FileSpreadsheet, FileText } from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button, Input } from '@/components/FormElements'
import { DataTable } from '@/components/DataTable'
import { cn } from '@/lib/utils'
import { downloadCsv } from '@/lib/exportUtils'

type ReportType =
  | 'financeOverview'
  | 'revenueCollections'
  | 'expensesPayables'
  | 'profitability'
  | 'cashFlow'
  | 'taxCompliance'
  | 'audit'
type DateFilter = 'daily' | 'weekly' | 'monthly' | 'custom'

const reportTypes = [
  {
    id: 'financeOverview' as ReportType,
    label: 'Finance Overview',
    icon: Wallet,
    description: 'High-level revenue, expenses, and profit summary',
    count: 124,
  },
  {
    id: 'revenueCollections' as ReportType,
    label: 'Revenue & Collections',
    icon: Wallet,
    description: 'Closing amounts, collections, and pending receivables',
    count: 89,
  },
  {
    id: 'expensesPayables' as ReportType,
    label: 'Expenses & Payables',
    icon: Wallet,
    description: 'Operating expenses, vendor payments, and approvals',
    count: 63,
  },
  {
    id: 'profitability' as ReportType,
    label: 'Profitability Analysis',
    icon: Wallet,
    description: 'Property-wise and segment-wise profit & loss',
    count: 47,
  },
  {
    id: 'cashFlow' as ReportType,
    label: 'Cash Flow',
    icon: Wallet,
    description: 'Inflow / outflow trends and cash position',
    count: 36,
  },
  {
    id: 'taxCompliance' as ReportType,
    label: 'Tax & Compliance',
    icon: Wallet,
    description: 'GST, TDS, and statutory payment summaries',
    count: 18,
  },
  {
    id: 'audit' as ReportType,
    label: 'Audit Report',
    icon: Wallet,
    description: 'Audit trail, control checks, and exception logs',
    count: 24,
  },
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null)
  const [dateFilter, setDateFilter] = useState<DateFilter>('monthly')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const handleGenerateReport = () => {
    if (!selectedReport) return
    // Placeholder for backend integration – currently just confirms to the user
    const label = reportTypes.find((r) => r.id === selectedReport)?.label ?? 'Report'
    const range =
      dateFilter === 'custom' && customFrom && customTo
        ? `${customFrom} to ${customTo}`
        : dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1)

    // Basic confirmation that the action worked
    alert(`${label} generated for ${range}.`)
  }

  const handleExportExcel = () => {
    if (!selectedReport) return
    const metrics = getReportMetrics(selectedReport)
    const label = reportTypes.find((r) => r.id === selectedReport)?.label ?? 'Report'

    downloadCsv(
      `finance-${selectedReport}-${dateFilter}.csv`,
      metrics.map((m) => ({
        metric: m.name,
        thisPeriod: m.current,
        lastPeriod: m.previous,
        change: m.change,
      })),
      [
        { key: 'metric', label: 'Metric' },
        { key: 'thisPeriod', label: 'This Period' },
        { key: 'lastPeriod', label: 'Last Period' },
        { key: 'change', label: 'Change' },
      ]
    )

    // Optional small confirmation
    console.info(`Exported Excel for ${label}`)
  }

  const handleExportPdf = () => {
    if (!selectedReport) return

    // Simple implementation: open the browser print dialog so user can save as PDF
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">Finance Reports</h1>
        <div className="mt-2">
          <Breadcrumb
            items={[
              {
                label: 'Finance Reports',
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

              <Button onClick={handleGenerateReport}>
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
                  <Button variant="secondary" size="sm" onClick={handleExportExcel}>
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    Export Excel
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleExportPdf}>
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
    financeOverview: [
      { name: 'Total Revenue', current: '₹12,45,000', previous: '₹10,80,000', change: '15.3%', isPositive: true },
      { name: 'Total Expenses', current: '₹4,85,500', previous: '₹4,10,000', change: '18.4%', isPositive: false },
      { name: 'Net Profit', current: '₹3,96,500', previous: '₹3,42,000', change: '15.9%', isPositive: true },
      { name: 'Profit Margin', current: '31.8%', previous: '29.4%', change: '2.4%', isPositive: true },
      { name: 'Avg. Collection Cycle', current: '32 days', previous: '38 days', change: '15.8%', isPositive: true },
    ],
    revenueCollections: [
      { name: 'Closing Amount (This Period)', current: '₹18,20,000', previous: '₹15,40,000', change: '18.2%', isPositive: true },
      { name: 'Total Collections', current: '₹14,50,000', previous: '₹11,90,000', change: '21.8%', isPositive: true },
      { name: 'Pending Receivables', current: '₹3,70,000', previous: '₹4,60,000', change: '19.6%', isPositive: true },
      { name: 'Overdue > 30 days', current: '₹1,10,000', previous: '₹1,60,000', change: '31.2%', isPositive: true },
      { name: 'Collection Efficiency', current: '86.9%', previous: '81.4%', change: '5.5%', isPositive: true },
    ],
    expensesPayables: [
      { name: 'Total Operating Expenses', current: '₹2,95,000', previous: '₹2,60,000', change: '13.5%', isPositive: false },
      { name: 'Office Expenses', current: '₹53,500', previous: '₹48,000', change: '11.5%', isPositive: false },
      { name: 'Technology & Licenses', current: '₹72,000', previous: '₹64,000', change: '12.5%', isPositive: false },
      { name: 'Vendor Payables', current: '₹1,35,000', previous: '₹1,52,000', change: '11.2%', isPositive: true },
      { name: 'On-time Payments', current: '91%', previous: '88%', change: '3%', isPositive: true },
    ],
    profitability: [
      { name: 'Property-wise Gross Profit', current: '₹4,80,000', previous: '₹4,10,000', change: '17.1%', isPositive: true },
      { name: 'Top 10 Properties Contribution', current: '68%', previous: '64%', change: '4%', isPositive: true },
      { name: 'Low-margin Properties', current: '7', previous: '9', change: '22.2%', isPositive: true },
      { name: 'Average Deal Size', current: '₹3,25,000', previous: '₹2,80,000', change: '16.1%', isPositive: true },
      { name: 'Discount Impact', current: '₹85,000', previous: '₹92,000', change: '7.6%', isPositive: true },
    ],
    cashFlow: [
      { name: 'Opening Cash Balance', current: '₹2,10,000', previous: '₹1,85,000', change: '13.5%', isPositive: true },
      { name: 'Cash Inflows', current: '₹9,80,000', previous: '₹8,40,000', change: '16.7%', isPositive: true },
      { name: 'Cash Outflows', current: '₹7,10,000', previous: '₹6,30,000', change: '12.7%', isPositive: false },
      { name: 'Net Cash Position', current: '₹4,80,000', previous: '₹3,95,000', change: '21.5%', isPositive: true },
      { name: 'Runway (Months)', current: '5.2', previous: '4.4', change: '18.2%', isPositive: true },
    ],
    taxCompliance: [
      { name: 'GST Payable', current: '₹1,12,000', previous: '₹1,05,000', change: '6.7%', isPositive: false },
      { name: 'TDS Deducted', current: '₹48,500', previous: '₹42,000', change: '15.5%', isPositive: false },
      { name: 'Returns Filed On Time', current: '100%', previous: '96%', change: '4%', isPositive: true },
      { name: 'Pending Filings', current: '0', previous: '2', change: '100%', isPositive: true },
      { name: 'Statutory Compliance Score', current: '9.4/10', previous: '8.9/10', change: '5.6%', isPositive: true },
    ],
    audit: [
      { name: 'Audit Issues Logged', current: '12', previous: '19', change: '36.8%', isPositive: true },
      { name: 'Critical Findings', current: '2', previous: '4', change: '50%', isPositive: true },
      { name: 'Issues Resolved', current: '9', previous: '7', change: '28.6%', isPositive: true },
      { name: 'Open Exceptions', current: '3', previous: '6', change: '50%', isPositive: true },
      { name: 'Control Effectiveness Score', current: '8.7/10', previous: '8.1/10', change: '7.4%', isPositive: true },
    ],
  }
  return metrics[type]
}
