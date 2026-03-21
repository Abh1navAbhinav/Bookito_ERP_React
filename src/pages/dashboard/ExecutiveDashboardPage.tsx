import { useState, useMemo, useEffect } from 'react'
import {
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Zap,
  Clock,
  ChevronRight,
  ArrowLeft,
  Users,
  Target,
  Globe,
  Info,
  Building2,
  MapPin,
  ExternalLink,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'
import { StatsCard } from '@/components/StatsCard'
import { ChartCard } from '@/components/ChartCard'
import { Button, Modal, FormField, Input, Textarea, Select } from '@/components/FormElements'
import { DataTable } from '@/components/DataTable'
import { StatusBadge, getStatusVariant } from '@/components/StatusBadge'
import { formatCurrency, formatNumber, cn } from '@/lib/utils'
import { type ColumnDef } from '@tanstack/react-table'
import { fetchExecutives, type Executive } from '@/lib/reportsApi'
import { fetchSalesRecords, type SalesRecord } from '@/lib/salesApi'

export default function ExecutiveDashboardPage() {
  const [executives, setExecutives] = useState<Executive[]>([])
  const [salesRecords, setSalesRecords] = useState<SalesRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedExecutiveId, setSelectedExecutiveId] = useState<number | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<SalesRecord | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([fetchExecutives(), fetchSalesRecords()])
      .then(([ex, rec]) => {
        if (!cancelled) {
          setExecutives(ex)
          setSalesRecords(rec)
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const selectedExecutive = useMemo(
    () => executives.find((ex) => ex.id === selectedExecutiveId),
    [executives, selectedExecutiveId]
  )

  const executivesForChart = useMemo(
    () =>
      executives.map((e) => ({
        ...e,
        revenueGenerated: Number(e.revenue_generated),
        targetClosings: e.target_closings,
        demosGiven: e.demos_given,
        trialsProvided: e.trials_provided,
      })),
    [executives]
  )

  const selectedExecutiveForDetail = useMemo(
    () => executivesForChart.find((ex) => ex.id === selectedExecutiveId),
    [executivesForChart, selectedExecutiveId]
  )

  const mySalesRecords = useMemo(
    () => salesRecords.filter((s) => s.executive === selectedExecutive?.name),
    [salesRecords, selectedExecutive?.name]
  )

  const rescheduledThisWeek = useMemo(
    () => mySalesRecords.filter((s) => s.status === 'Rescheduled'),
    [mySalesRecords]
  )

  const columns: ColumnDef<SalesRecord, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'property_name',
        header: 'Property',
        cell: ({ row }) => (
          <button
            onClick={() => setSelectedProperty(row.original)}
            className="group flex items-center gap-2 text-left"
          >
            <span className="font-semibold text-primary-600 transition-colors group-hover:text-primary-800">
              {row.original.property_name}
            </span>
          </button>
        ),
      },
      { accessorKey: 'location', header: 'Location' },
      {
        accessorKey: 'proposed_price',
        header: 'Price',
        cell: ({ row }) => formatCurrency(Number(row.original.proposed_price)),
      },
      {
        accessorKey: 'is_live',
        header: 'Is Live',
        cell: ({ row }) => (
          <StatusBadge
            label={row.original.is_live ? 'Live' : 'Inactive'}
            variant={row.original.is_live ? 'success' : 'default'}
            dot
          />
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge
            label={row.original.status}
            variant={getStatusVariant(row.original.status)}
            dot
          />
        ),
      },
      {
        id: 'lastVisit',
        header: 'Last Visit',
        cell: ({ row }) => {
          const hist = row.original.visit_history || []
          const lastVisit = hist[hist.length - 1]
          return <span className="text-xs text-surface-500">{lastVisit?.date ?? '—'}</span>
        },
      },
      {
        id: 'actions',
        header: 'Details',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {row.original.location_link && (
              <a 
                href={row.original.location_link} 
                target="_blank" 
                rel="noreferrer"
                className="rounded-md p-1.5 text-surface-400 hover:bg-surface-100 hover:text-primary-600"
              >
                <MapPin className="h-4 w-4" />
              </a>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setSelectedProperty(row.original)}
            >
              <Info className="h-4 w-4 text-surface-400" />
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-surface-500">Loading executive deck…</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        {error}
      </div>
    )
  }

  // --- Executive List (Comparison View) ---
  if (!selectedExecutive) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Executive Deck</h1>
          <p className="mt-1 text-sm text-surface-500">
            Compare performance across all sales executives.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Properties Closed"
            value={executivesForChart.reduce((acc, ex) => acc + ex.closings, 0)}
            icon={CheckCircle2}
            variant="primary"
          />
          <StatsCard
            title="Total Revenue Collected"
            value={formatCurrency(executivesForChart.reduce((acc, ex) => acc + ex.revenueGenerated, 0))}
            icon={DollarSign}
            variant="accent"
          />
          <StatsCard
            title="Total Demos"
            value={executivesForChart.reduce((acc, ex) => acc + ex.demosGiven, 0)}
            icon={Target}
          />
          <StatsCard
            title="Total Trials"
            value={executivesForChart.reduce((acc, ex) => acc + ex.trialsProvided, 0)}
            icon={Users}
          />
        </div>

        <ChartCard
          title="Executive Performance Overview"
          subtitle="Revenue vs Units against Targets"
        >
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={executivesForChart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#64748b' }} 
              />
              <YAxis 
                yAxisId="left"
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                label={{ value: 'Units', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                tickFormatter={(val) => formatNumber(val)}
                label={{ value: 'Revenue', angle: 90, position: 'insideRight', fontSize: 10, fill: '#64748b' }}
              />
              <Tooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                formatter={(value: any, name: any) => [
                  name === 'Revenue' ? formatCurrency(value) : value,
                  name
                ]}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
              
              <Bar yAxisId="left" dataKey="closings" name="Closed Props" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar yAxisId="left" dataKey="targetClosings" name="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar yAxisId="right" dataKey="revenueGenerated" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {executivesForChart.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setSelectedExecutiveId(ex.id)}
              className="group relative flex flex-col rounded-xl border border-surface-200 bg-white p-5 text-left transition-all hover:border-primary-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                  {ex.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-surface-900 group-hover:text-primary-600">
                    {ex.name}
                  </h3>
                  <p className="text-xs text-surface-500">{ex.role}</p>
                </div>
                <div className="ml-auto">
                  <ChevronRight className="h-5 w-5 text-surface-300 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-4 gap-2 border-t border-surface-50 pt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-surface-400">Closed</p>
                  <p className="text-sm font-bold text-surface-700">{ex.closings}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-surface-400">Target</p>
                  <p className="text-sm font-bold text-surface-700">{ex.targetClosings}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-surface-400">Demos</p>
                  <p className="text-sm font-bold text-surface-700">{ex.demosGiven}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-surface-400">Revenue</p>
                  <p className="text-sm font-bold text-accent-600">{formatNumber(ex.revenueGenerated)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // --- Detail View ---
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedExecutiveId(null)}
            className="rounded-full bg-surface-100 p-2 text-surface-600 hover:bg-surface-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-surface-900">
              {selectedExecutive.name}
            </h1>
            <p className="mt-1 text-sm text-surface-500">
              {selectedExecutive.role} • Performance overview
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Today's Visits"
          value={selectedExecutive?.agenda?.length ?? 0}
          icon={Calendar}
          variant="primary"
        />
        <StatsCard
          title="Total Revenue"
          value={selectedExecutiveForDetail ? formatCurrency(selectedExecutiveForDetail.revenueGenerated) : '—'}
          icon={DollarSign}
          variant="accent"
        />
        <StatsCard
          title="Total Closings"
          value={selectedExecutive?.closings ?? 0}
          icon={CheckCircle2}
          variant="success"
        />
        <StatsCard
          title="Active Target"
          value={selectedExecutive?.target_closings ?? 0}
          icon={Target}
        />
      </div>

      {/* Row 1: Agenda and Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Agenda */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-surface-200 bg-white shadow-sm overflow-hidden h-full">
            <div className="border-b border-surface-200 bg-surface-50 px-5 py-3">
              <h3 className="text-sm font-semibold text-surface-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary-600" />
                Today's Agenda
              </h3>
            </div>
            <div className="divide-y divide-surface-100">
              {selectedExecutive?.agenda && selectedExecutive.agenda.length > 0 ? (
                selectedExecutive.agenda.map((item, i) => (
                  <div key={i} className="px-5 py-4 hover:bg-surface-50 transition-colors">
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
                ))
              ) : (
                <div className="p-8 text-center text-surface-400 italic text-sm">
                  No agenda items for today.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Monthly Performance Trend"
            subtitle="6-month progress for closings and revenue"
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={selectedExecutive?.monthly_performance ?? []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                />
                <YAxis 
                  yAxisId="left" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  label={{ value: 'Units', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b' }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  tickFormatter={(val) => formatNumber(val)}
                  label={{ value: 'Revenue', angle: 90, position: 'insideRight', fontSize: 10, fill: '#64748b' }}
                />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  formatter={(value: any, name: any) => [
                    name === 'Revenue' ? formatCurrency(value) : value,
                    name
                  ]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                
                <Bar yAxisId="left" dataKey="closings" name="Closings" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar yAxisId="left" dataKey="target" name="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Row 2: Rescheduled and Portfolio */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-surface-200 bg-white shadow-sm overflow-hidden h-full">
            <div className="border-b border-surface-200 bg-surface-50 px-5 py-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-500" />
                Rescheduled This Week
              </h3>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                {rescheduledThisWeek.length} Found
              </span>
            </div>
            <div className="divide-y divide-surface-100">
              {rescheduledThisWeek.length > 0 ? (
                rescheduledThisWeek.map((record) => (
                  <div key={record.id} className="p-4 hover:bg-surface-50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-surface-900">{record.property_name}</p>
                        <p className="text-xs text-surface-500 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Upcoming Follow-up
                        </p>
                      </div>
                      <StatusBadge label="Pending" variant="warning" />
                    </div>
                    <div className="mt-3 bg-surface-50 rounded-lg p-2 text-xs text-surface-600 border border-surface-100">
                      <strong>Comment:</strong> {record.comments || 'No comments provided.'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-surface-400 italic text-sm">
                  No rescheduled visits for this week.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-surface-200 bg-white shadow-sm overflow-hidden h-full">
            <div className="border-b border-surface-200 bg-surface-50 px-5 py-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary-600" />
                Property portfolio
              </h3>
              <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-bold text-primary-700">
                {mySalesRecords.length} Total
              </span>
            </div>
            <div className="p-4">
              <DataTable
                data={mySalesRecords}
                columns={columns}
                searchPlaceholder="Search properties..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Property Details Modal */}
      <Modal
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        title="Property Details & History"
        size="xl"
      >
        {selectedProperty && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-xl border border-surface-200 bg-surface-50 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-surface-900">{selectedProperty.property_name}</h4>
                    <p className="text-xs text-surface-500">{selectedProperty.location}, {selectedProperty.district}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-surface-200">
                    <span className="text-xs text-surface-500 font-medium">Product Status</span>
                    <StatusBadge 
                      label={selectedProperty.is_live ? 'Live' : 'Inactive'} 
                      variant={selectedProperty.is_live ? 'success' : 'default'} 
                      dot 
                    />
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-surface-200">
                    <span className="text-xs text-surface-500 font-medium">Current Status</span>
                    <StatusBadge 
                      label={selectedProperty.status} 
                      variant={getStatusVariant(selectedProperty.status)} 
                      dot 
                    />
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-surface-200">
                    <span className="text-xs text-surface-500 font-medium">Rooms</span>
                    <span className="text-sm font-semibold text-surface-900">{selectedProperty.number_of_rooms}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-surface-200">
                    <span className="text-xs text-surface-500 font-medium">Plan Type</span>
                    <span className="text-sm font-semibold text-surface-900">{selectedProperty.plan_type}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-surface-500 font-medium">Proposed Price</span>
                    <span className="text-sm font-bold text-accent-600">{formatCurrency(Number(selectedProperty.proposed_price))}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-surface-200 p-5">
                <h5 className="text-xs font-bold uppercase tracking-wider text-surface-400 mb-3">Primary Contact</h5>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-surface-900">{selectedProperty.primary_contact_person}</p>
                  <p className="text-xs text-surface-500">{selectedProperty.designation}</p>
                  <p className="text-xs text-primary-600 font-medium">{selectedProperty.email}</p>
                </div>
              </div>

              {selectedProperty.location_link && (
                <div className="rounded-xl border border-surface-200 p-5">
                   <h5 className="text-xs font-bold uppercase tracking-wider text-surface-400 mb-3">Map & Location</h5>
                   <a 
                    href={selectedProperty.location_link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between group p-3 rounded-lg border border-surface-100 hover:border-primary-200 hover:bg-primary-50 transition-all text-sm font-medium text-surface-700"
                   >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary-600" />
                      <span>Google Maps Location</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-surface-400 group-hover:text-primary-500" />
                   </a>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-bold text-surface-900">
                  <Clock className="h-4 w-4 text-primary-600" />
                  Visit Log & Activity
                </h4>
                <span className="text-xs text-surface-400">{(selectedProperty.visit_history?.length ?? 0)} Interactions</span>
              </div>

              <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-surface-100">
                {(selectedProperty.visit_history ?? []).map((visit, idx) => (
                  <div key={idx} className="relative pl-8">
                    <div className={cn(
                      "absolute left-0 top-1.5 h-6 w-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center",
                      visit.status === 'Closed' ? 'bg-accent-500' : 'bg-primary-500'
                    )}>
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                    <div className="rounded-xl border border-surface-100 bg-white p-4 shadow-sm transition-all hover:border-primary-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-surface-900 uppercase">{visit.status}</span>
                        <div className="flex items-center gap-2 text-[10px] font-medium text-surface-400">
                           <span className="bg-surface-100 px-1.5 py-0.5 rounded">{visit.date}</span>
                           <span className="bg-surface-100 px-1.5 py-0.5 rounded">{visit.time}</span>
                        </div>
                      </div>
                      <p className="text-sm text-surface-600 italic leading-relaxed">
                        "{visit.comment}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="mt-8 flex justify-end">
          <Button onClick={() => setSelectedProperty(null)} variant="secondary">
            Close Overview
          </Button>
        </div>
      </Modal>
    </div>
  )
}
