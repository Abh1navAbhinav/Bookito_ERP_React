import { useEffect, useState, useMemo, useCallback } from 'react'
import { CalendarDays, X } from 'lucide-react'
import { Button, FormField, Input, Select } from '@/components/FormElements'
import { DataTable } from '@/components/DataTable'
import { StatusBadge } from '@/components/StatusBadge'
import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { fetchAttendance, createAttendance, fetchEmployees, type ApiAttendance } from '@/lib/hrApi'
import { fetchSalesAttendanceForMonth, type SalesAttendanceRecord } from '@/lib/salesApi'

type DemoRole = 'manager' | 'admin' | 'sales' | 'accountant' | 'crm' | 'hr'

interface AttendanceEntry {
  id: string
  employeeName: string
  date: string
  status: 'present' | 'absent' | 'on_leave'
  checkIn?: string
  checkOut?: string
  checkInSelfie?: string
  checkOutSelfie?: string
  checkInLocation?: { lat: number; lng: number; name?: string } | null
  checkOutLocation?: { lat: number; lng: number; name?: string } | null
  employeeRole?: string
  /** Rows from sales punch API vs HR Employee attendance */
  source?: 'hr' | 'sales'
}

function formatTime(t: string | null): string {
  if (!t) return ''
  if (t.length <= 5) return t
  const [h, m, s] = t.split(':')
  return `${h}:${m}`
}

function mapApiToEntry(a: ApiAttendance): AttendanceEntry {
  let status: AttendanceEntry['status'] = 'present'
  if (a.status === 'absent') status = 'absent'
  else if (a.status === 'leave') status = 'on_leave'
  return {
    id: a.id,
    employeeName: a.employee_name,
    date: a.date,
    status,
    checkIn: formatTime(a.check_in_time) || undefined,
    checkOut: formatTime(a.check_out_time) || undefined,
    source: 'hr',
  }
}

