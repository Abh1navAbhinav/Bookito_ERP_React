import { useState, useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  Users,
  Plus,
  Trash2,
  Edit,
  Mail,
  Phone,
  Building2,
  ExternalLink,
} from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { StatusBadge } from '@/components/StatusBadge'
import { Button, Modal, FormField, Input, Select } from '@/components/FormElements'
import { formatCurrency } from '@/lib/utils'

interface Vendor {
  id: string
  name: string
  company: string
  email: string
  phone: string
  category: string
  outstandingAmount: number
  status: 'active' | 'inactive'
}

const mockVendors: Vendor[] = [
  { id: 'v-1', name: 'Albin Joseph', company: 'Kerala Travels', email: 'albin@example.com', phone: '9847123456', category: 'Transportation', outstandingAmount: 15000, status: 'active' },
  { id: 'v-2', name: 'Sarah Khan', company: 'Swift Solutions', email: 'sarah@swift.in', phone: '7012345678', category: 'Marketing', outstandingAmount: 5000, status: 'active' },
  { id: 'v-3', name: 'John Doe', company: 'Apex Real Estate', email: 'john@apex.com', phone: '9988776655', category: 'Services', outstandingAmount: 0, status: 'active' },
  { id: 'v-4', name: 'Meera Nair', company: 'Green Office', email: 'meera@green.in', phone: '8877665544', category: 'Supplies', outstandingAmount: 2500, status: 'active' },
]

export default function VendorsPage() {
  const [localVendors, setLocalVendors] = useState<Vendor[]>(mockVendors)
  const [showVendorModal, setShowVendorModal] = useState(false)
  const [currentVendor, setCurrentVendor] = useState<Partial<Vendor>>({})

  const columns: ColumnDef<Vendor, any>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Vendor Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
             <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold uppercase text-xs">
                {row.original.name.charAt(0)}
             </div>
             <div className="flex flex-col">
                <span className="font-semibold text-surface-900">{row.original.name}</span>
                <span className="text-xs text-surface-500">{row.original.company}</span>
             </div>
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => <span className="text-xs font-medium text-surface-600 bg-surface-100 px-2 py-1 rounded-full">{row.original.category}</span>,
      },
      {
        accessorKey: 'contact',
        header: 'Contact Information',
        cell: ({ row }) => (
           <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs text-surface-500">
                 <Mail className="h-3 w-3" />
                 {row.original.email}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-surface-500">
                 <Phone className="h-3 w-3" />
                 {row.original.phone}
              </div>
           </div>
        )
      },
      {
        accessorKey: 'outstandingAmount',
        header: 'Outstanding',
        cell: ({ row }) => (
          <span className={row.original.outstandingAmount > 0 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
            {formatCurrency(row.original.outstandingAmount)}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge
            label={row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
            variant={row.original.status === 'active' ? 'success' : 'default'}
            dot
          />
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button className="rounded-md p-1.5 text-surface-400 hover:bg-surface-100 hover:text-primary-600">
              <Edit className="h-4 w-4" />
            </button>
            <button className="rounded-md p-1.5 text-surface-400 hover:bg-surface-100 hover:text-primary-600">
              <ExternalLink className="h-4 w-4" />
            </button>
            <button className="rounded-md p-1.5 text-surface-400 hover:bg-rose-50 hover:text-rose-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  )

  const handleSaveVendor = () => {
    // Save logic
    setShowVendorModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Vendors</h1>
          <p className="text-sm text-surface-500">Manage suppliers, service providers, and payables.</p>
        </div>
        <Button onClick={() => setShowVendorModal(true)}>
          <Plus className="h-4 w-4" />
          Onboard Vendor
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-surface-200">
        <DataTable
          data={localVendors}
          columns={columns}
          searchPlaceholder="Search vendors or companies..."
        />
      </div>

      {/* Add Vendor Modal */}
      <Modal
        isOpen={showVendorModal}
        onClose={() => setShowVendorModal(false)}
        title="Register New Vendor"
        size="md"
      >
        <div className="space-y-4">
           <FormField label="Full Name">
              <Input placeholder="Vendor Contact Name" />
           </FormField>
           <FormField label="Company/Entity Name">
              <Input placeholder="Kerala Travels Pvt Ltd" />
           </FormField>
           <div className="grid grid-cols-2 gap-4">
              <FormField label="Email Address">
                 <Input type="email" placeholder="vendor@example.com" />
              </FormField>
              <FormField label="Phone Number">
                 <Input placeholder="+91 0000 0000 00" />
              </FormField>
           </div>
           <FormField label="Category">
             <Select
               placeholder="Select category"
               options={[
                 { label: 'Transportation', value: 'transport' },
                 { label: 'Marketing', value: 'marketing' },
                 { label: 'Utilities', value: 'utilities' },
                 { label: 'Real Estate', value: 'realestate' },
                 { label: 'IT Services', value: 'it' },
               ]}
             />
           </FormField>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowVendorModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveVendor}>
            Register Vendor
          </Button>
        </div>
      </Modal>
    </div>
  )
}
