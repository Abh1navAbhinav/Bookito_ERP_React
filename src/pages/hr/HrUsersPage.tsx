import { useEffect, useState, useMemo } from 'react'
import { Users, Plus, Trash2, RotateCcw } from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button, FormField, Input, Select } from '@/components/FormElements'
import { DataTable } from '@/components/DataTable'
import { type ColumnDef } from '@tanstack/react-table'
import { differenceInDays, parseISO } from 'date-fns'

type DemoRole = 'manager' | 'sales' | 'accountant' | 'crm' | 'hr'

interface DemoUserAccount {
  id: string
  name: string
  email: string
  role: DemoRole
  status: 'active' | 'inactive'
  isDeleted?: boolean
  deletedAt?: string
}

export default function HrUsersPage() {
  const [currentRole, setCurrentRole] = useState<DemoRole | null>(null)
  const [users, setUsers] = useState<DemoUserAccount[]>([])
  const [newUser, setNewUser] = useState<Omit<DemoUserAccount, 'id'>>({
    name: '',
    email: '',
    role: 'sales',
    status: 'active',
  })
  const [tab, setTab] = useState<'active' | 'deleted'>('active')

  const getRemainingDays = (deletedAt?: string) => {
    if (!deletedAt) return 30
    const diff = differenceInDays(new Date(), parseISO(deletedAt))
    return Math.max(0, 30 - diff)
  }

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('bookito_demo_user')
      if (raw) {
        const parsed = JSON.parse(raw) as { role?: DemoRole }
        if (parsed.role) {
          setCurrentRole(parsed.role)
        }
      }
    } catch {
      // ignore
    }

    try {
      const rawUsers = window.localStorage.getItem('bookito_hr_users')
      if (rawUsers) {
        let parsed = JSON.parse(rawUsers) as DemoUserAccount[]
        // Purge logic
        const now = new Date()
        parsed = parsed.filter(u => !u.isDeleted || (u.deletedAt && differenceInDays(now, parseISO(u.deletedAt)) < 30))
        setUsers(parsed)
      }
    } catch {
      // ignore
    }
  }, [])

  const isHr = currentRole === 'hr'

  const saveUsers = (list: DemoUserAccount[]) => {
    setUsers(list)
    window.localStorage.setItem('bookito_hr_users', JSON.stringify(list))
  }

  const handleDelete = (id: string) => {
    saveUsers(users.map(u => 
      u.id === id ? { ...u, isDeleted: true, deletedAt: new Date().toISOString() } : u
    ))
  }

  const handleRestore = (id: string) => {
    saveUsers(users.map(u => 
      u.id === id ? { ...u, isDeleted: false, deletedAt: undefined } : u
    ))
  }

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (tab === 'active') return !u.isDeleted
      if (tab === 'deleted') return !!u.isDeleted
      return true
    })
  }, [users, tab])

  const columns: ColumnDef<DemoUserAccount, any>[] = useMemo(() => {
    const cols: ColumnDef<DemoUserAccount, any>[] = [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-xs uppercase">
                    {row.original.name[0]}
                </div>
                <span className="font-semibold text-surface-900">{row.original.name}</span>
            </div>
        )
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <span className="text-xs text-surface-500">{row.original.email}</span>
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => <span className="text-xs capitalize font-medium text-surface-600 px-2 py-1 bg-surface-100 rounded-lg">{row.original.role}</span>
      },
      {
        accessorKey: 'status',
        header: tab === 'active' ? 'Status' : 'Auto-deletes in',
        cell: ({ row }) => {
          if (tab === 'deleted') {
            const days = getRemainingDays(row.original.deletedAt)
            return (
              <span className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full w-fit">
                <div className="h-1 w-1 rounded-full bg-red-400" />
                {days} days
              </span>
            )
          }
          return (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                row.original.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-surface-100 text-surface-500'
              }`}
            >
              <div className={`h-1 w-1 rounded-full ${row.original.status === 'active' ? 'bg-emerald-500' : 'bg-surface-400'}`} />
              {row.original.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          )
        }
      },
    ]

    if (isHr || tab === 'deleted') {
      cols.push({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="text-right flex justify-end gap-2">
            {tab === 'active' ? (
              <button
                className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-red-50 hover:text-red-500"
                title="Move to Trash"
                onClick={() => handleDelete(row.original.id)}
              >
                <Trash2 className="h-4 w-4" /> 
              </button>
            ) : (
              <button
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition-colors border border-emerald-100 shadow-sm"
                title="Restore User"
                onClick={() => handleRestore(row.original.id)}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restore
              </button>
            )}
          </div>
        )
      })
    }
    return cols
  }, [tab, isHr, users])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Roles & Permissions</h1>
          <div className="mt-2">
            <Breadcrumb items={[{ label: 'People Ops' }, { label: 'Users & Roles' }]} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary-50 p-2 text-primary-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-surface-900">Account Management</h2>
            <p className="text-xs text-surface-500">
              Create and manage demo accounts for testing different role permissions.
            </p>
          </div>
        </div>

        {isHr && (
          <div className="mb-6 rounded-lg border border-surface-200 bg-surface-50 p-4">
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-surface-400">
              Create Demo User
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <FormField label="Name">
                <Input
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Employee name"
                />
              </FormField>
              <FormField label="Email">
                <Input
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="name@company.com"
                />
              </FormField>
              <FormField label="Role">
                <Select
                  value={newUser.role}
                  onChange={(value) =>
                    setNewUser((prev) => ({ ...prev, role: value as DemoRole }))
                  }
                  options={[
                    { label: 'Manager (Admin)', value: 'manager' },
                    { label: 'Sales Executive', value: 'sales' },
                    { label: 'Accountant', value: 'accountant' },
                    { label: 'CRM Specialist', value: 'crm' },
                    { label: 'HR Admin', value: 'hr' },
                  ]}
                />
              </FormField>
              <FormField label="Status">
                <Select
                  value={newUser.status}
                  onChange={(value) =>
                    setNewUser((prev) => ({
                      ...prev,
                      status: value as 'active' | 'inactive',
                    }))
                  }
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ]}
                />
              </FormField>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                size="sm"
                onClick={() => {
                  if (!newUser.name.trim() || !newUser.email.trim()) return
                  const created: DemoUserAccount = {
                    id: `${Date.now()}`,
                    ...newUser,
                  }
                  saveUsers([...users, created])
                  setNewUser({
                    name: '',
                    email: '',
                    role: 'sales',
                    status: 'active',
                  })
                }}
              >
                Add User Account
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex border-b border-surface-200 bg-white px-2">
            <button
              onClick={() => setTab('active')}
              className={`px-4 py-4 text-sm font-medium transition-colors border-b-2 ${
                tab === 'active'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-surface-500 hover:text-surface-700'
              }`}
            >
              Active Accounts
            </button>
            <button
              onClick={() => setTab('deleted')}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium transition-colors border-b-2 ${
                tab === 'deleted'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-surface-500 hover:text-surface-700'
              }`}
            >
              <Trash2 className="h-4 w-4" />
              Trash
            </button>
        </div>
        
        {tab === 'deleted' && (
            <div className="flex items-center gap-2 px-1">
                <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                <p className="text-sm text-surface-500 italic">
                    Accounts in trash are automatically deleted after 30 days.
                </p>
            </div>
        )}

        <DataTable
            data={filteredUsers}
            columns={columns}
            searchPlaceholder="Search accounts..."
        />
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
