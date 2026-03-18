import { useState, useMemo, useEffect } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { Users, Plus, RotateCcw, Trash2, Eye, Edit } from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { Breadcrumb, type BreadcrumbItem } from '@/components/Breadcrumb'
import { FolderNavigator } from '@/components/FolderNavigator'
import { StatusBadge, getStatusVariant } from '@/components/StatusBadge'
import { Button, Modal, FormField, Input, Select } from '@/components/FormElements'
import { locationHierarchy, travelAgents, type TravelAgent } from '@/data/mockData'

type DemoRole = 'manager' | 'sales' | 'accountant' | 'crm'

export default function TravelAgentsPage() {
  const [localAgents, setLocalAgents] = useState<TravelAgent[]>(travelAgents)
  const [path, setPath] = useState<string[]>([])
  const [pathLabels, setPathLabels] = useState<string[]>([])
  const [tab, setTab] = useState<'active' | 'deleted'>('active')
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentRole, setCurrentRole] = useState<DemoRole | null>(null)

  useEffect(() => {
    try {
      const rawUser = window.localStorage.getItem('bookito_demo_user')
      if (rawUser) {
        const parsed = JSON.parse(rawUser) as { role?: DemoRole }
        if (parsed.role) {
          setCurrentRole(parsed.role)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  const canEditOrCreate = currentRole === 'sales' || currentRole === 'crm'

  const isLeafLevel = path.length >= 2

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: 'Travel Agents',
      ...(path.length > 0
        ? { onClick: () => { setPath([]); setPathLabels([]) } }
        : {}),
    },
    ...pathLabels.map((label, i) => ({
      label,
      ...(i < pathLabels.length - 1
        ? {
            onClick: () => {
              setPath(path.slice(0, i + 1))
              setPathLabels(pathLabels.slice(0, i + 1))
            },
          }
        : {}),
    })),
  ]

  const handleNavigate = (newPath: string[], node?: any) => {
    setPath(newPath)
    if (node) setPathLabels([...pathLabels, node.name])
  }

  const getRemainingDays = (deletedAt?: string) => {
    if (!deletedAt) return 30
    const diff = Date.now() - new Date(deletedAt).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return Math.max(0, 30 - days)
  }

  const handleDelete = (id: string) => {
    setLocalAgents(prev => prev.map(a => 
      a.id === id ? { ...a, isDeleted: true, deletedAt: new Date().toISOString() } : a
    ))
  }

  const handleRestore = (id: string) => {
    setLocalAgents(prev => prev.map(a => 
      a.id === id ? { ...a, isDeleted: false, deletedAt: undefined } : a
    ))
  }

  const filteredAgents = useMemo(() => {
    return localAgents.filter(a => {
      // Tab filter
      if (tab === 'active' && a.isDeleted) return false
      if (tab === 'deleted') {
        if (!a.isDeleted) return false
        if (getRemainingDays(a.deletedAt) === 0) return false
      }

      if (!isLeafLevel) return true
      const [stateId, districtId] = path
      const state = locationHierarchy.find((s) => s.id === stateId)
      const district = state?.children?.find((d) => d.id === districtId)
      
      return a.state === state?.name && a.district === district?.name
    })
  }, [isLeafLevel, path, localAgents, tab])

  const columns: ColumnDef<TravelAgent, any>[] = useMemo(
    () => [
      {
        accessorKey: 'agentName',
        header: 'Agent Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
              {row.original.agentName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="font-medium text-surface-900">{row.original.agentName}</span>
              {row.original.trialStatus && (
                <StatusBadge label="Trial" variant="warning" className="ml-2" />
              )}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'contactNumber',
        header: 'Contact',
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <span className="text-surface-500">{row.original.email}</span>
        ),
      },
      {
        accessorKey: 'contractType',
        header: 'Contract',
        cell: ({ row }) => {
          return (
            <StatusBadge
              label={row.original.contractType}
              variant={getStatusVariant(row.original.contractType)}
              dot
            />
          )
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600">
              <Eye className="h-4 w-4" />
            </button>
            {canEditOrCreate && (
              <>
                <button className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600">
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(row.original.id)}
                  className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Delete Agent"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        )
      }
    ],
    [canEditOrCreate]
  )

  const deletedColumns: ColumnDef<TravelAgent, any>[] = useMemo(
    () => [
      {
        accessorKey: 'agentName',
        header: 'Agent Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
              {row.original.agentName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="font-medium text-surface-900">{row.original.agentName}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'contactNumber',
        header: 'Contact',
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <span className="text-surface-500">{row.original.email}</span>
        ),
      },
      {
        accessorKey: 'deletedAt',
        header: 'Auto-deletes in',
        cell: ({ row }) => {
          const days = getRemainingDays(row.original.deletedAt)
          return (
            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
              {days} days
            </span>
          )
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600">
              <Eye className="h-4 w-4" />
            </button>
            {canEditOrCreate && (
              <button 
                onClick={() => handleRestore(row.original.id)}
                className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                title="Restore Agent"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        )
      }
    ],
    [canEditOrCreate]
  )

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Travel Agents</h1>
        </div>
        <div className="flex flex-1 items-center justify-end gap-3 md:flex-none">
          {isLeafLevel && canEditOrCreate && (
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4" />
              Add Agent
            </Button>
          )}
        </div>
      </div>

      {!isLeafLevel ? (
        <FolderNavigator
          hierarchy={locationHierarchy}
          path={path}
          onNavigate={handleNavigate}
        />
      ) : (
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
              Active
            </button>
            <button
              onClick={() => setTab('deleted')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                tab === 'deleted'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Trash
            </button>
          </div>
          {tab === 'active' ? (
            <div className="space-y-3">
              <p className="text-xs font-medium text-surface-500">
                {filteredAgents.length}{' '}
                {filteredAgents.length === 1 ? 'agent' : 'agents'}
              </p>
              <DataTable
                data={filteredAgents}
                columns={columns}
                searchPlaceholder="Search agents..."
              />
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-medium text-surface-500">
                {filteredAgents.length}{' '}
                {filteredAgents.length === 1 ? 'deleted agent' : 'deleted agents'}
              </p>
              <DataTable
                data={filteredAgents}
                columns={deletedColumns}
                searchPlaceholder="Search deleted agents..."
              />
            </div>
          )}
        </div>
      )}

      {/* If nothing in leaf, show all agents */}
      {isLeafLevel && filteredAgents.length === 0 && (
        <div className="rounded-xl border border-surface-200 bg-white p-8 text-center">
          <Users className="mx-auto h-12 w-12 text-surface-300" />
          <p className="mt-3 text-sm text-surface-500">No travel agents found in this location.</p>
          {canEditOrCreate && (
            <Button className="mt-4" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4" /> Add First Agent
            </Button>
          )}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Travel Agent"
        size="md"
      >
        <div className="space-y-4">
          <FormField label="Agent Name">
            <Input placeholder="Enter agency name" />
          </FormField>
          <FormField label="Contact Number">
            <Input placeholder="+91 XXXXX XXXXX" />
          </FormField>
          <FormField label="Email">
            <Input type="email" placeholder="agent@email.com" />
          </FormField>
          <FormField label="Contract Type">
            <Select
              options={[
                { label: 'Platinum', value: 'Platinum' },
                { label: 'Gold', value: 'Gold' },
                { label: 'Silver', value: 'Silver' },
                { label: 'Bronze', value: 'Bronze' },
              ]}
              placeholder="Select contract"
            />
          </FormField>
          <FormField label="Plan Start Date">
            <Input type="date" />
          </FormField>
          <FormField label="Plan End Date">
            <Input type="date" />
          </FormField>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button onClick={() => setShowAddModal(false)}>Save Agent</Button>
        </div>
      </Modal>
    </div>
  )
}
