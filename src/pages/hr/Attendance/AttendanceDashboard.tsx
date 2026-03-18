import { useState, useMemo, useEffect } from 'react'
import { Calendar, Clock, UserCheck, UserX, AlertCircle, CheckCircle2, MoreHorizontal, Plus, LogIn, LogOut, Trash2, RotateCcw, X } from 'lucide-react'
import { Button, FormField, Input, Select, Modal } from '@/components/FormElements'
import { DataTable } from '@/components/DataTable'
import { type ColumnDef } from '@tanstack/react-table'
import { differenceInDays, parseISO } from 'date-fns'

interface AttendanceRecord {
  id: string
  employeeName: string
  employeeId: string
  date: string
  checkIn: string
  checkOut: string
  status: 'Present' | 'Late' | 'Absent' | 'On Leave'
  workHours: string
}

interface DeletedAttendanceRecord extends AttendanceRecord {
  deletedAt: string
}

const initialAttendance: AttendanceRecord[] = [
  {
    id: '1',
    employeeName: 'John Doe',
    employeeId: 'EMP001',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:05 AM',
    checkOut: '06:30 PM',
    status: 'Late',
    workHours: '9h 25m'
  },
  {
    id: '2',
    employeeName: 'Jane Smith',
    employeeId: 'EMP002',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    status: 'Present',
    workHours: '9h 00m'
  }
]

