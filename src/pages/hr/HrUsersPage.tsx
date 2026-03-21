import { useEffect, useState, useMemo, useCallback } from 'react'
import { Users, Plus, Trash2, RotateCcw } from 'lucide-react'
import { Button, FormField, Input, Select } from '@/components/FormElements'
import { DataTable } from '@/components/DataTable'
import { type ColumnDef } from '@tanstack/react-table'
import { differenceInDays, parseISO } from 'date-fns'
import {
  createUserAccount,
  fetchUserAccounts,
  restoreUserAccount,
  softDeleteUserAccount,
  type ApiUserAccount,
} from '@/lib/accountsApi'

type DemoRole = 'manager' | 'sales' | 'accountant' | 'crm' | 'hr' | 'employee'

interface DemoUserAccount {
  id: string
  name: string
  email: string
  role: DemoRole
  status: 'active' | 'inactive'
  isDeleted?: boolean
  deletedAt?: string
}

function mapUser(u: ApiUserAccount): DemoUserAccount {
  return {
    id: String(u.id),
    name: u.name,
    email: u.email,
    role: u.role as DemoRole,
    status: u.status,
    isDeleted: u.is_deleted,
    deletedAt: u.deleted_at ?? undefined,
  }
}

type NewAccountForm = Omit<DemoUserAccount, 'id'> & { password: string }

export default function HrUsersPage() {
  const [currentRole, setCurrentRole] = useState<DemoRole | null>(null)
  const [users, setUsers] = useState<DemoUserAccount[]>([])
  const [newUser, setNewUser] = useState<NewAccountForm>({
    name: '',
    email: '',
    role: 'sales',
    status: 'active',
    password: '',
  })
  const [createAccountError, setCreateAccountError] = useState<string | null>(null)
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
        if (parsed.role) setCurrentRole(parsed.role)
      }
    } catch {
      // ignore
    }
  }, [])

  const reload = useCallback(async () => {
    try {
      const list = await fetchUserAccounts(tab === 'deleted')
      setUsers(list.map(mapUser))
    } catch {
      setUsers([])
    }
  }, [tab])

  useEffect(() => {
    void reload()
  }, [reload])

  const isHr = currentRole === 'hr'

  const handleDelete = (id: string) => {
    void softDeleteUserAccount(id).then(() => reload())
  }

  const handleRestore = (id: string) => {
    void restoreUserAccount(id).then(() => reload())
  }

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-bold uppercase text-primary-600">
              {row.original.name[0]}
            </div>
            <span className="font-semibold text-surface-900">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <span className="text-xs text-surface-500">{row.original.email}</span>,
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => (
          <span className="rounded-lg bg-surface-100 px-2 py-1 text-xs font-medium capitalize text-surface-600">
            {row.original.role}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: tab === 'active' ? 'Status' : 'Auto-deletes in',
        cell: ({ row }) => {
          if (tab === 'deleted') {
            const days = getRemainingDays(row.original.deletedAt)
            return (
              <span className="flex w-fit items-center gap-1.5 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
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
              <div
                className={`h-1 w-1 rounded-full ${row.original.status === 'active' ? 'bg-emerald-500' : 'bg-surface-400'}`}
              />
              {row.original.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          )
        },
      },
    ]

    if (isHr || tab === 'deleted') {
      cols.push({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-end gap-2 text-right">
            {tab === 'active' ? (
              <button
                type="button"
                className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-red-50 hover:text-red-500"
                title="Move to Trash"
                onClick={() => handleDelete(row.original.id)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-md border border-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-600 shadow-sm transition-colors hover:bg-emerald-50"
                title="Restore User"
                onClick={() => handleRestore(row.original.id)}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restore
              </button>
            )}
          </div>
        ),
      })
    }
    return cols
  }, [tab, isHr])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Roles & Permissions</h1>
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
              Create accounts with a role and initial password. Users sign in on the login page with email and password.
            </p>
          </div>
        </div>

        {isHr && (
          <div className="mb-6 rounded-lg border border-surface-200 bg-surface-50 p-4">
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-surface-400">
              Create user account
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
              <FormField label="Name">
                <Input
                  value={newUser.name}
                  onChange={(e) => {
                    setCreateAccountError(null)
                    setNewUser((prev) => ({ ...prev, name: e.target.value }))
                  }}
                  placeholder="Employee name"
                />
              </FormField>
              <FormField label="Email">
                <Input
                  value={newUser.email}
                  onChange={(e) => {
                    setCreateAccountError(null)
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                  }}
                  placeholder="name@company.com"
                />
              </FormField>
              <FormField label="Role">
                <Select
                  value={newUser.role}
                  onChange={(value) => setNewUser((prev) => ({ ...prev, role: value as DemoRole }))}
                  options={[
                    { label: 'Manager (Admin)', value: 'manager' },
                    { label: 'Sales Executive', value: 'sales' },
                    { label: 'Accountant', value: 'accountant' },
                    { label: 'CRM Specialist', value: 'crm' },
                    { label: 'HR Admin', value: 'hr' },
                    { label: 'Employee (ESS)', value: 'employee' },
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
              <FormField label="Initial password">
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={newUser.password}
                  onChange={(e) => {
                    setCreateAccountError(null)
                    setNewUser((prev) => ({ ...prev, password: e.target.value }))
                  }}
                  placeholder="Min. 8 characters"
                  minLength={8}
                />
              </FormField>
            </div>
            {createAccountError && (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {createAccountError}
              </p>
            )}
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setCreateAccountError(null)
                  const name = newUser.name.trim()
                  const email = newUser.email.trim()
                  const pwd = newUser.password
                  if (!name) {
                    setCreateAccountError('Please enter a name.')
                    return
                  }
                  if (!email) {
                    setCreateAccountError('Please enter an email.')
                    return
                  }
                  if (pwd.length < 8) {
                    setCreateAccountError('Password must be at least 8 characters (API requirement).')
                    return
                  }
                  void createUserAccount({
                    name,
                    email,
                    role: newUser.role,
                    status: newUser.status,
                    password: pwd,
                  })
                    .then(() => {
                      setNewUser({
                        name: '',
                        email: '',
                        role: 'sales',
                        status: 'active',
                        password: '',
                      })
                      reload()
                    })
                    .catch((err) => {
                      alert(err instanceof Error ? err.message : 'Failed to create user')
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
            type="button"
            onClick={() => setTab('active')}
            className={`border-b-2 px-4 py-4 text-sm font-medium transition-colors ${
              tab === 'active'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-surface-500 hover:text-surface-700'
            }`}
          >
            Active Accounts
          </button>
          <button
            type="button"
            onClick={() => setTab('deleted')}
            className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-colors ${
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
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
            <p className="text-sm italic text-surface-500">
              Accounts in trash are retained on the server until restored.
            </p>
          </div>
        )}

        <DataTable data={filteredUsers} columns={columns} searchPlaceholder="Search accounts..." />
      </div>
    </div>
  )
}
