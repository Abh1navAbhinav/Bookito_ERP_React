import { useState, useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { CalendarDays, MapPin, Building2, Users } from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { Breadcrumb, type BreadcrumbItem } from '@/components/Breadcrumb'
import { StatusBadge, getStatusVariant } from '@/components/StatusBadge'
import {
  tradeFairVenues,
  tradeFairProperties,
  tradeFairAgents,
  type TradeFairVenue,
  type TradeFairProperty,
  type TradeFairAgent,
} from '@/data/mockData'
import { cn } from '@/lib/utils'

export default function TradeFairsPage() {
  const [selectedVenue, setSelectedVenue] = useState<TradeFairVenue | null>(null)
  const [activeTab, setActiveTab] = useState<'properties' | 'agents'>('properties')

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: 'Trade Fairs',
      ...(selectedVenue
        ? { onClick: () => setSelectedVenue(null) }
        : {}),
    },
    ...(selectedVenue
      ? [{ label: `${selectedVenue.venue} — ${selectedVenue.date}` }]
      : []),
  ]

  const filteredProperties = useMemo(
    () =>
      selectedVenue
        ? tradeFairProperties.filter((p) => p.fairId === selectedVenue.id)
        : [],
    [selectedVenue]
  )

  const filteredAgents = useMemo(
    () =>
      selectedVenue
        ? tradeFairAgents.filter((a) => a.fairId === selectedVenue.id)
        : [],
    [selectedVenue]
  )

  const propertyColumns: ColumnDef<TradeFairProperty, any>[] = useMemo(
    () => [
      {
        accessorKey: 'propertyName',
        header: 'Property Name',
        cell: ({ row }) => (
          <span className="font-medium text-surface-900">{row.original.propertyName}</span>
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
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge
            label={row.original.status}
            variant={getStatusVariant(row.original.status)}
            dot
          />
        ),
      },
    ],
    []
  )

  const agentColumns: ColumnDef<TradeFairAgent, any>[] = useMemo(
    () => [
      {
        accessorKey: 'agentName',
        header: 'Agent Name',
        cell: ({ row }) => (
          <span className="font-medium text-surface-900">{row.original.agentName}</span>
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
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge
            label={row.original.status}
            variant={getStatusVariant(row.original.status)}
            dot
          />
        ),
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">Trade Fairs</h1>
        <div className="mt-2">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {!selectedVenue ? (
        /* Venue Cards */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tradeFairVenues.map((venue) => {
            const propCount = tradeFairProperties.filter((p) => p.fairId === venue.id).length
            const agentCount = tradeFairAgents.filter((a) => a.fairId === venue.id).length
            return (
              <button
                key={venue.id}
                onClick={() => setSelectedVenue(venue)}
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

          {/* Tabs */}
          <div className="flex gap-1 rounded-lg border border-surface-200 bg-surface-50 p-1">
            <button
              onClick={() => setActiveTab('properties')}
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
              onClick={() => setActiveTab('agents')}
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
            />
          ) : (
            <DataTable
              data={filteredAgents}
              columns={agentColumns}
              searchPlaceholder="Search agents..."
            />
          )}
        </div>
      )}
    </div>
  )
}