export default function AttendanceDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('bookito_attendance')
    return saved ? JSON.parse(saved) : initialAttendance
  })
  
  const [deletedRecords, setDeletedRecords] = useState<DeletedAttendanceRecord[]>(() => {
    const saved = localStorage.getItem('bookito_deleted_attendance')
    return saved ? JSON.parse(saved) : []
  })

  const [showDeleted, setShowDeleted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [manualEntry, setManualEntry] = useState({
    employeeName: '',
    employeeId: '',
    checkIn: '09:00',
    checkOut: '18:00',
  })

  useEffect(() => {
    localStorage.setItem('bookito_attendance', JSON.stringify(records))
  }, [records])

  useEffect(() => {
    localStorage.setItem('bookito_deleted_attendance', JSON.stringify(deletedRecords))
  }, [deletedRecords])

  useEffect(() => {
    // Purge logic: Auto-delete after 30 days
    const now = new Date()
    setDeletedRecords(prev => prev.filter(r => differenceInDays(now, parseISO(r.deletedAt)) < 30))
  }, [])

  const filteredRecords = useMemo(() => {
    return records.filter(r => r.date === selectedDate)
  }, [records, selectedDate])

  const handleAddManual = () => {
    const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        employeeName: manualEntry.employeeName,
        employeeId: manualEntry.employeeId,
        date: selectedDate,
        checkIn: manualEntry.checkIn,
        checkOut: manualEntry.checkOut,
        status: 'Present',
        workHours: '9h 00m'
    }
    setRecords([newRecord, ...records])
    setIsModalOpen(false)
  }

  const handleDelete = (record: AttendanceRecord) => {
    const deletedAt = new Date().toISOString()
    const entry: DeletedAttendanceRecord = { ...record, deletedAt }
    
    setRecords(prev => prev.filter(r => r.id !== record.id))
    setDeletedRecords(prev => [entry, ...prev])
  }

  const handleRestore = (record: DeletedAttendanceRecord) => {
    const { deletedAt, ...rest } = record
    setDeletedRecords(prev => prev.filter(r => r.id !== record.id))
    setRecords(prev => [...prev, rest])
  }

  const getRemainingDays = (deletedAt: string) => {
    const diff = differenceInDays(new Date(), parseISO(deletedAt))
    return Math.max(0, 30 - diff)
  }

  const stats = useMemo(() => {
    const today = filteredRecords
    return [
        { label: 'Present', value: today.filter(r => r.status === 'Present' || r.status === 'Late').length.toString(), icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Late Arrival', value: today.filter(r => r.status === 'Late').length.toString(), icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Absent', value: today.filter(r => r.status === 'Absent').length.toString(), icon: UserX, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'Avg Hours', value: '8.5h', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    ]
  }, [filteredRecords])

  const columns: ColumnDef<AttendanceRecord, any>[] = useMemo(() => [
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
      accessorKey: 'checkIn',
      header: 'Check-In',
      cell: ({ row }) => <span className="text-sm font-medium text-surface-700">{row.original.checkIn}</span>
    },
    {
      accessorKey: 'checkOut',
      header: 'Check-Out',
      cell: ({ row }) => <span className="text-sm font-medium text-surface-700">{row.original.checkOut}</span>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
          row.original.status === 'Present' ? "bg-emerald-50 text-emerald-700" :
          row.original.status === 'Late' ? "bg-amber-50 text-amber-700" :
          row.original.status === 'Absent' ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
        )}>
            <div className={cn(
               "h-1.5 w-1.5 rounded-full",
               row.original.status === 'Present' ? "bg-emerald-500" :
               row.original.status === 'Late' ? "bg-amber-500" :
               row.original.status === 'Absent' ? "bg-red-500" : "bg-blue-500"
            )} />
          {row.original.status}
        </span>
      )
    },
    {
      accessorKey: 'workHours',
      header: 'Work Hours',
      cell: ({ row }) => <span className="text-sm text-surface-600">{row.original.workHours}</span>
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
            <button 
                onClick={() => handleDelete(row.original)}
                className="rounded-md p-1.5 text-surface-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Delete"
            >
                <Trash2 className="h-4 w-4" />
            </button>
            <button className="rounded-md p-1.5 text-surface-400 hover:bg-surface-50 hover:text-surface-600 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
            </button>
        </div>
      )
    }
  ], [records])

  const deletedColumns: ColumnDef<DeletedAttendanceRecord, any>[] = useMemo(() => [
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
  ], [deletedRecords])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Attendance</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-surface-200 p-0.5 bg-surface-100/50 shadow-inner">
            <button
              onClick={() => setShowDeleted(false)}
              className={cn(
                "rounded-md px-4 py-1.5 text-xs font-medium transition-all duration-200",
                !showDeleted
                  ? "bg-white text-primary-600 shadow-sm border border-surface-200"
                  : "text-surface-500 hover:text-surface-700"
              )}
            >
              Active
            </button>
            <button
              onClick={() => setShowDeleted(true)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-medium transition-all duration-200",
                showDeleted
                  ? "bg-white text-red-600 shadow-sm border border-red-200"
                  : "text-surface-500 hover:text-surface-700"
              )}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Trash
            </button>
          </div>
          <Input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
            className="w-40"
          />
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Manual Entry
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Export Monthly
          </Button>
        </div>
      </div>

      {!showDeleted && (
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
        {!showDeleted ? (
            <>
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-surface-900">Log – {selectedDate}</h2>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-surface-50 border border-surface-200 rounded-lg text-xs font-medium text-surface-600">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Biometric Synced
                    </span>
                </div>
                <DataTable
                    data={filteredRecords}
                    columns={columns}
                    searchPlaceholder="Search employee..."
                />
            </>
        ) : (
            <>
                <div className="flex items-center gap-2 px-1">
                    <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                    <p className="text-sm text-surface-500 italic">
                        Items in trash are automatically deleted after 30 days.
                    </p>
                </div>
                <DataTable
                    data={deletedRecords}
                    columns={deletedColumns}
                    searchPlaceholder="Search deleted records..."
                />
            </>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Manual Attendance Entry">
        <div className="space-y-4">
            <FormField label="Employee Name">
                <Input 
                    value={manualEntry.employeeName} 
                    onChange={(e) => setManualEntry({...manualEntry, employeeName: e.target.value})}
                />
            </FormField>
            <FormField label="Employee ID">
                <Input 
                    value={manualEntry.employeeId} 
                    onChange={(e) => setManualEntry({...manualEntry, employeeId: e.target.value})}
                />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
                <FormField label="Check-In">
                    <Input 
                        type="time"
                        value={manualEntry.checkIn} 
                        onChange={(e) => setManualEntry({...manualEntry, checkIn: e.target.value})}
                    />
                </FormField>
                <FormField label="Check-Out">
                    <Input 
                        type="time"
                        value={manualEntry.checkOut} 
                        onChange={(e) => setManualEntry({...manualEntry, checkOut: e.target.value})}
                    />
                </FormField>
            </div>
            <div className="flex justify-end gap-3 pt-6">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleAddManual}>Save Entry</Button>
            </div>
        </div>
      </Modal>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
