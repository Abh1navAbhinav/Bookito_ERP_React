import { useState, useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  PieChart,
  Download,
  Calendar,
  Search,
  Receipt,
  FileBarChart,
  TrendingUp,
} from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { StatsCard } from '@/components/StatsCard'
import { Button, Select } from '@/components/FormElements'
import { formatCurrency } from '@/lib/utils'

interface TaxRecord {
  id: string
  transactionType: 'Sale' | 'Purchase'
  invoiceNo: string
  date: string
  baseAmount: number
  taxRate: number
  taxAmount: number
}

const mockTaxRecords: TaxRecord[] = [
  { id: 't-1', transactionType: 'Sale', invoiceNo: 'INV/2026/001', date: '2026-03-10', baseAmount: 120000, taxRate: 18, taxAmount: 21600 },
  { id: 't-2', transactionType: 'Sale', invoiceNo: 'INV/2026/002', date: '2026-03-12', baseAmount: 85000, taxRate: 18, taxAmount: 15300 },
  { id: 't-3', transactionType: 'Purchase', invoiceNo: 'SW/2234/A', date: '2026-03-14', baseAmount: 45000, taxRate: 12, taxAmount: 5400 },
  { id: 't-4', transactionType: 'Sale', invoiceNo: 'INV/2026/003', date: '2026-03-15', baseAmount: 25000, taxRate: 18, taxAmount: 4500 },
]

export default function TaxationPage() {
  const [localRecords] = useState<TaxRecord[]>(mockTaxRecords)
  const [taxType, setTaxType] = useState('gst')

  const columns: ColumnDef<TaxRecord, any>[] = useMemo(
    () => [
      {
        accessorKey: 'invoiceNo',
        header: 'Invoice No.',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
             <Receipt className="h-4 w-4 text-surface-400" />
             <span className="font-semibold text-surface-900">{row.original.invoiceNo}</span>
          </div>
        )
      },
      {
        accessorKey: 'transactionType',
        header: 'Type',
        cell: ({ row }) => (
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
            row.original.transactionType === 'Sale' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}>
            {row.original.transactionType}
          </span>
        )
      },
      {
        accessorKey: 'date',
        header: 'Date',
      },
      {
        accessorKey: 'baseAmount',
        header: 'Amount (Before Tax)',
        cell: ({ row }) => formatCurrency(row.original.baseAmount),
      },
      {
        accessorKey: 'taxRate',
        header: 'Rate (%)',
        cell: ({ row }) => `${row.original.taxRate}%`,
      },
      {
        accessorKey: 'taxAmount',
        header: 'Tax Collected/Paid',
        cell: ({ row }) => (
          <span className="font-bold text-primary-700">{formatCurrency(row.original.taxAmount)}</span>
        ),
      },
    ],
    []
  )

  const totalCollected = useMemo(() => 
    localRecords
      .filter(r => r.transactionType === 'Sale')
      .reduce((s, r) => s + r.taxAmount, 0), [localRecords])

  const totalPaid = useMemo(() => 
    localRecords
      .filter(r => r.transactionType === 'Purchase')
      .reduce((s, r) => s + r.taxAmount, 0), [localRecords])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Taxation & Compliance</h1>
          <p className="text-sm text-surface-500">Track GST/VAT liability, input tax credits, and financial audit logs.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="bg-white hover:bg-surface-50">
            <Calendar className="h-4 w-4" />
            March 2026
          </Button>
          <Button>
            <Download className="h-4 w-4" />
            Generate Return Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatsCard
          title="Output Tax (Collected)"
          value={formatCurrency(totalCollected)}
          icon={TrendingUp}
          variant="primary"
        />
        <StatsCard
          title="Input Tax (ITC)"
          value={formatCurrency(totalPaid)}
          icon={FileBarChart}
          variant="accent"
        />
        <StatsCard
          title="Net Tax Liability"
          value={formatCurrency(totalCollected - totalPaid)}
          icon={PieChart}
          variant="warning"
        />
        <StatsCard
          title="Tax-ready Sales"
          value={formatCurrency(230000)}
          icon={Receipt}
          variant="success"
        />
      </div>

      <div className="bg-white p-6 rounded-xl border border-surface-200">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-bold text-surface-900">Tax Breakdown</h2>
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
          </div>
          <Select
             className="w-40"
             value={taxType}
             onChange={setTaxType}
             options={[
               { label: 'GST (18%)', value: 'gst' },
               { label: 'VAT', value: 'vat' },
               { label: 'Corporate Tax', value: 'corp' },
             ]}
          />
        </div>
        <DataTable
          data={localRecords}
          columns={columns}
          searchPlaceholder="Search invoices or transactions..."
        />
      </div>

      {/* Audit Alert */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm flex items-start gap-4">
         <div className="h-10 w-10 shrink-0 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <Calendar className="h-5 w-5" />
         </div>
         <div className="flex-1">
            <h4 className="text-sm font-bold text-amber-900">Compliance Reminder</h4>
            <p className="text-xs text-amber-700 mt-1">
              The GSTR-1 filing deadline for March is approaching in 5 days. Ensure all sale invoices are synchronized before submission.
            </p>
         </div>
         <Button size="sm" variant="secondary" className="bg-white hover:bg-amber-100 border-amber-200 text-amber-800">
            View Checklist
         </Button>
      </div>
    </div>
  )
}
