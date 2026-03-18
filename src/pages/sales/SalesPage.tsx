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
  Trash2,
  RotateCcw,
  Plus,
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
  const [localSales, setLocalSales] = useState<SalesRecord[]>(salesRecords)
  const [path, setPath] = useState<string[]>([])
  const [pathLabels, setPathLabels] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<SalesStatus | 'all'>('all')
  const [tab, setTab] = useState<'active' | 'deleted'>('active')

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

  const getRemainingDays = (deletedAt?: string) => {
    if (!deletedAt) return 30
    const diff = Date.now() - new Date(deletedAt).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return Math.max(0, 30 - days)
  }

  const handleDelete = (id: string) => {
    setLocalSales(prev => prev.map(s => 
      s.id === id ? { ...s, isDeleted: true, deletedAt: new Date().toISOString() } : s
    ))
  }

  const handleRestore = (id: string) => {
    setLocalSales(prev => prev.map(s => 
      s.id === id ? { ...s, isDeleted: false, deletedAt: undefined } : s
    ))
  }

  const filteredSales = useMemo(() => {
    return localSales.filter(s => {
      // Tab filter
      if (tab === 'active' && s.isDeleted) return false
      if (tab === 'deleted') {
        if (!s.isDeleted) return false
        if (getRemainingDays(s.deletedAt) === 0) return false
      }

      // Path filter
      if (isLeafLevel) {
        const [stateId, districtId, locationId] = path
        const state = locationHierarchy.find((s) => s.id === stateId)
        const district = state?.children?.find((d) => d.id === districtId)
        const location = district?.children?.find((l) => l.id === locationId)
        if (!(s.state === state?.name && s.district === district?.name && s.location === location?.name)) return false
      }

      // Status filter
      if (statusFilter !== 'all' && s.status !== statusFilter) return false

      return true
    })
  }, [isLeafLevel, path, statusFilter, localSales, tab])

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
        header: tab === 'active' ? 'Status' : 'Auto-deletes in',
        cell: ({ row }) => {
          if (tab === 'deleted') {
            const days = getRemainingDays(row.original.deletedAt)
            return (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                {days} days
              </span>
            )
          }
          return (
            <StatusBadge
              label={row.original.status}
              variant={getStatusVariant(row.original.status)}
              dot
            />
          )
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {tab === 'active' ? (
              <button 
                onClick={() => handleDelete(row.original.id)}
                className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-red-50 hover:text-red-600"
                title="Delete Sale"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ) : (
              <button 
                onClick={() => handleRestore(row.original.id)}
                className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-green-50 hover:text-green-600"
                title="Restore Sale"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        )
      }
    ],
    [tab]
  )

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">Sales</h1>
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
          {/* Status Folders & Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {statusFolders.map((sf) => {
                const Icon = sf.icon
                const count =
                  sf.status === 'all'
                    ? localSales.filter(s => !s.isDeleted).length
                    : localSales.filter((s) => s.status === sf.status && !s.isDeleted).length
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

            <div className="flex rounded-lg border border-surface-200 p-0.5">
              <button
                onClick={() => setTab('active')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  tab === 'active'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setTab('deleted')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  tab === 'deleted'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Trash
              </button>
            </div>
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
