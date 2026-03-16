import { useState, useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  TrendingUp,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Wrench,
  Filter,
} from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { Breadcrumb, type BreadcrumbItem } from '@/components/Breadcrumb'
import { FolderNavigator } from '@/components/FolderNavigator'
import { StatusBadge, getStatusVariant } from '@/components/StatusBadge'
import {
  locationHierarchy,
  salesRecords,
  type SalesRecord,
  type SalesStatus,
} from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

const statusFolders: { label: string; status: SalesStatus | 'all'; icon: any; color: string }[] = [
  { label: 'All Sales', status: 'all', icon: TrendingUp, color: 'text-primary-600 bg-primary-50' },
  { label: 'Closed', status: 'Closed', icon: CheckCircle, color: 'text-accent-600 bg-accent-50' },
  { label: 'Interested', status: 'Interested', icon: AlertCircle, color: 'text-blue-600 bg-blue-50' },
  { label: 'Not Interested', status: 'Not Interested', icon: XCircle, color: 'text-red-600 bg-red-50' },
  { label: 'Rescheduled', status: 'Rescheduled', icon: Clock, color: 'text-amber-600 bg-amber-50' },
  { label: 'Installation Pending', status: 'Installation Pending', icon: Wrench, color: 'text-purple-600 bg-purple-50' },
  { label: 'Maintenance', status: 'Under Maintenance', icon: Filter, color: 'text-surface-600 bg-surface-50' },
]

export default function SalesPage() {
  const [path, setPath] = useState<string[]>([])
  const [pathLabels, setPathLabels] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<SalesStatus | 'all'>('all')

  const isLeafLevel = path.length >= 3

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: 'Sales',
      ...(path.length > 0
        ? { onClick: () => { setPath([]); setPathLabels([]) } }
        : {}),
    },
    ...pathLabels.map((label, i) => ({
      label,
      ...(i < pathLabels.length - 1
        ? {
            onClick: () => {
              setPath(path.slice(0, i + 1))
              setPathLabels(pathLabels.slice(0, i + 1))
            },
          }
        : {}),
    })),
  ]

  const handleNavigate = (newPath: string[], node?: any) => {
    setPath(newPath)
    if (node) setPathLabels([...pathLabels, node.name])
  }

  const filteredSales = useMemo(() => {
    let records = salesRecords

    if (isLeafLevel) {
      const [stateId, districtId, locationId] = path
      const state = locationHierarchy.find((s) => s.id === stateId)
      const district = state?.children?.find((d) => d.id === districtId)
      const location = district?.children?.find((l) => l.id === locationId)
      records = records.filter(
        (s) => s.state === state?.name && s.district === district?.name && s.location === location?.name
      )
    }

    if (statusFilter !== 'all') {
      records = records.filter((s) => s.status === statusFilter)
    }

    return records
  }, [isLeafLevel, path, statusFilter])

  const columns: ColumnDef<SalesRecord, any>[] = useMemo(
    () => [
      { accessorKey: 'slno', header: 'SL No', size: 60 },
      {
        accessorKey: 'propertyName',
        header: 'Property',
        cell: ({ row }) => (
          <span className="font-medium text-surface-900">{row.original.propertyName}</span>
        ),
      },
      { accessorKey: 'numberOfRooms', header: 'Rooms' },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <span className="text-surface-500">{row.original.email}</span>,
      },
      { accessorKey: 'primaryContactPerson', header: 'Contact' },
      { accessorKey: 'designation', header: 'Designation' },
      {
        accessorKey: 'proposedPrice',
        header: 'Price',
        cell: ({ row }) => formatCurrency(row.original.proposedPrice),
      },
      {
        accessorKey: 'planType',
        header: 'Plan',
        cell: ({ row }) => (
          <StatusBadge label={row.original.planType} variant="default" />
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
        accessorKey: 'demoProvided',
        header: 'Demo',
        cell: ({ row }) => (
          <StatusBadge
            label={row.original.demoProvided ? 'Yes' : 'No'}
            variant={row.original.demoProvided ? 'success' : 'default'}
          />
        ),
      },
      {
        accessorKey: 'trialProvided',
        header: 'Trial',
        cell: ({ row }) => (
          <StatusBadge
            label={row.original.trialProvided ? 'Yes' : 'No'}
            variant={row.original.trialProvided ? 'success' : 'default'}
          />
        ),
      },
      {
        accessorKey: 'installed',
        header: 'Installed',
        cell: ({ row }) => (
          <StatusBadge
            label={row.original.installed ? 'Yes' : 'No'}
            variant={row.original.installed ? 'success' : 'default'}
          />
        ),
      },
      {
        accessorKey: 'executive',
        header: 'Executive',
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">Sales</h1>
        <div className="mt-2">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Folder navigation */}
      {!isLeafLevel && (
        <FolderNavigator
          hierarchy={locationHierarchy}
          path={path}
          onNavigate={handleNavigate}
        />
      )}

      {/* Status filter + Table */}
      {isLeafLevel && (
        <div className="space-y-4">
          {/* Status Folders */}
          <div className="flex flex-wrap gap-2">
            {statusFolders.map((sf) => {
              const Icon = sf.icon
              const count =
                sf.status === 'all'
                  ? salesRecords.length
                  : salesRecords.filter((s) => s.status === sf.status).length
              return (
                <button
                  key={sf.status}
                  onClick={() => setStatusFilter(sf.status)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                    statusFilter === sf.status
                      ? 'border-primary-300 bg-primary-50 text-primary-700 shadow-sm'
                      : 'border-surface-200 bg-white text-surface-600 hover:border-surface-300 hover:bg-surface-50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {sf.label}
                  <span className="rounded-full bg-surface-200 px-1.5 py-0.5 text-[10px] font-bold text-surface-600">
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          <DataTable
            data={filteredSales}
            columns={columns}
            searchPlaceholder="Search sales records..."
          />
        </div>
      )}
    </div>
  )
}
