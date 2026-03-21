import { useEffect, useMemo, useState } from 'react'
import { FileBarChart, Download, Wallet, FileSpreadsheet, FileText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button, Input } from '@/components/FormElements'
import { DataTable } from '@/components/DataTable'
import { cn } from '@/lib/utils'
import { downloadCsv } from '@/lib/exportUtils'
import {
  fetchReportCatalog,
  fetchReportMetrics,
  type FinanceReportId,
  type ReportCatalogItem,
  type ReportMetricRow,
} from '@/lib/reportsApi'

type ReportType = FinanceReportId
type DateFilter = 'daily' | 'weekly' | 'monthly' | 'custom'

const REPORT_UI: { id: ReportType; label: string; description: string; icon: LucideIcon }[] = [
  {
    id: 'financeOverview',
    label: 'Finance Overview',
    icon: Wallet,
    description: 'High-level revenue, expenses, and profit summary',
  },
  {
    id: 'revenueCollections',
    label: 'Revenue & Collections',
    icon: Wallet,
    description: 'Closing amounts, collections, and pending receivables',
  },
  {
    id: 'expensesPayables',
    label: 'Expenses & Payables',
    icon: Wallet,
    description: 'Operating expenses, vendor payments, and approvals',
  },
  {
    id: 'profitability',
    label: 'Profitability Analysis',
    icon: Wallet,
    description: 'Property-wise and segment-wise profit & loss',
  },
  {
    id: 'cashFlow',
    label: 'Cash Flow',
    icon: Wallet,
    description: 'Inflow / outflow trends and cash position',
  },
  {
    id: 'taxCompliance',
    label: 'Tax & Compliance',
    icon: Wallet,
    description: 'GST, TDS, and statutory payment summaries',
  },
  {
    id: 'audit',
    label: 'Audit Report',
    icon: Wallet,
    description: 'Audit trail, control checks, and exception logs',
  },
]

function catalogToMap(reports: ReportCatalogItem[]): Partial<Record<ReportType, number>> {
  const m: Partial<Record<ReportType, number>> = {}
  for (const r of reports) {
    m[r.id] = r.count
  }
  return m
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null)
  const [dateFilter, setDateFilter] = useState<DateFilter>('monthly')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [countsById, setCountsById] = useState<Partial<Record<ReportType, number>>>({})
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<ReportMetricRow[]>([])
  const [metricsLoading, setMetricsLoading] = useState(false)
  const [metricsError, setMetricsError] = useState<string | null>(null)

  const reportTypes = useMemo(
    () =>
      REPORT_UI.map((r) => ({
        ...r,
        count: countsById[r.id] ?? 0,
      })),
    [countsById]
  )

  useEffect(() => {
    let cancelled = false
    fetchReportCatalog()
      .then((data) => {
        if (!cancelled) {
          setCountsById(catalogToMap(data.reports))
          setCatalogError(null)
        }
      })
      .catch((e: Error) => {
        if (!cancelled) setCatalogError(e.message ?? 'Failed to load report catalog')
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!selectedReport) {
      setMetrics([])
      setMetricsError(null)
      return
    }
    let cancelled = false
    setMetricsLoading(true)
    setMetricsError(null)
    fetchReportMetrics(selectedReport)
      .then((data) => {
        if (!cancelled) setMetrics(data.metrics)
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setMetrics([])
          setMetricsError(e.message ?? 'Failed to load metrics')
        }
      })
      .finally(() => {
        if (!cancelled) setMetricsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [selectedReport])

  const handleGenerateReport = () => {
    if (!selectedReport) return
    const label = reportTypes.find((r) => r.id === selectedReport)?.label ?? 'Report'
    const range =
      dateFilter === 'custom' && customFrom && customTo
        ? `${customFrom} to ${customTo}`
        : dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1)

    setMetricsLoading(true)
    setMetricsError(null)
    fetchReportMetrics(selectedReport)
      .then((data) => {
        setMetrics(data.metrics)
        alert(`${label} refreshed for ${range} (period comparison uses server calendar month).`)
      })
      .catch((e: Error) => setMetricsError(e.message ?? 'Failed to refresh'))
      .finally(() => setMetricsLoading(false))
  }

  const handleExportExcel = () => {
    if (!selectedReport) return
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

    console.info(`Exported Excel for ${label}`)
  }

  const handleExportPdf = () => {
    if (!selectedReport) return
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">Finance Reports</h1>
        {catalogError ? <p className="mt-1 text-sm text-amber-700">{catalogError}</p> : null}
      </div>

      {!selectedReport ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((report) => {
            const Icon = report.icon
            return (
              <button
                key={report.id}
                type="button"
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
        <div className="space-y-6">
          <div className="rounded-xl border border-surface-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-surface-900 mb-4">Filter by Date Range</h3>
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex rounded-lg border border-surface-200 p-0.5">
                {(['daily', 'weekly', 'monthly', 'custom'] as DateFilter[]).map((filter) => (
                  <button
                    key={filter}
                    type="button"
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
                    <Input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-surface-500">To</label>
                    <Input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
                  </div>
                </>
              )}

              <Button onClick={handleGenerateReport} disabled={metricsLoading}>
                <FileBarChart className="h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-surface-200 bg-white">
            <div className="border-b border-surface-200 px-5 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-surface-900">
                  {reportTypes.find((r) => r.id === selectedReport)!.label} Report
                </h3>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={handleExportExcel} disabled={!metrics.length}>
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

            <div className="p-5">
              {metricsError ? (
                <p className="text-sm text-red-600">{metricsError}</p>
              ) : metricsLoading ? (
                <p className="text-sm text-surface-500">Loading metrics…</p>
              ) : (
                <DataTable
                  data={metrics}
                  columns={[
                    {
                      accessorKey: 'name',
                      header: 'Metric',
                      cell: ({ row }) => (
                        <span className="font-medium text-surface-900">{row.original.name}</span>
                      ),
                    },
                    {
                      accessorKey: 'current',
                      header: 'This Period',
                      cell: ({ row }) => <span className="text-surface-700">{row.original.current}</span>,
                    },
                    {
                      accessorKey: 'previous',
                      header: 'Last Period',
                      cell: ({ row }) => <span className="text-surface-500">{row.original.previous}</span>,
                    },
                    {
                      accessorKey: 'change',
                      header: 'Change',
                      cell: ({ row }) => (
                        <span
                          className={cn(
                            'font-medium',
                            row.original.isPositive ? 'text-accent-600' : 'text-red-500'
                          )}
                        >
                          {row.original.change === '—' ? '—' : row.original.isPositive ? '↑' : '↓'}{' '}
                          {row.original.change}
                        </span>
                      ),
                    },
                  ]}
                  searchPlaceholder="Search metrics..."
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
