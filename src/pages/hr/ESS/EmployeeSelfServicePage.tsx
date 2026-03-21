import { useState, useEffect, useCallback } from 'react'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Lock,
  Shield,
  CreditCard,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { Button, FormField, Input, Modal } from '@/components/FormElements'
import { cn } from '@/lib/utils'
import { downloadCsv } from '@/lib/exportUtils'
import {
  createEssLeave,
  fetchEssLeaves,
  fetchEssPayslips,
  patchEssLeave,
} from '@/lib/hrApi'

export default function EmployeeSelfServicePage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)

  const [essPayslips, setEssPayslips] = useState<
    { id: string; month: string; netPay: string; status: string }[]
  >([])

  const [essLeaves, setEssLeaves] = useState<
    {
      id: string
      type: string
      startDate: string
      endDate: string
      status: string
      reason?: string
      hrComment?: string
    }[]
  >([])

  const [newLeave, setNewLeave] = useState({
    type: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  })

  const [leaveFilter, setLeaveFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected' | 'Revoked'>('all')

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('bookito_demo_user')
      if (raw) {
        setCurrentUser(JSON.parse(raw))
      }
    } catch {
      // ignore
    }
  }, [])

  const loadEss = useCallback(async () => {
    try {
      const [pays, leaves] = await Promise.all([fetchEssPayslips(), fetchEssLeaves()])
      setEssPayslips(
        pays.map((p) => ({
          id: String(p.id),
          month: p.month_label,
          netPay: p.net_pay,
          status: p.status,
        }))
      )
      setEssLeaves(
        leaves.map((l) => ({
          id: String(l.id),
          type: l.leave_type,
          startDate: l.start_date,
          endDate: l.end_date,
          status: l.status,
          reason: l.reason,
          hrComment: l.hr_comment,
        }))
      )
    } catch {
      setEssPayslips([])
      setEssLeaves([])
    }
  }, [])

  useEffect(() => {
    void loadEss()
  }, [loadEss])

  const stats = [
    { key: 'leaves', label: 'Available Leaves', value: '12 Days', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { key: 'attendance', label: 'Attendance (MTD)', value: '98%', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { key: 'reviews', label: 'Pending Reviews', value: '1', icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50' },
    { key: 'hike', label: 'Next Hike', value: 'July 26', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">My Profile</h1>
        </div>
        {currentUser?.role === 'hr' && (
          <Button className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Change Password
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
            <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 text-3xl font-bold border-4 border-white shadow-lg">
                    {currentUser?.label?.[0] || 'U'}
                </div>
                <h2 className="mt-4 text-xl font-bold text-surface-900">{currentUser?.label || 'User Profile'}</h2>
                <p className="text-sm text-surface-500 capitalize">{currentUser?.role || 'Employee'}</p>
                <div className="mt-6 w-full space-y-4 text-left border-t border-surface-100 pt-6">
                    <div className="flex items-center gap-3 text-sm text-surface-600">
                        <Mail className="h-4 w-4 text-surface-400" />
                        <span>{currentUser?.email || 'user@bookito.com'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-surface-600">
                        <Phone className="h-4 w-4 text-surface-400" />
                        <span>+91 98765 43210</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-surface-600">
                        <MapPin className="h-4 w-4 text-surface-400" />
                        <span>Bangalore, India</span>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-surface-900 mb-4">Quick Links</h3>
                <div className="space-y-2">
                    <button
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-surface-50 text-sm font-medium text-surface-700 transition-colors border border-surface-100"
                      onClick={() => setIsPayslipModalOpen(true)}
                    >
                        View Payslips
                        <ChevronRight className="h-4 w-4 text-surface-300" />
                    </button>
                    <button
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-surface-50 text-sm font-medium text-surface-700 transition-colors border border-surface-100"
                      onClick={() => setIsLeaveModalOpen(true)}
                    >
                        Apply for Leave
                        <ChevronRight className="h-4 w-4 text-surface-300" />
                    </button>
                </div>
            </div>
        </div>

        {/* Info Tabs */}
        <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {stats.map((stat) => (
                <button
                  key={stat.key}
                  type="button"
                  className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm text-left transition-colors hover:border-primary-200 hover:bg-primary-50/30"
                  onClick={() => {
                    if (stat.key === 'attendance') {
                      setIsAttendanceModalOpen(true)
                    }
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`rounded-xl ${stat.bg} p-3 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-500">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-surface-900">{stat.value}</h3>
                    </div>
                  </div>
                  {stat.key === 'attendance' && (
                    <p className="mt-2 text-xs text-surface-500">
                      Click to view detailed attendance calendar
                    </p>
                  )}
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-surface-900 mb-6">Employment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Full Name">
                        <Input value={currentUser?.label || ''} readOnly />
                    </FormField>
                    <FormField label="Employee ID">
                        <Input value="EMP-BK-2024-08" readOnly />
                    </FormField>
                    <FormField label="Department">
                        <Input value="Engineering" readOnly />
                    </FormField>
                    <FormField label="Designation">
                        <Input value="Senior Frontend Developer" readOnly />
                    </FormField>
                    <FormField label="Reporting Manager">
                        <Input value="Sarah Wilson" readOnly />
                    </FormField>
                    <FormField label="Date of Joining">
                        <Input value="15 Jan 2024" readOnly />
                    </FormField>
                </div>
            </div>

            <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-surface-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="mt-1 h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-surface-900">Attendance marked for today</p>
                            <p className="text-xs text-surface-500">Checked in at 09:02 AM</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="mt-1 h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-surface-900">Leave request approved</p>
                            <p className="text-xs text-surface-500">Casual leave for 25th March 2026</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      {/* My Leave Requests List */}
      {essLeaves.length > 0 && (
        <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-semibold text-surface-900">My Leave Requests</h3>
            <select
              className="rounded-md border border-surface-300 bg-white px-2 py-1 text-xs text-surface-700"
              value={leaveFilter}
              onChange={(e) => setLeaveFilter(e.target.value as any)}
            >
              <option value="all">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Revoked">Revoked</option>
            </select>
          </div>
          <div className="space-y-3 text-sm">
            {essLeaves
              .filter((leave) => (leaveFilter === 'all' ? true : leave.status === leaveFilter))
              .map((leave) => (
              <div
                key={leave.id}
                className="flex items-center justify-between rounded-lg border border-surface-100 bg-surface-50 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-surface-900">{leave.type}</p>
                  <p className="text-xs text-surface-500">
                    {leave.startDate} – {leave.endDate}
                  </p>
                  {leave.reason && (
                    <p className="mt-1 text-xs text-surface-500 line-clamp-2">
                      {leave.reason}
                    </p>
                  )}
                  {leave.hrComment && (
                    <p className="mt-1 text-xs text-red-600 line-clamp-2">
                      HR remark: {leave.hrComment}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                      leave.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700'
                        : leave.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-red-50 text-red-700'
                    )}
                  >
                    {leave.status}
                  </span>
                  {leave.status === 'Pending' && (
                    <button
                      type="button"
                      onClick={() =>
                        void patchEssLeave(leave.id, { status: 'Revoked' }).then(() => loadEss())
                      }
                      className="text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attendance Calendar Modal */}
      <Modal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        title="Attendance Calendar"
        size="lg"
      >
        <AttendanceCalendar leaves={essLeaves} />
      </Modal>

      {/* Payslips Modal */}
      <Modal
        isOpen={isPayslipModalOpen}
        onClose={() => setIsPayslipModalOpen(false)}
        title="My Payslips"
        size="md"
      >
        <div className="space-y-3">
          {essPayslips.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-lg border border-surface-100 bg-surface-50 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium text-surface-900">{p.month}</p>
                <p className="text-xs text-surface-500">{p.status}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-surface-900">{p.netPay}</p>
                <button
                  type="button"
                  onClick={() =>
                    downloadCsv(
                      `payslip-${p.month.replace(/\s+/g, '-').toLowerCase()}.csv`,
                      [
                        {
                          field: 'Month',
                          value: p.month,
                        },
                        {
                          field: 'Net Pay',
                          value: p.netPay,
                        },
                        {
                          field: 'Status',
                          value: p.status,
                        },
                      ],
                      [
                        { key: 'field', label: 'Field' },
                        { key: 'value', label: 'Value' },
                        { key: 'Status', label: '' },
                      ]
                    )
                  }
                  className="text-xs font-medium text-primary-600 hover:text-primary-700 underline"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
          {essPayslips.length === 0 && (
            <p className="text-sm text-surface-500">No payslips available yet.</p>
          )}
        </div>
      </Modal>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Apply for Leave"
        size="md"
      >
        <div className="space-y-4">
          <FormField label="Leave Type">
            <select
              className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm"
              value={newLeave.type}
              onChange={(e) => setNewLeave((prev) => ({ ...prev, type: e.target.value }))}
            >
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Paid Leave">Paid Leave</option>
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date">
              <Input
                type="date"
                value={newLeave.startDate}
                onChange={(e) => setNewLeave((prev) => ({ ...prev, startDate: e.target.value }))}
              />
            </FormField>
            <FormField label="End Date">
              <Input
                type="date"
                value={newLeave.endDate}
                onChange={(e) => setNewLeave((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </FormField>
          </div>
          <FormField label="Reason">
            <Input
              placeholder="Short description..."
              value={newLeave.reason}
              onChange={(e) => setNewLeave((prev) => ({ ...prev, reason: e.target.value }))}
            />
          </FormField>
          <div className="mt-4 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsLeaveModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!newLeave.startDate || !newLeave.endDate) return
                void createEssLeave({
                  leave_type: newLeave.type,
                  start_date: newLeave.startDate,
                  end_date: newLeave.endDate,
                  reason: newLeave.reason,
                }).then(() => {
                  void loadEss()
                  setIsLeaveModalOpen(false)
                  setNewLeave({
                    type: 'Casual Leave',
                    startDate: '',
                    endDate: '',
                    reason: '',
                  })
                })
              }}
            >
              Submit Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function AttendanceCalendar({
  leaves,
}: {
  leaves: {
    startDate: string
    endDate: string
    status: string
    type?: string
    reason?: string
    hrComment?: string
  }[]
}) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const startWeekday = firstDay.getDay() // 0 (Sun) - 6 (Sat)
  const daysInMonth = lastDay.getDate()

  const weeks: (number | null)[][] = []
  let currentWeek: (number | null)[] = Array(startWeekday).fill(null)

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }
  if (currentWeek.length) {
    while (currentWeek.length < 7) currentWeek.push(null)
    weeks.push(currentWeek)
  }

  const dayStatusMap = new Map<
    string,
    {
      pending: number
      approved: number
      rejected: number
      details: typeof leaves
    }
  >()

  leaves.forEach((leave) => {
    if (!leave.startDate || !leave.endDate) return
    const start = new Date(leave.startDate)
    const end = new Date(leave.endDate)
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getFullYear() !== year || d.getMonth() !== month) continue
      const iso = d.toISOString().split('T')[0]
      const existing =
        dayStatusMap.get(iso) ?? {
          pending: 0,
          approved: 0,
          rejected: 0,
          details: [],
        }
      if (leave.status === 'Pending') existing.pending += 1
      else if (leave.status === 'Approved') existing.approved += 1
      else if (leave.status === 'Rejected') existing.rejected += 1
      existing.details.push(leave)
      dayStatusMap.set(iso, existing)
    }
  })

  const isLeaveDay = (day: number | null) => {
    if (!day) return undefined
    const iso = new Date(year, month, day).toISOString().split('T')[0]
    return dayStatusMap.get(iso)
  }

  const [selectedIso, setSelectedIso] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-surface-600">
        <p>
          Showing attendance for{' '}
          <span className="font-semibold">
            {new Date(year, month, 1).toLocaleString('default', { month: 'long' })} {year}
          </span>
          . Dates highlighted in red indicate approved or pending leave.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-surface-300 px-2 py-1 text-xs hover:bg-surface-50"
            aria-label="Previous month"
            onClick={() => {
              setYear((y) => (month === 0 ? y - 1 : y))
              setMonth((m) => (m === 0 ? 11 : m - 1))
            }}
          >
            ‹
          </button>
          <select
            className="rounded-md border border-surface-300 bg-white px-2 py-1 text-xs"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }).map((_, idx) => (
              <option key={idx} value={idx}>
                {new Date(2000, idx, 1).toLocaleString('default', { month: 'short' })}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border border-surface-300 bg-white px-2 py-1 text-xs"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {Array.from({ length: 5 }).map((_, idx) => {
              const y = today.getFullYear() - 2 + idx
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              )
            })}
          </select>
          <button
            type="button"
            className="rounded-full border border-surface-300 px-2 py-1 text-xs hover:bg-surface-50"
            aria-label="Next month"
            onClick={() => {
              setYear((y) => (month === 11 ? y + 1 : y))
              setMonth((m) => (m === 11 ? 0 : m + 1))
            }}
          >
            ›
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white">
        <table className="min-w-full text-center text-sm">
          <thead className="bg-surface-50 text-xs font-semibold uppercase text-surface-500">
            <tr>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <th key={d} className="px-3 py-2">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, i) => (
              <tr key={i} className="border-t border-surface-100">
                {week.map((day, j) => {
                  const info = isLeaveDay(day)
                  let bg = ''
                  let text = 'text-surface-700'
                  if (info) {
                    if (info.rejected > 0) {
                      bg = 'bg-red-100'
                      text = 'text-red-700'
                    } else if (info.pending > 0) {
                      bg = 'bg-amber-100'
                      text = 'text-amber-700'
                    } else if (info.approved > 0) {
                      bg = 'bg-emerald-100'
                      text = 'text-emerald-700'
                    }
                  }
                  const iso =
                    day != null ? new Date(year, month, day).toISOString().split('T')[0] : null
                  const isSelected = iso && iso === selectedIso

                  return (
                    <td key={j} className="px-2 py-3">
                      {day ? (
                        <button
                          type="button"
                          onClick={() => setSelectedIso(iso!)}
                          className={cn(
                            'mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs',
                            bg,
                            text,
                            isSelected && 'ring-2 ring-offset-2 ring-primary-500'
                          )}
                        >
                          {day}
                        </button>
                      ) : (
                        <span className="text-surface-200">·</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-surface-500">
        <div className="flex items-center gap-1">
          <span className="inline-flex h-3 w-3 rounded-full bg-emerald-400" />
          <span>Approved</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-flex h-3 w-3 rounded-full bg-amber-400" />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-flex h-3 w-3 rounded-full bg-red-400" />
          <span>Rejected</span>
        </div>
      </div>
      {selectedIso && dayStatusMap.get(selectedIso) && (
        <div className="mt-4 rounded-lg border border-surface-200 bg-surface-50 p-3 text-xs">
          <p className="mb-2 font-medium text-surface-700">
            Leave details for {selectedIso}
          </p>
          <div className="space-y-1">
            {dayStatusMap.get(selectedIso)!.details.map((leave, idx) => (
              <div key={idx} className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-surface-800">{leave.type || 'Leave'}</p>
                  {leave.reason && (
                    <p className="text-[11px] text-surface-500 line-clamp-2">{leave.reason}</p>
                  )}
                  {leave.hrComment && (
                    <p className="text-[11px] text-red-600 line-clamp-2">
                      HR remark: {leave.hrComment}
                    </p>
                  )}
                </div>
                <span
                  className={cn(
                    'mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                    leave.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-700'
                      : leave.status === 'Pending'
                      ? 'bg-amber-100 text-amber-700'
                      : leave.status === 'Rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-surface-200 text-surface-700'
                  )}
                >
                  {leave.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ChevronRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m9 18 6-6-6-6"/>
        </svg>
    )
}
