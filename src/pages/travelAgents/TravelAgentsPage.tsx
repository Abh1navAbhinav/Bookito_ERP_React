import { useState, useMemo, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import { Users, Plus, RotateCcw, Trash2, Eye, Edit } from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { Breadcrumb, type BreadcrumbItem } from '@/components/Breadcrumb'
import { FolderNavigator } from '@/components/FolderNavigator'
import { StatusBadge, getStatusVariant } from '@/components/StatusBadge'
import { Button } from '@/components/FormElements'
import { AddAgentModal } from '@/components/modals/AddAgentModal'
import { fetchConfig, type LocationNode } from '@/lib/configApi'
import {
  fetchTravelAgents,
  fetchDeletedTravelAgents,
  createTravelAgent,
  updateTravelAgent,
  softDeleteTravelAgent,
  restoreTravelAgent,
  type TravelAgent,
} from '@/lib/partnersApi'

type DemoRole = 'manager' | 'sales' | 'accountant' | 'crm'

export default function TravelAgentsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [localAgents, setLocalAgents] = useState<TravelAgent[]>([])
  const [deletedAgents, setDeletedAgents] = useState<TravelAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [path, setPath] = useState<string[]>([])
  const [pathLabels, setPathLabels] = useState<string[]>([])
  const [tab, setTab] = useState<'active' | 'deleted'>('active')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAgent, setEditingAgent] = useState<TravelAgent | null>(null)
  const [currentRole, setCurrentRole] = useState<DemoRole | null>(null)
  const [config, setConfig] = useState<{ location_hierarchy: LocationNode[] } | null>(null)

  const locationHierarchy = config?.location_hierarchy ?? []

  useEffect(() => {
    fetchConfig().then(setConfig).catch(() => {})
  }, [])

  const emptyForm = {
    agentName: '',
    contactNumber: '',
    email: '',
    location: '',
    contractType: 'Bronze' as TravelAgent['contractType'],
    planStartDate: '',
    planEndDate: '',
  }
  const [createForm, setCreateForm] = useState(emptyForm)
  const [editForm, setEditForm] = useState(emptyForm)

  const loadAgents = useCallback(async () => {
    setError(null)
    try {
      const [active, deleted] = await Promise.all([
        fetchTravelAgents(),
        fetchDeletedTravelAgents(),
      ])
      setLocalAgents(active)
      setDeletedAgents(deleted)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load agents')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAgents()
  }, [loadAgents])

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

  useEffect(() => {
    const state = location.state as { path?: string[]; pathLabels?: string[] } | null
    if (state?.path && state.path.length > 0) {
      setPath(state.path)
      setPathLabels(state.pathLabels ?? [])
    }
  }, [location.state])

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

  const handleDelete = async (id: string) => {
    setError(null)
    try {
      await softDeleteTravelAgent(id)
      await loadAgents()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete agent')
    }
  }

  const handleRestore = async (id: string) => {
    setError(null)
    try {
      await restoreTravelAgent(id)
      await loadAgents()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to restore agent')
    }
  }

  const filteredAgents = useMemo(() => {
    const list = tab === 'active' ? localAgents : deletedAgents
    return list.filter(a => {
      if (tab === 'deleted' && getRemainingDays(a.deletedAt) === 0) return false
      if (!isLeafLevel) return true
      const [stateId, districtId] = path
      const state = locationHierarchy.find((s) => s.id === stateId)
      const district = state?.children?.find((d) => d.id === districtId)
      return a.state === state?.name && a.district === district?.name
    })
  }, [isLeafLevel, path, localAgents, deletedAgents, tab])

  const columns: ColumnDef<TravelAgent, any>[] = useMemo(
    () => [
      {
        accessorKey: 'slno',
        header: 'SL No',
        size: 70,
      },
      {
        accessorKey: 'agentName',
        header: 'Agent Name',
        cell: ({ row }: { row: { original: TravelAgent } }) => (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
              {row.original.agentName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
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
        accessorKey: 'location',
        header: 'Location',
        cell: ({ row }: { row: { original: TravelAgent } }) => (
          <span className="text-surface-500">{row.original.location || '—'}</span>
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
            <button
              onClick={() =>
                navigate(`/travel-agents/${row.original.id}`, {
                  state: { path, pathLabels },
                })
              }
              className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600"
            >
              <Eye className="h-4 w-4" />
            </button>
            {canEditOrCreate && (
              <>
                <button
                  onClick={() => {
                    const a = row.original
                    setEditingAgent(a)
                    setEditForm({
                      agentName: a.agentName ?? '',
                      contactNumber: a.contactNumber ?? '',
                      email: a.email ?? '',
                      location: a.location ?? '',
                      contractType: a.contractType ?? 'Bronze',
                      planStartDate: a.planStartDate ?? '',
                      planEndDate: a.planEndDate ?? '',
                    })
                    setShowEditModal(true)
                  }}
                  className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600"
                >
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
    [canEditOrCreate, navigate, path]
  )

  const deletedColumns: ColumnDef<TravelAgent, any>[] = useMemo(
    () => [
      {
        accessorKey: 'slno',
        header: 'SL No',
        size: 70,
      },
      {
        accessorKey: 'agentName',
        header: 'Agent Name',
        cell: ({ row }: { row: { original: TravelAgent } }) => (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
              {row.original.agentName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
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
            <button
              onClick={() =>
                navigate(`/travel-agents/${row.original.id}`, {
                  state: { path, pathLabels },
                })
              }
              className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600"
            >
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
    [canEditOrCreate, navigate, path]
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className="rounded-xl border border-surface-200 bg-surface-50 p-12 text-center text-surface-500">
          Loading travel agents…
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}
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
          propertyList={localAgents}
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

      {/* Add Modal (Reused) */}
      <AddAgentModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setCreateForm(emptyForm)
        }}
        onSave={async (data: any) => {
          if (!data.agentName.trim()) return
          setError(null)
          const [stateId, districtId] = path
          const state = locationHierarchy.find((s) => s.id === stateId)
          const district = state?.children?.find((d) => d.id === districtId)
          const stateName = state?.name ?? 'Kerala'
          const districtName = district?.name ?? 'Wayanad'
          const nextSlno = Math.max(0, ...localAgents.map((a) => a.slno ?? 0)) + 1
          try {
            await createTravelAgent({
              slno: nextSlno,
              agentName: data.agentName.trim(),
              email: data.email.trim(),
              contactNumber: data.contactNumber.trim(),
              location: data.location.trim(),
              contractType: data.contractType ?? 'Bronze',
              planStartDate: data.planStartDate || new Date().toISOString().slice(0, 10),
              planEndDate: data.planEndDate || new Date().toISOString().slice(0, 10),
              state: stateName,
              district: districtName,
            })
            setShowAddModal(false)
            setCreateForm(emptyForm)
            await loadAgents()
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to add agent')
          }
        }}
      />

      {/* Edit Modal (Reused) */}
      {editingAgent && (
        <AddAgentModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setEditingAgent(null)
          }}
          title={`Edit ${editingAgent.agentName}`}
          initialData={editForm}
          onSave={async (data: any) => {
            if (!editingAgent) return
            setError(null)
            try {
              await updateTravelAgent(editingAgent.id, {
                agentName: data.agentName?.trim() || editingAgent.agentName,
                contactNumber: data.contactNumber?.trim() || editingAgent.contactNumber,
                email: data.email?.trim() || editingAgent.email,
                location: data.location?.trim() || editingAgent.location,
                contractType: data.contractType || editingAgent.contractType,
                planStartDate: data.planStartDate || editingAgent.planStartDate,
                planEndDate: data.planEndDate || editingAgent.planEndDate,
              })
              setShowEditModal(false)
              setEditingAgent(null)
              await loadAgents()
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Failed to update agent')
            }
          }}
        />
      )}
    </div>
  )
}
