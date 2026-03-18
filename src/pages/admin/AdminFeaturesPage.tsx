import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Plus } from 'lucide-react'
import { Button, Modal, FormField, Input, Textarea } from '@/components/FormElements'
import { features as initialFeatures, type Feature } from '@/data/mockData'

type DemoRole = 'manager' | 'sales' | 'accountant' | 'crm' | 'hr'

export default function AdminFeaturesPage() {
  const navigate = useNavigate()
  const [features, setFeatures] = useState<Feature[]>(initialFeatures)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
  const [currentRole, setCurrentRole] = useState<DemoRole | null>(null)

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
  }, [])

  const canManage = currentRole === 'manager'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-500">
            Pms modules
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-surface-900">
            Feature Library
          </h1>
        </div>
        {canManage && (
          <Button
            onClick={() => {
              setEditingFeature(null)
              setShowAddModal(true)
            }}
            className="shadow-[0_12px_30px_rgba(99,102,241,0.35)]"
          >
            <Plus className="h-4 w-4" />
            Add New Feature
          </Button>
        )}
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-surface-200 bg-gradient-to-br from-surface-50 via-white to-primary-50/40 p-6 shadow-md">
        <div className="pointer-events-none absolute inset-y-0 right-[-80px] hidden w-64 translate-y-6 rounded-full bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),transparent_60%)] blur-3xl sm:block" />
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-2.5 text-white shadow-md">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-surface-900">
                PMS Feature Catalogue
              </h2>
              <p className="mt-1 text-xs text-surface-500">
                Beautiful, sales-ready cards for every module. Use this view during demos
                to quickly jump into the right feature story.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => navigate(`/admin/features/${feature.id}`)}
              className="group flex flex-col justify-between rounded-xl border border-surface-100 bg-white/80 p-4 text-left shadow-sm ring-1 ring-transparent transition-all hover:-translate-y-1.5 hover:border-primary-200 hover:bg-primary-50/60 hover:shadow-lg hover:ring-primary-200/80"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-surface-900 group-hover:text-primary-700">
                    {feature.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-surface-500">
                    {feature.description}
                  </p>
                </div>
                <span className="rounded-full bg-primary-50 px-3 py-1 text-[11px] font-mono text-primary-700 shadow-sm">
                  v{feature.version}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-surface-400">
                <span className="rounded-full bg-surface-50 px-2 py-1">
                  Release&nbsp;·&nbsp;{feature.date}
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-primary-600 group-hover:text-primary-700">
                  View details
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </div>
            </button>
          ))}
        </div>
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