function parseSalesLocation(v: unknown): { lat: number; lng: number; name?: string } | null {
  if (v == null || typeof v !== 'object') return null
  const o = v as Record<string, unknown>
  const lat = Number(o.lat)
  const lng = Number(o.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  const name = o.name
  return {
    lat,
    lng,
    ...(typeof name === 'string' && name ? { name } : {}),
  }
}

function mapSalesAttendanceToEntry(r: SalesAttendanceRecord): AttendanceEntry {
  return {
    id: r.id,
    employeeName: r.user_name || r.username || 'Sales user',
    date: r.date,
    status: r.check_in_time ? 'present' : 'absent',
    checkIn: formatTime(r.check_in_time) || undefined,
    checkOut: formatTime(r.check_out_time) || undefined,
    checkInSelfie: r.check_in_selfie || undefined,
    checkOutSelfie: r.check_out_selfie || undefined,
    checkInLocation: parseSalesLocation(r.check_in_location),
    checkOutLocation: parseSalesLocation(r.check_out_location),
    employeeRole: 'sales',
    source: 'sales',
  }
}

export default function HrAttendancePage() {
  const [currentRole, setCurrentRole] = useState<DemoRole | null>(null)
  const [entries, setEntries] = useState<AttendanceEntry[]>([])
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<'sales' | 'others'>('sales')
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [newEntry, setNewEntry] = useState<Omit<AttendanceEntry, 'id'> & { employeeId?: string }>({
    employeeName: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    checkIn: '',
    checkOut: '',
  })

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      let viewerRole: DemoRole | null = null
      try {
        const raw = window.localStorage.getItem('bookito_demo_user')
        if (raw) viewerRole = (JSON.parse(raw) as { role?: DemoRole }).role ?? null
      } catch {
        // ignore
      }

      const [attList, empList] = await Promise.all([fetchAttendance(), fetchEmployees()])
      let merged: AttendanceEntry[] = attList.map(mapApiToEntry)

      if (viewerRole === 'manager' || viewerRole === 'admin' || viewerRole === 'hr') {
        try {
          const salesRows = await fetchSalesAttendanceForMonth(selectedMonth)
          merged = [...salesRows.map(mapSalesAttendanceToEntry), ...merged]
        } catch {
          // Sales API optional for register; keep HR rows only
        }
      }

      setEntries(merged)
      setEmployees(empList.map((e) => ({ id: e.id, name: `${e.first_name} ${e.last_name}`.trim() })))
    } catch {
      setEntries([])
    } finally {
      setLoading(false)
    }
  }, [selectedMonth])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('bookito_demo_user')
      if (raw) {
        const parsed = JSON.parse(raw) as { role?: DemoRole }
        if (parsed.role) setCurrentRole(parsed.role)
      }
    } catch {
      // ignore
    }
    void loadData()
  }, [loadData])

  const saveEntries = (list: AttendanceEntry[]) => {
    setEntries(list)
  }

  const columns: ColumnDef<AttendanceEntry, any>[] = useMemo(
    () => [
      {
        accessorKey: 'slno',
        header: 'SL No',
        size: 70,
        cell: ({ row }) => <span className="text-surface-500">{row.index + 1}</span>
      },
      {
        accessorKey: 'employeeName',
        header: 'Employee Name',
        cell: ({ row }) => {
          const initials = row.original.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
          return (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-700">
                {initials}
              </div>
              <span className="font-medium text-surface-900">{row.original.employeeName}</span>
            </div>
          )
        }
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => <span className="text-surface-600">{row.original.date}</span>
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status
          return (
            <StatusBadge 
              label={status.replace('_', ' ')} 
              variant={status === 'present' ? 'success' : status === 'absent' ? 'danger' : 'warning'} 
              dot 
            />
          )
        }
      },
      {
        accessorKey: 'checkIn',
        header: 'In',
        cell: ({ row }) => <span className="font-medium text-surface-900">{row.original.checkIn || '—'}</span>
      },
      {
        accessorKey: 'checkOut',
        header: 'Out',
        cell: ({ row }) => <span className="font-medium text-surface-900">{row.original.checkOut || '—'}</span>
      },
      {
        id: 'checkInLocation',
        header: 'In Location',
        cell: ({ row }) => {
          const loc = row.original.checkInLocation
          if (!loc) return <span className="text-surface-400">—</span>
          return (
            <a 
              href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-[150px] truncate text-xs text-surface-500 hover:text-primary-600 hover:underline transition-colors block"
              title={loc.name}
            >
              {loc.name || 'View Map'}
            </a>
          )
        }
      },
      {
        id: 'checkOutLocation',
        header: 'Out Location',
        cell: ({ row }) => {
          const loc = row.original.checkOutLocation
          if (!loc) return <span className="text-surface-400">—</span>
          return (
            <a 
              href={`https://www.google.com/maps?q=${loc.lat},${loc.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-[150px] truncate text-xs text-surface-500 hover:text-amber-600 hover:underline transition-colors block"
              title={loc.name}
            >
              {loc.name || 'View Map'}
            </a>
          )
        }
      },
      {
        id: 'verification',
        header: 'Verification',
        cell: ({ row }) => {
          const hasIn = !!row.original.checkInSelfie
          const hasOut = !!row.original.checkOutSelfie
          if (!hasIn && !hasOut) return <span className="text-surface-300">—</span>
          return (
            <div className="flex -space-x-1.5">
              {row.original.checkInSelfie && (
                <button 
                  onClick={() => setSelectedImage(row.original.checkInSelfie!)}
                  className="h-7 w-7 overflow-hidden rounded-full border-2 border-white bg-surface-100 shadow-sm transition-transform hover:scale-110"
                >
                  <img src={row.original.checkInSelfie} className="h-full w-full object-cover" alt="Check-in" />
                </button>
              )}
              {row.original.checkOutSelfie && (
                <button 
                  onClick={() => setSelectedImage(row.original.checkOutSelfie!)}
                  className="h-7 w-7 overflow-hidden rounded-full border-2 border-white bg-surface-100 shadow-sm transition-transform hover:scale-110"
                >
                  <img src={row.original.checkOutSelfie} className="h-full w-full object-cover" alt="Check-out" />
                </button>
              )}
            </div>
          )
        }
      },
    ],
    []
  )

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const matchesMonth = e.date.startsWith(selectedMonth)
      const isSales =
        e.source === 'sales' ||
        e.employeeRole?.toLowerCase() === 'sales' ||
        e.employeeName.toLowerCase().includes('sales')
      const matchesSection = activeSection === 'sales' ? isSales : !isSales
      return matchesMonth && matchesSection
    })
  }, [entries, selectedMonth, activeSection])

  const monthOptions = useMemo(() => {
    const options: { value: string; label: string }[] = []
    const now = new Date()
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label = d.toLocaleDateString('default', { month: 'long', year: 'numeric' })
      options.push({ value: val, label })
    }
    return options
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">
            Attendance Register
          </h1>
          <p className="text-sm text-surface-500">Track logs, uniform verification, and locations.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <div className="rounded-xl bg-primary-50 p-3 text-primary-600 shadow-sm">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-surface-900">
              Daily Attendance Logs
            </h2>
            <p className="text-xs text-surface-500">
              {currentRole === 'hr' ? 'Review sales team attendance with uniform compliance and GPS tracking.' : 'View team attendance logs.'}
            </p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between border-b border-surface-100 pb-6">
          <div className="flex rounded-lg border border-surface-200 p-0.5 w-fit bg-surface-50">
            <button
              onClick={() => setActiveSection('sales')}
              className={cn(
                "rounded-md px-4 py-1.5 text-xs font-bold transition-all",
                activeSection === 'sales'
                  ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                  : "text-surface-500 hover:text-surface-700 hover:bg-surface-100"
              )}
            >
              Sales Team
            </button>
            <button
              onClick={() => setActiveSection('others')}
              className={cn(
                "rounded-md px-4 py-1.5 text-xs font-bold transition-all",
                activeSection === 'others'
                  ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                  : "text-surface-500 hover:text-surface-700 hover:bg-surface-100"
              )}
            >
              Other Roles
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-surface-400 italic">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse" />
            Showing specialized logs for {activeSection === 'sales' ? 'Sales Executives' : 'Management & Operation teams'}
          </div>
        </div>

        {currentRole === 'hr' && (
          <div className="mb-8 rounded-xl border border-surface-200 bg-surface-50 p-5 ring-1 ring-surface-200/50">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-surface-400">
              Manual Attendance Entry
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <FormField label="Employee">
                <Select
                  value={newEntry.employeeId ?? ''}
                  onChange={(id) => {
                    const emp = employees.find((e) => e.id === id)
                    setNewEntry((prev) => ({ ...prev, employeeId: id, employeeName: emp?.name ?? '' }))
                  }}
                  options={[{ label: 'Select employee', value: '' }, ...employees.map((e) => ({ label: e.name, value: e.id }))]}
                  placeholder="Select employee"
                />
              </FormField>
              <FormField label="Date">
                <Input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) =>
                    setNewEntry((prev) => ({ ...prev, date: e.target.value }))
                  }
                />
              </FormField>
              <FormField label="Status">
                <Select
                  value={newEntry.status}
                  onChange={(value) =>
                    setNewEntry((prev) => ({
                      ...prev,
                      status: value as AttendanceEntry['status'],
                    }))
                  }
                  options={[
                    { label: 'Present', value: 'present' },
                    { label: 'Absent', value: 'absent' },
                    { label: 'On leave', value: 'on_leave' },
                  ]}
                  placeholder="Status"
                />
              </FormField>
              <FormField label="Check‑in">
                <Input
                  type="time"
                  value={newEntry.checkIn}
                  onChange={(e) =>
                    setNewEntry((prev) => ({ ...prev, checkIn: e.target.value }))
                  }
                />
              </FormField>
              <FormField label="Check‑out">
                <Input
                  type="time"
                  value={newEntry.checkOut}
                  onChange={(e) =>
                    setNewEntry((prev) => ({
                      ...prev,
                      checkOut: e.target.value,
                    }))
                  }
                />
              </FormField>
            </div>
            <div className="mt-5 flex justify-end">
              <Button
                onClick={async () => {
                  const employeeId = newEntry.employeeId ?? ''
                  if (!employeeId || !newEntry.date) return
                  try {
                    await createAttendance({
                      id: `att-${employeeId}-${newEntry.date}-${Date.now()}`,
                      employee: employeeId,
                      date: newEntry.date,
                      status: newEntry.status,
                      check_in_time: newEntry.checkIn || null,
                      check_out_time: newEntry.checkOut || null,
                    })
                    setNewEntry({
                      employeeId: '',
                      employeeName: '',
                      date: new Date().toISOString().split('T')[0],
                      status: 'present',
                      checkIn: '',
                      checkOut: '',
                    })
                    await loadData()
                  } catch (err) {
                    alert((err as Error).message ?? 'Failed to add attendance')
                  }
                }}
              >
                Add Manual Record
              </Button>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between border-t border-surface-100 pt-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-surface-400">Duration Filter</span>
            <div className="w-56">
              <Select
                value={selectedMonth}
                onChange={(val) => setSelectedMonth(val)}
                options={monthOptions}
              />
            </div>
          </div>
          <div className="rounded-lg bg-surface-50 px-3 py-1.5 border border-surface-200">
            <p className="text-xs font-semibold text-surface-600">
              <span className="text-primary-600">{filteredEntries.length}</span> Records in this period
            </p>
          </div>
        </div>

        <DataTable
          data={filteredEntries}
          columns={columns}
          searchPlaceholder="Search employees or dates..."
        />
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center bg-surface-900/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-screen max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in duration-300">
            <button 
              className="absolute top-4 right-4 z-10 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 backdrop-blur-md transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </button>
            <img src={selectedImage} className="max-h-[85vh] w-auto object-contain" alt="Verification" />
            <div className="p-4 bg-white text-center">
              <p className="text-sm font-semibold text-surface-900 italic">Uniform Compliance Verification Photo</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


