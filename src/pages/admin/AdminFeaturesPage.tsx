import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Plus, Search, Filter, Layers, Globe, Database, Settings2, BarChart3, Users as UsersIcon, ChevronRight, Edit3, Trash2 } from 'lucide-react'
import { Button, Modal, FormField, Input, Textarea } from '@/components/FormElements'
import { features as initialFeatures, type Feature } from '@/data/mockData'
import { cn } from '@/lib/utils'

type DemoRole = 'manager' | 'sales' | 'accountant' | 'crm' | 'hr'
type Category = 'All' | 'Operations' | 'Inventory' | 'Distribution' | 'Finance' | 'Security'

// Enriching the initial features with some extra metadata for the new design
export interface EnforcedFeature extends Feature {
  category: string
  status: 'New' | 'Updated' | 'Stable'
  icon: any
}

function getFeatureCategory(f: Feature): Exclude<Category, 'All'> {
  const key = `${f.id} ${f.name}`.toLowerCase()
  if (key.includes('ota') || key.includes('channel')) return 'Distribution'
  if (key.includes('finance') || key.includes('account')) return 'Finance'
  if (key.includes('role') || key.includes('access')) return 'Security'
  if (key.includes('inventory') || key.includes('store')) return 'Inventory'
  return 'Operations'
}

function getFeatureIcon(category: Exclude<Category, 'All'>) {
  switch (category) {
    case 'Distribution':
      return Globe
    case 'Finance':
      return BarChart3
    case 'Inventory':
      return Database
    case 'Security':
      return UsersIcon
    default:
      return Layers
  }
}

const enhancedFeatures: EnforcedFeature[] = initialFeatures.map((f, i) => {
  const category = getFeatureCategory(f)
  return {
    ...f,
    category,
    status: i === 0 ? 'New' : (i === 1 ? 'Updated' : 'Stable'),
    icon: getFeatureIcon(category),
  }
})

