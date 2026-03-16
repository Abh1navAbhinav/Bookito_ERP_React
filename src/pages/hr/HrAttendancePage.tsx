import { useEffect, useState } from 'react'
import { CalendarDays, Clock } from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button, FormField, Input, Select } from '@/components/FormElements'

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

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-surface-500">
            <span>{entries.length} entries</span>
          </div>
          <div className="overflow-hidden rounded-lg border border-surface-200">
            <table className="min-w-full divide-y divide-surface-200 text-sm">
              <thead className="bg-surface-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-surface-500">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-surface-500">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-surface-500">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-surface-500">
                    Time
                  </th>
                  {isHr && (
                    <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-surface-500">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 bg-white">
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-2 text-surface-800">
                      {entry.employeeName}
                    </td>
                    <td className="px-4 py-2 text-xs text-surface-500">
                      {entry.date}
                    </td>
                    <td className="px-4 py-2 text-xs">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          entry.status === 'present'
                            ? 'bg-emerald-50 text-emerald-700'
                            : entry.status === 'absent'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {entry.status === 'present'
                          ? 'Present'
                          : entry.status === 'absent'
                            ? 'Absent'
                            : 'On leave'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-surface-500">
                      <div className="flex items-center gap-2">
                        {entry.checkIn && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            In {entry.checkIn}
                          </span>
                        )}
                        {entry.checkOut && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Out {entry.checkOut}
                          </span>
                        )}
                      </div>
                    </td>
                    {isHr && (
                      <td className="px-4 py-2 text-right text-xs">
                        <button
                          className="text-red-500 hover:text-red-600"
                          onClick={() =>
                            saveEntries(entries.filter((e) => e.id !== entry.id))
                          }
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr>
                    <td
                      colSpan={isHr ? 5 : 4}
                      className="px-4 py-6 text-center text-xs text-surface-400"
                    >
                      No attendance entries yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

