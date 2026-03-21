import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'

export function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  // Require auth: redirect to login if no access token
  useEffect(() => {
    const token = window.localStorage.getItem('bookito_access_token')
    if (!token && location.pathname !== '/login') {
      navigate('/login', { replace: true, state: { from: location.pathname } })
    }
  }, [location.pathname, navigate])

  // Employee (ESS) demo: only self-service area
  useEffect(() => {
    const token = window.localStorage.getItem('bookito_access_token')
    if (!token) return
    try {
      const raw = window.localStorage.getItem('bookito_demo_user')
      if (!raw) return
      const u = JSON.parse(raw) as { role?: string }
      if (u.role === 'employee' && !location.pathname.startsWith('/hr/ess')) {
        navigate('/hr/ess', { replace: true })
      }
    } catch {
      // ignore
    }
  }, [location.pathname, navigate])

  // Scroll to top on route change without blocking rendering
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className="flex min-h-screen bg-surface-50 overflow-x-hidden">
      <Sidebar />
      {/* 
          We keep the margin constant at 68px (the width of the collapsed sidebar) 
          to prevent the entire dashboard from jumping/resizing when the sidebar expands on hover.
      */}
      <div className="flex flex-1 flex-col ml-[68px] overflow-x-hidden">
        <Topbar />
        <main className="flex-1 p-6 overflow-x-hidden">
          <PageBreadcrumb />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
