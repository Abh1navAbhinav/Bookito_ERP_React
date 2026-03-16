import { useState, useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { Plus, Eye, Edit, MapPin, ExternalLink, AlertTriangle } from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { Breadcrumb, type BreadcrumbItem } from '@/components/Breadcrumb'
import { FolderNavigator } from '@/components/FolderNavigator'
import { StatusBadge, getStatusVariant } from '@/components/StatusBadge'
import { Modal, FormField, Input, Select, Button, Textarea } from '@/components/FormElements'
import { locationHierarchy, properties, type Property, propertyTypes, propertyClasses, roomCategories, tenureOptions, primaryContactOptions, visitStatusOptions } from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'
import { differenceInDays, parseISO } from 'date-fns'

export default function PropertiesPage() {
  const [path, setPath] = useState<string[]>([])
  const [pathLabels, setPathLabels] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)

  // Are we at the leaf level (showing properties)?
  const isLeafLevel = path.length >= 3

  // Build breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: 'Properties',
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
    if (node) {
      setPathLabels([...pathLabels, node.name])
    }
  }

  // Filter properties by current path
  const filteredProperties = useMemo(() => {
    if (!isLeafLevel) return []
    const [stateId, districtId, locationId] = path
    // Find names from hierarchy
    const state = locationHierarchy.find((s) => s.id === stateId)
    const district = state?.children?.find((d) => d.id === districtId)
    const location = district?.children?.find((l) => l.id === locationId)

    return properties.filter(
      (p) =>
        p.state === state?.name &&
        p.district === district?.name &&
        p.location === location?.name
    )
  }, [isLeafLevel, path])

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
                setSelectedProperty(row.original)
                setShowViewModal(true)
              }}
              className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600">
              <Edit className="h-4 w-4" />
            </button>
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
    []
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Properties</h1>
          <div className="mt-2">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
        {isLeafLevel && (
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        )}
      </div>

      {/* Folder Navigation or Table */}
      {!isLeafLevel ? (
        <FolderNavigator
          hierarchy={locationHierarchy}
          path={path}
          onNavigate={handleNavigate}
        />
      ) : (
        <DataTable
          data={filteredProperties}
          columns={columns}
          searchPlaceholder="Search properties..."
        />
      )}

      {/* View Property Modal */}
      {selectedProperty && (
        <Modal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false)
            setSelectedProperty(null)
          }}
          title={selectedProperty.name}
          size="xl"
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <DetailItem label="Property Type" value={selectedProperty.propertyType} />
            <DetailItem label="Property Class" value={selectedProperty.propertyClass} />
            <DetailItem label="Room Category" value={selectedProperty.roomCategory} />
            <DetailItem label="Number of Rooms" value={String(selectedProperty.numberOfRooms)} />
            <DetailItem label="Multiple Properties" value={selectedProperty.hasMultipleProperty ? 'Yes' : 'No'} />
            <DetailItem label="Email" value={selectedProperty.email} />
            <DetailItem label="Proposed Price" value={formatCurrency(selectedProperty.proposedPrice)} />
            <DetailItem label="Final Price" value={selectedProperty.finalCommittedPrice ? formatCurrency(selectedProperty.finalCommittedPrice) : '—'} />
            <DetailItem label="Tenure" value={selectedProperty.tenure} />
            <DetailItem label="Contact Person" value={`${selectedProperty.contactPersonName} (${selectedProperty.primaryContactPerson})`} />
            <DetailItem label="Contact Number" value={selectedProperty.contactNumber} />
            <DetailItem label="Place" value={selectedProperty.place} />
            <DetailItem label="Plan Start" value={selectedProperty.planStartDate || '—'} />
            <DetailItem label="Plan Expiry" value={selectedProperty.planExpiryDate || '—'} />
            <DetailItem label="Current PMS" value={selectedProperty.currentPMS} />
            <DetailItem label="OTA Platforms" value={selectedProperty.connectedOTAPlatforms.join(', ') || 'None'} />
            <DetailItem label="Visit Status" value={selectedProperty.secondVisitStatus || '—'} />
            <DetailItem label="Closing Amount" value={selectedProperty.closingAmount ? formatCurrency(selectedProperty.closingAmount) : '—'} />
            {selectedProperty.locationLink && (
              <div className="col-span-2">
                <p className="text-xs font-medium text-surface-500">Location Link</p>
                <a
                  href={selectedProperty.locationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 flex items-center gap-1 text-sm text-primary-600 hover:underline"
                >
                  Open in Google Maps <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            {selectedProperty.comments && (
              <div className="col-span-2">
                <p className="text-xs font-medium text-surface-500">Comments</p>
                <p className="mt-0.5 text-sm text-surface-700">{selectedProperty.comments}</p>
              </div>
            )}
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
