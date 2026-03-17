import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Lock, Shield, CreditCard, Clock, CheckCircle2 } from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button, FormField, Input } from '@/components/FormElements'

export default function EmployeeSelfServicePage() {
  const [currentUser, setCurrentUser] = useState<any>(null)

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

  const stats = [
    { label: 'Available Leaves', value: '12 Days', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Attendance (MTD)', value: '98%', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Reviews', value: '1', icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Next Hike', value: 'July 26', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">My Profile</h1>
          <div className="mt-2">
            <Breadcrumb items={[{ label: 'ESS' }, { label: 'My Dashboard' }]} />
          </div>
        </div>
        <Button className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Change Password
        </Button>
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
                    <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-surface-50 text-sm font-medium text-surface-700 transition-colors border border-surface-100">
                        View Payslips
                        <ChevronRight className="h-4 w-4 text-surface-300" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-surface-50 text-sm font-medium text-surface-700 transition-colors border border-surface-100">
                        Apply for Leave
                        <ChevronRight className="h-4 w-4 text-surface-300" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-surface-50 text-sm font-medium text-surface-700 transition-colors border border-surface-100">
                        Tax Declarations
                        <ChevronRight className="h-4 w-4 text-surface-300" />
                    </button>
                </div>
            </div>
        </div>

        {/* Info Tabs */}
        <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
