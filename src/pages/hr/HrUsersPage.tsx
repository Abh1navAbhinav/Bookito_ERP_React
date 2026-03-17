import { useEffect, useState, useMemo } from 'react'
import { Users, Plus } from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button, FormField, Input, Select } from '@/components/FormElements'
import { DataTable } from '@/components/DataTable'
import { type ColumnDef } from '@tanstack/react-table'

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
    const diff = Date.now() - new Date(deletedAt).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return Math.max(0, 30 - days)
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
        setUsers(JSON.parse(rawUsers) as DemoUserAccount[])
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
      if (tab === 'active' && u.isDeleted) return false
      if (tab === 'deleted') {
        if (!u.isDeleted) return false
        if (getRemainingDays(u.deletedAt) === 0) return false
      }
      return true
    })
  }, [users, tab])

  const columns: ColumnDef<DemoUserAccount, any>[] = useMemo(() => {
    const cols: ColumnDef<DemoUserAccount, any>[] = [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <span className="text-surface-800">{row.original.name}</span>
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <span className="text-xs text-surface-500">{row.original.email}</span>
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => <span className="text-xs capitalize text-surface-600">{row.original.role}</span>
      },
      {
        accessorKey: 'status',
        header: tab === 'active' ? 'Status' : 'Auto-deletes in',
        cell: ({ row }) => {
          if (tab === 'deleted') {
            const days = getRemainingDays(row.original.deletedAt)
            return (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                {days} days
              </span>
            )
          }
          return (
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                row.original.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-surface-100 text-surface-500'
              }`}
            >
              {row.original.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          )
        }
      },
    ]

    if (isHr || tab === 'deleted') {
      cols.push({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="text-right flex justify-end gap-2">
            {tab === 'active' ? (
              <button
                className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-red-50 hover:text-red-500"
                title="Move to Trash"
                onClick={() => handleDelete(row.original.id)}
              >
                <Users className="h-4 w-4 rotate-45" /> 
              </button>
            ) : (
              <button
                className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-emerald-50 hover:text-emerald-500"
                title="Restore User"
                onClick={() => handleRestore(row.original.id)}
              >
                <Plus className="h-4 w-4 rotate-0" />
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
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">User Management</h1>
          <div className="mt-2">
            <Breadcrumb items={[{ label: 'HR' }, { label: 'Users & Roles' }]} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary-50 p-2 text-primary-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-surface-900">Accounts & Roles</h2>
            <p className="text-xs text-surface-500">
              HR can create demo accounts and assign roles. Other roles can only view this list.
            </p>
          </div>
        </div>

        {isHr && (
          <div className="mb-6 rounded-lg border border-surface-200 bg-surface-50 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-surface-500">
              Create user
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
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
                    { label: 'CRM', value: 'crm' },
                    { label: 'HR', value: 'hr' },
                  ]}
                  placeholder="Choose role"
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
                  placeholder="Status"
                />
              </FormField>
            </div>
            <div className="mt-3 flex justify-end">
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
                Create User
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex rounded-lg border border-surface-200 p-0.5 w-fit">
            <button
              onClick={() => setTab('active')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                tab === 'active'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              Active Users
            </button>
            <button
              onClick={() => setTab('deleted')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                tab === 'deleted'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <Users className="h-3.5 w-3.5 rotate-45" />
              Trash
            </button>
          </div>
          <DataTable
            data={filteredUsers}
            columns={columns}
            searchPlaceholder="Search users..."
          />
        </div>
      </div>
    </div>
  )
}

