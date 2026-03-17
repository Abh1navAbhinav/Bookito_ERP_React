import { useState, useMemo, useEffect } from 'react'
import { Plus, Search, MapPin, Briefcase, Users, Clock, Globe, ArrowUpRight, MoreVertical, X, Trash2, RotateCcw } from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button, FormField, Input, Select, Modal } from '@/components/FormElements'
import { DataTable } from '@/components/DataTable'
import { type ColumnDef } from '@tanstack/react-table'
import { differenceInDays, parseISO } from 'date-fns'

interface JobPosting {
  id: string
  title: string
  department: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract'
  applicants: number
  postedDate: string
  status: 'Published' | 'Draft' | 'Closed'
}

interface DeletedJobPosting extends JobPosting {
  deletedAt: string
}

const initialJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Sales Executive',
    department: 'Sales',
    location: 'Remote / Dubai',
    type: 'Full-time',
    applicants: 45,
    postedDate: '2026-03-01',
    status: 'Published'
  },
  {
    id: '2',
    title: 'React Developer',
    department: 'Engineering',
    location: 'Bangalore Office',
    type: 'Full-time',
    applicants: 128,
    postedDate: '2026-03-05',
    status: 'Published'
  }
]

export default function JobPostingsPage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Published' | 'Draft' | 'Closed' | 'Trash'>('All')
  const [jobs, setJobs] = useState<JobPosting[]>(() => {
    const saved = localStorage.getItem('bookito_jobs')
    return saved ? JSON.parse(saved) : initialJobs
  })
  
  const [deletedJobs, setDeletedJobs] = useState<DeletedJobPosting[]>(() => {
    const saved = localStorage.getItem('bookito_deleted_jobs')
    return saved ? JSON.parse(saved) : []
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newJob, setNewJob] = useState<Omit<JobPosting, 'id' | 'applicants' | 'postedDate'>>({
    title: '',
    department: 'Sales',
    location: '',
    type: 'Full-time',
    status: 'Published'
  })

  useEffect(() => {
    localStorage.setItem('bookito_jobs', JSON.stringify(jobs))
  }, [jobs])

  useEffect(() => {
    localStorage.setItem('bookito_deleted_jobs', JSON.stringify(deletedJobs))
  }, [deletedJobs])

  useEffect(() => {
    // Purge logic: Auto-delete after 30 days
    const now = new Date()
    setDeletedJobs(prev => prev.filter(j => differenceInDays(now, parseISO(j.deletedAt)) < 30))
  }, [])

  const handleCreate = () => {
    const created: JobPosting = {
        ...newJob,
        id: Date.now().toString(),
        applicants: 0,
        postedDate: new Date().toISOString().split('T')[0]
    }
    setJobs([created, ...jobs])
    setIsModalOpen(false)
  }

  const handleDelete = (job: JobPosting) => {
    const deletedAt = new Date().toISOString()
    const entry: DeletedJobPosting = { ...job, deletedAt }
    
    setJobs(prev => prev.filter(j => j.id !== job.id))
    setDeletedJobs(prev => [entry, ...prev])
  }

  const handleRestore = (job: DeletedJobPosting) => {
    const { deletedAt, ...rest } = job
    setDeletedJobs(prev => prev.filter(j => j.id !== job.id))
    setJobs(prev => [rest, ...prev])
  }

  const getRemainingDays = (deletedAt: string) => {
    const diff = differenceInDays(new Date(), parseISO(deletedAt))
    return Math.max(0, 30 - diff)
  }

  const stats = useMemo(() => [
    { label: 'Active Jobs', value: jobs.filter(j => j.status === 'Published').length.toString(), icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Applicants', value: jobs.reduce((sum, j) => sum + j.applicants, 0).toString(), icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Interviews Today', value: '5', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Career Page Visits', value: '2.4K', icon: Globe, color: 'text-amber-600', bg: 'bg-amber-50' },
  ], [jobs])

  const columns: ColumnDef<JobPosting, any>[] = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Job Title',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div>
            <div className="font-semibold text-surface-900">{row.original.title}</div>
            <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-surface-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {row.original.location}
                </span>
                <span className="text-xs text-surface-300">•</span>
                <span className="text-xs text-surface-500">{row.original.type}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => <span className="text-sm text-surface-600">{row.original.department}</span>
    },
    {
      accessorKey: 'applicants',
      header: 'Applicants',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
            <span className="font-semibold text-surface-900">{row.original.applicants}</span>
            <span className="text-xs text-surface-400 font-normal">applied</span>
        </div>
      )
    },
    {
      accessorKey: 'postedDate',
      header: 'Posted On',
      cell: ({ row }) => <span className="text-sm text-surface-500">{row.original.postedDate}</span>
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
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => handleDelete(row.original)}
            className="h-8 w-8 rounded-lg text-surface-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm border border-transparent hover:border-red-100"
            title="Move to Trash"
          >
             <Trash2 className="h-4 w-4" />
          </button>
          <button className="h-8 w-8 rounded-lg text-surface-400 hover:bg-surface-50 flex items-center justify-center">
             <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ], [jobs])

  const deletedColumns: ColumnDef<DeletedJobPosting, any>[] = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Job Title',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div>
            <div className="font-semibold text-surface-900">{row.original.title}</div>
            <div className="text-xs text-surface-500">{row.original.department}</div>
          </div>
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
  ], [deletedJobs])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Recruitment</h1>
          <div className="mt-2">
            <Breadcrumb items={[{ label: 'People Ops' }, { label: 'Job Postings' }]} />
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Job Posting
        </Button>
      </div>

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

      <div className="space-y-4">
        <div className="flex border-b border-surface-200 bg-white px-2 overflow-x-auto">
            {(['All', 'Published', 'Draft', 'Closed', 'Trash'] as const).map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                        "px-4 py-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap",
                        activeTab === tab 
                            ? (tab === 'Trash' ? "border-red-600 text-red-600" : "border-primary-600 text-primary-600")
                            : "border-transparent text-surface-500 hover:text-surface-700"
                    )}
                >
                    {tab === 'Trash' && <Trash2 className="h-3.5 w-3.5" />}
                    {tab}
                </button>
            ))}
        </div>
        <div>
            {activeTab !== 'Trash' ? (
                <DataTable
                    data={activeTab === 'All' ? jobs : jobs.filter(j => j.status === activeTab)}
                    columns={columns}
                    searchPlaceholder="Search jobs..."
                />
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                        <p className="text-sm text-surface-500 italic">
                            Jobs in trash are automatically deleted after 30 days.
                        </p>
                    </div>
                    <DataTable
                        data={deletedJobs}
                        columns={deletedColumns}
                        searchPlaceholder="Search deleted jobs..."
                    />
                </div>
            )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Job Posting">
        <div className="space-y-4">
            <FormField label="Job Title">
                <Input 
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                    placeholder="e.g. Sales Executive"
                />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
                <FormField label="Department">
                    <Select 
                        value={newJob.department}
                        onChange={(val) => setNewJob({...newJob, department: val})}
                        options={[
                            { label: 'Sales', value: 'Sales' },
                            { label: 'Engineering', value: 'Engineering' },
                            { label: 'HR', value: 'HR' },
                        ]}
                    />
                </FormField>
                <FormField label="Job Type">
                    <Select 
                        value={newJob.type}
                        onChange={(val) => setNewJob({...newJob, type: val as any})}
                        options={[
                            { label: 'Full-time', value: 'Full-time' },
                            { label: 'Part-time', value: 'Part-time' },
                            { label: 'Contract', value: 'Contract' },
                        ]}
                    />
                </FormField>
            </div>
            <FormField label="Location">
                <Input 
                    value={newJob.location}
                    onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                    placeholder="e.g. Remote or Dubai"
                />
            </FormField>
            <div className="flex justify-end gap-3 pt-6">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Publish Job</Button>
            </div>
        </div>
      </Modal>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
