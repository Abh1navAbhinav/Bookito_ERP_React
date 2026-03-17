import { useState, useMemo, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { type ColumnDef } from '@tanstack/react-table'
import {
  DollarSign,
  TrendingUp,
  Clock,
  Upload,
  Trash2,
  Edit,
  Plus,
  Filter,
  ChevronDown,
  X,
  FileText,
  Receipt,
  Eye,
  RotateCcw,
  Download,
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
import { Button, Modal, FormField, Input, Select, SearchableSelect } from '@/components/FormElements'
import { QuotationDocument } from '@/components/QuotationDocument'
import {
  financeRecords,
  financeStats,
  dailyRevenueData,
  weeklyRevenueData,
  monthlyRevenueData,
  expenses,
  properties,
  quotationRecords,
  type FinanceRecord,
  type ExpenseRecord,
  type QuotationRecord,
  type Property,
} from '@/data/mockData'
import { formatCurrency, formatNumber } from '@/lib/utils'

type RevenueView = 'daily' | 'weekly' | 'monthly'

export default function FinancePage() {
  const [localFinanceRecords, setLocalFinanceRecords] = useState<FinanceRecord[]>(financeRecords)
  const [localProperties, setLocalProperties] = useState<Property[]>(properties)
  const [localQuotationRecords, setLocalQuotationRecords] = useState<QuotationRecord[]>(quotationRecords)

  const [revenueView, setRevenueView] = useState<RevenueView>('monthly')
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showQuotationModal, setShowQuotationModal] = useState(false)
  const [showBillModal, setShowBillModal] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isEditingQuotation, setIsEditingQuotation] = useState(false)

  const [quotationTab, setQuotationTab] = useState<'active' | 'deleted'>('active')
  const [paymentTab, setPaymentTab] = useState<'active' | 'deleted'>('active')
  const [expenseTab, setExpenseTab] = useState<'active' | 'deleted'>('active')
  const [localExpenses, setLocalExpenses] = useState<ExpenseRecord[]>(expenses)
  const [isEditingExpense, setIsEditingExpense] = useState(false)
  const [currentExpenseId, setCurrentExpenseId] = useState<string | null>(null)
  
  const [expenseData, setExpenseData] = useState({
    category: 'Office Expenses' as any,
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  })

  const [isEditingPayment, setIsEditingPayment] = useState(false)
  const [currentPaymentId, setCurrentPaymentId] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState({
    propertyName: '',
    closingAmount: 0,
    collectedAmount: 0,
    lastPaymentDate: '',
    executive: ''
  })
  
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

  // State to track if a property is selected to handle data fetching
  const [isPropertySelected, setIsPropertySelected] = useState(false)

  const handlePropertySelect = (propertyId: string) => {
    if (!propertyId) {
      setIsPropertySelected(false)
      return
    }
    
    const property = localProperties.find(p => p.id === propertyId)
    if (property) {
      setIsPropertySelected(true)
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
    setIsPropertySelected(false)
    setShowPreview(false)
    setIsEditingQuotation(false)
  }

  const handleEditQuotation = (record: QuotationRecord) => {
    setQuotationData({
      propertyId: record.propertyId,
      propertyName: record.propertyName,
      recipientName: record.recipientName,
      roomCategory: record.roomCategory,
      standardPrice: record.standardPrice,
      sellingPrice: record.sellingPrice,
      tenure: record.tenure,
      executiveName: record.executive,
      executiveRole: 'Relationship Manager',
      executivePhone: '+91 8891695554'
    })
    setIsPropertySelected(true)
    setIsEditingQuotation(true)
    setShowQuotationModal(true)
  }

  const [billData, setBillData] = useState({
    propertyId: '',
    propertyName: '',
    closingAmount: 0,
    collectedAmount: 0,
    tenure: '',
    roomCategory: '',
    executive: ''
  })

  const handleCreateBill = (record: QuotationRecord) => {
    setBillData({
      propertyId: record.propertyId,
      propertyName: record.propertyName,
      closingAmount: record.sellingPrice,
      collectedAmount: 0,
      tenure: record.tenure,
      roomCategory: record.roomCategory,
      executive: record.executive
    })
    setShowBillModal(true)
  }

  const handleGenerateBill = () => {
    // 1. Update Property details in localProperties
    setLocalProperties(prev => prev.map(p => {
      if (p.id === billData.propertyId) {
        return {
          ...p,
          finalCommittedPrice: billData.closingAmount,
          tenure: billData.tenure as any,
          roomCategory: billData.roomCategory as any
        }
      }
      return p
    }))

    // 2. Add to Finance Records
    const propertyInfo = localProperties.find(p => p.id === billData.propertyId)
    const newRecord: FinanceRecord = {
      id: `f-${Date.now()}`,
      propertyName: billData.propertyName,
      state: propertyInfo?.state || 'Kerala',
      district: propertyInfo?.district || 'Kozhikode',
      location: propertyInfo?.location || 'Unknown',
      closingAmount: billData.closingAmount,
      pendingAmount: billData.closingAmount - billData.collectedAmount,
      collectedAmount: billData.collectedAmount,
      invoiceUploaded: false,
      invoiceDate: new Date().toISOString().split('T')[0],
      executive: billData.executive
    }

    setLocalFinanceRecords(prev => [newRecord, ...prev])
    setShowBillModal(false)
  }

  const handlePrint = useReactToPrint({
    contentRef: quotationRef,
    documentTitle: `Quotation_${quotationData.propertyName.replace(/\s+/g, '_')}`,
  })

  // --- Quotation Handlers ---
  const handleDeleteQuotation = (id: string) => {
    setLocalQuotationRecords(prev => prev.map(q => 
      q.id === id ? { ...q, isDeleted: true, deletedAt: new Date().toISOString() } : q
    ))
  }

  const handleRestoreQuotation = (id: string) => {
    setLocalQuotationRecords(prev => prev.map(q => 
      q.id === id ? { ...q, isDeleted: false, deletedAt: undefined } : q
    ))
  }

  // --- Payment Handlers ---
  const handleDeletePayment = (id: string) => {
    setLocalFinanceRecords(prev => prev.map(r => 
      r.id === id ? { ...r, isDeleted: true, deletedAt: new Date().toISOString() } : r
    ))
  }

  const handleRestorePayment = (id: string) => {
    setLocalFinanceRecords(prev => prev.map(r => 
      r.id === id ? { ...r, isDeleted: false, deletedAt: undefined } : r
    ))
  }

  const handleEditPayment = (record: FinanceRecord) => {
    setCurrentPaymentId(record.id)
    setPaymentData({
      propertyName: record.propertyName,
      closingAmount: record.closingAmount,
      collectedAmount: record.collectedAmount,
      lastPaymentDate: record.lastPaymentDate || '',
      executive: record.executive
    })
    setIsEditingPayment(true)
    setShowPaymentEditModal(true)
  }

  const handleSavePayment = () => {
    setLocalFinanceRecords(prev => prev.map(r => 
      r.id === currentPaymentId ? {
        ...r,
        propertyName: paymentData.propertyName,
        closingAmount: paymentData.closingAmount,
        collectedAmount: paymentData.collectedAmount,
        pendingAmount: paymentData.closingAmount - paymentData.collectedAmount,
        lastPaymentDate: paymentData.lastPaymentDate,
        executive: paymentData.executive
      } : r
    ))
    setShowPaymentEditModal(false)
    setIsEditingPayment(false)
    setCurrentPaymentId(null)
  }

  const handleDownloadPaymentPDF = (record: FinanceRecord) => {
    // Mock PDF download
    console.log('Downloading PDF for', record.propertyName)
    alert(`Downloading Payment Receipt for ${record.propertyName}`)
  }

  // --- Expense Handlers ---
  const handleDeleteExpense = (id: string) => {
    setLocalExpenses(prev => prev.map(e => 
      e.id === id ? { ...e, isDeleted: true, deletedAt: new Date().toISOString() } : e
    ))
  }

  const handleRestoreExpense = (id: string) => {
    setLocalExpenses(prev => prev.map(e => 
      e.id === id ? { ...e, isDeleted: false, deletedAt: undefined } : e
    ))
  }

  const handleEditExpense = (record: ExpenseRecord) => {
    setCurrentExpenseId(record.id)
    setExpenseData({
      category: record.category,
      description: record.description,
      amount: record.amount,
      date: record.date
    })
    setIsEditingExpense(true)
    setShowExpenseModal(true)
  }

  const handleSaveExpense = () => {
    if (isEditingExpense && currentExpenseId) {
      setLocalExpenses(prev => prev.map(e => 
        e.id === currentExpenseId ? { ...e, ...expenseData } : e
      ))
    } else {
      const newExpense: ExpenseRecord = {
        id: `e-${Date.now()}`,
        ...expenseData
      }
      setLocalExpenses(prev => [newExpense, ...prev])
    }
    setShowExpenseModal(false)
    setIsEditingExpense(false)
    setCurrentExpenseId(null)
    setExpenseData({
      category: 'Office Expenses',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0]
    })
  }

  const getRemainingDays = (deletedAt?: string) => {
    if (!deletedAt) return 30
    const diff = Date.now() - new Date(deletedAt).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return Math.max(0, 30 - days)
  }
  
  // Filters state
  const [statusFilter, setStatusFilter] = useState<'all' | 'full' | 'partial' | 'pending'>('all')
  const [executiveFilter, setExecutiveFilter] = useState<string>('all')
  const [customFilters, setCustomFilters] = useState<{ column: string, value: string }[]>([])
  const [showAddFilterModal, setShowAddFilterModal] = useState(false)
  const [showPaymentEditModal, setShowPaymentEditModal] = useState(false)
  const [newFilterColumn, setNewFilterColumn] = useState('')
  const [newFilterValue, setNewFilterValue] = useState('')

  const uniqueExecutives = useMemo(() => {
    return Array.from(new Set(localFinanceRecords.map(r => r.executive)))
  }, [localFinanceRecords])

  const filteredFinanceRecords = useMemo(() => {
    return localFinanceRecords.filter(record => {
      // Tab filter
      if (paymentTab === 'active' && record.isDeleted) return false
      if (paymentTab === 'deleted') {
        if (!record.isDeleted) return false
        if (getRemainingDays(record.deletedAt) === 0) return false
      }

      // Status filter
      if (statusFilter === 'full' && record.pendingAmount !== 0) return false
      if (statusFilter === 'partial' && !(record.collectedAmount > 0 && record.pendingAmount > 0)) return false
      if (statusFilter === 'pending' && record.collectedAmount !== 0) return false
      
      // Executive filter
      if (executiveFilter !== 'all' && record.executive !== executiveFilter) return false
      
      // Custom filters
      for (const filter of customFilters) {
        const val = (record as any)[filter.column]?.toString().toLowerCase()
        if (!val?.includes(filter.value.toLowerCase())) return false
      }
      
      return true
    })
  }, [localFinanceRecords, statusFilter, executiveFilter, customFilters, paymentTab])

  // Quotation Filters state
  const [quotationStatusFilter, setQuotationStatusFilter] = useState<'all' | 'Draft' | 'Sent' | 'Downloaded'>('all')
  const [quotationExecutiveFilter, setQuotationExecutiveFilter] = useState<string>('all')
  const [quotationCustomFilters, setQuotationCustomFilters] = useState<{ column: string, value: string }[]>([])
  const [showAddQuotationFilterModal, setShowAddQuotationFilterModal] = useState(false)
  const [newQuotationFilterColumn, setNewQuotationFilterColumn] = useState('')
  const [newQuotationFilterValue, setNewQuotationFilterValue] = useState('')

  const uniqueQuotationExecutives = useMemo(() => {
    return Array.from(new Set(localQuotationRecords.map(r => r.executive)))
  }, [localQuotationRecords])

  const filteredQuotationRecords = useMemo(() => {
    return localQuotationRecords.filter(record => {
      // Tab filter
      if (quotationTab === 'active' && record.isDeleted) return false
      if (quotationTab === 'deleted') {
        if (!record.isDeleted) return false
        // Auto-delete after 30 days logic
        if (getRemainingDays(record.deletedAt) === 0) return false
      }

      // Status filter
      if (quotationStatusFilter !== 'all' && record.status !== quotationStatusFilter) return false
      
      // Executive filter
      if (quotationExecutiveFilter !== 'all' && record.executive !== quotationExecutiveFilter) return false
      
      // Custom filters
      for (const filter of quotationCustomFilters) {
        const val = (record as any)[filter.column]?.toString().toLowerCase()
        if (!val?.includes(filter.value.toLowerCase())) return false
      }
      
      return true
    })
  }, [localQuotationRecords, quotationStatusFilter, quotationExecutiveFilter, quotationCustomFilters, quotationTab])

  const filteredExpenses = useMemo(() => {
    return localExpenses.filter(e => {
      if (expenseTab === 'active' && e.isDeleted) return false
      if (expenseTab === 'deleted') {
        if (!e.isDeleted) return false
        if (getRemainingDays(e.deletedAt) === 0) return false
      }
      return true
    })
  }, [localExpenses, expenseTab])

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
        accessorKey: 'executive',
        header: paymentTab === 'active' ? 'Executive' : 'Auto-deletes in',
        cell: ({ row }) => {
          if (paymentTab === 'deleted') {
            const days = getRemainingDays(row.original.deletedAt)
            return (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                {days} days
              </span>
            )
          }
          return <span className="text-xs text-surface-500">{row.original.executive}</span>
        },
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
                  className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600"
                  title="Edit Payment"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDownloadPaymentPDF(row.original)}
                  className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600"
                  title="Download PDF"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDeletePayment(row.original.id)}
                  className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Delete Payment"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => handleRestorePayment(row.original.id)}
                className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-green-50 hover:text-green-600"
                title="Restore Payment"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        ),
      },
    ],
    [paymentTab]
  )
  
  const quotationColumns: ColumnDef<QuotationRecord, any>[] = useMemo(
    () => [
      {
        accessorKey: 'propertyName',
        header: 'Property',
        cell: ({ row }) => (
          <span className="font-medium text-surface-900">{row.original.propertyName}</span>
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
        accessorKey: 'roomCategory',
        header: 'Category',
      },
      {
        accessorKey: 'sellingPrice',
        header: 'Selling Price',
        cell: ({ row }) => formatCurrency(row.original.sellingPrice),
      },
      {
        accessorKey: 'tenure',
        header: 'Tenure',
      },
      {
        accessorKey: 'status',
        header: quotationTab === 'active' ? 'Status' : 'Auto-deletes in',
        cell: ({ row }) => {
          if (quotationTab === 'deleted') {
            const days = getRemainingDays(row.original.deletedAt)
            return (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                {days} days
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
        cell: ({ row }) => (
          <span className="text-xs text-surface-500">{row.original.executive}</span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button 
              onClick={() => handleCreateBill(row.original)}
              title="Create Bill"
              className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600"
            >
              <Receipt className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleEditQuotation(row.original)}
              title="Edit Quotation"
              className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600"
            >
              <Edit className="h-4 w-4" />
            </button>
            {quotationTab === 'active' ? (
              <button 
                onClick={() => handleDeleteQuotation(row.original.id)}
                title="Delete Quotation"
                className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ) : (
              <button 
                onClick={() => handleRestoreQuotation(row.original.id)}
                title="Restore Quotation"
                className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-green-50 hover:text-green-600"
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
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {expenseTab === 'active' ? (
              <>
                <button 
                  onClick={() => handleEditExpense(row.original)}
                  className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-600"
                  title="Edit Expense"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDeleteExpense(row.original.id)}
                  className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Delete Expense"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => handleRestoreExpense(row.original.id)}
                className="rounded-md p-1.5 text-surface-400 transition-colors hover:bg-green-50 hover:text-green-600"
                title="Restore Expense"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        ),
      },
    ],
    [expenseTab]
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
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => setShowQuotationModal(true)}>
            <FileText className="h-4 w-4" />
            Create Quotation
          </Button>
          <Button onClick={() => setShowExpenseModal(true)}>
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>
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
      
      {/* Quotation Records Table */}
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-surface-900">Quotation Records</h2>
            <div className="flex rounded-lg border border-surface-200 p-0.5 ml-4">
              <button
                onClick={() => setQuotationTab('active')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  quotationTab === 'active'
                    ? 'bg-primary-600 text-white'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                All Quotations
              </button>
              <button
                onClick={() => setQuotationTab('deleted')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  quotationTab === 'deleted'
                    ? 'bg-red-600 text-white'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Trash
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <Select
              className="w-40"
              value={quotationStatusFilter}
              onChange={(val) => setQuotationStatusFilter(val as any)}
              options={[
                { label: 'All Quotations', value: 'all' },
                { label: 'Draft', value: 'Draft' },
                { label: 'Sent', value: 'Sent' },
                { label: 'Downloaded', value: 'Downloaded' },
              ]}
            />

            {/* Executive Filter */}
            <Select
              className="w-48"
              value={quotationExecutiveFilter}
              onChange={setQuotationExecutiveFilter}
              options={[
                { label: 'All Executives', value: 'all' },
                ...uniqueQuotationExecutives.map(e => ({ label: e, value: e }))
              ]}
            />

            {/* Custom Filter Button */}
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setShowAddQuotationFilterModal(true)}
              className="h-9"
            >
              <Filter className="h-4 w-4" />
              Create Filter
            </Button>

            {(quotationStatusFilter !== 'all' || quotationExecutiveFilter !== 'all' || quotationCustomFilters.length > 0) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setQuotationStatusFilter('all')
                  setQuotationExecutiveFilter('all')
                  setQuotationCustomFilters([])
                }}
                className="h-9 text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Applied Custom Filters */}
        {quotationCustomFilters.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {quotationCustomFilters.map((filter, index) => (
              <div 
                key={index}
                className="flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 border border-primary-100"
              >
                <span className="capitalize">{filter.column.replace(/([A-Z])/g, ' $1')}:</span>
                <span>{filter.value}</span>
                <button 
                  onClick={() => setQuotationCustomFilters(prev => prev.filter((_, i) => i !== index))}
                  className="rounded-full hover:bg-primary-100 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <DataTable
          data={filteredQuotationRecords}
          columns={quotationColumns}
          searchPlaceholder="Search quotations..."
        />
      </div>

      {/* Finance Records Table */}
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-surface-900">Payment Records</h2>
            <div className="flex rounded-lg border border-surface-200 p-0.5 ml-4">
              <button
                onClick={() => setPaymentTab('active')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  paymentTab === 'active'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                All Payments
              </button>
              <button
                onClick={() => setPaymentTab('deleted')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  paymentTab === 'deleted'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Trash
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <Select
              className="w-40"
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as any)}
              options={[
                { label: 'All Payments', value: 'all' },
                { label: 'Full Closed', value: 'full' },
                { label: 'Partial Closed', value: 'partial' },
                { label: 'Pending to Pay', value: 'pending' },
              ]}
            />

            {/* Executive Filter */}
            <Select
              className="w-48"
              value={executiveFilter}
              onChange={setExecutiveFilter}
              options={[
                { label: 'All Executives', value: 'all' },
                ...uniqueExecutives.map(e => ({ label: e, value: e }))
              ]}
            />

            {/* Custom Filter Button */}
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setShowAddFilterModal(true)}
              className="h-9"
            >
              <Filter className="h-4 w-4" />
              Create Filter
            </Button>

            {(statusFilter !== 'all' || executiveFilter !== 'all' || customFilters.length > 0) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setStatusFilter('all')
                  setExecutiveFilter('all')
                  setCustomFilters([])
                }}
                className="h-9 text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Applied Custom Filters */}
        {customFilters.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {customFilters.map((filter, index) => (
              <div 
                key={index}
                className="flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 border border-primary-100"
              >
                <span className="capitalize">{filter.column.replace(/([A-Z])/g, ' $1')}:</span>
                <span>{filter.value}</span>
                <button 
                  onClick={() => setCustomFilters(prev => prev.filter((_, i) => i !== index))}
                  className="rounded-full hover:bg-primary-100 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <DataTable
          data={filteredFinanceRecords}
          columns={financeColumns}
          searchPlaceholder="Search properties..."
        />
      </div>

      <div>
        <div className="mb-3 flex items-center gap-4">
          <h2 className="text-lg font-semibold text-surface-900">Expense Tracking</h2>
          <div className="flex rounded-lg border border-surface-200 p-0.5 ml-4">
            <button
              onClick={() => setExpenseTab('active')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                expenseTab === 'active'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              All Expenses
            </button>
            <button
              onClick={() => setExpenseTab('deleted')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                expenseTab === 'deleted'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Trash
            </button>
          </div>
        </div>
        <DataTable
          data={filteredExpenses}
          columns={expenseColumns}
          searchPlaceholder="Search expenses..."
        />
      </div>

      {/* Add/Edit Expense Modal */}
      <Modal
        isOpen={showExpenseModal}
        onClose={() => {
          setShowExpenseModal(false)
          setIsEditingExpense(false)
          setCurrentExpenseId(null)
        }}
        title={isEditingExpense ? "Edit Expense" : "Add Expense"}
        size="md"
      >
        <div className="space-y-4">
          <FormField label="Category">
            <Select
              value={expenseData.category}
              onChange={(val) => setExpenseData(prev => ({ ...prev, category: val as any }))}
              options={[
                { label: 'Office Expenses', value: 'Office Expenses' },
                { label: 'Other Expenses', value: 'Other Expenses' },
                { label: 'Income', value: 'Income' },
              ]}
              placeholder="Select category"
            />
          </FormField>
          <FormField label="Description">
            <Input 
              placeholder="Enter description" 
              value={expenseData.description}
              onChange={(e) => setExpenseData(prev => ({ ...prev, description: e.target.value }))}
            />
          </FormField>
          <FormField label="Amount">
            <Input 
              type="number" 
              placeholder="0" 
              value={expenseData.amount || ''}
              onChange={(e) => setExpenseData(prev => ({ ...prev, amount: Number(e.target.value) }))}
            />
          </FormField>
          <FormField label="Date">
            <Input 
              type="date" 
              value={expenseData.date}
              onChange={(e) => setExpenseData(prev => ({ ...prev, date: e.target.value }))}
            />
          </FormField>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowExpenseModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveExpense}>
            {isEditingExpense ? "Update Expense" : "Save Expense"}
          </Button>
        </div>
      </Modal>

      {/* Create Quotation Modal */}
      <Modal
        isOpen={showQuotationModal}
        onClose={() => {
          setShowQuotationModal(false)
          resetQuotationForm()
        }}
        title={isEditingQuotation ? "Edit Quotation" : "Create Quotation"}
        size="lg"
      >
        {!showPreview ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Select Property">
                <SearchableSelect 
                  placeholder="Search and choose property"
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
                  placeholder="e.g. Silent Creek Resort And Spa" 
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
              <FormField label="Standard Price">
                <Input 
                  type="number" 
                  value={quotationData.standardPrice || ''}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setQuotationData(prev => ({ ...prev, standardPrice: val }))
                  }}
                />
              </FormField>
              <FormField label="Actual Selling Price">
                <Input 
                  type="number" 
                  value={quotationData.sellingPrice || ''}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setQuotationData(prev => ({ ...prev, sellingPrice: val }))
                  }}
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
              <div className="flex flex-col justify-end pb-1">
                <div className="rounded-lg bg-emerald-50 p-2 border border-emerald-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700 uppercase">Discount:</span>
                  <span className="text-sm font-bold text-emerald-600">
                    {quotationData.standardPrice > 0 
                      ? (((quotationData.standardPrice - quotationData.sellingPrice) / quotationData.standardPrice) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
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
                Preview Quotation
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-auto bg-surface-100 p-4 rounded-lg max-h-[58vh] border border-surface-200 shadow-inner">
              <div className="scale-75 origin-top mb-[-150px]">
                <QuotationDocument ref={quotationRef} {...quotationData} />
              </div>
            </div>
            <div className="flex justify-between items-center bg-white pt-4">
              <Button variant="secondary" onClick={() => setShowPreview(false)}>
                Back to Edit
              </Button>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => handlePrint()}>
                  Download PDF
                </Button>
                <Button onClick={() => {
                  handlePrint()
                  setShowQuotationModal(false)
                  resetQuotationForm()
                }}>
                  {isEditingQuotation ? "Update & Send" : "Send to Client"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Custom Filter Modal */}
      <Modal
        isOpen={showAddFilterModal}
        onClose={() => setShowAddFilterModal(false)}
        title="Create Custom Filter"
        size="sm"
      >
        <div className="space-y-4">
          <FormField label="Select Column">
            <Select
              value={newFilterColumn}
              onChange={setNewFilterColumn}
              options={[
                { label: 'Property Name', value: 'propertyName' },
                { label: 'State', value: 'state' },
                { label: 'District', value: 'district' },
                { label: 'Location', value: 'location' },
                { label: 'Executive', value: 'executive' },
              ]}
              placeholder="Select column"
            />
          </FormField>
          <FormField label="Filter Value">
            <Input 
              placeholder="Enter value to filter by" 
              value={newFilterValue}
              onChange={(e) => setNewFilterValue(e.target.value)}
            />
          </FormField>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowAddFilterModal(false)}>
            Cancel
          </Button>
          <Button 
            disabled={!newFilterColumn || !newFilterValue}
            onClick={() => {
              setCustomFilters(prev => [...prev, { column: newFilterColumn, value: newFilterValue }])
              setNewFilterColumn('')
              setNewFilterValue('')
              setShowAddFilterModal(false)
            }}
          >
            Add Filter
          </Button>
        </div>
      </Modal>

      {/* Add Quotation Custom Filter Modal */}
      <Modal
        isOpen={showAddQuotationFilterModal}
        onClose={() => setShowAddQuotationFilterModal(false)}
        title="Create Quotation Filter"
        size="sm"
      >
        <div className="space-y-4">
          <FormField label="Select Column">
            <Select
              value={newQuotationFilterColumn}
              onChange={setNewQuotationFilterColumn}
              options={[
                { label: 'Property Name', value: 'propertyName' },
                { label: 'Recipient Name', value: 'recipientName' },
                { label: 'Executive', value: 'executive' },
                { label: 'Tenure', value: 'tenure' },
                { label: 'Room Category', value: 'roomCategory' },
              ]}
              placeholder="Select column"
            />
          </FormField>
          <FormField label="Filter Value">
            <Input 
              placeholder="Enter value" 
              value={newQuotationFilterValue}
              onChange={(e) => setNewQuotationFilterValue(e.target.value)}
            />
          </FormField>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowAddQuotationFilterModal(false)}>
            Cancel
          </Button>
          <Button 
            disabled={!newQuotationFilterColumn || !newQuotationFilterValue}
            onClick={() => {
              setQuotationCustomFilters(prev => [...prev, { column: newQuotationFilterColumn, value: newQuotationFilterValue }])
              setNewQuotationFilterColumn('')
              setNewQuotationFilterValue('')
              setShowAddQuotationFilterModal(false)
            }}
          >
            Add Filter
          </Button>
        </div>
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
                value={billData.collectedAmount}
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
            Generate Bill
          </Button>
        </div>
      </Modal>
      {/* Edit Payment Modal */}
      <Modal
        isOpen={showPaymentEditModal}
        onClose={() => setShowPaymentEditModal(false)}
        title="Edit Payment Record"
        size="md"
      >
        <div className="space-y-4">
          <FormField label="Property Name">
            <Input 
              value={paymentData.propertyName}
              onChange={(e) => setPaymentData(prev => ({ ...prev, propertyName: e.target.value }))}
            />
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
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Last Payment Date">
              <Input 
                type="date" 
                value={paymentData.lastPaymentDate}
                onChange={(e) => setPaymentData(prev => ({ ...prev, lastPaymentDate: e.target.value }))}
              />
            </FormField>
            <FormField label="Executive">
              <Input 
                value={paymentData.executive}
                onChange={(e) => setPaymentData(prev => ({ ...prev, executive: e.target.value }))}
              />
            </FormField>
          </div>
          <div className="rounded-lg bg-orange-50 p-3 border border-orange-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-orange-700 font-medium">Pending Balance:</span>
              <span className="text-orange-800 font-bold">
                {formatCurrency(paymentData.closingAmount - paymentData.collectedAmount)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowPaymentEditModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSavePayment}>
            Update Payment
          </Button>
        </div>
      </Modal>
    </div>
  )
}
