import { useState, useMemo, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import {
  Plus,
  Eye,
  Edit,
  MapPin,
  ExternalLink,
  AlertTriangle,
  Trash2,
  RotateCcw,
  FileText,
} from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { Breadcrumb, type BreadcrumbItem } from '@/components/Breadcrumb'
import { FolderNavigator } from '@/components/FolderNavigator'
import { StatusBadge, getStatusVariant } from '@/components/StatusBadge'
import { Modal, FormField, Input, Select, Button, Textarea } from '@/components/FormElements'
import { formatCurrency } from '@/lib/utils'
import { fetchConfig, type AppConfig, type LocationNode } from '@/lib/configApi'
import { fetchProperties, fetchDeletedProperties, softDeleteProperty, restoreProperty, deleteProperty, createProperty, updateProperty, type Property as ApiProperty } from '@/lib/propertiesApi'
import { fetchSalesRecords, type SalesRecord } from '@/lib/salesApi'
import { differenceInDays, parseISO } from 'date-fns'

type DemoRole = 'manager' | 'sales' | 'accountant' | 'crm'

/** UI shape (camelCase) for property list and forms */
export interface Property {
  id: string
  slno: number
  name: string
  propertyType: string
  propertyClass: string
  roomCategory: string
  numberOfRooms: number
  hasMultipleProperty: boolean
  numberOfProperties?: number
  email: string
  proposedPrice: number
  finalCommittedPrice: number
  tenure: string
  place: string
  primaryContactPerson: string
  contactPersonName: string
  contactNumber: string
  primaryPersonPosition?: string
  executiveName?: string
  firstVisitDate: string
  firstVisitStatus: string
  committedProposedRate?: string
  comments: string
  rescheduledDate?: string
  rescheduledComment?: string
  secondVisitExecutive?: string
  secondVisitDate?: string
  secondVisitStatus?: string
  secondVisitComments?: string
  currentlyAssignedTo?: string
  planType?: string
  closingAmount?: number
  planStartDate: string
  planExpiryDate: string
  locationLink: string
  currentPMS: string
  connectedOTAPlatforms: string[]
  state: string
  district: string
  location: string
  isDraft?: boolean
}

interface DeletedProperty extends Property {
  deletedAt: string
}

export default function PropertiesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [path, setPath] = useState<string[]>([])
  const [pathLabels, setPathLabels] = useState<string[]>([])
  const [propertyList, setPropertyList] = useState<Property[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [tenureFilter, setTenureFilter] = useState('')
  const [roomsFilter, setRoomsFilter] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [currentRole, setCurrentRole] = useState<DemoRole | null>(null)
  const [showDeleted, setShowDeleted] = useState(false)
  const [showDrafts, setShowDrafts] = useState(false)
  const [deletedProperties, setDeletedProperties] = useState<DeletedProperty[]>([])
  const [draftProperties, setDraftProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)



  const getRemainingDays = (deletedAt?: string) => {
    if (!deletedAt) return 30
    const diff = Date.now() - new Date(deletedAt).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return Math.max(0, 30 - days)
  }

  const [config, setConfig] = useState<AppConfig | null>(null)
  const [salesRecordsList, setSalesRecordsList] = useState<SalesRecord[]>([])

  const mapApiPropertyToProperty = (p: ApiProperty): Property => ({
    id: p.id,
    slno: p.slno,
    name: p.name,
    propertyType: p.property_type,
    propertyClass: p.property_class,
    roomCategory: p.room_category,
    numberOfRooms: p.number_of_rooms,
    hasMultipleProperty: p.has_multiple_property,
    numberOfProperties: p.number_of_properties ?? undefined,
    email: p.email,
    proposedPrice: Number(p.proposed_price),
    finalCommittedPrice: Number(p.final_committed_price),
    tenure: p.tenure,
    place: p.place,
    primaryContactPerson: p.primary_contact_person,
    contactPersonName: p.contact_person_name,
    contactNumber: p.contact_number,
    primaryPersonPosition: p.primary_person_position ?? undefined,
    executiveName: p.executive_name ?? undefined,
    firstVisitDate: p.first_visit_date,
    firstVisitStatus: p.first_visit_status,
    committedProposedRate: p.committed_proposed_rate ?? undefined,
    comments: p.comments ?? '',
    rescheduledDate: p.rescheduled_date ?? undefined,
    rescheduledComment: p.rescheduled_comment ?? undefined,
    secondVisitExecutive: p.second_visit_executive ?? undefined,
    secondVisitDate: p.second_visit_date ?? undefined,
    secondVisitStatus: p.second_visit_status ?? undefined,
    secondVisitComments: p.second_visit_comments ?? undefined,
    currentlyAssignedTo: p.currently_assigned_to ?? undefined,
    planType: p.plan_type ?? undefined,
    closingAmount:
      p.closing_amount !== null && p.closing_amount !== undefined
        ? Number(p.closing_amount)
        : undefined,
    planStartDate: p.plan_start_date,
    planExpiryDate: p.plan_expiry_date,
    locationLink: p.location_link,
    currentPMS: p.current_pms,
    connectedOTAPlatforms: Array.isArray(p.connected_ota_platforms)
      ? p.connected_ota_platforms
      : [],
    state: p.state,
    district: p.district,
    location: p.location,
    isDraft: p.is_draft,
  })

  const locationHierarchy: LocationNode[] = config?.location_hierarchy ?? []
  const propertyTypes = config?.property_types ?? []
  const propertyClasses = config?.property_classes ?? []
  const roomCategories = config?.room_categories ?? []
  const tenureOptions = config?.tenure_options ?? []
  const primaryContactOptions = config?.primary_contact_options ?? []
  const visitStatusOptions = config?.visit_status_options ?? []
  const firstVisitStatusOptions = config?.first_visit_status_options ?? []
  const planTypeOptions = config?.plan_type_options ?? []

  function toApiPayload(p: Partial<Property>): Partial<ApiProperty> {
    return {
      name: p.name,
      property_type: p.propertyType,
      property_class: p.propertyClass,
      room_category: p.roomCategory,
      number_of_rooms: p.numberOfRooms,
      has_multiple_property: p.hasMultipleProperty,
      number_of_properties: p.numberOfProperties ?? null,
      email: p.email,
      proposed_price: String(p.proposedPrice ?? 0),
      final_committed_price: String(p.finalCommittedPrice ?? 0),
      tenure: p.tenure,
      place: p.place,
      primary_contact_person: p.primaryContactPerson,
      contact_person_name: p.contactPersonName,
      contact_number: p.contactNumber,
      primary_person_position: p.primaryPersonPosition ?? null,
      executive_name: p.executiveName ?? null,
      first_visit_date: p.firstVisitDate,
      first_visit_status: p.firstVisitStatus,
      committed_proposed_rate: p.committedProposedRate ?? null,
      comments: p.comments ?? '',
      second_visit_executive: p.secondVisitExecutive ?? null,
      second_visit_date: p.secondVisitDate ?? null,
      second_visit_status: p.secondVisitStatus ?? null,
      second_visit_comments: p.secondVisitComments ?? null,
      currently_assigned_to: p.currentlyAssignedTo ?? null,
      plan_type: p.planType ?? null,
      closing_amount: p.closingAmount != null ? String(p.closingAmount) : null,
      plan_start_date: p.planStartDate,
      plan_expiry_date: p.planExpiryDate,
      location_link: p.locationLink ?? '',
      current_pms: p.currentPMS ?? 'None',
      connected_ota_platforms: p.connectedOTAPlatforms ?? [],
      state: p.state,
      district: p.district,
      location: p.location,
      is_draft: p.isDraft,
    }
  }
  function getPathLabels(hierarchy: LocationNode[], pathIds: string[]): string[] {
    const labels: string[] = []
    let current: LocationNode[] = hierarchy
    for (const id of pathIds) {
      const node = current.find((n) => n.id === id)
      if (!node) break
      labels.push(node.name)
      current = node.children ?? []
    }
    return labels
  }

  const loadProperties = useCallback(async () => {
    try {
      setIsLoading(true)
      setLoadError(null)
      const items = await fetchProperties({ is_draft: false })
      setPropertyList(items.map(mapApiPropertyToProperty))
    } catch (err: unknown) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load properties')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadDraftProperties = useCallback(async () => {
    try {
      setIsLoading(true)
      const items = await fetchProperties({ is_draft: true })
      setDraftProperties(items.map(mapApiPropertyToProperty))
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadDeletedProperties = useCallback(async () => {
    try {
      const items = await fetchDeletedProperties({ retention_days: 30 })
      setDeletedProperties(
        items.map((p) => ({
          ...mapApiPropertyToProperty(p),
          deletedAt: p.deleted_at ?? '',
        }))
      )
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      const rawUser = window.localStorage.getItem('bookito_demo_user')
      if (rawUser) {
        const parsed = JSON.parse(rawUser) as { role?: DemoRole }
        if (parsed.role) setCurrentRole(parsed.role)
      }
    } catch {
      // ignore
    }
    fetchConfig().then(setConfig).catch(() => {})
    fetchSalesRecords().then(setSalesRecordsList).catch(() => {})
    void loadProperties()
    void loadDeletedProperties()
    void loadDraftProperties()
  }, [loadProperties, loadDeletedProperties, loadDraftProperties])

  useEffect(() => {
    const state = location.state as { path?: string[]; pathLabels?: string[] } | null
    if (state?.path && state.path.length > 0) {
      setPath(state.path)
      setPathLabels(state.pathLabels ?? [])
    }
  }, [location.state])

  useEffect(() => {
    if (config && path.length > 0) {
      setPathLabels((prev) => {
        const fromHierarchy = getPathLabels(locationHierarchy, path)
        return fromHierarchy.length === path.length ? fromHierarchy : prev
      })
    }
  }, [config, path])

  const canEditOrCreate = currentRole === 'sales' || currentRole === 'crm'

  // Are we at the leaf level (showing properties)?
  // Now: State -> District -> Properties table
  const isLeafLevel = path.length >= 2

  // Build breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: 'Properties',
      ...(path.length > 0
        ? {
            onClick: () => {
              setPath([])
              setPathLabels([])
            },
          }
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

  const handleNavigate = (newPath: string[], _node?: LocationNode) => {
    setPath(newPath)
    setPathLabels(getPathLabels(locationHierarchy, newPath))
  }

  // Filter properties by current path
  const filteredProperties = useMemo(() => {
    if (!isLeafLevel) return []
    const [stateId, districtId] = path
    // Find names from hierarchy
    const state = locationHierarchy.find((s) => s.id === stateId)
    const district = state?.children?.find((d) => d.id === districtId)

    return propertyList.filter((p) => {
      if (p.state !== state?.name || p.district !== district?.name) return false

      const q = searchQuery.toLowerCase()
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.place.toLowerCase().includes(q) ||
        p.contactPersonName.toLowerCase().includes(q)

      if (!matchesSearch) return false

      if (statusFilter && p.secondVisitStatus !== statusFilter) return false
      if (tenureFilter && p.tenure !== tenureFilter) return false
      if (classFilter && p.propertyClass !== classFilter) return false
      if (typeFilter && p.propertyType !== typeFilter) return false

      if (roomsFilter) {
        const rooms = p.numberOfRooms
        if (roomsFilter === '1-10' && !(rooms >= 1 && rooms <= 10)) return false
        if (roomsFilter === '11-20' && !(rooms >= 11 && rooms <= 20)) return false
        if (roomsFilter === '21-30' && !(rooms >= 21 && rooms <= 30)) return false
        if (roomsFilter === '30+' && !(rooms >= 31)) return false
      }

      return true
    })
  }, [
    isLeafLevel,
    path,
    propertyList,
    searchQuery,
    statusFilter,
    tenureFilter,
    roomsFilter,
    classFilter,
    typeFilter,
  ])

  const deletedPropertiesForPath = useMemo(() => {
    if (!isLeafLevel) return []
    const [stateId, districtId] = path
    const state = locationHierarchy.find((s) => s.id === stateId)
    const district = state?.children?.find((d) => d.id === districtId)

    return deletedProperties.filter(
      (p) => p.state === state?.name && p.district === district?.name
    )
  }, [isLeafLevel, path, deletedProperties, locationHierarchy])

  const getLifecycleStatus = useCallback(
    (property: Property): { label: string; variant: Parameters<typeof getStatusVariant>[0] | 'success' | 'warning' | 'info' | 'default' } => {
      const record = salesRecordsList.find((s) => s.property_name === property.name)
      if (record?.is_live) return { label: 'Live', variant: 'success' }
      if (record?.trial_provided) return { label: 'Trial', variant: 'warning' }
      if (record?.demo_provided) return { label: 'Demo', variant: 'info' }
      return { label: 'Prospect', variant: 'default' }
    },
    [salesRecordsList]
  )

  const [draftPendingDelete, setDraftPendingDelete] = useState<Property | null>(null)

  const filteredDrafts = useMemo(() => {
    if (!isLeafLevel) return []
    const [stateId, districtId] = path
    const state = locationHierarchy.find((s) => s.id === stateId)
    const district = state?.children?.find((d) => d.id === districtId)

    return draftProperties.filter(
      (p) => p.state === state?.name && p.district === district?.name
    )
  }, [isLeafLevel, path, draftProperties, locationHierarchy])

  const handleDelete = useCallback(
    (property: Property) => {
      void (async () => {
        try {
          await softDeleteProperty(property.id)
          await loadProperties()
          await loadDeletedProperties()
        } catch (err: unknown) {
          const message =
            err instanceof Error
              ? err.message
              : 'Failed to delete property. This might be due to lack of permissions.'
          alert(message)
        }
      })()
    },
    [loadProperties, loadDeletedProperties]
  )

  const confirmDeleteDraft = useCallback(() => {
    const target = draftPendingDelete
    if (!target) return
    void (async () => {
      try {
        await deleteProperty(target.id)
        setDraftProperties((prev) => prev.filter((p) => p.id !== target.id))
        setDraftPendingDelete(null)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to delete draft.'
        alert(message)
      }
    })()
  }, [draftPendingDelete])

  const handleRestore = useCallback((property: DeletedProperty) => {
    void (async () => {
      try {
        await restoreProperty(property.id)
        await loadProperties()
        await loadDeletedProperties()
      } catch {
        // ignore
      }
    })()
  }, [loadProperties, loadDeletedProperties])

  const columns: ColumnDef<Property, any>[] = useMemo(
    () => [
      {
        accessorKey: 'slno',
        header: 'SL No',
        size: 60,
      },
      {
        accessorKey: 'name',
        header: 'Property Name',
        cell: ({ row }) => (
          <span className="font-medium text-surface-900">{row.original.name}</span>
        ),
      },
      {
        accessorKey: 'propertyType',
        header: 'Type',
        cell: ({ row }) => (
          <StatusBadge label={row.original.propertyType} variant="info" />
        ),
      },
      {
        accessorKey: 'propertyClass',
        header: 'Class',
        cell: ({ row }) => {
          const cls = row.original.propertyClass
          const variant = cls === 'Luxury' ? 'purple' : cls === 'Premium' ? 'info' : cls === 'Standard' ? 'default' : 'outline'
          return <StatusBadge label={cls} variant={variant} />
        },
      },
      {
        accessorKey: 'numberOfRooms',
        header: 'Rooms',
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: ({ row }) => (
          <span className="text-surface-600">{row.original.location || '—'}</span>
        ),
      },
      {
        accessorKey: 'place',
        header: 'Place',
        cell: ({ row }) => (
          <span className="text-surface-600">{row.original.place || '—'}</span>
        ),
      },
      {
        accessorKey: 'contactPersonName',
        header: 'Contact',
      },
      {
        accessorKey: 'firstVisitStatus',
        header: 'First Visit',
        cell: ({ row }) => (
          <span className="text-surface-600">{row.original.firstVisitStatus || '—'}</span>
        ),
      },
      {
        accessorKey: 'executiveName',
        header: 'Executive',
        cell: ({ row }) => (
          <span className="text-surface-600">{row.original.executiveName || '—'}</span>
        ),
      },
      {
        accessorKey: 'currentlyAssignedTo',
        header: 'Assigned To',
        cell: ({ row }) => (
          <span className="text-surface-600">{row.original.currentlyAssignedTo || '—'}</span>
        ),
      },
      {
        accessorKey: 'finalCommittedPrice',
        header: 'Price',
        cell: ({ row }) => (
          <span>{row.original.finalCommittedPrice ? formatCurrency(row.original.finalCommittedPrice) : '—'}</span>
        ),
      },
      {
        accessorKey: 'tenure',
        header: 'Tenure',
      },
      {
        id: 'lifecycleStatus',
        header: 'Lifecycle',
        cell: ({ row }) => {
          const status = getLifecycleStatus(row.original)
          return (
            <StatusBadge
              label={status.label}
              variant={status.variant as 'default' | 'success' | 'warning' | 'info' | 'purple' | 'outline' | 'danger'}
            />
          )
        },
      },
      {
        accessorKey: 'planExpiryDate',
        header: 'Expiry',
        cell: ({ row }) => {
          const expiry = row.original.planExpiryDate
          if (!expiry) return <span className="text-surface-400">—</span>
          const daysLeft = differenceInDays(parseISO(expiry), new Date())
          const isExpiring = daysLeft <= 7 && daysLeft >= 0
          return (
            <div className="flex items-center gap-1">
              <span>{expiry}</span>
              {isExpiring && (
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              )}
            </div>
          )
        },
      },
      {
        accessorKey: 'secondVisitStatus',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.secondVisitStatus
          if (!status) return <span className="text-surface-400">—</span>
          return <StatusBadge label={status} variant={getStatusVariant(status)} dot />
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                navigate(`/properties/${row.original.id}`, {
                  state: { path, pathLabels },
                })
              }}
              className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600"
            >
              <Eye className="h-4 w-4" />
            </button>
            {canEditOrCreate && (
              <>
                <button
                  onClick={() => {
                    navigate(`/properties/edit/${row.original.id}`, {
                      state: { path, pathLabels },
                    })
                  }}
                  className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    showDrafts ? setDraftPendingDelete(row.original) : handleDelete(row.original)
                  }
                  className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  title={showDrafts ? 'Delete draft' : 'Move to trash'}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
            {row.original.locationLink && (
              <a
                href={row.original.locationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600"
              >
                <MapPin className="h-4 w-4" />
              </a>
            )}
          </div>
        ),
      },
    ],
    [canEditOrCreate, navigate, path, pathLabels, handleDelete, getLifecycleStatus, showDrafts]
  )

  const deletedColumns: ColumnDef<DeletedProperty, any>[] = useMemo(
    () => [
      {
        accessorKey: 'slno',
        header: 'SL No',
        size: 60,
      },
      {
        accessorKey: 'name',
        header: 'Property Name',
        cell: ({ row }) => (
          <span className="font-medium text-surface-900">{row.original.name}</span>
        ),
      },
      {
        accessorKey: 'propertyType',
        header: 'Type',
      },
      {
        accessorKey: 'propertyClass',
        header: 'Class',
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
              onClick={() => {
                navigate(`/properties/${row.original.id}`, {
                  state: { path, pathLabels },
                })
              }}
              className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600"
            >
              <Eye className="h-4 w-4" />
            </button>
            {canEditOrCreate && (
              <button
                onClick={() => handleRestore(row.original)}
                className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                title="Restore"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        ),
      },
    ],
    [canEditOrCreate, navigate, path, pathLabels, handleRestore]
  )

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Properties</h1>
        </div>
        <div className="flex flex-1 items-center justify-end gap-3 md:flex-none">
          {isLeafLevel && canEditOrCreate && (
          <Button onClick={() => navigate('/properties/add', { state: { path, pathLabels } })}>
            <Plus className="h-4 w-4" />
              Create Property
          </Button>
        )}
        </div>
      </div>

      {/* Folder Navigation or Table */}
      {!isLeafLevel ? (
        <FolderNavigator
          hierarchy={locationHierarchy}
          path={path}
          onNavigate={handleNavigate}
          propertyList={propertyList}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex rounded-lg border border-surface-200 p-0.5 w-fit">
            <button
              onClick={() => {
                setShowDeleted(false)
                setShowDrafts(false)
              }}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                !showDeleted && !showDrafts
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => {
                setShowDeleted(false)
                setShowDrafts(true)
              }}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                showDrafts
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Drafts
            </button>
            <button
              onClick={() => {
                setShowDeleted(true)
                setShowDrafts(false)
              }}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                showDeleted
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Trash
            </button>
          </div>

          {!showDeleted && !showDrafts ? (
            <div className="space-y-3">
              <p className="text-xs font-medium text-surface-500">
                {filteredProperties.length}{' '}
                {filteredProperties.length === 1 ? 'property' : 'properties'}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-md border border-surface-300 bg-white px-2.5 py-1.5 text-xs text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">All statuses</option>
                  {visitStatusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <select
                  value={tenureFilter}
                  onChange={(e) => setTenureFilter(e.target.value)}
                  className="rounded-md border border-surface-300 bg-white px-2.5 py-1.5 text-xs text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">All tenures</option>
                  {tenureOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <select
                  value={roomsFilter}
                  onChange={(e) => setRoomsFilter(e.target.value)}
                  className="rounded-md border border-surface-300 bg-white px-2.5 py-1.5 text-xs text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">All room ranges</option>
                  <option value="1-10">1–10 rooms</option>
                  <option value="11-20">11–20 rooms</option>
                  <option value="21-30">21–30 rooms</option>
                  <option value="30+">30+ rooms</option>
                </select>
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="rounded-md border border-surface-300 bg-white px-2.5 py-1.5 text-xs text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">All classes</option>
                  {propertyClasses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-md border border-surface-300 bg-white px-2.5 py-1.5 text-xs text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">All types</option>
                  {propertyTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
        <DataTable
          data={filteredProperties}
          columns={columns}
          searchPlaceholder="Search properties..."
        />
            </div>
          ) : showDrafts ? (
            <div className="space-y-3">
              <p className="text-xs font-medium text-surface-500">
                {filteredDrafts.length}{' '}
                {filteredDrafts.length === 1 ? 'draft' : 'drafts'}
              </p>
              <DataTable
                data={filteredDrafts}
                columns={columns}
                searchPlaceholder="Search drafts..."
              />
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-medium text-surface-500">
                {deletedPropertiesForPath.length}{' '}
                {deletedPropertiesForPath.length === 1
                  ? 'deleted property'
                  : 'deleted properties'}
              </p>
              <DataTable
                data={deletedPropertiesForPath}
                columns={deletedColumns}
                searchPlaceholder="Search deleted properties..."
              />
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={draftPendingDelete !== null}
        onClose={() => setDraftPendingDelete(null)}
        title="Delete draft?"
        size="sm"
      >
        <p className="text-sm text-surface-600">
          Delete &quot;{draftPendingDelete?.name}&quot;? This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={() => setDraftPendingDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" type="button" onClick={confirmDeleteDraft}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-surface-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-surface-800">{value}</p>
    </div>
  )
}
