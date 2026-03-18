import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Wallet,
  Users,
  CalendarDays,
  CreditCard,
  FileBarChart,
  ChevronLeft,
  ChevronRight,
  Building,
  Shield,
  UserCircle,
  IdCard,
  DollarSign,
  Briefcase,
  Star,
  GraduationCap,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type DemoRole = 'manager' | 'sales' | 'accountant' | 'crm' | 'hr'

interface DemoUserInfo {
  role: DemoRole
  label: string
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['manager', 'sales', 'accountant', 'crm'] },
  { label: 'Executive Deck', icon: UserCircle, path: '/executive-dashboard', roles: ['manager'] },
  { label: 'Properties', icon: Building2, path: '/properties', roles: ['manager', 'sales', 'crm'] },
  { label: 'Finance', icon: Wallet, path: '/finance', roles: ['manager', 'accountant'] },
  { label: 'Travel Agents', icon: Users, path: '/travel-agents', roles: ['manager', 'sales', 'crm'] },
  { label: 'Trade Fairs', icon: CalendarDays, path: '/trade-fairs', roles: ['manager', 'sales'] },
  { label: 'Pricing Plan', icon: CreditCard, path: '/pricing-plan', roles: ['manager'] },
  { label: 'Reports', icon: FileBarChart, path: '/reports', roles: ['manager', 'accountant'] },
  { label: 'Feature List', icon: Shield, path: '/admin/features', roles: ['manager'] },
  
  // HR Specific Modules (Visible to HR login only)
  { label: 'Dashboard', icon: LayoutDashboard, path: '/hr/dashboard', roles: ['hr'] },
  { label: 'Employees', icon: Users, path: '/hr/employees', roles: ['hr'] },
  { label: 'Attendance', icon: CalendarDays, path: '/hr/attendance-v2', roles: ['hr'] },
  { label: 'Leaves', icon: IdCard, path: '/hr/leaves', roles: ['hr'] },
  { label: 'Payroll', icon: DollarSign, path: '/hr/payroll', roles: ['hr'] },
  { label: 'Recruitment', icon: Briefcase, path: '/hr/recruitment', roles: ['hr'] },
  { label: 'Performance', icon: Star, path: '/hr/performance', roles: ['hr'] },
  { label: 'Training', icon: GraduationCap, path: '/hr/training', roles: ['hr'] },
  { label: 'Exit Management', icon: LogOut, path: '/hr/exit', roles: ['hr'] },
  { label: 'Roles & Permissions', icon: Shield, path: '/hr/users', roles: ['hr'] },
  { label: 'Reports', icon: FileBarChart, path: '/hr/reports', roles: ['hr'] },
  
  // ESS (Visible to everyone)
  { label: 'My Profile', icon: UserCircle, path: '/hr/ess' },
]

export function Sidebar() {
  const location = useLocation()
  const [isHovered, setIsHovered] = useState(false)
  const [currentUser, setCurrentUser] = useState<DemoUserInfo | null>(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('bookito_demo_user')
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<DemoUserInfo>
        if (parsed.role && parsed.label) {
          setCurrentUser(parsed as DemoUserInfo)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  const initials =
    currentUser?.label
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AD'

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-surface-200 bg-white shadow-xl transition-all duration-300 ease-in-out',
        isHovered ? 'w-[240px]' : 'w-[68px]'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center overflow-hidden border-b border-surface-200 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 shadow-md">
            <Building className="h-5 w-5 text-white" />
          </div>
          <div className={cn(
            'flex flex-col transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}>
            <span className="whitespace-nowrap text-base font-bold tracking-tight text-surface-900">
              Bookito
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-primary-500">
              ERP
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-x-hidden overflow-y-auto p-3">
        {navItems
          .filter(item => !item.roles || (currentUser?.role && item.roles.includes(currentUser.role)))
          .map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path)

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                )}
              >
                <item.icon
                  className={cn(
                    'h-[20px] w-[20px] shrink-0 transition-colors',
                    isActive ? 'text-primary-600' : 'text-surface-400 group-hover:text-surface-600'
                  )}
                />
                <span className={cn(
                  'whitespace-nowrap transition-all duration-300',
                  isHovered ? 'translate-x-0 opacity-100' : '-translate-x-4 pointer-events-none opacity-0'
                )}>
                  {item.label}
                </span>
              </NavLink>
            )
          })}
      </nav>

      {/* Optional: Footer info or just padding */}
      <div className="border-t border-surface-200 p-4">
        <div className={cn(
          'flex items-center gap-3 transition-opacity duration-300',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}>
           <div className="h-8 w-8 rounded-full bg-surface-100 flex items-center justify-center text-xs font-bold text-surface-600 uppercase">
             {initials}
           </div>
           <div className="flex flex-col">
             <span className="text-xs font-bold text-surface-900">
               {currentUser?.label || 'Admin'}
             </span>
             <span className="text-[10px] text-surface-500">
               {currentUser?.role === 'manager'
                 ? 'Administrator'
                 : currentUser?.role === 'sales'
                   ? 'Sales Executive'
                   : currentUser?.role === 'accountant'
                     ? 'Accountant'
                     : currentUser?.role === 'crm'
                       ? 'CRM'
                       : currentUser?.role === 'hr'
                         ? 'HR'
                         : 'Administrator'}
             </span>
           </div>
        </div>
      </div>
    </aside>
  )
}
