import { useState, useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { Users, Plus } from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { Breadcrumb, type BreadcrumbItem } from '@/components/Breadcrumb'
import { FolderNavigator } from '@/components/FolderNavigator'
import { StatusBadge, getStatusVariant } from '@/components/StatusBadge'
import { Button, Modal, FormField, Input, Select } from '@/components/FormElements'
import { locationHierarchy, travelAgents, type TravelAgent } from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function TravelAgentsPage() {
  const [path, setPath] = useState<string[]>([])
  const [pathLabels, setPathLabels] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  const isLeafLevel = path.length >= 3

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

  const filteredAgents = useMemo(() => {
    if (!isLeafLevel) return travelAgents
    const [stateId, districtId, locationId] = path
    const state = locationHierarchy.find((s) => s.id === stateId)
    const district = state?.children?.find((d) => d.id === districtId)
    const location = district?.children?.find((l) => l.id === locationId)
    return travelAgents.filter(
      (a) => a.state === state?.name && a.district === district?.name && a.location === location?.name
    )
  }, [isLeafLevel, path])

  const columns: ColumnDef<TravelAgent, any>[] = useMemo(
    () => [
      {
        accessorKey: 'agentName',
        header: 'Agent Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
              {row.original.agentName.split(' ').map((w) => w[0]).join('').slice(0, 2)}
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
        cell: ({ row }) => (
          <StatusBadge
            label={row.original.contractType}
            variant={getStatusVariant(row.original.contractType)}
            dot
          />
        ),
      },
      {
        accessorKey: 'trialRemainingDays',
        header: 'Trial Days',
        cell: ({ row }) => {
          if (!row.original.trialStatus) return <span className="text-surface-400">—</span>
          const days = row.original.trialRemainingDays
          return (
            <span className={cn('font-medium', days <= 7 ? 'text-red-600' : 'text-amber-600')}>
              {days} days left
            </span>
          )
        },
      },
      {
        accessorKey: 'planStartDate',
        header: 'Plan Start',
      },
      {
        accessorKey: 'planEndDate',
        header: 'Plan End',
      },
      {
        accessorKey: 'collectedAmount',
        header: 'Collected',
        cell: ({ row }) => (
          <span className="text-accent-600 font-medium">
            {formatCurrency(row.original.collectedAmount)}
          </span>
        ),
      },
      {
        accessorKey: 'pendingAmount',
        header: 'Pending',
        cell: ({ row }) => (
          <span className={row.original.pendingAmount > 0 ? 'text-amber-600 font-medium' : 'text-surface-400'}>
            {row.original.pendingAmount > 0 ? formatCurrency(row.original.pendingAmount) : '—'}
          </span>
        ),
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Travel Agents</h1>
          <div className="mt-2">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4" />
          Add Agent
        </Button>
      </div>

      {!isLeafLevel ? (
        <FolderNavigator
          hierarchy={locationHierarchy}
          path={path}
          onNavigate={handleNavigate}
        />
      ) : (
        <DataTable
          data={filteredAgents}
          columns={columns}
          searchPlaceholder="Search agents..."
        />
      )}

      {/* If nothing in leaf, show all agents */}
      {isLeafLevel && filteredAgents.length === 0 && (
        <div className="rounded-xl border border-surface-200 bg-white p-8 text-center">
          <Users className="mx-auto h-12 w-12 text-surface-300" />
          <p className="mt-3 text-sm text-surface-500">No travel agents found in this location.</p>
          <Button className="mt-4" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4" /> Add First Agent
          </Button>
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
