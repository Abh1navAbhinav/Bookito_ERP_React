import { useState, useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  DollarSign,
  TrendingUp,
  Clock,
  Upload,
  Trash2,
  Edit,
  Plus,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { StatsCard } from '@/components/StatsCard'
import { ChartCard } from '@/components/ChartCard'
import { DataTable } from '@/components/DataTable'
import { Breadcrumb } from '@/components/Breadcrumb'
import { StatusBadge } from '@/components/StatusBadge'
import { Button, Modal, FormField, Input, Select } from '@/components/FormElements'
import {
  financeRecords,
  financeStats,
  dailyRevenueData,
  weeklyRevenueData,
  monthlyRevenueData,
  expenses,
  type FinanceRecord,
  type ExpenseRecord,
} from '@/data/mockData'
import { formatCurrency, formatNumber } from '@/lib/utils'

type RevenueView = 'daily' | 'weekly' | 'monthly'

export default function FinancePage() {
  const [revenueView, setRevenueView] = useState<RevenueView>('monthly')
  const [showExpenseModal, setShowExpenseModal] = useState(false)

  const revenueDataMap = {
    daily: { data: dailyRevenueData, key: 'day' },
    weekly: { data: weeklyRevenueData, key: 'week' },
    monthly: { data: monthlyRevenueData, key: 'month' },
  }

  const activeData = revenueDataMap[revenueView]

  const financeColumns: ColumnDef<FinanceRecord, any>[] = useMemo(
    () => [
      {
        accessorKey: 'propertyName',
        header: 'Property',
        cell: ({ row }) => (
          <span className="font-medium text-surface-900">{row.original.propertyName}</span>
        ),
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
      {
        accessorKey: 'district',
        header: 'District',
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
          <span className="text-accent-600 font-medium">
            {formatCurrency(row.original.collectedAmount)}
          </span>
        ),
      },
      {
        accessorKey: 'pendingAmount',
        header: 'Pending',
        cell: ({ row }) => (
          <span className={row.original.pendingAmount > 0 ? 'text-amber-600 font-medium' : 'text-surface-400'}>
            {row.original.pendingAmount > 0 ? formatCurrency(row.original.pendingAmount) : '—'}
          </span>
        ),
      },
      {
        accessorKey: 'invoiceUploaded',
        header: 'Invoice',
        cell: ({ row }) => (
          <StatusBadge
            label={row.original.invoiceUploaded ? 'Uploaded' : 'Pending'}
            variant={row.original.invoiceUploaded ? 'success' : 'warning'}
            dot
          />
        ),
      },
      {
        accessorKey: 'lastPaymentDate',
        header: 'Last Payment',
        cell: ({ row }) => (
          <span>{row.original.lastPaymentDate || '—'}</span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: () => (
          <div className="flex items-center gap-1">
            <button className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600">
              <Edit className="h-4 w-4" />
            </button>
            <button className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600">
              <Upload className="h-4 w-4" />
            </button>
            <button className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-red-50 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  )

  const expenseColumns: ColumnDef<ExpenseRecord, any>[] = useMemo(
    () => [
      {
        accessorKey: 'date',
        header: 'Date',
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
          <span className="font-medium">{row.original.description}</span>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => {
          const cat = row.original.category
          const variant = cat === 'Income' ? 'success' : cat === 'Office Expenses' ? 'info' : 'warning'
          return <StatusBadge label={cat} variant={variant} />
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => {
          const isIncome = row.original.category === 'Income'
          return (
            <span className={isIncome ? 'text-accent-600 font-medium' : 'text-red-600 font-medium'}>
              {isIncome ? '+' : '-'}{formatCurrency(row.original.amount)}
            </span>
          )
        },
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Finance</h1>
          <div className="mt-2">
            <Breadcrumb items={[{ label: 'Finance' }]} />
          </div>
        </div>
        <Button onClick={() => setShowExpenseModal(true)}>
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard
          title="Total Closing Amount"
          value={formatCurrency(financeStats.totalClosingAmount)}
          icon={DollarSign}
          variant="primary"
        />
        <StatsCard
          title="Collected Amount"
          value={formatCurrency(financeStats.collectedAmount)}
          icon={TrendingUp}
          variant="accent"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Pending Amount"
          value={formatCurrency(financeStats.pendingAmount)}
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* Revenue Chart */}
      <ChartCard
        title="Revenue Overview"
        subtitle={`${revenueView.charAt(0).toUpperCase() + revenueView.slice(1)} revenue breakdown`}
        action={
          <div className="flex rounded-lg border border-surface-200 p-0.5">
            {(['daily', 'weekly', 'monthly'] as RevenueView[]).map((view) => (
              <button
                key={view}
                onClick={() => setRevenueView(view)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  revenueView === view
                    ? 'bg-primary-600 text-white'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={activeData.data as any[]}>
            <defs>
              <linearGradient id="financeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey={activeData.key} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              formatter={(value: any) => [formatCurrency(Number(value)), 'Revenue']}
            />
            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#financeGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Finance Records Table */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-surface-900">Payment Records</h2>
        <DataTable
          data={financeRecords}
          columns={financeColumns}
          searchPlaceholder="Search properties..."
        />
      </div>

      {/* Expenses */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-surface-900">Expense Tracking</h2>
        <DataTable
          data={expenses}
          columns={expenseColumns}
          searchPlaceholder="Search expenses..."
        />
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        title="Add Expense"
        size="md"
      >
        <div className="space-y-4">
          <FormField label="Category">
            <Select
              options={[
                { label: 'Office Expenses', value: 'Office Expenses' },
                { label: 'Other Expenses', value: 'Other Expenses' },
                { label: 'Income', value: 'Income' },
              ]}
              placeholder="Select category"
            />
          </FormField>
          <FormField label="Description">
            <Input placeholder="Enter description" />
          </FormField>
          <FormField label="Amount">
            <Input type="number" placeholder="0" />
          </FormField>
          <FormField label="Date">
            <Input type="date" />
          </FormField>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowExpenseModal(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowExpenseModal(false)}>Save Expense</Button>
        </div>
      </Modal>
    </div>
  )
}
