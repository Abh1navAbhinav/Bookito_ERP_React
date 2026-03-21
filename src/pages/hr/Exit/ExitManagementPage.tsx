import { useState, useMemo, useEffect, useCallback } from 'react'
import { LogOut, FileCheck, ClipboardList, TrendingDown, Clock, UserMinus, MoreVertical, Trash2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/FormElements'
import { DataTable } from '@/components/DataTable'
import { type ColumnDef } from '@tanstack/react-table'
import { differenceInDays, parseISO } from 'date-fns'
import {
  fetchDeletedExitRequests,
  fetchExitRequests,
  restoreExitRequest,
  softDeleteExitRequest,
  type ApiExitRequest,
} from '@/lib/hrApi'

interface ExitRequest {
  id: string
  employeeName: string
  employeeId: string
  resignationDate: string
  lastWorkingDay: string
  status: 'Pending' | 'Approved' | 'Settled'
  reason: string
}

interface DeletedExitRequest extends ExitRequest {
  deletedAt: string
}

function mapExit(r: ApiExitRequest): ExitRequest {
  return {
    id: r.id,
    employeeName: r.employee_name,
    employeeId: r.employee_code,
    resignationDate: r.resignation_date,
    lastWorkingDay: r.last_working_day,
    status: r.status as ExitRequest['status'],
    reason: r.reason,
  }
}

function mapDeleted(r: ApiExitRequest): DeletedExitRequest {
  return {
    ...mapExit(r),
    deletedAt: r.deleted_at || new Date().toISOString(),
  }
}

export default function ExitManagementPage() {
  const [exits, setExits] = useState<ExitRequest[]>([])
  const [deletedExits, setDeletedExits] = useState<DeletedExitRequest[]>([])
  const [showTrash, setShowTrash] = useState(false)

  const load = useCallback(async () => {
    try {
      const [active, del] = await Promise.all([fetchExitRequests(), fetchDeletedExitRequests()])
      setExits(active.map(mapExit))
      setDeletedExits(del.map(mapDeleted))
    } catch {
      setExits([])
      setDeletedExits([])
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const stats = [
    { label: 'Pending Exits', value: exits.filter(e => e.status === 'Pending').length.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Settled this Month', value: exits.filter(e => e.status === 'Settled').length.toString(), icon: FileCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Attrition Rate', value: '4.2%', icon: TrendingDown, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Retention Rate', value: '95.8%', icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
  ]

  const handleDelete = (exit: ExitRequest) => {
    void softDeleteExitRequest(exit.id).then(() => load())
  }

  const handleRestore = (exit: DeletedExitRequest) => {
    void restoreExitRequest(exit.id).then(() => load())
  }

  const getRemainingDays = (deletedAt: string) => {
    const diff = differenceInDays(new Date(), parseISO(deletedAt))
    return Math.max(0, 30 - diff)
  }

  const columns: ColumnDef<ExitRequest, any>[] = useMemo(() => [
    {
      accessorKey: 'employeeName',
      header: 'Employee',
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-surface-900">{row.original.employeeName}</div>
          <div className="text-xs text-surface-500">{row.original.employeeId}</div>
        </div>
      )
    },
    {
      accessorKey: 'resignationDate',
      header: 'Resigned On',
      cell: ({ row }) => <span className="text-sm text-surface-600">{row.original.resignationDate}</span>
    },
    {
      accessorKey: 'lastWorkingDay',
      header: 'Last Working Day',
      cell: ({ row }) => <span className="text-sm text-surface-900 font-medium">{row.original.lastWorkingDay}</span>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
          row.original.status === 'Settled' ? "bg-emerald-50 text-emerald-700" :
          row.original.status === 'Approved' ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
        )}>
          {row.original.status}
        </span>
      )
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
            <button 
                onClick={() => handleDelete(row.original)}
                className="h-8 w-8 rounded-lg text-surface-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors"
                title="Move to Trash"
            >
                <Trash2 className="h-4 w-4" />
            </button>
            <button className="h-8 w-8 rounded-lg text-surface-400 hover:bg-surface-50 flex items-center justify-center">
                <MoreVertical className="h-4 w-4" />
            </button>
        </div>
      )
    }
  ], [exits, showTrash])

  const deletedColumns: ColumnDef<DeletedExitRequest, any>[] = useMemo(() => [
    {
      accessorKey: 'employeeName',
      header: 'Employee',
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-surface-900">{row.original.employeeName}</div>
          <div className="text-xs text-surface-500">{row.original.employeeId}</div>
        </div>
      )
    },
    {
      accessorKey: 'deletedAt',
      header: 'Auto-deletes in',
      cell: ({ row }) => {
        const days = getRemainingDays(row.original.deletedAt)
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
            {days} days remaining
          </span>
        )
      }
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
            <button 
                onClick={() => handleRestore(row.original)}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition-colors shadow-sm border border-emerald-100"
            >
                <RotateCcw className="h-3.5 w-3.5" />
                Restore
            </button>
        </div>
      )
    }
  ], [deletedExits, showTrash])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Exit Management</h1>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-surface-200 p-0.5 bg-surface-100/50 shadow-inner">
                <button
                    onClick={() => setShowTrash(false)}
                    className={cn(
                        "rounded-md px-4 py-1.5 text-xs font-medium transition-all duration-200",
                        !showTrash
                        ? "bg-white text-primary-600 shadow-sm border border-surface-200"
                        : "text-surface-500 hover:text-surface-700"
                    )}
                >
                    Active
                </button>
                <button
                    onClick={() => setShowTrash(true)}
                    className={cn(
                        "flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-medium transition-all duration-200",
                        showTrash
                        ? "bg-white text-red-600 shadow-sm border border-red-200"
                        : "text-surface-500 hover:text-surface-700"
                    )}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    Trash
                </button>
            </div>
            <Button variant="danger" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Initiate Exit
            </Button>
        </div>
      </div>

      {!showTrash && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                <div className={`rounded-xl ${stat.bg} p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-surface-500">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-surface-900">{stat.value}</h3>
                </div>
                </div>
            </div>
            ))}
        </div>
      )}

      <div className="space-y-4">
        {!showTrash ? (
            <DataTable
                data={exits}
                columns={columns}
                searchPlaceholder="Search exits..."
            />
        ) : (
            <>
                <div className="flex items-center gap-2 px-1">
                    <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                    <p className="text-sm text-surface-500 italic">
                        Records in trash are automatically deleted after 30 days.
                    </p>
                </div>
                <DataTable
                    data={deletedExits}
                    columns={deletedColumns}
                    searchPlaceholder="Search deleted exits..."
                />
            </>
        )}
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
