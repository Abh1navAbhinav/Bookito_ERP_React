import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function DashboardLayout() {
  const location = useLocation()

  // Scroll to top on route change without blocking rendering
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className="flex min-h-screen bg-surface-50">
      <Sidebar />
      {/* 
          We keep the margin constant at 68px (the width of the collapsed sidebar) 
          to prevent the entire dashboard from jumping/resizing when the sidebar expands on hover.
      */}
      <div className="flex flex-1 flex-col ml-[68px]">
        <Topbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
