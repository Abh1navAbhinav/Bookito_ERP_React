import { useState, useMemo, useEffect } from 'react'
import { Plus, Star, Award, TrendingUp, User, Target, BarChart, ChevronRight, Trash2, RotateCcw } from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button, FormField, Input, Select } from '@/components/FormElements'
import { DataTable } from '@/components/DataTable'
import { type ColumnDef } from '@tanstack/react-table'
import { differenceInDays, parseISO } from 'date-fns'

interface PerformanceReview {
  id: string
  employeeName: string
  employeeId: string
  reviewPeriod: string
  rating: number
  reviewer: string
  status: 'Completed' | 'In Progress' | 'Scheduled'
}

interface DeletedPerformanceReview extends PerformanceReview {
  deletedAt: string
}

const initialReviews: PerformanceReview[] = [
  {
    id: '1',
    employeeName: 'John Doe',
    employeeId: 'EMP001',
    reviewPeriod: 'Q1 2026',
    rating: 4.5,
    reviewer: 'Manager Sarah',
    status: 'Completed'
  },
  {
    id: '2',
    employeeName: 'Jane Smith',
    employeeId: 'EMP002',
    reviewPeriod: 'Q1 2026',
    rating: 0,
    reviewer: 'Manager Mike',
    status: 'In Progress'
  }
]

export default function PerformanceReviewsPage() {
  const [reviews, setReviews] = useState<PerformanceReview[]>(() => {
    const saved = localStorage.getItem('bookito_performance_reviews')
    return saved ? JSON.parse(saved) : initialReviews
  })
  
  const [deletedReviews, setDeletedReviews] = useState<DeletedPerformanceReview[]>(() => {
    const saved = localStorage.getItem('bookito_deleted_performance_reviews')
    return saved ? JSON.parse(saved) : []
  })

  const [showTrash, setShowTrash] = useState(false)

  useEffect(() => {
    localStorage.setItem('bookito_performance_reviews', JSON.stringify(reviews))
  }, [reviews])

  useEffect(() => {
    localStorage.setItem('bookito_deleted_performance_reviews', JSON.stringify(deletedReviews))
  }, [deletedReviews])

  useEffect(() => {
    // Purge logic: Auto-delete after 30 days
    const now = new Date()
    setDeletedReviews(prev => prev.filter(r => differenceInDays(now, parseISO(r.deletedAt)) < 30))
  }, [])

  const stats = [
    { label: 'Avg Rating', value: '4.2', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Reviews Due', value: '15', icon: Target, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Top Performers', value: '8', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Overall Perf.', value: '+5%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
  ]

  const handleDelete = (review: PerformanceReview) => {
    const deletedAt = new Date().toISOString()
    const entry: DeletedPerformanceReview = { ...review, deletedAt }
    setReviews(prev => prev.filter(r => r.id !== review.id))
    setDeletedReviews(prev => [entry, ...prev])
  }

  const handleRestore = (review: DeletedPerformanceReview) => {
    const { deletedAt, ...rest } = review
    setDeletedReviews(prev => prev.filter(r => r.id !== review.id))
    setReviews(prev => [rest, ...prev])
  }

  const getRemainingDays = (deletedAt: string) => {
    const diff = differenceInDays(new Date(), parseISO(deletedAt))
    return Math.max(0, 30 - diff)
  }

  const columns: ColumnDef<PerformanceReview, any>[] = useMemo(() => [
    {
      accessorKey: 'employeeName',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-surface-100 flex items-center justify-center font-bold text-surface-500 text-xs">
             {row.original.employeeName[0]}
          </div>
          <span className="font-semibold text-surface-900">{row.original.employeeName}</span>
        </div>
      )
    },
    {
      accessorKey: 'reviewPeriod',
      header: 'Period',
      cell: ({ row }) => <span className="text-sm text-surface-600">{row.original.reviewPeriod}</span>
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Star className={cn("h-4 w-4 fill-amber-400 text-amber-400", row.original.rating === 0 && "fill-surface-200 text-surface-200")} />
          <span className="font-bold text-surface-900">{row.original.rating === 0 ? '-' : row.original.rating}</span>
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
          row.original.status === 'Completed' ? "bg-emerald-50 text-emerald-700" :
          row.original.status === 'In Progress' ? "bg-amber-50 text-amber-700" : "bg-surface-50 text-surface-500"
        )}>
          {row.original.status}
        </span>
      )
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
            <button 
                onClick={() => handleDelete(row.original)}
                className="h-8 w-8 rounded-lg text-surface-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors"
                title="Move to Trash"
            >
                <Trash2 className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700">
                View Report
                <ChevronRight className="h-3 w-3" />
            </button>
        </div>
      )
    }
  ], [reviews])

  const deletedColumns: ColumnDef<DeletedPerformanceReview, any>[] = useMemo(() => [
    {
      accessorKey: 'employeeName',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-surface-100 flex items-center justify-center font-bold text-surface-500 text-xs">
             {row.original.employeeName[0]}
          </div>
          <span className="font-semibold text-surface-900">{row.original.employeeName}</span>
        </div>
      )
    },
    {
      accessorKey: 'deletedAt',
      header: 'Auto-deletes in',
      cell: ({ row }) => {
        const days = getRemainingDays(row.original.deletedAt)
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
            {days} days remaining
          </span>
        )
      }
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
            <button 
                onClick={() => handleRestore(row.original)}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition-colors shadow-sm border border-emerald-100"
            >
                <RotateCcw className="h-3.5 w-3.5" />
                Restore
            </button>
        </div>
      )
    }
  ], [deletedReviews])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Performance Management</h1>
          <div className="mt-2">
            <Breadcrumb items={[{ label: 'People Ops' }, { label: 'Performance Reviews' }]} />
          </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-surface-200 p-0.5 bg-surface-100/50 shadow-inner">
                <button
                    onClick={() => setShowTrash(false)}
                    className={cn(
                        "rounded-md px-4 py-1.5 text-xs font-medium transition-all duration-200",
                        !showTrash
                        ? "bg-white text-primary-600 shadow-sm border border-surface-200"
                        : "text-surface-500 hover:text-surface-700"
                    )}
                >
                    Current
                </button>
                <button
                    onClick={() => setShowTrash(true)}
                    className={cn(
                        "flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-medium transition-all duration-200",
                        showTrash
                        ? "bg-white text-red-600 shadow-sm border border-red-200"
                        : "text-surface-500 hover:text-surface-700"
                    )}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    Trash
                </button>
            </div>
            <Button variant="secondary" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                KPI Config
            </Button>
            <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Schedule Review
            </Button>
        </div>
      </div>

      {!showTrash && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                <div className={`rounded-xl ${stat.bg} p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-surface-500">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-surface-900">{stat.value}</h3>
                </div>
                </div>
            </div>
            ))}
        </div>
      )}

      <div className="space-y-4">
        {!showTrash ? (
            <DataTable
                data={reviews}
                columns={columns}
                searchPlaceholder="Search reviews..."
            />
        ) : (
            <>
                <div className="flex items-center gap-2 px-1">
                    <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                    <p className="text-sm text-surface-500 italic">
                        Reviews in trash are automatically deleted after 30 days.
                    </p>
                </div>
                <DataTable
                    data={deletedReviews}
                    columns={deletedColumns}
                    searchPlaceholder="Search deleted reviews..."
                />
            </>
        )}
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
