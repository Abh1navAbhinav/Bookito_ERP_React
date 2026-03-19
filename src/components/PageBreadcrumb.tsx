import { useLocation } from 'react-router-dom'
import { Breadcrumb } from './Breadcrumb'

/**
 * Route-to-breadcrumb config.
 * Pages that manage their OWN dynamic breadcrumbs (Properties, Sales, Travel Agents, etc.)
 * are excluded from this map — they still render their own <Breadcrumb> inline.
 */
const routeBreadcrumbs: Record<string, { label: string; href?: string }[]> = {
  '/': [{ label: 'Dashboard' }],
  '/executive-dashboard': [{ label: 'Executive Dashboard' }],
  '/finance': [{ label: 'Finance' }],
  '/pricing-plan': [{ label: 'Pricing Plan' }],
  '/admin/features': [{ label: 'PMS' }, { label: 'Feature List' }],
  '/hr/dashboard': [{ label: 'People Ops' }, { label: 'Dashboard' }],
  '/hr/employees': [{ label: 'People Ops' }, { label: 'Employee Management' }],
  '/hr/attendance-v2': [{ label: 'People Ops' }, { label: 'Attendance' }],
  '/hr/leaves': [{ label: 'People Ops' }, { label: 'Leave Requests' }],
  '/hr/payroll': [{ label: 'People Ops' }, { label: 'Payroll' }],
  '/hr/recruitment': [{ label: 'People Ops' }, { label: 'Job Postings' }],
  '/hr/performance': [{ label: 'People Ops' }, { label: 'Performance Reviews' }],
  '/hr/training': [{ label: 'People Ops' }, { label: 'Programs' }],
  '/hr/exit': [{ label: 'People Ops' }, { label: 'Exit Workflow' }],
  '/hr/ess': [{ label: 'ESS' }, { label: 'My Dashboard' }],
  '/hr/reports': [{ label: 'HR' }, { label: 'Reports' }],
  '/hr/users': [{ label: 'People Ops' }, { label: 'Users & Roles' }],
  '/hr/attendance': [{ label: 'HR' }, { label: 'Attendance' }],
}

/**
 * Pages that handle their own breadcrumbs dynamically
 * (due to folder navigation, route params, etc.)
 * We skip rendering the global breadcrumb for these.
 */
const dynamicBreadcrumbRoutes = [
  '/properties',
  '/sales',
  '/travel-agents',
  '/trade-fairs',
  '/reports',
  '/admin/features/',   // detail pages like /admin/features/:id
]

function shouldSkip(pathname: string): boolean {
  return dynamicBreadcrumbRoutes.some((route) => {
    if (route.endsWith('/')) {
      // prefix match for param routes
      return pathname.startsWith(route) && pathname !== route.slice(0, -1)
    }
    return pathname === route
  })
}

export function PageBreadcrumb() {
  const { pathname } = useLocation()

  // Skip routes that manage their own breadcrumbs
  if (shouldSkip(pathname)) return null

  let items = routeBreadcrumbs[pathname]
  if (!items) return null

  // Role-based overrides for breadcrumbs
  try {
    const rawUser = window.localStorage.getItem('bookito_demo_user')
    if (rawUser) {
      const user = JSON.parse(rawUser)
      if (user.role === 'manager' && pathname === '/hr/attendance') {
        items = [{ label: 'Manager' }, { label: 'Attendance' }]
      }
    }
  } catch (e) { /* ignore */ }

  return (
    <div className="mb-4">
      <Breadcrumb items={items} />
    </div>
  )
}
