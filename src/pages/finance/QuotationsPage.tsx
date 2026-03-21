import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { useReactToPrint } from 'react-to-print'
import { type ColumnDef } from '@tanstack/react-table'
import {
  FileText,
  Plus,
  Filter,
  Trash2,
  Edit,
  X,
  RotateCcw,
  Receipt,
  Search,
  Download,
} from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { StatusBadge } from '@/components/StatusBadge'
import { Button, Modal, FormField, Input, Select, SearchableSelect } from '@/components/FormElements'
import { QuotationDocument } from '@/components/QuotationDocument'
import { formatCurrency } from '@/lib/utils'
import { fetchProperties } from '@/lib/propertiesApi'
import {
  createQuotation,
  fetchDeletedQuotations,
  fetchQuotations,
  patchQuotation,
  restoreQuotation,
  softDeleteQuotation,
} from '@/lib/financeApi'

export interface QuotationRecord {
  id: string
  propertyId: string
  propertyName: string
  recipientName: string
  date: string
  roomCategory: string
  standardPrice: number
  sellingPrice: number
  tenure: string
  status: string
  executive?: string
  isDeleted?: boolean
  deletedAt?: string
}

interface PropertyOption {
  id: string
  name: string
  roomCategory?: string
  proposedPrice?: number
  finalCommittedPrice?: number
  tenure?: string
}

