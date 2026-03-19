import { useState, useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  Wallet,
  Plus,
  Trash2,
  Edit,
  RotateCcw,
  Search,
  Receipt,
  Download,
} from 'lucide-react'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { ExpenseDocument } from '@/components/ExpenseDocument'
import { DataTable } from '@/components/DataTable'
import { StatusBadge } from '@/components/StatusBadge'
import { Button, Modal, FormField, Input, Select } from '@/components/FormElements'
import {
  expenses,
  type ExpenseRecord,
} from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'

export default function ExpensesPage() {
  const [localExpenses, setLocalExpenses] = useState<ExpenseRecord[]>(expenses)
  const [expenseTab, setExpenseTab] = useState<'active' | 'deleted'>('active')
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [isEditingExpense, setIsEditingExpense] = useState(false)
  const [currentExpenseId, setCurrentExpenseId] = useState<string | null>(null)
  
  const [expenseData, setExpenseData] = useState({
    category: 'Office Expenses' as any,
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  })

  // Global Printing State
  const printRef = useRef<HTMLDivElement>(null)
  const [expenseToPrint, setExpenseToPrint] = useState<ExpenseRecord | null>(null)
  
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Expense_${expenseToPrint?.description.replace(/\s+/g, '_') || 'Bookito'}`,
  })

  const handleDownloadExpense = (record: ExpenseRecord) => {
    setExpenseToPrint(record)
    setTimeout(() => {
      handlePrint()
    }, 100)
  }

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
  }

  const getRemainingDays = (deletedAt?: string) => {
    if (!deletedAt) return 30
    const diff = Date.now() - new Date(deletedAt).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return Math.max(0, 30 - days)
  }

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

  const columns: ColumnDef<ExpenseRecord, any>[] = useMemo(
    () => [
      {
        accessorKey: 'date',
        header: 'Transaction Date',
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
          <span className="font-semibold text-surface-900">{row.original.description}</span>
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
            <span className={isIncome ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
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
                  className="rounded-md p-1.5 text-surface-400 hover:bg-surface-100 hover:text-primary-600"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                   onClick={() => handleDownloadExpense(row.original)}
                   className="rounded-md p-1.5 text-surface-400 hover:bg-emerald-50 hover:text-emerald-600"
                   title="Download Voucher"
                >
                   <Download className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDeleteExpense(row.original.id)}
                  className="rounded-md p-1.5 text-surface-400 hover:bg-rose-50 hover:text-rose-600"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => handleRestoreExpense(row.original.id)}
                className="rounded-md p-1.5 text-surface-400 hover:bg-emerald-50 hover:text-emerald-600"
                title="Restore"
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

  const totalExpenses = useMemo(() => {
    return filteredExpenses
      .filter(e => e.category !== 'Income')
      .reduce((sum, e) => sum + e.amount, 0)
  }, [filteredExpenses])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Expense Tracking</h1>
          <p className="text-sm text-surface-500">Manage company expenditures and track employee reimbursements.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="secondary" className="bg-white hover:bg-surface-50">
              <Download className="h-4 w-4" />
              Download Report
           </Button>
           <Button onClick={() => setShowExpenseModal(true)}>
              <Plus className="h-4 w-4" />
              Add Expense
           </Button>
        </div>
      </div>

      <div className="rounded-xl bg-surface-900 p-6 text-white shadow-lg overflow-hidden relative">
         <div className="absolute right-[-20px] top-[-20px] h-40 w-40 rounded-full bg-white/5 blur-3xl"></div>
         <div className="flex items-center justify-between relative z-10">
            <div>
               <p className="text-surface-400 text-sm font-medium">Accumulated Expenses (Current Month)</p>
               <h2 className="text-3xl font-bold mt-1">{formatCurrency(totalExpenses)}</h2>
            </div>
            <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
               <Wallet className="h-6 w-6" />
            </div>
         </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-surface-200">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex rounded-lg border border-surface-200 p-1 bg-surface-50">
            <button
              onClick={() => setExpenseTab('active')}
              className={`rounded-md px-4 py-1.5 text-xs font-bold transition-all ${
                expenseTab === 'active'
                  ? 'bg-white text-primary-600 shadow-sm border border-surface-200'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              All Expenses
            </button>
            <button
              onClick={() => setExpenseTab('deleted')}
              className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-bold transition-all ${
                expenseTab === 'deleted'
                  ? 'bg-rose-50 text-rose-600 border border-rose-100 shadow-sm'
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
          columns={columns}
          searchPlaceholder="Search descriptions or categories..."
        />
      </div>

      {/* Add/Edit Expense Modal */}
      <Modal
        isOpen={showExpenseModal}
        onClose={() => {
          setShowExpenseModal(false)
          setIsEditingExpense(false)
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
                { label: 'Travel & Meals', value: 'Travel & Meals' },
                { label: 'Utilities', value: 'Utilities' },
              ]}
              placeholder="Select category"
            />
          </FormField>
          <FormField label="Description">
            <Input 
              placeholder="Enter description (e.g. Office Rent Feb)" 
              value={expenseData.description}
              onChange={(e) => setExpenseData(prev => ({ ...prev, description: e.target.value }))}
            />
          </FormField>
          <FormField label="Amount">
            <Input 
              type="number" 
              placeholder="0.00" 
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

      {/* Hidden Printable Area */}
      <div className="hidden">
        {expenseToPrint && (
          <ExpenseDocument
            ref={printRef}
            description={expenseToPrint.description}
            category={expenseToPrint.category}
            amount={expenseToPrint.amount}
            date={expenseToPrint.date}
            expenseId={expenseToPrint.id.toUpperCase()}
          />
        )}
      </div>
    </div>
  )
}
