import { useState, useMemo, useEffect } from 'react'
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
} from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { Breadcrumb, type BreadcrumbItem } from '@/components/Breadcrumb'
import { FolderNavigator } from '@/components/FolderNavigator'
import { StatusBadge, getStatusVariant } from '@/components/StatusBadge'
import { Modal, FormField, Input, Select, Button, Textarea } from '@/components/FormElements'
import { locationHierarchy, properties, type Property, propertyTypes, propertyClasses, roomCategories, tenureOptions, primaryContactOptions, visitStatusOptions } from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'
import { differenceInDays, parseISO } from 'date-fns'

type DemoRole = 'manager' | 'sales' | 'accountant' | 'crm'

interface DeletedProperty extends Property {
  deletedAt: string
}

export default function PropertiesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [path, setPath] = useState<string[]>([])
  const [pathLabels, setPathLabels] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [propertyList, setPropertyList] = useState<Property[]>(properties)
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
  const [deletedProperties, setDeletedProperties] = useState<DeletedProperty[]>([])
  const [editForm, setEditForm] = useState({
    name: '',
    propertyType: '',
    propertyClass: '',
    roomCategory: '',
    numberOfRooms: '',
    email: '',
    proposedPrice: '',
    tenure: '',
    primaryContactPerson: '',
    contactPersonName: '',
    contactNumber: '',
    firstVisitDate: '',
    locationLink: '',
    finalCommittedPrice: '',
    secondVisitStatus: '',
    planExpiryDate: '',
    comments: '',
  })

  const getRemainingDays = (deletedAt?: string) => {
    if (!deletedAt) return 30
    const diff = Date.now() - new Date(deletedAt).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return Math.max(0, 30 - days)
  }

  useEffect(() => {
    // Load current demo user role
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

    // Purge logic for local state
    const now = new Date()
    setDeletedProperties((prev) =>
      prev.filter((p) => differenceInDays(now, parseISO(p.deletedAt)) < 30)
    )
  }, [])

  useEffect(() => {
    const state = location.state as
      | {
          path?: string[]
          pathLabels?: string[]
        }
      | null

    if (state?.path && state.path.length > 0) {
      setPath(state.path)
      setPathLabels(state.pathLabels ?? [])
    }
  }, [location.state])

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

  const handleNavigate = (newPath: string[], node?: any) => {
    setPath(newPath)
    if (node) {
      setPathLabels([...pathLabels, node.name])
    }
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
  }, [isLeafLevel, path, deletedProperties])

  const handleDelete = (property: Property) => {
    const deletedAt = new Date().toISOString()
    const entry: DeletedProperty = { ...property, deletedAt }

    setDeletedProperties((prev) => {
      const updated = [...prev.filter((p) => p.id !== property.id), entry]
      window.localStorage.setItem(
        'bookito_deleted_properties',
        JSON.stringify(updated)
      )
      return updated
    })

    setPropertyList((prev) => prev.filter((p) => p.id !== property.id))
  }

  const handleRestore = (property: DeletedProperty) => {
    setDeletedProperties((prev) => {
      const updated = prev.filter((p) => p.id !== property.id)
      window.localStorage.setItem(
        'bookito_deleted_properties',
        JSON.stringify(updated)
      )
      return updated
    })

    setPropertyList((prev) => [...prev, property])
  }

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
        accessorKey: 'contactPersonName',
        header: 'Contact',
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
                    const current = row.original
                    setEditingProperty(current)
                    setEditForm({
                      name: current.name,
                      propertyType: current.propertyType,
                      propertyClass: current.propertyClass,
                      roomCategory: current.roomCategory,
                      numberOfRooms: String(current.numberOfRooms ?? ''),
                      email: current.email ?? '',
                      proposedPrice: String(current.proposedPrice ?? ''),
                      tenure: current.tenure ?? '',
                      primaryContactPerson: current.primaryContactPerson ?? '',
                      contactPersonName: current.contactPersonName ?? '',
                      contactNumber: current.contactNumber ?? '',
                      firstVisitDate: current.firstVisitDate ?? '',
                      locationLink: current.locationLink ?? '',
                      finalCommittedPrice: String(current.finalCommittedPrice ?? ''),
                      secondVisitStatus: current.secondVisitStatus ?? '',
                      planExpiryDate: current.planExpiryDate ?? '',
                      comments: current.comments ?? '',
                    })
                    setShowEditModal(true)
                  }}
                  className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600"
                >
              <Edit className="h-4 w-4" />
            </button>
                <button
                  onClick={() => handleDelete(row.original)}
                  className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-red-50 hover:text-red-600"
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
    [canEditOrCreate]
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
                className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-emerald-600"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        ),
      },
    ],
    [canEditOrCreate, navigate]
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Properties</h1>
          <div className="mt-2">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-3 md:flex-none">
          {isLeafLevel && canEditOrCreate && (
          <Button onClick={() => setShowAddModal(true)}>
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
        />
      ) : (
        <div className="space-y-4">
          <div className="flex rounded-lg border border-surface-200 p-0.5 w-fit">
            <button
              onClick={() => setShowDeleted(false)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                !showDeleted
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setShowDeleted(true)}
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

          {!showDeleted ? (
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

      {/* Edit Property Modal */}
      {editingProperty && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setEditingProperty(null)
          }}
          title={`Edit ${editingProperty.name}`}
          size="xl"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Property Name">
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter property name"
              />
            </FormField>
            <FormField label="Property Type">
              <Select
                value={editForm.propertyType}
                onChange={(value) =>
                  setEditForm((prev) => ({ ...prev, propertyType: value }))
                }
                options={propertyTypes.map((t) => ({ label: t, value: t }))}
                placeholder="Select type"
              />
            </FormField>
            <FormField label="Property Class">
              <Select
                value={editForm.propertyClass}
                onChange={(value) =>
                  setEditForm((prev) => ({ ...prev, propertyClass: value }))
                }
                options={propertyClasses.map((c) => ({ label: c, value: c }))}
                placeholder="Select class"
              />
            </FormField>
            <FormField label="Room Category">
              <Select
                value={editForm.roomCategory}
                onChange={(value) =>
                  setEditForm((prev) => ({ ...prev, roomCategory: value }))
                }
                options={roomCategories.map((r) => ({ label: r, value: r }))}
                placeholder="Select category"
              />
            </FormField>
            <FormField label="Number of Rooms">
              <Input
                type="number"
                value={editForm.numberOfRooms}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, numberOfRooms: e.target.value }))
                }
                placeholder="0"
              />
            </FormField>
            <FormField label="Email">
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="property@email.com"
              />
            </FormField>
            <FormField label="Proposed Price">
              <Input
                type="number"
                value={editForm.proposedPrice}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, proposedPrice: e.target.value }))
                }
                placeholder="0"
              />
            </FormField>
            <FormField label="Tenure">
              <Select
                value={editForm.tenure}
                onChange={(value) => setEditForm((prev) => ({ ...prev, tenure: value }))}
                options={tenureOptions.map((t) => ({ label: t, value: t }))}
                placeholder="Select tenure"
              />
            </FormField>
            <FormField label="Primary Contact Person">
              <Select
                value={editForm.primaryContactPerson}
                onChange={(value) =>
                  setEditForm((prev) => ({ ...prev, primaryContactPerson: value }))
                }
                options={primaryContactOptions.map((p) => ({ label: p, value: p }))}
                placeholder="Select role"
              />
            </FormField>
            <FormField label="Contact Person Name">
              <Input
                value={editForm.contactPersonName}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, contactPersonName: e.target.value }))
                }
                placeholder="Enter name"
              />
            </FormField>
            <FormField label="Contact Number">
              <Input
                value={editForm.contactNumber}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, contactNumber: e.target.value }))
                }
                placeholder="+91 XXXXX XXXXX"
              />
            </FormField>
            <FormField label="First Visit Date">
              <Input
                type="date"
                value={editForm.firstVisitDate}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, firstVisitDate: e.target.value }))
                }
              />
            </FormField>
            <FormField label="Location Link">
              <Input
                value={editForm.locationLink}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, locationLink: e.target.value }))
                }
                placeholder="https://maps.google.com/..."
              />
            </FormField>
            <FormField label="Final Committed Price">
              <Input
                type="number"
                value={editForm.finalCommittedPrice}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, finalCommittedPrice: e.target.value }))
                }
                placeholder="0"
              />
            </FormField>
            <FormField label="Visit Status">
              <Select
                value={editForm.secondVisitStatus}
                onChange={(value) =>
                  setEditForm((prev) => ({ ...prev, secondVisitStatus: value }))
                }
                options={visitStatusOptions.map((s) => ({ label: s, value: s }))}
                placeholder="Select status"
              />
            </FormField>
            <FormField label="Plan Expiry Date">
              <Input
                type="date"
                value={editForm.planExpiryDate}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, planExpiryDate: e.target.value }))
                }
              />
            </FormField>
              <div className="col-span-2">
              <FormField label="Comments">
                <Textarea
                  rows={3}
                  value={editForm.comments}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, comments: e.target.value }))
                  }
                  placeholder="Any comments..."
                />
              </FormField>
              </div>
              </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowEditModal(false)
                setEditingProperty(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!editingProperty) return
                setPropertyList((prev) =>
                  prev.map((p) =>
                    p.id === editingProperty.id
                      ? {
                          ...p,
                          name: editForm.name || p.name,
                          propertyType: (editForm.propertyType || p.propertyType) as Property['propertyType'],
                          propertyClass: (editForm.propertyClass || p.propertyClass) as Property['propertyClass'],
                          roomCategory: (editForm.roomCategory || p.roomCategory) as Property['roomCategory'],
                          numberOfRooms:
                            editForm.numberOfRooms.trim() === ''
                              ? p.numberOfRooms
                              : Number(editForm.numberOfRooms),
                          email: editForm.email || p.email,
                          proposedPrice:
                            editForm.proposedPrice.trim() === ''
                              ? p.proposedPrice
                              : Number(editForm.proposedPrice),
                          primaryContactPerson:
                            (editForm.primaryContactPerson || p.primaryContactPerson) as Property['primaryContactPerson'],
                          contactPersonName: editForm.contactPersonName || p.contactPersonName,
                          contactNumber: editForm.contactNumber || p.contactNumber,
                          firstVisitDate: editForm.firstVisitDate || p.firstVisitDate,
                          locationLink: editForm.locationLink || p.locationLink,
                          finalCommittedPrice:
                            editForm.finalCommittedPrice.trim() === ''
                              ? p.finalCommittedPrice
                              : Number(editForm.finalCommittedPrice),
                          tenure: (editForm.tenure || p.tenure) as Property['tenure'],
                          secondVisitStatus: editForm.secondVisitStatus
                            ? (editForm.secondVisitStatus as Property['secondVisitStatus'])
                            : p.secondVisitStatus,
                          planExpiryDate: editForm.planExpiryDate || p.planExpiryDate,
                          comments: editForm.comments || p.comments,
                        }
                      : p
                  )
                )
                setShowEditModal(false)
                setEditingProperty(null)
              }}
            >
              Save Changes
            </Button>
          </div>
        </Modal>
      )}

      {/* Add Property Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Property"
        size="xl"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Property Name">
            <Input placeholder="Enter property name" />
          </FormField>
          <FormField label="Property Type">
            <Select
              options={propertyTypes.map((t) => ({ label: t, value: t }))}
              placeholder="Select type"
            />
          </FormField>
          <FormField label="Property Class">
            <Select
              options={propertyClasses.map((c) => ({ label: c, value: c }))}
              placeholder="Select class"
            />
          </FormField>
          <FormField label="Room Category">
            <Select
              options={roomCategories.map((r) => ({ label: r, value: r }))}
              placeholder="Select category"
            />
          </FormField>
          <FormField label="Number of Rooms">
            <Input type="number" placeholder="0" />
          </FormField>
          <FormField label="Email">
            <Input type="email" placeholder="property@email.com" />
          </FormField>
          <FormField label="Proposed Price">
            <Input type="number" placeholder="0" />
          </FormField>
          <FormField label="Tenure">
            <Select
              options={tenureOptions.map((t) => ({ label: t, value: t }))}
              placeholder="Select tenure"
            />
          </FormField>
          <FormField label="Primary Contact Person">
            <Select
              options={primaryContactOptions.map((p) => ({ label: p, value: p }))}
              placeholder="Select role"
            />
          </FormField>
          <FormField label="Contact Person Name">
            <Input placeholder="Enter name" />
          </FormField>
          <FormField label="Contact Number">
            <Input placeholder="+91 XXXXX XXXXX" />
          </FormField>
          <FormField label="First Visit Date">
            <Input type="date" />
          </FormField>
          <FormField label="Location Link">
            <Input placeholder="https://maps.google.com/..." />
          </FormField>
          <div className="col-span-2">
            <FormField label="Comments">
              <Textarea rows={3} placeholder="Any comments..." />
            </FormField>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowAddModal(false)}>Save Property</Button>
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