export default function AdminFeaturesPage() {
  const navigate = useNavigate()
  const [features, setFeatures] = useState<EnforcedFeature[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingFeature, setEditingFeature] = useState<EnforcedFeature | null>(null)
  const [currentRole, setCurrentRole] = useState<DemoRole | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category>('All')

  useEffect(() => {
    const savedFeatures = localStorage.getItem('bookito_features_catalogue')
    if (savedFeatures) {
      const parsed = JSON.parse(savedFeatures)
      const withIcons = parsed.map((f: any, i: number) => {
        const category =
          typeof f?.category === 'string' && ['Operations', 'Inventory', 'Distribution', 'Finance', 'Security'].includes(f.category)
            ? f.category
            : getFeatureCategory(f)

        return {
          ...f,
          category,
          status: f?.status || (i === 0 ? 'New' : (i === 1 ? 'Updated' : 'Stable')),
          icon: getFeatureIcon(category),
        }
      })
      setFeatures(withIcons)
    } else {
      setFeatures(enhancedFeatures)
    }

    try {
      const raw = window.localStorage.getItem('bookito_demo_user')
      if (raw) {
        const parsed = JSON.parse(raw) as { role?: DemoRole }
        if (parsed.role) setCurrentRole(parsed.role)
      }
    } catch { /* ignore */ }
  }, [])

  const canManage = currentRole === 'manager'

  const filteredFeatures = useMemo(() => {
    return features.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           f.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = activeCategory === 'All' || f.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [features, searchQuery, activeCategory])

  const categories: Category[] = ['All', 'Operations', 'Inventory', 'Distribution', 'Finance', 'Security']

  const handleSaveFeature = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newFeature: EnforcedFeature = {
      id: editingFeature?.id || `feat-${Date.now()}`,
      name: formData.get('name') as string,
      version: formData.get('version') as string,
      date: formData.get('date') as string,
      description: formData.get('description') as string,
      category: (formData.get('category') as string) || 'Product',
      status: editingFeature?.status || 'New',
      icon: editingFeature?.icon || Globe
    }

    let updatedFeatures: EnforcedFeature[]
    if (editingFeature) {
      updatedFeatures = features.map(f => f.id === editingFeature.id ? newFeature : f)
    } else {
      updatedFeatures = [newFeature, ...features]
    }

    setFeatures(updatedFeatures)
    localStorage.setItem('bookito_features_catalogue', JSON.stringify(updatedFeatures))
    setShowAddModal(false)
  }

  const handleDeleteFeature = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to remove this module from the library?')) {
      const updatedFeatures = features.filter(f => f.id !== id)
      setFeatures(updatedFeatures)
      localStorage.setItem('bookito_features_catalogue', JSON.stringify(updatedFeatures))
    }
  }

  const handleEditFeature = (e: React.MouseEvent, feature: EnforcedFeature) => {
    e.stopPropagation()
    setEditingFeature(feature)
    setShowAddModal(true)
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-[2rem] bg-surface-900 px-8 py-12 text-white shadow-2xl">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary-500/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary-600/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-300 ring-1 ring-white/20">
              <Settings2 className="h-3 w-3" />
              PMS Module Management
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              Feature Library
            </h1>
            <p className="max-w-xl text-lg text-surface-400">
              Explore and manage the core capabilities of the Bookito PMS ecosystem. 
              Beautiful, sales-ready modules for seamless operations.
            </p>
          </div>
          
          {canManage && (
            <Button
              onClick={() => {
                setEditingFeature(null)
                setShowAddModal(true)
              }}
              size="lg"
              className="group h-14 rounded-2xl bg-white px-8 text-surface-900 shadow-xl transition-all hover:bg-primary-50 hover:text-primary-700 active:scale-95"
            >
              <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
              Add New Module
            </Button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="sticky top-4 z-30 flex flex-col gap-4 rounded-2xl border border-surface-200 bg-white/80 p-4 shadow-lg backdrop-blur-md md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search features, modules, or version updates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-xl border-none bg-surface-50 pl-11 pr-4 text-sm font-medium text-surface-900 ring-1 ring-surface-200 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-4 md:pb-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-50 text-surface-400 ring-1 ring-surface-200">
            <Filter className="h-4 w-4" />
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "flex h-10 items-center justify-center whitespace-nowrap rounded-xl px-5 text-sm font-semibold transition-all",
                activeCategory === cat
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-200"
                  : "bg-white text-surface-600 ring-1 ring-surface-200 hover:bg-surface-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFeatures.map((feature) => (
          <button
            key={feature.id}
            onClick={() => navigate(`/admin/features/${feature.id}`)}
            className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-surface-200 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary-200 hover:shadow-2xl hover:shadow-primary-100"
          >
            {/* Action Buttons for Managers */}
            {canManage && (
              <div className="absolute right-4 top-12 z-20 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button 
                  onClick={(e) => handleEditFeature(e, feature)}
                  className="rounded-full bg-white p-2 text-surface-400 shadow-lg ring-1 ring-surface-100 hover:bg-primary-50 hover:text-primary-600 transition-all"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={(e) => handleDeleteFeature(e, feature.id)}
                  className="rounded-full bg-white p-2 text-surface-400 shadow-lg ring-1 ring-surface-100 hover:bg-red-50 hover:text-white transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute right-4 top-4">
              <span className={cn(
                "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                feature.status === 'New' ? "bg-green-100 text-green-700" : 
                feature.status === 'Updated' ? "bg-amber-100 text-amber-700" : "bg-surface-100 text-surface-600"
              )}>
                {feature.status}
              </span>
            </div>

            {/* Icon & Category */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/50 text-primary-600 shadow-inner group-hover:from-primary-600 group-hover:to-primary-700 group-hover:text-white group-hover:shadow-lg transition-all duration-500">
                <feature.icon className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500">
                  {feature.category}
                </span>
                <h3 className="text-lg font-bold text-surface-900 group-hover:text-primary-700 transition-colors">
                  {feature.name}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="mb-8 line-clamp-3 text-sm leading-relaxed text-surface-500 group-hover:text-surface-700 transition-colors">
              {feature.description}
            </p>

            {/* Footer */}
            <div className="mt-auto flex items-center justify-between border-t border-surface-100 pt-4 text-[11px]">
              <div className="flex flex-col">
                <span className="font-semibold text-surface-400 uppercase tracking-tighter">Version</span>
                <span className="font-mono text-surface-900">v{feature.version}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-semibold text-surface-400 uppercase tracking-tighter">Released</span>
                <span className="text-surface-900">{feature.date}</span>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary-600 transition-all duration-500 group-hover:w-full" />
          </button>
        ))}
        
        {/* Empty State */}
        {filteredFeatures.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface-50 text-surface-300">
              <Search className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-bold text-surface-900">No modules found</h3>
            <p className="text-surface-500 text-sm mt-2">Try adjusting your search or filters to find what you're looking for.</p>
            <Button 
              variant="secondary" 
              className="mt-6"
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingFeature ? 'Edit Module Detail' : 'Add New Module to Library'}
        size="md"
      >
        <form onSubmit={handleSaveFeature} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Feature Name">
              <Input name="name" placeholder="e.g. Channel Manager v3.0" defaultValue={editingFeature?.name} required />
            </FormField>
            <FormField label="Category">
              <Input name="category" placeholder="e.g. Inventory" defaultValue={editingFeature?.category} required />
            </FormField>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Version Number">
              <Input name="version" placeholder="e.g. 3.0.0" defaultValue={editingFeature?.version} required />
            </FormField>
            <FormField label="Official Release Date">
              <Input type="date" name="date" defaultValue={editingFeature?.date} required />
            </FormField>
          </div>
          
          <FormField label="Description">
            <Textarea name="description" rows={4} placeholder="Describe the module's core capabilities..." defaultValue={editingFeature?.description} required />
          </FormField>
          
          <div className="rounded-xl bg-primary-50 p-4 ring-1 ring-primary-100">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="notify" className="h-5 w-5 rounded-md border-primary-300 text-primary-600 focus:ring-primary-500 transition-all" />
              <label htmlFor="notify" className="text-sm font-semibold text-primary-900">
                Broadcast update to all partner dashboards
              </label>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3 border-t border-surface-100 pt-6">
            <Button variant="ghost" type="button" onClick={() => setShowAddModal(false)} className="h-12 px-6">Cancel</Button>
            <Button type="submit" className="h-12 px-10 shadow-lg shadow-primary-200">
              {editingFeature ? 'Apply Updates' : 'Publish Module'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}


