import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Wallet,
  Users,
  CalendarDays,
  TrendingUp,
  CreditCard,
  FileBarChart,
  ChevronLeft,
  ChevronRight,
  Building,
  Shield,
  UserCircle,
  IdCard,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type DemoRole = 'manager' | 'sales' | 'accountant' | 'crm' | 'hr'

interface DemoUserInfo {
  role: DemoRole
  label: string
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Executive Deck', icon: UserCircle, path: '/executive-dashboard' },
  { label: 'Properties', icon: Building2, path: '/properties' },
  { label: 'Finance', icon: Wallet, path: '/finance' },
  { label: 'Travel Agents', icon: Users, path: '/travel-agents' },
  { label: 'Trade Fairs', icon: CalendarDays, path: '/trade-fairs' },
  { label: 'Sales', icon: TrendingUp, path: '/sales' },
  { label: 'Pricing Plan', icon: CreditCard, path: '/pricing-plan' },
  { label: 'Reports', icon: FileBarChart, path: '/reports' },
  { label: 'Feature List', icon: Shield, path: '/admin/features' },
  { label: 'HR – Users', icon: IdCard, path: '/hr/users' },
  { label: 'HR – Attendance', icon: CalendarDays, path: '/hr/attendance' },
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
        {navItems.map((item) => {
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
