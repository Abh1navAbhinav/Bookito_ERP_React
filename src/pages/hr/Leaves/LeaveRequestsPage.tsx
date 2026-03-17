import { useState, useMemo, useEffect } from 'react'
import { Plus, Check, X, Calendar, User, Clock, AlertCircle, Trash2, RotateCcw } from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button, FormField, Input, Select, Modal } from '@/components/FormElements'
import { DataTable } from '@/components/DataTable'
import { type ColumnDef } from '@tanstack/react-table'
import { differenceInDays, parseISO } from 'date-fns'

interface LeaveRequest {
  id: string
  employeeName: string
  leaveType: string
  startDate: string
  endDate: string
  days: number
  reason: string
  status: 'Approved' | 'Rejected' | 'Pending'
}

interface DeletedLeaveRequest extends LeaveRequest {
  deletedAt: string
}

const initialLeaves: LeaveRequest[] = [
  {
    id: '1',
    employeeName: 'John Doe',
    leaveType: 'Sick Leave',
    startDate: '2026-03-20',
    endDate: '2026-03-21',
    days: 2,
    reason: 'Fever and cold',
    status: 'Pending'
  },
  {
    id: '2',
    employeeName: 'Jane Smith',
    leaveType: 'Casual Leave',
    startDate: '2026-03-25',
    endDate: '2026-03-25',
    days: 1,
    reason: 'Family event',
    status: 'Approved'
  }
]

