import { useEffect, useState, useMemo } from 'react'
import { CalendarDays, Clock, Users } from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button, FormField, Input, Select } from '@/components/FormElements'
import { DataTable } from '@/components/DataTable'
import { type ColumnDef } from '@tanstack/react-table'

type DemoRole = 'manager' | 'sales' | 'accountant' | 'crm' | 'hr'

interface AttendanceEntry {
  id: string
  employeeName: string
  date: string
  status: 'present' | 'absent' | 'on_leave'
  checkIn?: string
  checkOut?: string
}

export default function HrAttendancePage() {
  const [currentRole, setCurrentRole] = useState<DemoRole | null>(null)
  const [entries, setEntries] = useState<AttendanceEntry[]>([])
  const [newEntry, setNewEntry] = useState<Omit<AttendanceEntry, 'id'>>({
    employeeName: '',
    date: '',
    status: 'present',
    checkIn: '',
    checkOut: '',
  })

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('bookito_demo_user')
      if (raw) {
        const parsed = JSON.parse(raw) as { role?: DemoRole }
        if (parsed.role) {
          setCurrentRole(parsed.role)
        }
      }
    } catch {
      // ignore
    }

    try {
      const rawEntries = window.localStorage.getItem('bookito_hr_attendance')
      if (rawEntries) {
        setEntries(JSON.parse(rawEntries) as AttendanceEntry[])
      }
    } catch {
      // ignore
    }
  }, [])

  const isHr = currentRole === 'hr'

  const saveEntries = (list: AttendanceEntry[]) => {
    setEntries(list)
    window.localStorage.setItem('bookito_hr_attendance', JSON.stringify(list))
  }

      const columns: ColumnDef<AttendanceEntry, any>[] = useMemo(
        () => [
          {
            accessorKey: 'employeeName',
            header: 'Name',
            cell: ({ row }) => <span className="text-surface-800">{row.original.employeeName}</span>
          },
          {
            accessorKey: 'date',
            header: 'Date',
            cell: ({ row }) => <span className="text-xs text-surface-500">{row.original.date}</span>
          },
          {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  row.original.status === 'present'
                    ? 'bg-emerald-50 text-emerald-700'
                    : row.original.status === 'absent'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-amber-50 text-amber-700'
                }`}
              >
                {row.original.status === 'present'
                  ? 'Present'
                  : row.original.status === 'absent'
                    ? 'Absent'
                    : 'On leave'}
              </span>
            )
          },
          {
            id: 'time',
            header: 'Time',
            cell: ({ row }) => (
              <div className="flex items-center gap-2 text-xs text-surface-500">
                {row.original.checkIn && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    In {row.original.checkIn}
                  </span>
                )}
                {row.original.checkOut && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Out {row.original.checkOut}
                  </span>
                )}
              </div>
            )
          },
        ],
        []
      )

      if (isHr) {
        columns.push({
          id: 'actions',
          header: 'Actions',
          cell: ({ row }) => (
            <div className="text-right">
              <button
                className="text-xs text-red-500 hover:text-red-600"
                onClick={() =>
                  saveEntries(entries.filter((e) => e.id !== row.original.id))
                }
              >
                Remove
              </button>
            </div>
          )
        })
      }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">
            Attendance Register
          </h1>
          <div className="mt-2">
            <Breadcrumb items={[{ label: 'HR' }, { label: 'Attendance' }]} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-surface-900">
              Daily attendance
            </h2>
            <p className="text-xs text-surface-500">
              HR can register attendance for team members. This is a simple demo
              register for now.
            </p>
          </div>
        </div>

        {isHr && (
          <div className="mb-6 rounded-lg border border-surface-200 bg-surface-50 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-surface-500">
              Add attendance entry
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
              <FormField label="Employee name">
                <Input
                  value={newEntry.employeeName}
                  onChange={(e) =>
                    setNewEntry((prev) => ({
                      ...prev,
                      employeeName: e.target.value,
                    }))
                  }
                  placeholder="Employee name"
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
            <div className="mt-3 flex justify-end">
              <Button
                size="sm"
                onClick={() => {
                  if (!newEntry.employeeName.trim() || !newEntry.date) return
                  const created: AttendanceEntry = {
                    id: `${Date.now()}`,
                    ...newEntry,
                  }
                  saveEntries([...entries, created])
                  setNewEntry({
                    employeeName: '',
                    date: '',
                    status: 'present',
                    checkIn: '',
                    checkOut: '',
                  })
                }}
              >
                Add Entry
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <DataTable
            data={entries}
            columns={columns}
            searchPlaceholder="Search attendance..."
          />
        </div>
      </div>
    </div>
  )
}

