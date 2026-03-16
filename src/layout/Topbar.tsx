import { useState, useRef, useEffect } from 'react'
import { Search, Bell, LogOut, User, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { notifications as mockNotifications } from '@/data/mockData'

export function Topbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const unreadCount = mockNotifications.filter((n) => !n.read).length

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

  const typeColors = {
    info: 'bg-blue-500',
    warning: 'bg-amber-500',
    success: 'bg-accent-500',
    error: 'bg-red-500',
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-200 bg-white/80 px-6 backdrop-blur-md">
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
                {mockNotifications.map((notif) => (
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
              AD
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-semibold text-surface-800">Admin</p>
              <p className="text-[10px] text-surface-400">admin@bookito.in</p>
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
              <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50">
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
