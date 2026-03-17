import { useNavigate } from 'react-router-dom'
import { UserCircle2, Briefcase, DollarSign, Headphones, IdCard } from 'lucide-react'
import { Button } from '@/components/FormElements'

type DemoRole = 'manager' | 'sales' | 'accountant' | 'crm' | 'hr'

interface DemoUser {
  id: DemoRole
  label: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  defaultRoute: string
}

const demoUsers: DemoUser[] = [
  {
    id: 'manager',
    label: 'Manager (Admin)',
    description: 'Full access to dashboards, properties and settings.',
    icon: UserCircle2,
    defaultRoute: '/',
  },
  {
    id: 'sales',
    label: 'Sales Executive',
    description: 'Focus on properties, visits and closings.',
    icon: Briefcase,
    defaultRoute: '/properties',
  },
  {
    id: 'accountant',
    label: 'Accountant',
    description: 'Access to finance, invoices and collections.',
    icon: DollarSign,
    defaultRoute: '/finance',
  },
  {
    id: 'crm',
    label: 'CRM (Customer Relations)',
    description: 'Track follow‑ups, comments and relationships.',
    icon: Headphones,
    defaultRoute: '/properties',
  },
  {
    id: 'hr',
    label: 'HR (People Ops)',
    description: 'Comprehensive People Operations dashboard for management and HR teams.',
    icon: IdCard,
    defaultRoute: '/hr/dashboard',
  },
]

export default function LoginPage() {
  const navigate = useNavigate()

  const handleLogin = (user: DemoUser) => {
    // For now we just stash the role; real auth can replace this later.
    window.localStorage.setItem(
      'bookito_demo_user',
      JSON.stringify({ role: user.id, label: user.label })
    )
    navigate(user.defaultRoute)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4">
      <div className="w-full max-w-4xl rounded-2xl border border-surface-200 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">
            Bookito ERP — Demo Login
          </h1>
          <p className="mt-2 text-sm text-surface-500">
            Choose a role to explore the app. These are demo logins; we&apos;ll connect real
            authentication and permissions later.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {demoUsers.map((user) => {
            const Icon = user.icon
            return (
              <button
                key={user.id}
                onClick={() => handleLogin(user)}
                className="group flex flex-col items-start gap-3 rounded-xl border border-surface-200 bg-surface-50 p-5 text-left transition-all hover:border-primary-300 hover:bg-primary-50 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-900 group-hover:text-primary-700">
                      {user.label}
                    </p>
                    <p className="text-xs text-surface-500">{user.description}</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-1"
                  type="button"
                >
                  Login as {user.label}
                </Button>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

