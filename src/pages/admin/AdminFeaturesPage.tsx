import { useState, useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { Zap, Plus, Edit, Trash2, Send } from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button, Modal, FormField, Input, Textarea } from '@/components/FormElements'
import { features as initialFeatures, type Feature } from '@/data/mockData'

export default function AdminFeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)

  const columns: ColumnDef<Feature, any>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Feature Name',
        cell: ({ row }) => <span className="font-semibold text-surface-900">{row.original.name}</span>,
      },
      {
        accessorKey: 'version',
        header: 'Version',
        cell: ({ row }) => (
          <span className="rounded-md bg-surface-100 px-2 py-1 text-xs font-mono text-surface-600">
            {row.original.version}
          </span>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => <p className="max-w-md truncate text-sm text-surface-500">{row.original.description}</p>,
      },
      {
        accessorKey: 'date',
        header: 'Release Date',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setEditingFeature(row.original)
                setShowAddModal(true)
              }}
              className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-red-50 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
            <button className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-primary-50 hover:text-primary-600" title="Notify Executives">
              <Send className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Feature Management</h1>
          <div className="mt-2">
            <Breadcrumb items={[{ label: 'Admin' }, { label: 'Features' }]} />
          </div>
        </div>
        <Button onClick={() => {
          setEditingFeature(null)
          setShowAddModal(true)
        }}>
          <Plus className="h-4 w-4" />
          Add New Feature
        </Button>
      </div>

      <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-surface-900">Release Notes & Features</h2>
            <p className="text-xs text-surface-500">Manage the product features shown to executives.</p>
          </div>
        </div>
        
        <DataTable
          data={features}
          columns={columns}
          searchPlaceholder="Search features..."
        />
      </div>

      {/* Add/Edit Feature Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingFeature ? 'Edit Feature' : 'Add New Feature'}
        size="md"
      >
        <div className="space-y-4">
          <FormField label="Feature Name">
            <Input placeholder="e.g. Channel Manager v3.0" defaultValue={editingFeature?.name} />
          </FormField>
          <FormField label="Version">
            <Input placeholder="e.g. 3.0.0" defaultValue={editingFeature?.version} />
          </FormField>
          <FormField label="Release Date">
            <Input type="date" defaultValue={editingFeature?.date} />
          </FormField>
          <FormField label="Description">
            <Textarea rows={4} placeholder="Describe the feature updates..." defaultValue={editingFeature?.description} />
          </FormField>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="notify" className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
            <label htmlFor="notify" className="text-sm text-surface-700 font-medium">Notify all executives immediately</label>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button onClick={() => setShowAddModal(false)}>
            {editingFeature ? 'Update Feature' : 'Add Feature'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
