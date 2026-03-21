import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, LogOut, User, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SelfieCaptureModal } from '@/components/modals/SelfieCaptureModal'
import { fetchNotifications } from '@/lib/notificationsApi'

function formatNotificationTime(createdAt: string): string {
  try {
    const d = new Date(createdAt)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString()
  } catch {
    return ''
  }
}

type DemoRole = 'manager' | 'admin' | 'sales' | 'accountant' | 'crm' | 'hr' | 'employee'

interface DemoUserInfo {
  role: DemoRole
  label: string
}

export function Topbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [currentUser, setCurrentUser] = useState<DemoUserInfo | null>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<{ id: string; read: boolean; title: string; message: string; time: string; type: string }[]>([])

  useEffect(() => {
    fetchNotifications()
      .then((list) =>
        setNotifications(
          list.map((n) => ({
            id: n.id,
            read: n.read,
            title: n.title,
            message: n.message,
            time: formatNotificationTime(n.created_at),
            type: n.notification_type || 'info',
          }))
        )
      )
      .catch(() => setNotifications([]))
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const typeColors: Record<string, string> = {
    info: 'bg-blue-500',
    warning: 'bg-amber-500',
    success: 'bg-accent-500',
    error: 'bg-red-500',
  }

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

  const handleLogoutClick = () => {
    void performLogout()
  }

  const apiBase =
    (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:8000'

  const performLogout = async () => {
    const accessToken = window.localStorage.getItem('bookito_access_token')

    // Fire-and-forget logout call; frontend mainly clears tokens.
    if (accessToken) {
      void fetch(`${apiBase}/api/accounts/logout/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).catch(() => {
        // Ignore network errors on logout
      })
    }

    window.localStorage.removeItem('bookito_access_token')
    window.localStorage.removeItem('bookito_refresh_token')
    window.localStorage.removeItem('bookito_demo_user')

    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-surface-200 bg-white/80 px-8 backdrop-blur-md sm:px-10 lg:px-12">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search properties, agents, contacts..."
          className="w-full rounded-lg border border-surface-200 bg-surface-50 py-2 pl-10 pr-4 text-sm text-surface-900 transition-all placeholder:text-surface-400 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowProfile(false)
            }}
            className="relative rounded-lg p-2 text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-700"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-surface-200 bg-white shadow-lg">
              <div className="border-b border-surface-200 px-4 py-3">
                <h3 className="text-sm font-semibold text-surface-900">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      'flex gap-3 border-b border-surface-100 px-4 py-3 transition-colors hover:bg-surface-50',
                      !notif.read && 'bg-primary-50/40'
                    )}
                  >
                    <div className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', typeColors[notif.type])} />
                    <div>
                      <p className="text-xs font-semibold text-surface-800">{notif.title}</p>
                      <p className="mt-0.5 text-xs text-surface-500">{notif.message}</p>
                      <p className="mt-1 text-[10px] text-surface-400">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-surface-200 px-4 py-2.5 text-center">
                <button className="text-xs font-medium text-primary-600 hover:text-primary-700">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-surface-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-semibold text-surface-800">
                {currentUser?.label || 'Admin'}
              </p>
              <p className="text-[10px] text-surface-400">
                {currentUser?.role === 'manager' || currentUser?.role === 'admin'
                  ? 'Administrator'
                  : currentUser?.role === 'sales'
                    ? 'Sales Executive'
                    : currentUser?.role === 'accountant'
                      ? 'Accountant'
                      : currentUser?.role === 'crm'
                        ? 'CRM'
                        : currentUser?.role === 'hr'
                          ? 'HR'
                          : currentUser?.role === 'employee'
                            ? 'Employee'
                            : 'User'}
              </p>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-surface-400 md:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-surface-200 bg-white py-1 shadow-lg">
              <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-surface-700 transition-colors hover:bg-surface-50">
                <User className="h-4 w-4" />
                My Profile
              </button>
              <div className="my-1 border-t border-surface-200" />
              <button
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                onClick={handleLogoutClick}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

    </header>
  )
}

