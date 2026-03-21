import { useState, useMemo, useEffect, useCallback } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  DollarSign,
  TrendingUp,
  Clock,
  Trash2,
  Edit,
  Plus,
  Filter,
  Receipt,
  Download,
  RotateCcw,
} from 'lucide-react'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { BillDocument } from '@/components/BillDocument'
import { StatsCard } from '@/components/StatsCard'
import { DataTable } from '@/components/DataTable'
import { StatusBadge } from '@/components/StatusBadge'
import { Button, Modal, FormField, Input, Select } from '@/components/FormElements'
import { formatCurrency } from '@/lib/utils'
import { fetchFinanceSummary } from '@/lib/reportsApi'
import {
  fetchDeletedFinancePayments,
  fetchFinancePayments,
  patchFinancePayment,
  restoreFinancePayment,
  softDeleteFinancePayment,
} from '@/lib/financeApi'

export interface FinanceRecord {
  id: string
  propertyName: string
  closingAmount: number
  pendingAmount: number
  collectedAmount: number
  invoiceUploaded?: boolean
  lastPaymentDate?: string
  executive?: string
  isDeleted?: boolean
  deletedAt?: string
}

export default function InvoicesPage() {
  const [localFinanceRecords, setLocalFinanceRecords] = useState<FinanceRecord[]>([])
  const [financeSummary, setFinanceSummary] = useState<{ total_closing_amount: string | number; total_collected_amount: string | number; total_pending_amount: string | number } | null>(null)

  const mapPayment = (r: {
    id: string
    property_name: string
    closing_amount: string
    pending_amount: string
    collected_amount: string
    invoice_uploaded: boolean
    last_payment_date?: string | null
    executive: string
    is_deleted?: boolean
    deleted_at?: string | null
  }): FinanceRecord => ({
    id: r.id,
    propertyName: r.property_name,
    closingAmount: Number(r.closing_amount),
    pendingAmount: Number(r.pending_amount),
    collectedAmount: Number(r.collected_amount),
    invoiceUploaded: r.invoice_uploaded,
    lastPaymentDate: r.last_payment_date ?? undefined,
    executive: r.executive,
    isDeleted: !!r.is_deleted,
    deletedAt: r.deleted_at ?? undefined,
  })

  const loadPayments = useCallback(async () => {
    try {
      const [active, deleted] = await Promise.all([fetchFinancePayments(), fetchDeletedFinancePayments()])
      setLocalFinanceRecords([
        ...active.map((r) => mapPayment(r)),
        ...deleted.map((r) => mapPayment({ ...r, is_deleted: true })),
      ])
    } catch {
      setLocalFinanceRecords([])
    }
  }, [])

  useEffect(() => {
    fetchFinanceSummary().then(setFinanceSummary).catch(() => {})
    loadPayments()
  }, [loadPayments])
  const [paymentTab, setPaymentTab] = useState<'active' | 'deleted'>('active')
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentPaymentId, setCurrentPaymentId] = useState<string | null>(null)
  
  const [paymentData, setPaymentData] = useState({
    propertyName: '',
    closingAmount: 0,
    collectedAmount: 0,
    lastPaymentDate: '',
    executive: ''
  })

  // Printing State
  const printRef = useRef<HTMLDivElement>(null)
  const [recordToPrint, setRecordToPrint] = useState<FinanceRecord | null>(null)
  
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Bill_${recordToPrint?.propertyName.replace(/\s+/g, '_') || 'Bookito'}`,
  })

  const handlePrintBill = (record: FinanceRecord) => {
    setRecordToPrint(record)
    // Small timeout to allow state to update the document before printing
    setTimeout(() => {
      handlePrint()
    }, 100)
  }

  const [statusFilter, setStatusFilter] = useState<'all' | 'full' | 'partial' | 'pending'>('all')

  const handleDeletePayment = (id: string) => {
    void softDeleteFinancePayment(id).then(() => loadPayments())
  }

  const handleRestorePayment = (id: string) => {
    void restoreFinancePayment(id).then(() => loadPayments())
  }

  const handleEditPayment = (record: FinanceRecord) => {
    setCurrentPaymentId(record.id)
    setPaymentData({
      propertyName: record.propertyName,
      closingAmount: record.closingAmount,
      collectedAmount: record.collectedAmount,
      lastPaymentDate: record.lastPaymentDate || '',
      executive: record.executive ?? '',
    })
    setShowEditModal(true)
  }

  const handleSavePayment = () => {
    if (!currentPaymentId) return
    const closing = paymentData.closingAmount
    const collected = paymentData.collectedAmount
    void patchFinancePayment(currentPaymentId, {
      closing_amount: closing,
      collected_amount: collected,
      pending_amount: Math.max(0, closing - collected),
      last_payment_date: paymentData.lastPaymentDate || null,
      executive: paymentData.executive,
    }).then(() => {
      loadPayments()
      setShowEditModal(false)
    })
  }

  const getRemainingDays = (deletedAt?: string) => {
    if (!deletedAt) return 30
    const diff = Date.now() - new Date(deletedAt).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return Math.max(0, 30 - days)
  }

  const filteredFinanceRecords = useMemo(() => {
    return localFinanceRecords.filter(record => {
      if (paymentTab === 'active' && record.isDeleted) return false
      if (paymentTab === 'deleted') {
        if (!record.isDeleted) return false
        if (getRemainingDays(record.deletedAt) === 0) return false
      }
      if (statusFilter === 'full' && record.pendingAmount !== 0) return false
      if (statusFilter === 'partial' && !(record.collectedAmount > 0 && record.pendingAmount > 0)) return false
      if (statusFilter === 'pending' && record.collectedAmount !== 0) return false
      return true
    })
  }, [localFinanceRecords, statusFilter, paymentTab])

  const columns: ColumnDef<FinanceRecord, any>[] = useMemo(
    () => [
      {
        accessorKey: 'propertyName',
        header: 'Property',
        cell: ({ row }) => (
          <span className="font-semibold text-surface-900">{row.original.propertyName}</span>
        ),
      },
      {
        accessorKey: 'closingAmount',
        header: 'Closing Amount',
        cell: ({ row }) => formatCurrency(row.original.closingAmount),
      },
      {
        accessorKey: 'collectedAmount',
        header: 'Collected',
        cell: ({ row }) => (
          <span className="text-emerald-600 font-bold">
            {formatCurrency(row.original.collectedAmount)}
          </span>
        ),
      },
      {
        accessorKey: 'pendingAmount',
        header: 'Pending',
        cell: ({ row }) => (
          <span className={row.original.pendingAmount > 0 ? 'text-rose-500 font-bold' : 'text-surface-400'}>
            {row.original.pendingAmount > 0 ? formatCurrency(row.original.pendingAmount) : '—'}
          </span>
        ),
      },
      {
        accessorKey: 'invoiceUploaded',
        header: 'Invoice Status',
        cell: ({ row }) => (
          <StatusBadge
            label={row.original.invoiceUploaded ? 'Generated' : 'Pending'}
            variant={row.original.invoiceUploaded ? 'success' : 'warning'}
            dot
          />
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {paymentTab === 'active' ? (
              <>
                <button 
                  onClick={() => handleEditPayment(row.original)}
                  className="rounded-md p-1.5 text-surface-400 hover:bg-surface-100 hover:text-primary-600"
                  title="Update Payment"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handlePrintBill(row.original)}
                  className="rounded-md p-1.5 text-surface-400 hover:bg-blue-50 hover:text-blue-600"
                  title="Download Bill"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDeletePayment(row.original.id)}
                  className="rounded-md p-1.5 text-surface-400 hover:bg-rose-50 hover:text-rose-600"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => handleRestorePayment(row.original.id)}
                className="rounded-md p-1.5 text-surface-400 hover:bg-emerald-50 hover:text-emerald-600"
                title="Restore"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        )
      }
    ],
    [paymentTab]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Bills & Payments</h1>
          <p className="text-sm text-surface-500">Track and manage received payments and generated billing records.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard
          title="Total Receivables"
          value={financeSummary ? formatCurrency(Number(financeSummary.total_closing_amount)) : '—'}
          icon={DollarSign}
          variant="primary"
        />
        <StatsCard
          title="Total Collected"
          value={financeSummary ? formatCurrency(Number(financeSummary.total_collected_amount)) : '—'}
          icon={TrendingUp}
          variant="success"
        />
        <StatsCard
          title="Total Outstanding"
          value={financeSummary ? formatCurrency(Number(financeSummary.total_pending_amount)) : '—'}
          icon={Clock}
          variant="warning"
        />
      </div>

      <div className="bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex rounded-lg border border-surface-200 p-1 bg-surface-50">
            <button
              onClick={() => setPaymentTab('active')}
              className={`rounded-md px-4 py-1.5 text-xs font-bold transition-all ${
                paymentTab === 'active'
                  ? 'bg-white text-primary-600 shadow-sm border border-surface-200'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              All Bills
            </button>
            <button
              onClick={() => setPaymentTab('deleted')}
              className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-bold transition-all ${
                paymentTab === 'deleted'
                  ? 'bg-rose-50 text-rose-600 border border-rose-100 shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Trash
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Select
              className="w-48"
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as any)}
              options={[
                { label: 'All Payments', value: 'all' },
                { label: 'Full Closed', value: 'full' },
                { label: 'Partial Closed', value: 'partial' },
                { label: 'Pending to Pay', value: 'pending' },
              ]}
            />
          </div>
        </div>

        <DataTable
          data={filteredFinanceRecords}
          columns={columns}
          searchPlaceholder="Search invoices or properties..."
        />
      </div>

      {/* Edit Payment Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Update Payment Record"
        size="md"
      >
        <div className="space-y-4">
          <FormField label="Property Name">
            <Input value={paymentData.propertyName} disabled className="bg-surface-50" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Closing Amount">
              <Input 
                type="number" 
                value={paymentData.closingAmount}
                onChange={(e) => setPaymentData(prev => ({ ...prev, closingAmount: Number(e.target.value) }))}
              />
            </FormField>
            <FormField label="Collected Amount">
              <Input 
                type="number" 
                value={paymentData.collectedAmount}
                onChange={(e) => setPaymentData(prev => ({ ...prev, collectedAmount: Number(e.target.value) }))}
              />
            </FormField>
          </div>
          <FormField label="Last Payment Date">
            <Input 
              type="date" 
              value={paymentData.lastPaymentDate}
              onChange={(e) => setPaymentData(prev => ({ ...prev, lastPaymentDate: e.target.value }))}
            />
          </FormField>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSavePayment}>
            Save Changes
          </Button>
        </div>
      </Modal>

      {/* Hidden Printable Bill */}
      <div className="hidden">
        {recordToPrint && (
          <BillDocument
            ref={printRef}
            propertyName={recordToPrint.propertyName}
            closingAmount={recordToPrint.closingAmount}
            collectedAmount={recordToPrint.collectedAmount}
            pendingAmount={recordToPrint.pendingAmount}
            date={recordToPrint.lastPaymentDate || new Date().toLocaleDateString()}
            executive={recordToPrint.executive ?? ''}
            invoiceNo={`BK-${recordToPrint.id.toUpperCase()}`}
          />
        )}
      </div>
    </div>
  )
}
