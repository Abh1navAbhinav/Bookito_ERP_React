import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import { CalendarDays, MapPin, Building2, Users, Trash2, RotateCcw, Eye } from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { Breadcrumb, type BreadcrumbItem } from '@/components/Breadcrumb'
import { StatusBadge, getStatusVariant } from '@/components/StatusBadge'
import {
  fetchVenues,
  fetchFairProperties,
  fetchFairAgents,
  fetchDeletedFairProperties,
  fetchDeletedFairAgents,
  softDeleteFairProperty,
  restoreFairProperty,
  softDeleteFairAgent,
  restoreFairAgent,
  type TradeFairVenue,
  type TradeFairProperty,
  type TradeFairAgent,
} from '@/lib/partnersApi'
import { cn } from '@/lib/utils'
import { TradeFairCardLeadForm } from './TradeFairCardLeadForm'

export default function TradeFairsPage() {
  const [venues, setVenues] = useState<TradeFairVenue[]>([])
  const [properties, setProperties] = useState<TradeFairProperty[]>([])
  const [deletedProperties, setDeletedProperties] = useState<TradeFairProperty[]>([])
  const [agents, setAgents] = useState<TradeFairAgent[]>([])
  const [deletedAgents, setDeletedAgents] = useState<TradeFairAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAll = useCallback(async () => {
    setError(null)
    try {
      const [v, p, dp, a, da] = await Promise.all([
        fetchVenues(),
        fetchFairProperties(),
        fetchDeletedFairProperties(),
        fetchFairAgents(),
        fetchDeletedFairAgents(),
      ])
      setVenues(v)
      setProperties(p)
      setDeletedProperties(dp)
      setAgents(a)
      setDeletedAgents(da)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load trade fairs data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const [searchParams, setSearchParams] = useSearchParams()
  const fairId = searchParams.get('fairId')

  const selectedVenue = useMemo(
    () => (fairId ? venues.find(v => v.id === fairId) ?? null : null),
    [fairId, venues]
  )

  const handleSetSelectedVenue = (venue: TradeFairVenue | null) => {
    if (venue) {
      setSearchParams({ fairId: venue.id })
    } else {
      setSearchParams({})
    }
  }

  const tabParam = searchParams.get('tab') as 'properties' | 'agents' | null
  const [activeTab, setActiveTab] = useState<'properties' | 'agents'>(tabParam || 'properties')

  useEffect(() => {
    if (tabParam && (tabParam === 'properties' || tabParam === 'agents')) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const handleTabChange = (tab: 'properties' | 'agents') => {
    setActiveTab(tab)
    if (selectedVenue) {
      setSearchParams({ fairId: selectedVenue.id, tab })
    }
  }

  const [showCardLeadPanel, setShowCardLeadPanel] = useState(false)
  const [trashTab, setTrashTab] = useState<'active' | 'deleted'>('active')

  const getRemainingDays = (deletedAt?: string) => {
    if (!deletedAt) return 30
    const diff = Date.now() - new Date(deletedAt).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return Math.max(0, 30 - days)
  }

  const handleDeleteProperty = async (id: string) => {
    setError(null)
    try {
      await softDeleteFairProperty(id)
      await loadAll()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete property')
    }
  }

  const handleRestoreProperty = async (id: string) => {
    setError(null)
    try {
      await restoreFairProperty(id)
      await loadAll()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to restore property')
    }
  }

  const handleDeleteAgent = async (id: string) => {
    setError(null)
    try {
      await softDeleteFairAgent(id)
      await loadAll()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete agent')
    }
  }

  const handleRestoreAgent = async (id: string) => {
    setError(null)
    try {
      await restoreFairAgent(id)
      await loadAll()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to restore agent')
    }
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: 'Trade Fairs',
      ...(selectedVenue
        ? { onClick: () => handleSetSelectedVenue(null) }
        : {}),
    },
    ...(selectedVenue
      ? [{ label: `${selectedVenue.venue} — ${selectedVenue.date}` }]
      : []),
  ]

  const filteredProperties = useMemo(() => {
    if (!selectedVenue) return []
    const list = trashTab === 'active' ? properties : deletedProperties
    return list.filter(p => {
      if (p.fairId !== selectedVenue.id) return false
      if (trashTab === 'deleted' && getRemainingDays(p.deletedAt) === 0) return false
      return true
    })
  }, [selectedVenue, properties, deletedProperties, trashTab])

  const filteredAgents = useMemo(() => {
    if (!selectedVenue) return []
    const list = trashTab === 'active' ? agents : deletedAgents
    return list.filter(a => {
      if (a.fairId !== selectedVenue.id) return false
      if (trashTab === 'deleted' && getRemainingDays(a.deletedAt) === 0) return false
      return true
    })
  }, [selectedVenue, agents, deletedAgents, trashTab])

  const activeTrashToolbar = useMemo(
    () => (
      <div className="flex w-fit shrink-0 rounded-lg border border-surface-200 bg-surface-50 p-0.5">
        <button
          type="button"
          onClick={() => setTrashTab('active')}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            trashTab === 'active'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-surface-500 hover:text-surface-700'
          }`}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => setTrashTab('deleted')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            trashTab === 'deleted'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-surface-500 hover:text-surface-700'
          }`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Trash
        </button>
      </div>
    ),
    [trashTab]
  )

  const propertyColumns: ColumnDef<TradeFairProperty, any>[] = useMemo(
    () => [
      {
        accessorKey: 'propertyName',
        header: 'Property Name',
        cell: ({ row }) => (
          <Link 
            to={`/trade-fairs/property/${row.original.id}`}
            className="font-medium text-primary-600 transition-colors hover:text-primary-700 hover:underline"
          >
            {row.original.propertyName}
          </Link>
        ),
      },
      { accessorKey: 'contactPerson', header: 'Contact Person' },
      { accessorKey: 'contactNumber', header: 'Contact Number' },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <span className="text-surface-500">{row.original.email}</span>
        ),
      },
      { accessorKey: 'location', header: 'Location' },
      {
        accessorKey: 'status',
        header: trashTab === 'active' ? 'Status' : 'Auto-deletes in',
        cell: ({ row }) => {
          if (trashTab === 'deleted') {
            const days = getRemainingDays(row.original.deletedAt)
            return (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                {days} days
              </span>
            )
          }
          return (
            <StatusBadge
              label={row.original.status}
              variant={getStatusVariant(row.original.status)}
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
            {trashTab === 'active' ? (
              <>
                <Link
                  to={`/trade-fairs/property/${row.original.id}`}
                  className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <button 
                  onClick={() => handleDeleteProperty(row.original.id)}
                  className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Delete Property"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => handleRestoreProperty(row.original.id)}
                className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-green-50 hover:text-green-600"
                title="Restore Property"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        )
      }
    ],
    [trashTab]
  )

  const agentColumns: ColumnDef<TradeFairAgent, any>[] = useMemo(
    () => [
      {
        accessorKey: 'agentName',
        header: 'Agent Name',
        cell: ({ row }) => (
          <Link 
            to={`/trade-fairs/agent/${row.original.id}`}
            className="font-medium text-primary-600 transition-colors hover:text-primary-700 hover:underline"
          >
            {row.original.agentName}
          </Link>
        ),
      },
      { accessorKey: 'contactNumber', header: 'Contact Number' },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <span className="text-surface-500">{row.original.email}</span>
        ),
      },
      { accessorKey: 'location', header: 'Location' },
      {
        accessorKey: 'isDMC',
        header: 'Is DMC',
        cell: ({ row }) => (
          <StatusBadge
            label={row.original.isDMC ? 'Yes' : 'No'}
            variant={row.original.isDMC ? 'success' : 'default'}
          />
        ),
      },
      {
        accessorKey: 'status',
        header: trashTab === 'active' ? 'Status' : 'Auto-deletes in',
        cell: ({ row }) => {
          if (trashTab === 'deleted') {
            const days = getRemainingDays(row.original.deletedAt)
            return (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                {days} days
              </span>
            )
          }
          return (
            <StatusBadge
              label={row.original.status}
              variant={getStatusVariant(row.original.status)}
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
            {trashTab === 'active' ? (
              <>
                <Link
                  to={`/trade-fairs/agent/${row.original.id}`}
                  className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <button 
                  onClick={() => handleDeleteAgent(row.original.id)}
                  className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Delete Agent"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => handleRestoreAgent(row.original.id)}
                className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-green-50 hover:text-green-600"
                title="Restore Agent"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        )
      }
    ],
    [trashTab]
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className="rounded-xl border border-surface-200 bg-surface-50 p-12 text-center text-surface-500">
          Loading trade fairs…
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">Trade Fairs</h1>
      </div>

      {!selectedVenue ? (
        /* Venue Cards */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => {
            const propCount = properties.filter((p) => p.fairId === venue.id).length
            const agentCount = agents.filter((a) => a.fairId === venue.id).length
            return (
              <button
                key={venue.id}
                onClick={() => handleSetSelectedVenue(venue)}
                className="group rounded-xl border border-surface-200 bg-white p-5 text-left transition-all duration-200 hover:border-primary-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-primary-50 p-2.5 text-primary-600 transition-colors group-hover:bg-primary-100">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium text-surface-600">
                    {venue.date}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-surface-900">{venue.venue}</h3>
                <div className="mt-1 flex items-center gap-1 text-sm text-surface-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {venue.city}, {venue.location}
                </div>
                <div className="mt-3 flex items-center gap-4 border-t border-surface-100 pt-3">
                  <div className="flex items-center gap-1 text-xs text-surface-500">
                    <Building2 className="h-3.5 w-3.5" />
                    {propCount} Properties
                  </div>
                  <div className="flex items-center gap-1 text-xs text-surface-500">
                    <Users className="h-3.5 w-3.5" />
                    {agentCount} Agents
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        /* Venue Detail with Tabs */
        <div className="space-y-4">
          {/* Venue Info */}
          <div className="rounded-xl border border-surface-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary-50 p-2.5 text-primary-600">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-surface-900">{selectedVenue.venue}</h2>
                <p className="text-sm text-surface-500">
                  {selectedVenue.city}, {selectedVenue.location} • {selectedVenue.date}
                </p>
              </div>
            </div>
          </div>

          {/* Card Lead Capture */}
          <div className="rounded-xl border border-dashed border-primary-200 bg-primary-50/40 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-primary-900">
                  Capture leads from business cards
                </h3>
                <p className="text-xs text-primary-700">
                  Scan or upload both sides of a business card from this trade fair to quickly create
                  a lead.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCardLeadPanel((prev) => !prev)}
                className="inline-flex items-center justify-center rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-primary-700"
              >
                {showCardLeadPanel ? 'Hide card scanner' : 'Add lead from card'}
              </button>
            </div>

            {showCardLeadPanel && selectedVenue && (
              <div className="mt-4 rounded-lg bg-white p-4 shadow-sm">
                <TradeFairCardLeadForm
                  fairName={selectedVenue.venue}
                  fairId={selectedVenue.id}
                />
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 rounded-lg border border-surface-200 bg-surface-50 p-1">
            <button
              type="button"
              onClick={() => handleTabChange('properties')}
              className={cn(
                'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all',
                activeTab === 'properties'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              )}
            >
              <Building2 className="h-4 w-4" />
              Properties ({filteredProperties.length})
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('agents')}
              className={cn(
                'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all',
                activeTab === 'agents'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              )}
            >
              <Users className="h-4 w-4" />
              Travel Agents ({filteredAgents.length})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'properties' ? (
            <DataTable
              data={filteredProperties}
              columns={propertyColumns}
              searchPlaceholder="Search properties..."
              toolbarActions={activeTrashToolbar}
            />
          ) : (
            <DataTable
              data={filteredAgents}
              columns={agentColumns}
              searchPlaceholder="Search agents..."
              toolbarActions={activeTrashToolbar}
            />
          )}
        </div>
      )}
    </div>
  )
}
