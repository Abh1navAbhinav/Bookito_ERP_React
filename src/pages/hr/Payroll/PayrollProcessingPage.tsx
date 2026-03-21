import { useState, useMemo, useEffect, useCallback } from 'react'
import { DollarSign, FileText, Download, Play, CheckCircle2, AlertCircle, History, Loader2, Trash2, RotateCcw } from 'lucide-react'
import { Button, FormField, Input, Select } from '@/components/FormElements'
import { DataTable } from '@/components/DataTable'
import { type ColumnDef } from '@tanstack/react-table'
import { differenceInDays, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'
import { fetchPayroll, fetchDeletedPayroll, softDeletePayroll, restorePayroll, type ApiPayroll } from '@/lib/hrApi'

interface PayrollRecord {
  id: string
  employeeName: string
  employeeId: string
  basicSalary: number
  hra: number
  allowances: number
  deductions: number
  netPay: number
  status: 'Processed' | 'Pending' | 'Paid'
}

interface DeletedPayrollRecord extends PayrollRecord {
  deletedAt: string
}

function mapApiToPayroll(p: ApiPayroll): PayrollRecord {
  const basic = Number(p.basic_salary)
  const allowances = Number(p.allowances)
  const deductions = Number(p.deductions)
  const net = Number(p.net_salary)
  return {
    id: p.id,
    employeeName: p.employee_name,
    employeeId: p.employee,
    basicSalary: basic,
    hra: 0,
    allowances,
    deductions,
    netPay: net,
    status: 'Processed',
  }
}

export default function PayrollProcessingPage() {
  const [selectedMonth, setSelectedMonth] = useState('2026-03')
  const [showTrash, setShowTrash] = useState(false)
  const [payroll, setPayroll] = useState<PayrollRecord[]>([])
  const [deletedPayroll, setDeletedPayroll] = useState<DeletedPayrollRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [isRunning, setIsRunning] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [list, delList] = await Promise.all([fetchPayroll(), fetchDeletedPayroll()])
      setPayroll(list.map(mapApiToPayroll))
      setDeletedPayroll(
        delList.map((p) => ({ ...mapApiToPayroll(p), deletedAt: p.deleted_at ?? new Date().toISOString() }))
      )
    } catch {
      setPayroll([])
      setDeletedPayroll([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const handleRunPayroll = () => {
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
      alert('Payroll processed successfully for all employees!')
    }, 2000)
  }

  const handlePayAll = () => {
    if (confirm('Are you sure you want to release payments for all processed records?')) {
      setPayroll(payroll.map(p => p.status === 'Processed' ? { ...p, status: 'Paid' } : p))
    }
  }

  const handleDelete = async (record: PayrollRecord) => {
    try {
      await softDeletePayroll(record.id)
      await loadData()
    } catch {
      // ignore
    }
  }

  const handleRestore = async (record: DeletedPayrollRecord) => {
    try {
      await restorePayroll(record.id)
      await loadData()
    } catch {
      // ignore
    }
  }

  const getRemainingDays = (deletedAt: string) => {
    const diff = differenceInDays(new Date(), parseISO(deletedAt))
    return Math.max(0, 30 - diff)
  }

  const displayedDeleted = useMemo(
    () => deletedPayroll.filter((r) => getRemainingDays(r.deletedAt) > 0),
    [deletedPayroll]
  )

  const totals = useMemo(() => {
    return payroll.reduce((acc, curr) => ({
        total: acc.total + curr.netPay,
        paid: acc.paid + (curr.status === 'Paid' ? 1 : 0),
        pending: acc.pending + (curr.status !== 'Paid' ? 1 : 0),
        tax: acc.tax + (curr.basicSalary * 0.1) // dummy tax calculation
    }), { total: 0, paid: 0, pending: 0, tax: 0 })
  }, [payroll])

  const stats = [
    { label: 'Total Payroll', value: `₹${totals.total.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Employees Paid', value: `${totals.paid}/${payroll.length}`, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Payment', value: totals.pending.toString(), icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Tax Deducted', value: `₹${totals.tax.toLocaleString()}`, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  const columns: ColumnDef<PayrollRecord, any>[] = useMemo(() => [
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
      accessorKey: 'basicSalary',
      header: 'Basic',
      cell: ({ row }) => <span className="text-sm">₹{row.original.basicSalary.toLocaleString()}</span>
    },
    {
      accessorKey: 'netPay',
      header: 'Net Pay',
      cell: ({ row }) => <span className="text-sm font-bold text-surface-900">₹{row.original.netPay.toLocaleString()}</span>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
          row.original.status === 'Paid' ? "bg-emerald-50 text-emerald-700" :
          row.original.status === 'Processed' ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
        )}>
          {row.original.status}
        </span>
      )
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => handleDelete(row.original)}
            className="h-8 w-8 rounded-lg text-surface-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm border border-transparent"
            title="Move to Trash"
          >
             <Trash2 className="h-4 w-4" />
          </button>
          <button className="h-8 w-8 rounded-lg bg-surface-50 text-surface-600 hover:bg-surface-100 flex items-center justify-center transition-colors" title="Download Payslip">
            <Download className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ], [payroll])

  const deletedColumns: ColumnDef<DeletedPayrollRecord, any>[] = useMemo(() => [
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
  ], [deletedPayroll])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Payroll Processing</h1>
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
                    Current
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
            <Input 
                type="month" 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)} 
                className="w-44"
            />
            {!showTrash && (
                payroll.some(p => p.status === 'Processed') ? (
                    <Button onClick={handlePayAll} className="bg-emerald-600 hover:bg-emerald-700">
                        Release Payments
                    </Button>
                ) : (
                    <Button onClick={handleRunPayroll} disabled={isRunning} className="flex items-center gap-2">
                        {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                        {isRunning ? 'Processing...' : 'Run Payroll'}
                    </Button>
                )
            )}
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
            <>
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-bold text-surface-900">Salary Register – {selectedMonth}</h2>
                    <Button variant="secondary" size="sm" className="flex items-center gap-2">
                        <History className="h-4 w-4" />
                        History
                    </Button>
                </div>
                {loading ? (
                  <div className="rounded-xl border border-surface-200 bg-white p-8 text-center text-surface-500">Loading payroll...</div>
                ) : (
                <DataTable
                    data={payroll}
                    columns={columns}
                    searchPlaceholder="Search by employee..."
                />
                )}
            </>
        ) : (
            <>
                <div className="flex items-center gap-2 px-1">
                    <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                    <p className="text-sm text-surface-500 italic">
                        Records in trash are automatically deleted after 30 days.
                    </p>
                </div>
                <DataTable
                    data={displayedDeleted}
                    columns={deletedColumns}
                    searchPlaceholder="Search deleted records..."
                />
            </>
        )}
      </div>
    </div>
  )
}
