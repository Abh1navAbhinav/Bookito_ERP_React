import { useState, useMemo, useEffect } from 'react'
import { Plus, BookOpen, GraduationCap, CheckCircle, Clock, User, Download, ExternalLink, Trash2, RotateCcw } from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button, FormField, Input, Select } from '@/components/FormElements'
import { DataTable } from '@/components/DataTable'
import { type ColumnDef } from '@tanstack/react-table'
import { differenceInDays, parseISO } from 'date-fns'

interface TrainingProgram {
  id: string
  title: string
  instructor: string
  employeesEnrolled: number
  completionRate: string
  startDate: string
  status: 'Published' | 'Draft' | 'Ended'
}

interface DeletedTrainingProgram extends TrainingProgram {
  deletedAt: string
}

const initialPrograms: TrainingProgram[] = [
  {
    id: '1',
    title: 'Advanced CRM Training',
    instructor: 'Alex Mercer',
    employeesEnrolled: 15,
    completionRate: '80%',
    startDate: '2026-03-20',
    status: 'Published'
  },
  {
    id: '2',
    title: 'Soft Skills & Communication',
    instructor: 'Jane Doe',
    employeesEnrolled: 25,
    completionRate: '0%',
    startDate: '2026-04-01',
    status: 'Draft'
  }
]

export default function TrainingProgramsPage() {
  const [programs, setPrograms] = useState<TrainingProgram[]>(() => {
    const saved = localStorage.getItem('bookito_training_programs')
    return saved ? JSON.parse(saved) : initialPrograms
  })
  
  const [deletedPrograms, setDeletedPrograms] = useState<DeletedTrainingProgram[]>(() => {
    const saved = localStorage.getItem('bookito_deleted_training_programs')
    return saved ? JSON.parse(saved) : []
  })

  const [showTrash, setShowTrash] = useState(false)

  useEffect(() => {
    localStorage.setItem('bookito_training_programs', JSON.stringify(programs))
  }, [programs])

  useEffect(() => {
    localStorage.setItem('bookito_deleted_training_programs', JSON.stringify(deletedPrograms))
  }, [deletedPrograms])

  useEffect(() => {
    // Purge logic: Auto-delete after 30 days
    const now = new Date()
    setDeletedPrograms(prev => prev.filter(p => differenceInDays(now, parseISO(p.deletedAt)) < 30))
  }, [])

  const stats = [
    { label: 'Active Programs', value: programs.filter(p => p.status === 'Published').length.toString(), icon: BookOpen, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Total Enrolled', value: '142', icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Certifications', value: '85', icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Success Rate', value: '92%', icon: CheckCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  const handleDelete = (program: TrainingProgram) => {
    const deletedAt = new Date().toISOString()
    const entry: DeletedTrainingProgram = { ...program, deletedAt }
    setPrograms(prev => prev.filter(p => p.id !== program.id))
    setDeletedPrograms(prev => [entry, ...prev])
  }

  const handleRestore = (program: DeletedTrainingProgram) => {
    const { deletedAt, ...rest } = program
    setDeletedPrograms(prev => prev.filter(p => p.id !== program.id))
    setPrograms(prev => [rest, ...prev])
  }

  const getRemainingDays = (deletedAt: string) => {
    const diff = differenceInDays(new Date(), parseISO(deletedAt))
    return Math.max(0, 30 - diff)
  }

  const columns: ColumnDef<TrainingProgram, any>[] = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Program Title',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="font-semibold text-surface-900">{row.original.title}</div>
            <div className="text-xs text-surface-500">Instructor: {row.original.instructor}</div>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'employeesEnrolled',
      header: 'Enrolled',
      cell: ({ row }) => <span className="font-medium">{row.original.employeesEnrolled} Employees</span>
    },
    {
      accessorKey: 'completionRate',
      header: 'Completion',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 rounded-full bg-surface-100 overflow-hidden">
                <div 
                    className="h-full bg-emerald-500" 
                    style={{ width: row.original.completionRate }} 
                />
            </div>
            <span className="text-xs font-semibold text-surface-900">{row.original.completionRate}</span>
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
          row.original.status === 'Published' ? "bg-emerald-50 text-emerald-700" :
          row.original.status === 'Draft' ? "bg-surface-100 text-surface-600" : "bg-red-50 text-red-700"
        )}>
          {row.original.status}
        </span>
      )
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
            <button 
                onClick={() => handleDelete(row.original)}
                className="h-8 w-8 rounded-lg text-surface-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors"
                title="Move to Trash"
            >
                <Trash2 className="h-4 w-4" />
            </button>
            <button className="h-8 w-8 rounded-lg text-surface-400 hover:bg-surface-50 flex items-center justify-center">
                <ExternalLink className="h-4 w-4" />
            </button>
        </div>
      )
    }
  ], [programs])

  const deletedColumns: ColumnDef<DeletedTrainingProgram, any>[] = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Program Title',
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-surface-900">{row.original.title}</div>
          <div className="text-xs text-surface-500">{row.original.instructor}</div>
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
  ], [deletedPrograms])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Training & Development</h1>
          <div className="mt-2">
            <Breadcrumb items={[{ label: 'People Ops' }, { label: 'Programs' }]} />
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
                    Active
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
            <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Program
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
                data={programs}
                columns={columns}
                searchPlaceholder="Search programs..."
            />
        ) : (
            <>
                <div className="flex items-center gap-2 px-1">
                    <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                    <p className="text-sm text-surface-500 italic">
                        Programs in trash are automatically deleted after 30 days.
                    </p>
                </div>
                <DataTable
                    data={deletedPrograms}
                    columns={deletedColumns}
                    searchPlaceholder="Search deleted programs..."
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