export default function QuotationsPage() {
  const [localProperties, setLocalProperties] = useState<PropertyOption[]>([])
  const [localQuotationRecords, setLocalQuotationRecords] = useState<QuotationRecord[]>([])
  const [editingQuotationId, setEditingQuotationId] = useState<string | null>(null)

  const mapQuotation = (q: {
    id: string
    property: string
    property_name: string
    recipient_name: string
    date: string
    room_category: string
    standard_price: string
    selling_price: string
    tenure: string
    status: string
    executive: string
    is_deleted?: boolean
    deleted_at?: string | null
  }): QuotationRecord => ({
    id: q.id,
    propertyId: q.property,
    propertyName: q.property_name,
    recipientName: q.recipient_name,
    date: q.date,
    roomCategory: q.room_category,
    standardPrice: Number(q.standard_price),
    sellingPrice: Number(q.selling_price),
    tenure: q.tenure,
    status: q.status,
    executive: q.executive ?? '',
    isDeleted: !!q.is_deleted,
    deletedAt: q.deleted_at ?? undefined,
  })

  const loadQuotations = useCallback(async () => {
    try {
      const [active, deleted] = await Promise.all([fetchQuotations(), fetchDeletedQuotations()])
      setLocalQuotationRecords([
        ...active.map((q) => mapQuotation(q)),
        ...deleted.map((q) => mapQuotation({ ...q, is_deleted: true })),
      ])
    } catch {
      setLocalQuotationRecords([])
    }
  }, [])

  useEffect(() => {
    fetchProperties().then((list) => setLocalProperties(list.map((p) => ({ id: p.id, name: p.name, roomCategory: p.room_category, proposedPrice: Number(p.proposed_price), finalCommittedPrice: Number(p.final_committed_price), tenure: p.tenure })))).catch(() => {})
    loadQuotations()
  }, [loadQuotations])
  const [showQuotationModal, setShowQuotationModal] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isEditingQuotation, setIsEditingQuotation] = useState(false)
  const [isViewOnly, setIsViewOnly] = useState(false)
  const [quotationTab, setQuotationTab] = useState<'active' | 'deleted'>('active')
  
  const quotationRef = useRef<HTMLDivElement>(null)
  
  const [quotationData, setQuotationData] = useState({
    propertyId: '',
    recipientName: '',
    propertyName: '',
    roomCategory: '',
    standardPrice: 0,
    sellingPrice: 0,
    tenure: '',
    executiveName: '',
    executiveRole: '',
    executivePhone: ''
  })

  // Bill Generation State
  const [showBillModal, setShowBillModal] = useState(false)
  const [billData, setBillData] = useState({
    propertyName: '',
    closingAmount: 0,
    collectedAmount: 0,
    executive: ''
  })

  const [statusFilter, setStatusFilter] = useState<'all' | 'Draft' | 'Sent' | 'Downloaded'>('all')
  const [executiveFilter, setExecutiveFilter] = useState<string>('all')

  const uniqueExecutives = useMemo(() => {
    return Array.from(
      new Set(localQuotationRecords.map((r) => r.executive).filter((e): e is string => Boolean(e)))
    )
  }, [localQuotationRecords])

  const handlePropertySelect = (propertyId: string) => {
    const property = localProperties.find(p => p.id === propertyId)
    if (property) {
      setQuotationData(prev => ({
        ...prev,
        propertyId: property.id,
        propertyName: property.name,
        recipientName: property.name,
        roomCategory: property.roomCategory || '',
        standardPrice: property.proposedPrice || 0,
        sellingPrice: property.finalCommittedPrice || 0,
        tenure: property.tenure || ''
      }))
    }
  }

  const resetQuotationForm = () => {
    setQuotationData({
      propertyId: '',
      recipientName: '',
      propertyName: '',
      roomCategory: '',
      standardPrice: 0,
      sellingPrice: 0,
      tenure: '',
      executiveName: '',
      executiveRole: '',
      executivePhone: ''
    })
    setShowPreview(false)
    setIsEditingQuotation(false)
    setIsViewOnly(false)
    setEditingQuotationId(null)
  }

  const handleEditQuotation = (record: QuotationRecord) => {
    setEditingQuotationId(record.id)
    setQuotationData({
      propertyId: record.propertyId,
      propertyName: record.propertyName,
      recipientName: record.recipientName,
      roomCategory: record.roomCategory,
      standardPrice: record.standardPrice,
      sellingPrice: record.sellingPrice,
      tenure: record.tenure,
      executiveName: record.executive ?? '',
      executiveRole: 'Relationship Manager',
      executivePhone: '+91 8891695554'
    })
    setIsEditingQuotation(true)
    setIsViewOnly(false)
    setShowQuotationModal(true)
  }

  const handleDeleteQuotation = (id: string) => {
    void softDeleteQuotation(id).then(() => loadQuotations())
  }

  const handleRestoreQuotation = (id: string) => {
    void restoreQuotation(id).then(() => loadQuotations())
  }

  const handleViewQuotation = (record: QuotationRecord) => {
    setEditingQuotationId(record.id)
    setQuotationData({
      propertyId: record.propertyId,
      propertyName: record.propertyName,
      recipientName: record.recipientName,
      roomCategory: record.roomCategory,
      standardPrice: record.standardPrice,
      sellingPrice: record.sellingPrice,
      tenure: record.tenure,
      executiveName: record.executive ?? '',
      executiveRole: 'Relationship Manager',
      executivePhone: '+91 8891695554'
    })
    setIsEditingQuotation(true)
    setIsViewOnly(true)
    setShowPreview(true)
    setShowQuotationModal(true)
  }

  const handleCreateBill = (record: QuotationRecord) => {
    setBillData({
      propertyName: record.propertyName,
      closingAmount: record.sellingPrice,
      collectedAmount: 0,
      executive: record.executive ?? '',
    })
    setShowBillModal(true)
  }

  const handleGenerateBill = () => {
    // In a real app, this would create a payment record in the database
    // For now, we'll just show a success message or close the modal
    alert(`Bill generated for ${billData.propertyName} successfully!`)
    setShowBillModal(false)
  }

  const handlePrint = useReactToPrint({
    contentRef: quotationRef,
    documentTitle: `Quotation_${quotationData.propertyName.replace(/\s+/g, '_')}`,
  })

  const getRemainingDays = (deletedAt?: string) => {
    if (!deletedAt) return 30
    const diff = Date.now() - new Date(deletedAt).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return Math.max(0, 30 - days)
  }

  const filteredQuotationRecords = useMemo(() => {
    return localQuotationRecords.filter(record => {
      if (quotationTab === 'active' && record.isDeleted) return false
      if (quotationTab === 'deleted') {
        if (!record.isDeleted) return false
        if (getRemainingDays(record.deletedAt) === 0) return false
      }
      if (statusFilter !== 'all' && record.status !== statusFilter) return false
      if (executiveFilter !== 'all' && record.executive !== executiveFilter) return false
      return true
    })
  }, [localQuotationRecords, statusFilter, executiveFilter, quotationTab])

  const columns: ColumnDef<QuotationRecord, any>[] = useMemo(
    () => [
      {
        accessorKey: 'propertyName',
        header: 'Property',
        cell: ({ row }) => (
          <span className="font-semibold text-surface-900">{row.original.propertyName}</span>
        ),
      },
      {
        accessorKey: 'recipientName',
        header: 'Recipient',
      },
      {
        accessorKey: 'date',
        header: 'Date',
      },
      {
        accessorKey: 'sellingPrice',
        header: 'Selling Price',
        cell: ({ row }) => formatCurrency(row.original.sellingPrice),
      },
      {
        accessorKey: 'status',
        header: quotationTab === 'active' ? 'Status' : 'Auto-deletes in',
        cell: ({ row }) => {
          if (quotationTab === 'deleted') {
            const days = getRemainingDays(row.original.deletedAt)
            return (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                {days} days left
              </span>
            )
          }
          const status = row.original.status
          const variant = status === 'Sent' ? 'success' : status === 'Downloaded' ? 'info' : 'warning'
          return <StatusBadge label={status} variant={variant} dot />
        },
      },
      {
        accessorKey: 'executive',
        header: 'Executive',
        cell: ({ row }) => <span className="text-xs font-medium text-surface-500">{row.original.executive}</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => handleEditQuotation(row.original)}
              className="rounded-md p-1.5 text-surface-400 hover:bg-surface-100 hover:text-primary-600"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            {quotationTab === 'active' ? (
              <>
                <button 
                  onClick={() => handleCreateBill(row.original)}
                  className="rounded-md p-1.5 text-surface-400 hover:bg-emerald-50 hover:text-emerald-600"
                  title="Generate Bill"
                >
                  <Receipt className="h-4 w-4" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewQuotation(row.original)
                    setTimeout(() => handlePrint(), 100)
                  }}
                  className="rounded-md p-1.5 text-surface-400 hover:bg-blue-50 hover:text-blue-600"
                  title="Download PDF"
                >
                   <FileText className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDeleteQuotation(row.original.id)}
                  className="rounded-md p-1.5 text-surface-400 hover:bg-red-50 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => handleRestoreQuotation(row.original.id)}
                className="rounded-md p-1.5 text-surface-400 hover:bg-green-50 hover:text-green-600"
                title="Restore"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        )
      }
    ],
    [quotationTab]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Quotations</h1>
          <p className="text-sm text-surface-500">Create and manage property quotations for clients.</p>
        </div>
        <Button
          onClick={() => {
            resetQuotationForm()
            setShowQuotationModal(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Create Quotation
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl border border-surface-200">
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-surface-200 p-1 bg-surface-50 shadow-inner">
            <button
              onClick={() => setQuotationTab('active')}
              className={`rounded-md px-4 py-1.5 text-xs font-bold transition-all ${
                quotationTab === 'active'
                  ? 'bg-white text-primary-600 shadow-sm border border-surface-200'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setQuotationTab('deleted')}
              className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-bold transition-all ${
                quotationTab === 'deleted'
                  ? 'bg-red-50 text-red-600 border border-red-100 shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Trash
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select
             className="w-40 min-h-[38px]"
             value={statusFilter}
             onChange={(val) => setStatusFilter(val as any)}
             options={[
               { label: 'All Status', value: 'all' },
               { label: 'Draft', value: 'Draft' },
               { label: 'Sent', value: 'Sent' },
               { label: 'Downloaded', value: 'Downloaded' },
             ]}
          />
          <Select
             className="w-48 min-h-[38px]"
             value={executiveFilter}
             onChange={setExecutiveFilter}
             options={[
               { label: 'All Executives', value: 'all' },
               ...uniqueExecutives.map(e => ({ label: e, value: e }))
             ]}
          />
        </div>
      </div>

      <DataTable
        data={filteredQuotationRecords}
        columns={columns}
        searchPlaceholder="Search properties or recipients..."
        onRowClick={handleViewQuotation}
      />

      {/* Create/Edit Quotation Modal */}
      <Modal
        isOpen={showQuotationModal}
        onClose={() => {
          setShowQuotationModal(false)
          resetQuotationForm()
        }}
        title={isViewOnly ? "Quotation Preview" : isEditingQuotation ? "Edit Quotation" : "Create Quotation"}
        size="lg"
      >
        {!showPreview ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Select Property">
                <SearchableSelect 
                  placeholder="Choose property"
                  value={quotationData.propertyId}
                  disabled={isEditingQuotation}
                  options={localProperties.map(p => ({ label: p.name, value: p.id }))}
                  onChange={handlePropertySelect}
                />
              </FormField>
              <FormField label="Recipient Name">
                <Input 
                  value={quotationData.recipientName}
                  onChange={(e) => setQuotationData(prev => ({ ...prev, recipientName: e.target.value }))}
                  placeholder="e.g. Client Name" 
                />
              </FormField>
              <FormField label="Room Category">
                <Select 
                  value={quotationData.roomCategory}
                  placeholder="Select category"
                  onChange={(val) => setQuotationData(prev => ({ ...prev, roomCategory: val }))}
                  options={[
                    { label: '1-10 rooms', value: '1-10 rooms' },
                    { label: '11-20 rooms', value: '11-20 rooms' },
                    { label: '21-30 rooms', value: '21-30 rooms' },
                    { label: '30+ rooms', value: '30+ rooms' },
                  ]}
                />
              </FormField>
              <FormField label="Tenure Period">
                <Select
                  value={quotationData.tenure}
                  placeholder="Select tenure"
                  onChange={(val) => setQuotationData(prev => ({ ...prev, tenure: val }))}
                  options={[
                    { label: '6 Months', value: '6 Months' },
                    { label: '1 Year', value: '1 Year' },
                    { label: '2 Years', value: '2 Years' },
                  ]}
                />
              </FormField>
              <FormField label="Standard Price">
                <Input 
                  type="number" 
                  value={quotationData.standardPrice || ''}
                  onChange={(e) => setQuotationData(prev => ({ ...prev, standardPrice: Number(e.target.value) }))}
                />
              </FormField>
              <FormField label="Actual Selling Price">
                <Input 
                  type="number" 
                  value={quotationData.sellingPrice || ''}
                  onChange={(e) => setQuotationData(prev => ({ ...prev, sellingPrice: Number(e.target.value) }))}
                />
              </FormField>
            </div>
            
            <div className="grid grid-cols-3 gap-4 border-t border-surface-100 pt-4 mt-4">
              <FormField label="Executive Name">
                <Input 
                  value={quotationData.executiveName}
                  onChange={(e) => setQuotationData(prev => ({ ...prev, executiveName: e.target.value }))}
                />
              </FormField>
              <FormField label="Role">
                <Input 
                  value={quotationData.executiveRole}
                  onChange={(e) => setQuotationData(prev => ({ ...prev, executiveRole: e.target.value }))}
                />
              </FormField>
              <FormField label="Phone">
                <Input 
                  value={quotationData.executivePhone}
                  onChange={(e) => setQuotationData(prev => ({ ...prev, executivePhone: e.target.value }))}
                />
              </FormField>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => {
                setShowQuotationModal(false)
                resetQuotationForm()
              }}>
                Cancel
              </Button>
              <Button onClick={() => setShowPreview(true)} disabled={!quotationData.propertyName}>
                Preview & Generate
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-auto bg-surface-50 p-6 rounded-xl border border-surface-200">
               <div className="scale-[0.8] origin-top mb-[-120px] bg-white shadow-lg mx-auto p-4 rounded">
                  <QuotationDocument ref={quotationRef} {...quotationData} />
               </div>
            </div>
            <div className="flex justify-between items-center bg-white pt-4">
              {!isViewOnly ? (
                <Button variant="secondary" onClick={() => setShowPreview(false)}>
                  Edit Details
                </Button>
              ) : <div />}
              <div className="flex gap-3">
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handlePrint()}>
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button
                  onClick={() => {
                    if (isViewOnly) {
                      setShowQuotationModal(false)
                      resetQuotationForm()
                      return
                    }
                    const existing = editingQuotationId
                      ? localQuotationRecords.find((r) => r.id === editingQuotationId)
                      : null
                    const qDate = existing?.date ?? new Date().toISOString().split('T')[0]
                    const exec = quotationData.executiveName || 'Sales Team'
                    const body = {
                      property: quotationData.propertyId,
                      recipient_name: quotationData.recipientName,
                      date: qDate,
                      room_category: quotationData.roomCategory,
                      standard_price: quotationData.standardPrice,
                      selling_price: quotationData.sellingPrice,
                      tenure: quotationData.tenure,
                      status: existing?.status ?? 'Draft',
                      executive: exec,
                    }
                    const done = async () => {
                      if (editingQuotationId) {
                        await patchQuotation(editingQuotationId, body)
                      } else {
                        await createQuotation({ id: `q-${Date.now()}`, ...body })
                      }
                      await loadQuotations()
                      setShowQuotationModal(false)
                      resetQuotationForm()
                    }
                    void done()
                  }}
                >
                  {isViewOnly ? "Close Preview" : isEditingQuotation ? "Update Quotation" : "Finalize Quotation"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Bill Modal */}
      <Modal
        isOpen={showBillModal}
        onClose={() => setShowBillModal(false)}
        title="Create Bill from Quotation"
        size="md"
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-primary-50 p-3 border border-primary-100 mb-4">
            <p className="text-sm text-primary-800">
              Converting quotation for <strong>{billData.propertyName}</strong> into a payment record.
            </p>
          </div>
          <FormField label="Property Name">
            <Input value={billData.propertyName} readOnly className="bg-surface-50" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Total Closing Amount">
              <Input 
                type="number" 
                value={billData.closingAmount}
                onChange={(e) => setBillData(prev => ({ ...prev, closingAmount: Number(e.target.value) }))}
              />
            </FormField>
            <FormField label="Initial Collection">
              <Input 
                type="number" 
                value={billData.collectedAmount || ''}
                onChange={(e) => setBillData(prev => ({ ...prev, collectedAmount: Number(e.target.value) }))}
                placeholder="Enter amount collected"
              />
            </FormField>
          </div>
          <FormField label="Executive">
            <Input value={billData.executive} readOnly className="bg-surface-50" />
          </FormField>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowBillModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerateBill}>
            Confirm & Create Bill
          </Button>
        </div>
      </Modal>
    </div>
  )
}
