import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button, FormField, Input, Select } from '@/components/FormElements'

type DemoRole = 'manager' | 'sales' | 'accountant' | 'crm' | 'hr'

interface DemoUserAccount {
  id: string
  name: string
  email: string
  role: DemoRole
  status: 'active' | 'inactive'
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

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-surface-500">
            <span>{users.length} users</span>
          </div>
          <div className="overflow-hidden rounded-lg border border-surface-200">
            <table className="min-w-full divide-y divide-surface-200 text-sm">
              <thead className="bg-surface-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-surface-500">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-surface-500">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-surface-500">
                    Role
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-surface-500">
                    Status
                  </th>
                  {isHr && (
                    <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-surface-500">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 bg-white">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-2 text-surface-800">{user.name}</td>
                    <td className="px-4 py-2 text-xs text-surface-500">
                      {user.email}
                    </td>
                    <td className="px-4 py-2 text-xs capitalize text-surface-600">
                      {user.role}
                    </td>
                    <td className="px-4 py-2 text-xs">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          user.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-surface-100 text-surface-500'
                        }`}
                      >
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {isHr && (
                      <td className="px-4 py-2 text-right text-xs">
                        <button
                          className="text-red-500 hover:text-red-600"
                          onClick={() =>
                            saveUsers(users.filter((u) => u.id !== user.id))
                          }
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={isHr ? 5 : 4}
                      className="px-4 py-6 text-center text-xs text-surface-400"
                    >
                      No users created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

