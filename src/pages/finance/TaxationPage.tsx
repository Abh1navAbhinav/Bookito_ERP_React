import { useState, useMemo, useEffect, useCallback } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { PieChart, Download, Calendar, Receipt, FileBarChart, TrendingUp } from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { StatsCard } from '@/components/StatsCard'
import { Button, Select } from '@/components/FormElements'
import { formatCurrency } from '@/lib/utils'
import { fetchTaxRecords, type ApiTaxRecord } from '@/lib/financeApi'

interface TaxRecord {
  id: string
  transactionType: 'Sale' | 'Purchase'
  invoiceNo: string
  date: string
  baseAmount: number
  taxRate: number
  taxAmount: number
}

function mapTax(r: ApiTaxRecord): TaxRecord {
  const t = r.transaction_type === 'Purchase' ? 'Purchase' : 'Sale'
  return {
    id: r.id,
    transactionType: t,
    invoiceNo: r.invoice_no,
    date: r.date,
    baseAmount: Number(r.base_amount),
    taxRate: Number(r.tax_rate),
    taxAmount: Number(r.tax_amount),
  }
}

export default function TaxationPage() {
  const [localRecords, setLocalRecords] = useState<TaxRecord[]>([])
  const [taxType, setTaxType] = useState('gst')

  const load = useCallback(async () => {
    try {
      const rows = await fetchTaxRecords()
      setLocalRecords(rows.map(mapTax))
    } catch {
      setLocalRecords([])
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

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
        ),
      },
      {
        accessorKey: 'transactionType',
        header: 'Type',
        cell: ({ row }) => (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
              row.original.transactionType === 'Sale'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-rose-100 text-rose-700'
            }`}
          >
            {row.original.transactionType}
          </span>
        ),
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

  const totalTax = useMemo(
    () => localRecords.reduce((s, r) => s + r.taxAmount, 0),
    [localRecords]
  )
  const totalBase = useMemo(
    () => localRecords.reduce((s, r) => s + r.baseAmount, 0),
    [localRecords]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Taxation & Compliance</h1>
          <p className="text-sm text-surface-500">
            GST-ready ledger view backed by seeded API data (no local storage).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select
            className="min-h-[40px] w-44"
            value={taxType}
            onChange={setTaxType}
            options={[
              { label: 'GST (India)', value: 'gst' },
              { label: 'VAT', value: 'vat' },
            ]}
          />
          <Button variant="secondary" className="gap-2">
            <Download className="h-4 w-4" />
            Export GSTR-1
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard title="Taxable base (sample)" value={formatCurrency(totalBase)} icon={FileBarChart} subtitle="From API" />
        <StatsCard title="Total tax" value={formatCurrency(totalTax)} icon={TrendingUp} subtitle="Sum of rows" />
        <StatsCard title="Regime" value={taxType.toUpperCase()} icon={Calendar} subtitle="Selector only" />
      </div>

      <div className="rounded-xl border border-surface-200 bg-white p-4">
        <div className="mb-4 flex items-center gap-2 text-sm text-surface-500">
          <PieChart className="h-4 w-4" />
          <span>Transaction register</span>
        </div>
        <DataTable data={localRecords} columns={columns} searchPlaceholder="Search invoice or amount..." />
      </div>
    </div>
  )
}
