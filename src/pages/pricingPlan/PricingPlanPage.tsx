import { useState, useEffect, useCallback } from 'react'
import { CreditCard, Check, Plus, Star, Zap, Info, ArrowRight, Trash2, Edit3, X, RotateCcw } from 'lucide-react'
import { Button, Modal, FormField, Input, Textarea } from '@/components/FormElements'
import { cn } from '@/lib/utils'
import {
  type RoomSlab,
  type SubscriptionPlanUi as Plan,
  type DeletedSubscriptionPlanUi as DeletedPlan,
  fetchActiveSubscriptionPlans,
  fetchTrashedSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  softDeleteSubscriptionPlan,
  restoreSubscriptionPlan,
} from '@/lib/subscriptionPlansApi'

type DemoRole = 'manager' | 'sales' | 'accountant' | 'crm' | 'hr' | 'admin'

type PlanFeature = {
  title: string
  items: string[]
}

const formatInr = (value: number) =>
  `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

const roomLabel: Record<RoomSlab, string> = {
  '1-10': 'Rooms 1–10',
  '11-20': 'Rooms 11–20',
  '21-30': 'Rooms 21–30',
  '30+': 'Rooms 30+',
}

export default function PricingPlanPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [currentRole, setCurrentRole] = useState<DemoRole | null>(null)
  const [showComparison, setShowComparison] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [modalFeatures, setModalFeatures] = useState<PlanFeature[]>([])
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({})
  const [showDeleted, setShowDeleted] = useState(false)
  const [deletedPlans, setDeletedPlans] = useState<DeletedPlan[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const reloadPlans = useCallback(async () => {
    setListError(null)
    setListLoading(true)
    try {
      const [active, trash] = await Promise.all([
        fetchActiveSubscriptionPlans(),
        fetchTrashedSubscriptionPlans(),
      ])
      setPlans(active)
      setDeletedPlans(trash)
    } catch (e) {
      setListError(e instanceof Error ? e.message : 'Failed to load subscription plans')
      setPlans([])
      setDeletedPlans([])
    } finally {
      setListLoading(false)
    }
  }, [])

  useEffect(() => {
    void reloadPlans()
  }, [reloadPlans])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('bookito_demo_user')
      if (raw) {
        const parsed = JSON.parse(raw) as { role?: DemoRole }
        if (parsed.role) setCurrentRole(parsed.role)
      }
    } catch {
      /* ignore */
    }
  }, [])

  // Initialize modal features when opening modal
  useEffect(() => {
    if (showEditModal) {
      setModalFeatures(editingPlan?.features || [{ title: 'Core Features', items: [''] }])
    }
  }, [showEditModal, editingPlan])

  const canManage = currentRole === 'manager' || currentRole === 'admin'
  const isSalesRole = currentRole === 'sales'
  /** Sales users only see active plans; trash toggle is hidden for them */
  const viewingDeleted = !isSalesRole && showDeleted

  useEffect(() => {
    if (currentRole === 'sales') setShowDeleted(false)
  }, [currentRole])

  const handleSavePlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaveError(null)
    const formData = new FormData(e.currentTarget)

    const newPlan: Plan = {
      id: editingPlan?.id || `plan-${Date.now()}`,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      popular: formData.get('popular') === 'on',
      promo: (formData.get('promo') as string) || '',
      color: (formData.get('color') as string) || 'from-surface-700 to-surface-900',
      footerNote: (formData.get('footerNote') as string) || editingPlan?.footerNote || '',
      sortOrder: editingPlan?.sortOrder ?? plans.length,
      pricing: [
        { rooms: '1-10', sixMonths: Number(formData.get('p1-6m')), oneYear: Number(formData.get('p1-1y')) },
        { rooms: '11-20', sixMonths: Number(formData.get('p2-6m')), oneYear: Number(formData.get('p2-1y')) },
        { rooms: '21-30', sixMonths: Number(formData.get('p3-6m')), oneYear: Number(formData.get('p3-1y')) },
        { rooms: '30+', sixMonths: Number(formData.get('p4-6m')), oneYear: Number(formData.get('p4-1y')) },
      ],
      features: modalFeatures.filter((f) => f.title.trim() !== ''),
    }

    setSaving(true)
    try {
      if (editingPlan) {
        await updateSubscriptionPlan(editingPlan.id, newPlan)
      } else {
        await createSubscriptionPlan({ ...newPlan, sortOrder: plans.length })
      }
      await reloadPlans()
      setShowEditModal(false)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save plan')
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePlan = async (id: string) => {
    if (!window.confirm('Move this pricing plan to trash? It will be auto-deleted after 30 days.')) return
    setListError(null)
    try {
      await softDeleteSubscriptionPlan(id)
      await reloadPlans()
    } catch (err) {
      setListError(err instanceof Error ? err.message : 'Failed to delete plan')
    }
  }

  const handleRestorePlan = async (id: string) => {
    setListError(null)
    try {
      await restoreSubscriptionPlan(id)
      await reloadPlans()
    } catch (err) {
      setListError(err instanceof Error ? err.message : 'Failed to restore plan')
    }
  }

  const getRemainingDays = (deletedAt: string) => {
    const diff = Date.now() - new Date(deletedAt).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return Math.max(0, 30 - days)
  }

  const addFeatureGroup = () => {
    setModalFeatures([...modalFeatures, { title: '', items: [''] }])
  }

  const removeFeatureGroup = (index: number) => {
    setModalFeatures(modalFeatures.filter((_, i) => i !== index))
  }

  const updateFeatureGroupTitle = (index: number, title: string) => {
    const next = [...modalFeatures]
    next[index].title = title
    setModalFeatures(next)
  }

  const addFeatureItem = (groupIndex: number) => {
    const next = [...modalFeatures]
    next[groupIndex].items.push('')
    setModalFeatures(next)
  }

  const removeFeatureItem = (groupIndex: number, itemIndex: number) => {
    const next = [...modalFeatures]
    next[groupIndex].items = next[groupIndex].items.filter((_, i) => i !== itemIndex)
    setModalFeatures(next)
  }

  const updateFeatureItem = (groupIndex: number, itemIndex: number, value: string) => {
    const next = [...modalFeatures]
    next[groupIndex].items[itemIndex] = value
    setModalFeatures(next)
  }

  const toggleExpand = (planId: string) => {
    setExpandedPlans(prev => ({ ...prev, [planId]: !prev[planId] }))
  }

  return (
    <div className="space-y-10 pb-20">
      {listError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{listError}</div>
      )}
      {listLoading && (
        <p className="text-sm text-surface-500">Loading subscription plans…</p>
      )}
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-600 ring-1 ring-primary-100">
            <Zap className="h-3.5 w-3.5" />
            Pricing & Monetization
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-surface-900 md:text-4xl">Subscription Plans</h1>
          <p className="max-w-xl text-surface-500">
            Manage your product tiers and pricing slabs. Changes here will reflect across the sales and partner portals.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {!isSalesRole && (
            <div className="mr-4 flex rounded-xl border border-surface-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setShowDeleted(false)}
                className={cn(
                  'rounded-lg px-4 py-1.5 text-xs font-bold transition-all',
                  !showDeleted ? 'bg-primary-600 text-white shadow-md' : 'text-surface-500 hover:text-surface-900'
                )}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setShowDeleted(true)}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-bold transition-all',
                  showDeleted ? 'bg-red-500 text-white shadow-md' : 'text-surface-500 hover:text-red-500'
                )}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Trash
                {deletedPlans.length > 0 && (
                  <span
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-full text-[10px]',
                      showDeleted ? 'bg-white text-red-500' : 'bg-red-100 text-red-600'
                    )}
                  >
                    {deletedPlans.length}
                  </span>
                )}
              </button>
            </div>
          )}

          <Button 
            variant="secondary" 
            onClick={() => setShowComparison(true)}
            className="h-12 rounded-xl border-surface-200 bg-white px-6 shadow-sm"
          >
            <Info className="h-4 w-4" />
            Compare Features
          </Button>
          {canManage && (
            <Button 
              onClick={() => { setEditingPlan(null); setShowEditModal(true); }}
              className="h-12 rounded-xl shadow-lg shadow-primary-200"
            >
              <Plus className="h-4 w-4" />
              Create New Plan
            </Button>
          )}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {!listLoading && (!viewingDeleted ? plans : deletedPlans).map((plan) => (
          <div
            key={plan.id}
            className={cn(
              'group relative flex flex-col rounded-[2.5rem] border bg-white p-2 transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]',
              plan.popular && !viewingDeleted
                ? 'border-primary-200 shadow-2xl shadow-primary-100 ring-4 ring-primary-50/50' 
                : 'border-surface-200 shadow-xl',
              viewingDeleted && 'opacity-80'
            )}
          >
            {/* Action Buttons for Managers */}
            {canManage && (
              <div className="absolute right-6 top-6 z-20 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                {!viewingDeleted ? (
                  <>
                    <button 
                      onClick={() => { setEditingPlan(plan); setShowEditModal(true); }}
                      className="rounded-full bg-white/20 p-2 text-white backdrop-blur-md hover:bg-white hover:text-surface-900 shadow-lg transition-all"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeletePlan(plan.id)}
                      className="rounded-full bg-white/20 p-2 text-white backdrop-blur-md hover:bg-red-500 hover:text-white shadow-lg transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleRestorePlan(plan.id)}
                    className="rounded-full bg-white/20 p-2 text-white backdrop-blur-md hover:bg-emerald-500 hover:text-white shadow-lg transition-all"
                    title="Restore Plan"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {plan.popular && !viewingDeleted && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 rounded-full bg-gradient-to-r from-primary-600 to-purple-600 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg ring-4 ring-white">
                <div className="flex items-center gap-1.5">
                  <Star className="h-3 w-3 fill-white" />
                  Most Popular
                </div>
              </div>
            )}

            {viewingDeleted && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 rounded-full bg-red-600 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg ring-4 ring-white">
                Auto-deletes in {getRemainingDays((plan as DeletedPlan).deletedAt)} days
              </div>
            )}

            {/* Header */}
            <div className={cn('overflow-hidden rounded-[2rem] bg-gradient-to-br p-8 text-white shadow-inner', plan.color)}>
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-white/20 p-2 backdrop-blur-md">
                  <CreditCard className="h-6 w-6" />
                </div>
                {plan.promo && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                    {plan.promo}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">{plan.description}</p>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col px-6 py-8">
              {/* Pricing Section */}
              <div className="mb-8 overflow-hidden rounded-[1.5rem] border border-surface-100 bg-surface-50/50 p-1">
                <div className="flex items-center justify-between px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">
                    Pricing Slabs
                  </p>
                </div>
                <div className="space-y-1">
                  {plan.pricing.map((row) => (
                    <div 
                      key={row.rooms} 
                      className="flex items-center justify-between rounded-xl px-4 py-3 transition-all hover:bg-white hover:shadow-md hover:ring-1 hover:ring-surface-200"
                    >
                      <span className="text-xs font-bold text-surface-900">{roomLabel[row.rooms]}</span>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[9px] font-bold uppercase tracking-tighter text-surface-400">6 Months</p>
                          <p className="text-sm font-black text-surface-900">{formatInr(row.sixMonths)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold uppercase tracking-tighter text-surface-400">Annual</p>
                          <p className="text-sm font-black text-primary-600">{formatInr(row.oneYear)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features List (Expandable) */}
              <div className="flex-1 space-y-4">
                <button 
                  onClick={() => toggleExpand(plan.id)}
                  className="flex w-full items-center justify-between px-1"
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-surface-400">
                    Included Features
                  </p>
                  <div className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full bg-surface-100 text-surface-500 transition-transform duration-300",
                    expandedPlans[plan.id] ? "rotate-180" : ""
                  )}>
                    <ArrowRight className="h-3 w-3 rotate-90" />
                  </div>
                </button>
                
                <div className={cn(
                  "overflow-hidden transition-all duration-500",
                  expandedPlans[plan.id] ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                )}>
                  <div className="space-y-4 py-2">
                    {plan.features.map((section) => (
                      <div key={section.title} className="group/item flex gap-3">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 ring-1 ring-primary-100 group-hover/item:bg-primary-600 group-hover/item:text-white">
                          <Check className="h-3 w-3" />
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-sm font-bold text-surface-900">{section.title}</p>
                          {section.items.length > 0 && (
                            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                              {section.items.map((item) => (
                                <span key={item} className="inline-flex items-center text-[11px] font-medium text-surface-500">
                                  <span className="mr-1.5 h-1 w-1 rounded-full bg-surface-300" />
                                  {item}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {plan.footerNote && !viewingDeleted && (
                <p className="mt-6 border-t border-surface-100 pt-4 text-center text-xs text-surface-500">
                  {plan.footerNote}
                </p>
              )}
            </div>
          </div>
        ))}
        
        {!listLoading && viewingDeleted && deletedPlans.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-surface-400">
            <Trash2 className="mb-4 h-12 w-12 opacity-20" />
          </div>
        )}
      </div>

      {/* Add/Edit Plan Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={editingPlan ? 'Edit Pricing Plan' : 'Create New Pricing Plan'}
        size="lg"
      >
        <form onSubmit={handleSavePlan} className="space-y-6 py-4">
          {saveError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{saveError}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Plan Name">
              <Input name="name" defaultValue={editingPlan?.name} required placeholder="e.g. Standard, Enterprise" />
            </FormField>
            <FormField label="Promo Text (Optional)">
              <Input name="promo" defaultValue={editingPlan?.promo} placeholder="e.g. Most Popular, 20% Off" />
            </FormField>
          </div>
          
          <FormField label="Description">
            <Textarea name="description" defaultValue={editingPlan?.description} required rows={2} placeholder="Brief overview of who this plan is for" />
          </FormField>

          <FormField label="Footer note (optional)">
            <Textarea name="footerNote" defaultValue={editingPlan?.footerNote} rows={2} placeholder="Shown below features on the plan card" />
          </FormField>

          {/* Pricing Grid Inputs */}
          <div className="rounded-2xl border border-surface-200 p-4 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-surface-400">Rate Slabs (INR)</h4>
            <div className="grid grid-cols-3 gap-4 items-center font-bold text-[10px] text-surface-400 uppercase">
              <div>Slab</div>
              <div>6 Months Rate</div>
              <div>Annual Rate</div>
            </div>
            {[
              { id: 'p1', label: '1-10' },
              { id: 'p2', label: '11-20' },
              { id: 'p3', label: '21-30' },
              { id: 'p4', label: '30+' },
            ].map((slab, i) => (
              <div key={slab.id} className="grid grid-cols-3 gap-4 items-center">
                <div className="text-sm font-bold text-surface-700">{roomLabel[slab.label as RoomSlab]}</div>
                <Input type="number" name={`${slab.id}-6m`} defaultValue={editingPlan?.pricing[i]?.sixMonths} required placeholder="6m rate" />
                <Input type="number" name={`${slab.id}-1y`} defaultValue={editingPlan?.pricing[i]?.oneYear} required placeholder="1y rate" />
              </div>
            ))}
          </div>

          {/* Dynamic Features Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-widest text-surface-400 px-1">Plan Features Library</h4>
              <Button type="button" variant="secondary" onClick={addFeatureGroup} className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider">
                <Plus className="h-3 w-3 mr-1" />
                Add Group
              </Button>
            </div>
            
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {modalFeatures.map((group, gIdx) => (
                <div key={gIdx} className="relative rounded-2xl border border-primary-100 bg-primary-50/30 p-5 pt-8">
                  <button 
                    type="button" 
                    onClick={() => removeFeatureGroup(gIdx)}
                    className="absolute right-3 top-3 text-surface-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  <div className="mb-4">
                    <Input 
                      placeholder="Group Title (e.g. Core PMS Modules)" 
                      value={group.title} 
                      onChange={(e) => updateFeatureGroupTitle(gIdx, e.target.value)}
                      className="bg-white font-bold h-10 ring-primary-100/50"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    {group.items.map((item, iIdx) => (
                      <div key={iIdx} className="flex gap-2 group/feat">
                        <Input 
                          placeholder="Feature item description..." 
                          value={item} 
                          onChange={(e) => updateFeatureItem(gIdx, iIdx, e.target.value)}
                          className="flex-1 bg-white text-xs h-9 transition-all focus:ring-primary-500/20"
                        />
                        <button 
                          type="button" 
                          onClick={() => removeFeatureItem(gIdx, iIdx)}
                          className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-500 text-surface-300 transition-all opacity-0 group-hover/feat:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => addFeatureItem(gIdx)}
                      className="h-9 w-full border-2 border-dashed border-primary-100 bg-white/50 text-[10px] font-bold uppercase tracking-wider text-primary-600 hover:bg-white hover:border-primary-300 active:scale-[0.98] transition-all"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Detailed Feature
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Gradient Color Class">
              <Input name="color" defaultValue={editingPlan?.color} placeholder="from-blue-600 to-blue-800" />
            </FormField>
            <div className="flex items-center gap-3 pt-8">
              <input type="checkbox" id="popular" name="popular" defaultChecked={editingPlan?.popular} className="h-5 w-5 rounded border-surface-300 text-primary-600" />
              <label htmlFor="popular" className="text-sm font-bold text-surface-700">Set as Popular</label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-surface-100">
            <Button variant="ghost" type="button" onClick={() => setShowEditModal(false)} className="h-12 px-6">Cancel</Button>
            <Button type="submit" disabled={saving} className="px-10 shadow-lg shadow-primary-200 h-12">
              {saving ? 'Saving…' : editingPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Comparison Modal (Static) */}
      <Modal isOpen={showComparison} onClose={() => setShowComparison(false)} title="Feature Comparison Matrix" size="xl">
        <div className="py-4">
          <div className="overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-200">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-surface-500">Feature</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-surface-500 text-center">Standard</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-surface-500 text-center">Premium</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-surface-500 text-center">PRO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 text-sm">
                {[
                  { name: 'Cloud PMS & CRS', s: true, p: true, pro: true },
                  { name: 'Channel Manager', s: true, p: true, pro: true },
                  { name: 'Banquet & Store', s: false, p: true, pro: true },
                  { name: 'POS Integration', s: false, p: false, pro: true },
                  { name: 'API Access', s: false, p: false, pro: true },
                ].map((row) => (
                  <tr key={row.name}>
                    <td className="px-6 py-4 font-semibold text-surface-700">{row.name}</td>
                    <td className="px-6 py-4 text-center">{row.s ? <Check className="mx-auto h-4 w-4 text-green-500" /> : '—'}</td>
                    <td className="px-6 py-4 text-center">{row.p ? <Check className="mx-auto h-4 w-4 text-green-500" /> : '—'}</td>
                    <td className="px-6 py-4 text-center">{row.pro ? <Check className="mx-auto h-4 w-4 text-green-500" /> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  )
}

