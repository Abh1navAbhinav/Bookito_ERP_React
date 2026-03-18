import { useState, useMemo, useEffect } from 'react'
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, MapPin, Building2, UserCircle, X, Check, Trash2, RotateCcw } from 'lucide-react'
import { Button, FormField, Input, Select, Modal } from '@/components/FormElements'
import { DataTable } from '@/components/DataTable'
import { type ColumnDef } from '@tanstack/react-table'
import { differenceInDays, parseISO } from 'date-fns'

interface Employee {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  department: string
  designation: string
  dateOfJoining: string
  status: 'Active' | 'Inactive'
  salary: string
}

interface DeletedEmployee extends Employee {
  deletedAt: string
}

const initialEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'John Doe',
    email: 'john.doe@bookito.com',
    phone: '+91 9876543210',
    department: 'Sales',
    designation: 'Sales Manager',
    dateOfJoining: '2024-01-15',
    status: 'Active',
    salary: '75000'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Jane Smith',
    email: 'jane.smith@bookito.com',
    phone: '+91 9876543211',
    department: 'Engineering',
    designation: 'Frontend Developer',
    dateOfJoining: '2024-02-10',
    status: 'Active',
    salary: '85000'
  }
]

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('bookito_employees')
    return saved ? JSON.parse(saved) : initialEmployees
  })
  
  const [deletedEmployees, setDeletedEmployees] = useState<DeletedEmployee[]>(() => {
    const saved = localStorage.getItem('bookito_deleted_employees')
    return saved ? JSON.parse(saved) : []
  })

  const [showDeleted, setShowDeleted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id' | 'employeeId'>>({
    name: '',
    email: '',
    phone: '',
    department: 'Sales',
    designation: '',
    dateOfJoining: new Date().toISOString().split('T')[0],
    status: 'Active',
    salary: ''
  })

  useEffect(() => {
    localStorage.setItem('bookito_employees', JSON.stringify(employees))
  }, [employees])

  useEffect(() => {
    localStorage.setItem('bookito_deleted_employees', JSON.stringify(deletedEmployees))
  }, [deletedEmployees])

  useEffect(() => {
    // Purge logic for local state: Auto-delete after 30 days
    const now = new Date()
    setDeletedEmployees(prev => prev.filter(emp => differenceInDays(now, parseISO(emp.deletedAt)) < 30))
  }, [])

  const handleCreate = () => {
    const id = Date.now().toString()
    const employeeId = `EMP${(employees.length + 1).toString().padStart(3, '0')}`
    const created: Employee = {
        ...newEmployee,
        id,
        employeeId
    }
    setEmployees([...employees, created])
    setIsModalOpen(false)
    setNewEmployee({
        name: '',
        email: '',
        phone: '',
        department: 'Sales',
        designation: '',
        dateOfJoining: new Date().toISOString().split('T')[0],
        status: 'Active',
        salary: ''
    })
  }

  const handleDelete = (employee: Employee) => {
    const deletedAt = new Date().toISOString()
    const entry: DeletedEmployee = { ...employee, deletedAt }
    
    setEmployees(prev => prev.filter(e => e.id !== employee.id))
    setDeletedEmployees(prev => [entry, ...prev])
  }

  const handleRestore = (employee: DeletedEmployee) => {
    const { deletedAt, ...rest } = employee
    setDeletedEmployees(prev => prev.filter(e => e.id !== employee.id))
    setEmployees(prev => [...prev, rest])
  }

  const getRemainingDays = (deletedAt: string) => {
    const diff = differenceInDays(new Date(), parseISO(deletedAt))
    return Math.max(0, 30 - diff)
  }

  const columns: ColumnDef<Employee, any>[] = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-surface-100 flex items-center justify-center">
             <UserCircle className="h-6 w-6 text-surface-400" />
          </div>
          <div>
            <div className="font-semibold text-surface-900">{row.original.name}</div>
            <div className="text-xs text-surface-500">{row.original.employeeId}</div>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'department',
      header: 'Dept & Role',
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium text-surface-700">{row.original.department}</div>
          <div className="text-xs text-surface-400">{row.original.designation}</div>
        </div>
      )
    },
    {
      accessorKey: 'email',
      header: 'Contact',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-surface-500">
            <Mail className="h-3 w-3" />
            {row.original.email}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-surface-500">
            <Phone className="h-3 w-3" />
            {row.original.phone}
          </div>
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
          row.original.status === 'Active' ? "bg-emerald-50 text-emerald-700" : "bg-surface-100 text-surface-600"
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
                className="rounded-md p-1.5 text-surface-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Delete"
            >
                <Trash2 className="h-4 w-4" />
            </button>
            <button className="rounded-md p-1.5 text-surface-400 hover:bg-surface-50 hover:text-surface-600 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
            </button>
        </div>
      )
    }
  ], [employees, deletedEmployees])

  const deletedColumns: ColumnDef<DeletedEmployee, any>[] = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-surface-100 flex items-center justify-center">
             <UserCircle className="h-6 w-6 text-surface-400" />
          </div>
          <div>
            <div className="font-semibold text-surface-900">{row.original.name}</div>
            <div className="text-xs text-surface-500">{row.original.employeeId}</div>
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
  ], [deletedEmployees, employees])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">Employees</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-surface-200 p-0.5 bg-surface-100/50 shadow-inner">
            <button
              onClick={() => setShowDeleted(false)}
              className={cn(
                "rounded-md px-4 py-1.5 text-xs font-medium transition-all duration-200",
                !showDeleted
                  ? "bg-white text-primary-600 shadow-sm border border-surface-200"
                  : "text-surface-500 hover:text-surface-700"
              )}
            >
              Active
            </button>
            <button
              onClick={() => setShowDeleted(true)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-medium transition-all duration-200",
                showDeleted
                  ? "bg-white text-red-600 shadow-sm border border-red-200"
                  : "text-surface-500 hover:text-surface-700"
              )}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Trash
            </button>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {!showDeleted ? (
        <DataTable
          data={employees}
          columns={columns}
          searchPlaceholder="Search by name, ID, or email..."
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
            <p className="text-sm text-surface-500 italic">
              Items in trash are automatically deleted after 30 days.
            </p>
          </div>
          <DataTable
            data={deletedEmployees}
            columns={deletedColumns}
            searchPlaceholder="Search deleted employees..."
          />
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Employee"
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Full Name">
                <Input 
                    value={newEmployee.name} 
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                    placeholder="e.g. Robert Fox"
                />
            </FormField>
            <FormField label="Email Address">
                <Input 
                    type="email"
                    value={newEmployee.email} 
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    placeholder="robert@company.com"
                />
            </FormField>
            <FormField label="Phone Number">
                <Input 
                    value={newEmployee.phone} 
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                    placeholder="+91 00000 00000"
                />
            </FormField>
            <FormField label="Department">
                <Select 
                    value={newEmployee.department}
                    onChange={(val) => setNewEmployee({...newEmployee, department: val})}
                    options={[
                        { label: 'Sales', value: 'Sales' },
                        { label: 'Engineering', value: 'Engineering' },
                        { label: 'HR', value: 'HR' },
                        { label: 'Finance', value: 'Finance' },
                        { label: 'Marketing', value: 'Marketing' },
                    ]}
                />
            </FormField>
            <FormField label="Designation">
                <Input 
                    value={newEmployee.designation} 
                    onChange={(e) => setNewEmployee({...newEmployee, designation: e.target.value})}
                    placeholder="e.g. UI Designer"
                />
            </FormField>
            <FormField label="Date of Joining">
                <Input 
                    type="date"
                    value={newEmployee.dateOfJoining} 
                    onChange={(e) => setNewEmployee({...newEmployee, dateOfJoining: e.target.value})}
                />
            </FormField>
            <FormField label="Basic Salary">
                <Input 
                    type="number"
                    value={newEmployee.salary} 
                    onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                    placeholder="0.00"
                />
            </FormField>
            <FormField label="Status">
                <Select 
                    value={newEmployee.status}
                    onChange={(val) => setNewEmployee({...newEmployee, status: val as 'Active' | 'Inactive'})}
                    options={[
                        { label: 'Active', value: 'Active' },
                        { label: 'Inactive', value: 'Inactive' },
                    ]}
                />
            </FormField>
        </div>
        <div className="mt-8 flex justify-end gap-3 border-t border-surface-100 pt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newEmployee.name || !newEmployee.email}>Create Employee</Button>
        </div>
      </Modal>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