export default function LeaveRequestsPage() {
  const [activeTab, setActiveTab] = useState<'Pending' | 'Approved' | 'Rejected' | 'Trash'>('Pending')
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('bookito_leaves')
    return saved ? JSON.parse(saved) : initialLeaves
  })
  
  const [deletedLeaves, setDeletedLeaves] = useState<DeletedLeaveRequest[]>(() => {
    const saved = localStorage.getItem('bookito_deleted_leaves')
    return saved ? JSON.parse(saved) : []
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newRequest, setNewRequest] = useState({
    employeeName: '',
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  })

  useEffect(() => {
    localStorage.setItem('bookito_leaves', JSON.stringify(leaves))
  }, [leaves])

  useEffect(() => {
    localStorage.setItem('bookito_deleted_leaves', JSON.stringify(deletedLeaves))
  }, [deletedLeaves])

  useEffect(() => {
    // Purge logic for local state: Auto-delete after 30 days
    const now = new Date()
    setDeletedLeaves(prev => prev.filter(l => differenceInDays(now, parseISO(l.deletedAt)) < 30))
  }, [])

  const stats = useMemo(() => [
    { label: 'Total Requests', value: leaves.length.toString(), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Approval', value: leaves.filter(l => l.status === 'Pending').length.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Approved', value: leaves.filter(l => l.status === 'Approved').length.toString(), icon: Check, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Rejected', value: leaves.filter(l => l.status === 'Rejected').length.toString(), icon: X, color: 'text-red-600', bg: 'bg-red-50' },
  ], [leaves])

  const handleApply = () => {
    const start = new Date(newRequest.startDate)
    const end = new Date(newRequest.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    const request: LeaveRequest = {
        id: Date.now().toString(),
        employeeName: newRequest.employeeName,
        leaveType: newRequest.leaveType,
        startDate: newRequest.startDate,
        endDate: newRequest.endDate,
        days: diffDays,
        reason: newRequest.reason,
        status: 'Pending'
    }
    setLeaves([request, ...leaves])
    setIsModalOpen(false)
  }

  const handleAction = (id: string, status: 'Approved' | 'Rejected') => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status } : l))
  }

  const handleDelete = (leave: LeaveRequest) => {
    const deletedAt = new Date().toISOString()
    const entry: DeletedLeaveRequest = { ...leave, deletedAt }
    
    setLeaves(prev => prev.filter(l => l.id !== leave.id))
    setDeletedLeaves(prev => [entry, ...prev])
  }

  const handleRestore = (leave: DeletedLeaveRequest) => {
    const { deletedAt, ...rest } = leave
    setDeletedLeaves(prev => prev.filter(l => l.id !== leave.id))
    setLeaves(prev => [rest, ...prev])
  }

  const getRemainingDays = (deletedAt: string) => {
    const diff = differenceInDays(new Date(), parseISO(deletedAt))
    return Math.max(0, 30 - diff)
  }

  const columns: ColumnDef<LeaveRequest, any>[] = useMemo(() => [
    {
      accessorKey: 'employeeName',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-surface-100 flex items-center justify-center">
            <User className="h-4 w-4 text-surface-400" />
          </div>
          <span className="font-semibold text-surface-900">{row.original.employeeName}</span>
        </div>
      )
    },
    {
      accessorKey: 'leaveType',
      header: 'Leave Type',
      cell: ({ row }) => <span className="text-sm text-surface-700">{row.original.leaveType}</span>
    },
    {
        accessorKey: 'days',
        header: 'Duration',
        cell: ({ row }) => (
          <div>
            <div className="text-sm font-medium text-surface-900">
                {row.original.startDate} to {row.original.endDate}
            </div>
            <div className="text-xs text-surface-500">{row.original.days} Day(s)</div>
          </div>
        )
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: ({ row }) => <span className="text-xs text-surface-500 line-clamp-1 max-w-[200px]">{row.original.reason}</span>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
          row.original.status === 'Approved' ? "bg-emerald-50 text-emerald-700" :
          row.original.status === 'Pending' ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
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
          {row.original.status === 'Pending' && (
            <>
              <button 
                onClick={() => handleAction(row.original.id, 'Approved')}
                className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                title="Approve"
              >
                <Check className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleAction(row.original.id, 'Rejected')}
                className="h-8 w-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                title="Reject"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
          <button 
            onClick={() => handleDelete(row.original)}
            className="h-8 w-8 rounded-lg text-surface-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm border border-transparent"
            title="Move to Trash"
          >
             <Trash2 className="h-4 w-4" />
          </button>
          <button className="h-8 w-8 rounded-lg text-surface-400 hover:bg-surface-50 flex items-center justify-center">
             <AlertCircle className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ], [leaves])

  const deletedColumns: ColumnDef<DeletedLeaveRequest, any>[] = useMemo(() => [
    {
      accessorKey: 'employeeName',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-surface-100 flex items-center justify-center">
            <User className="h-4 w-4 text-surface-400" />
          </div>
          <span className="font-semibold text-surface-900">{row.original.employeeName}</span>
        </div>
      )
    },
    {
        accessorKey: 'leaveType',
        header: 'Leave Type',
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
  ], [deletedLeaves])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Leave Management</h1>
          <div className="mt-2">
            <Breadcrumb items={[{ label: 'People Ops' }, { label: 'Leave Requests' }]} />
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Apply Leave
        </Button>
      </div>

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

      <div className="rounded-xl border border-surface-200 bg-white shadow-sm overflow-hidden">
        <div className="flex border-b border-surface-200 bg-surface-50/50 px-6">
            {(['Pending', 'Approved', 'Rejected', 'Trash'] as const).map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                        "px-4 py-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2",
                        activeTab === tab 
                            ? (tab === 'Trash' ? "border-red-600 text-red-600" : "border-primary-600 text-primary-600")
                            : "border-transparent text-surface-500 hover:text-surface-700"
                    )}
                >
                    {tab === 'Trash' && <Trash2 className="h-3.5 w-3.5" />}
                    {tab} Requests
                </button>
            ))}
        </div>
        <div className="p-4">
            {activeTab !== 'Trash' ? (
                <DataTable
                    data={leaves.filter(r => r.status === activeTab)}
                    columns={columns}
                    searchPlaceholder="Search by employee..."
                />
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                        <p className="text-sm text-surface-500 italic">
                            Requests in trash are automatically deleted after 30 days.
                        </p>
                    </div>
                    <DataTable
                        data={deletedLeaves}
                        columns={deletedColumns}
                        searchPlaceholder="Search deleted requests..."
                    />
                </div>
            )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Apply for Leave">
        <div className="space-y-4">
            <FormField label="Employee Name">
                <Input 
                    value={newRequest.employeeName}
                    onChange={(e) => setNewRequest({...newRequest, employeeName: e.target.value})}
                    placeholder="Enter your name"
                />
            </FormField>
            <FormField label="Leave Type">
                <Select 
                    value={newRequest.leaveType}
                    onChange={(val) => setNewRequest({...newRequest, leaveType: val})}
                    options={[
                        { label: 'Casual Leave', value: 'Casual Leave' },
                        { label: 'Sick Leave', value: 'Sick Leave' },
                        { label: 'Paid Leave', value: 'Paid Leave' },
                    ]}
                />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
                <FormField label="Start Date">
                    <Input 
                        type="date"
                        value={newRequest.startDate}
                        onChange={(e) => setNewRequest({...newRequest, startDate: e.target.value})}
                    />
                </FormField>
                <FormField label="End Date">
                    <Input 
                        type="date"
                        value={newRequest.endDate}
                        onChange={(e) => setNewRequest({...newRequest, endDate: e.target.value})}
                    />
                </FormField>
            </div>
            <FormField label="Reason">
                <Input 
                    value={newRequest.reason}
                    onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                    placeholder="Short description..."
                />
            </FormField>
            <div className="flex justify-end gap-3 pt-6">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleApply}>Submit Request</Button>
            </div>
        </div>
      </Modal>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
