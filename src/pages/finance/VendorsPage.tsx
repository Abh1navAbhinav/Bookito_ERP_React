import { useState, useMemo, useEffect, useCallback } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  Plus,
  Trash2,
  Edit,
  Mail,
  Phone,
  ExternalLink,
} from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { StatusBadge } from '@/components/StatusBadge'
import { Button, Modal, FormField, Input, Select } from '@/components/FormElements'
import { formatCurrency } from '@/lib/utils'
import { createVendor, fetchVendors, patchVendor, softDeleteVendor, type ApiVendor } from '@/lib/financeApi'

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

function mapVendor(v: ApiVendor): Vendor {
  return {
    id: v.id,
    name: v.name,
    company: v.company,
    email: v.email,
    phone: v.phone,
    category: v.category,
    outstandingAmount: Number(v.outstanding_amount),
    status: (v.status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive',
  }
}

export default function VendorsPage() {
  const [localVendors, setLocalVendors] = useState<Vendor[]>([])
  const [showVendorModal, setShowVendorModal] = useState(false)
  const [currentVendor, setCurrentVendor] = useState<Partial<Vendor>>({})
  const [editingId, setEditingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const rows = await fetchVendors()
      setLocalVendors(rows.map(mapVendor))
    } catch {
      setLocalVendors([])
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const columns: ColumnDef<Vendor, any>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Vendor Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-bold uppercase text-primary-700">
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
        cell: ({ row }) => (
          <span className="rounded-full bg-surface-100 px-2 py-1 text-xs font-medium text-surface-600">
            {row.original.category}
          </span>
        ),
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
        ),
      },
      {
        accessorKey: 'outstandingAmount',
        header: 'Outstanding',
        cell: ({ row }) => (
          <span
            className={
              row.original.outstandingAmount > 0
                ? 'font-bold text-rose-600'
                : 'font-bold text-emerald-600'
            }
          >
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
            <button
              type="button"
              className="rounded-md p-1.5 text-surface-400 hover:bg-surface-100 hover:text-primary-600"
              onClick={() => {
                setEditingId(row.original.id)
                setCurrentVendor(row.original)
                setShowVendorModal(true)
              }}
            >
              <Edit className="h-4 w-4" />
            </button>
            <button type="button" className="rounded-md p-1.5 text-surface-400 hover:bg-surface-100 hover:text-primary-600">
              <ExternalLink className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-md p-1.5 text-surface-400 hover:bg-rose-50 hover:text-rose-600"
              onClick={() => void softDeleteVendor(row.original.id).then(() => load())}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    [load]
  )

  const handleSaveVendor = () => {
    const body = {
      name: currentVendor.name ?? '',
      company: currentVendor.company ?? '',
      email: currentVendor.email ?? '',
      phone: currentVendor.phone ?? '',
      category: currentVendor.category ?? 'Services',
      outstanding_amount: currentVendor.outstandingAmount ?? 0,
      status: currentVendor.status ?? 'active',
    }
    const run = async () => {
      if (editingId) {
        await patchVendor(editingId, body)
      } else {
        await createVendor({ id: `v-${Date.now()}`, ...body })
      }
      await load()
      setShowVendorModal(false)
      setEditingId(null)
      setCurrentVendor({})
    }
    void run()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Vendors</h1>
          <p className="text-sm text-surface-500">Manage suppliers, service providers, and payables.</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setCurrentVendor({ status: 'active', outstandingAmount: 0 })
            setShowVendorModal(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Onboard Vendor
        </Button>
      </div>

      <div className="rounded-xl border border-surface-200 bg-white p-4">
        <DataTable data={localVendors} columns={columns} searchPlaceholder="Search vendors or companies..." />
      </div>

      <Modal
        isOpen={showVendorModal}
        onClose={() => {
          setShowVendorModal(false)
          setEditingId(null)
          setCurrentVendor({})
        }}
        title={editingId ? 'Edit Vendor' : 'Register New Vendor'}
        size="md"
      >
        <div className="space-y-4">
          <FormField label="Full Name">
            <Input
              placeholder="Vendor Contact Name"
              value={currentVendor.name ?? ''}
              onChange={(e) => setCurrentVendor((p) => ({ ...p, name: e.target.value }))}
            />
          </FormField>
          <FormField label="Company/Entity Name">
            <Input
              placeholder="Kerala Travels Pvt Ltd"
              value={currentVendor.company ?? ''}
              onChange={(e) => setCurrentVendor((p) => ({ ...p, company: e.target.value }))}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Email Address">
              <Input
                type="email"
                placeholder="vendor@example.com"
                value={currentVendor.email ?? ''}
                onChange={(e) => setCurrentVendor((p) => ({ ...p, email: e.target.value }))}
              />
            </FormField>
            <FormField label="Phone Number">
              <Input
                placeholder="+91 0000 0000 00"
                value={currentVendor.phone ?? ''}
                onChange={(e) => setCurrentVendor((p) => ({ ...p, phone: e.target.value }))}
              />
            </FormField>
          </div>
          <FormField label="Category">
            <Select
              placeholder="Select category"
              value={currentVendor.category ?? ''}
              onChange={(value) => setCurrentVendor((p) => ({ ...p, category: value }))}
              options={[
                { label: 'Transportation', value: 'Transportation' },
                { label: 'Marketing', value: 'Marketing' },
                { label: 'Utilities', value: 'Utilities' },
                { label: 'Real Estate', value: 'Real Estate' },
                { label: 'IT Services', value: 'IT Services' },
                { label: 'Supplies', value: 'Supplies' },
                { label: 'Services', value: 'Services' },
              ]}
            />
          </FormField>
          <FormField label="Outstanding amount">
            <Input
              type="number"
              value={currentVendor.outstandingAmount ?? ''}
              onChange={(e) =>
                setCurrentVendor((p) => ({ ...p, outstandingAmount: Number(e.target.value) }))
              }
            />
          </FormField>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setShowVendorModal(false)
              setEditingId(null)
              setCurrentVendor({})
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSaveVendor}>{editingId ? 'Save changes' : 'Register Vendor'}</Button>
        </div>
      </Modal>
    </div>
  )
}
