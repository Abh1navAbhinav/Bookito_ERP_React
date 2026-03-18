import { useMemo, useState, useEffect } from 'react'
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  UserPlus,
  TrendingUp,
  BarChart3,
  Calendar
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']

export default function HrDashboard() {
  const [data, setData] = useState({
    employees: [],
    leaves: [],
    attendance: []
  })

  useEffect(() => {
    const employees = JSON.parse(localStorage.getItem('bookito_employees') || '[]')
    const leaves = JSON.parse(localStorage.getItem('bookito_leaves') || '[]')
    const attendance = JSON.parse(localStorage.getItem('bookito_attendance') || '[]')
    setData({ employees, leaves, attendance })
  }, [])

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return [
      { label: 'Total Employees', value: data.employees.length.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Present Today', value: data.attendance.filter((a: any) => a.date === today && (a.status === 'Present' || a.status === 'Late')).length.toString(), icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'On Leave', value: data.leaves.filter((l: any) => l.status === 'Approved').length.toString(), icon: UserMinus, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'New Joinees', value: data.employees.filter((e: any) => e.dateOfJoining.startsWith('2024-03')).length.toString(), icon: UserPlus, color: 'text-purple-600', bg: 'bg-purple-50' },
    ]
  }, [data])

  const departmentData = useMemo(() => {
    const depts = data.employees.reduce((acc: any, curr: any) => {
        acc[curr.department] = (acc[curr.department] || 0) + 1
        return acc
    }, {})
    
    const chartData = Object.keys(depts).map(name => ({ name, value: depts[name] }))
    return chartData.length > 0 ? chartData : [
        { name: 'Sales', value: 15 },
        { name: 'Engineering', value: 12 },
        { name: 'HR', value: 4 },
        { name: 'Finance', value: 6 },
        { name: 'Marketing', value: 8 },
    ]
  }, [data])

  const attendanceChartData = [
    { name: 'Mon', present: 40, absent: 5 },
    { name: 'Tue', present: 38, absent: 7 },
    { name: 'Wed', present: 42, absent: 3 },
    { name: 'Thu', present: 35, absent: 10 },
    { name: 'Fri', present: 39, absent: 6 },
    { name: 'Sat', present: 20, absent: 2 },
  ]

  const recentActivities = [
    { id: 1, type: 'hire', user: 'John Doe', role: 'Sales Executive', time: '2 hours ago' },
    { id: 2, type: 'leave', user: 'Jane Smith', role: 'Accountant', time: '4 hours ago', status: 'Pending' },
    { id: 3, type: 'attendance', user: 'Mike Johnson', role: 'Manager', time: '5 hours ago', action: 'Late Check-in' },
    { id: 4, type: 'hire', user: 'Sarah Wilson', role: 'CRM Specialist', time: '1 day ago' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-sm font-medium text-surface-600 shadow-sm">
            <Calendar className="h-4 w-4" />
            <span>March 2026</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg ${stat.bg} p-2 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                +12%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-surface-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-surface-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Attendance Trend */}
        <div className="lg:col-span-2 rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary-600" />
              <h2 className="font-semibold text-surface-900">Attendance Trends</h2>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                  }} 
                />
                <Bar dataKey="present" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="absent" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary-600" />
            <h2 className="font-semibold text-surface-900">Department-wise</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {departmentData.map((dept, index) => (
              <div key={dept.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-surface-600 text-xs truncate max-w-[100px]">{dept.name}</span>
                </div>
                <span className="font-semibold text-surface-900">{dept.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
         {/* Recent Activities */}
         <div className="lg:col-span-2 rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 font-semibold text-surface-900">Recent Activities</h2>
          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  activity.type === 'hire' ? 'bg-emerald-500' : 
                  activity.type === 'leave' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-surface-900">
                    <span className="font-semibold">{activity.user}</span>
                    {activity.type === 'hire' ? ' joined as ' : 
                     activity.type === 'leave' ? ' applied for leave as ' : 
                     activity.type === 'attendance' ? ` ${activity.action} - ` : ''}
                    <span className="text-surface-600">{activity.role}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-surface-500">{activity.time}</p>
                </div>
                {activity.status && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">
                    {activity.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-surface-900">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-2">
            <button className="flex items-center gap-3 rounded-lg border border-surface-200 px-4 py-2.5 text-left text-sm font-medium text-surface-600 transition-colors hover:bg-surface-50">
              <UserPlus className="h-4 w-4 text-emerald-600" />
              Add New Employee
            </button>
            <button className="flex items-center gap-3 rounded-lg border border-surface-200 px-4 py-2.5 text-left text-sm font-medium text-surface-600 transition-colors hover:bg-surface-50">
              <Calendar className="h-4 w-4 text-primary-600" />
              Schedule Interview
            </button>
            <button className="flex items-center gap-3 rounded-lg border border-surface-200 px-4 py-2.5 text-left text-sm font-medium text-surface-600 transition-colors hover:bg-surface-50">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              Run Payroll
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
