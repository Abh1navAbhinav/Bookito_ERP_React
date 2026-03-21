import { useState, useRef, useEffect, type ReactNode } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronsUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Settings2,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T, any>[]
  searchPlaceholder?: string
  searchColumn?: string
  pageSize?: number
  onRowClick?: (data: T) => void
  /** Rendered after the search field on the same row (e.g. Active / Trash toggles) */
  toolbarActions?: ReactNode
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  searchColumn,
  pageSize = 10,
  onRowClick,
  toolbarActions,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [isColumnPickerOpen, setIsColumnPickerOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsColumnPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnVisibility },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: { pageSize },
    },
  })

  return (
    <div className="space-y-3">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative max-w-sm min-w-[12rem] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-surface-300 py-2 pl-9 pr-4 text-sm text-surface-900 transition-colors placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          {toolbarActions != null && (
            <div className="flex shrink-0 items-center">{toolbarActions}</div>
          )}
        </div>

        {/* Column Toggle */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setIsColumnPickerOpen(!isColumnPickerOpen)}
            className={cn(
              "flex items-center gap-2 rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm font-medium text-surface-700 transition-all hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
              isColumnPickerOpen && "border-primary-500 ring-2 ring-primary-500/20"
            )}
          >
            <Settings2 className="h-4 w-4 text-surface-500" />
            <span>Columns</span>
          </button>

          {isColumnPickerOpen && (
            <div className="absolute right-0 z-[60] mt-2 w-56 overflow-hidden rounded-xl border border-surface-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="border-b border-surface-100 bg-surface-50/50 px-4 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Toggle Columns
                </p>
              </div>
              <div className="max-h-[300px] overflow-y-auto p-1.5">
                {table
                  .getAllLeafColumns()
                  .filter((column) => typeof column.columnDef.header === 'string')
                  .map((column) => {
                    return (
                      <div
                        key={column.id}
                        onClick={() => column.toggleVisibility(!column.getIsVisible())}
                        className={cn(
                          "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-surface-50",
                          column.getIsVisible() ? "text-surface-900 font-medium" : "text-surface-400"
                        )}
                      >
                        <span className="truncate pr-2">
                          {column.columnDef.header as string}
                        </span>
                        {column.getIsVisible() && (
                          <Check className="h-4 w-4 shrink-0 text-primary-600" />
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-surface-200 bg-white">
        <div className="relative overflow-x-auto">
          <table className="min-w-full divide-y divide-surface-200">
            <thead className="bg-surface-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={cn(
                        'whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-surface-500',
                        header.column.getCanSort() && 'cursor-pointer select-none hover:text-surface-700',
                        header.column.id === 'actions' &&
                          'sticky right-0 z-20 bg-surface-50 shadow-[inset_1px_0_0_rgba(226,232,240,1),-4px_0_8px_rgba(15,23,42,0.06)]'
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="ml-0.5">
                            {header.column.getIsSorted() === 'asc' ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <ChevronDown className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronsUpDown className="h-3.5 w-3.5 text-surface-300" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-surface-100">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-sm text-surface-400"
                  >
                    No results found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    className={cn(
                      'transition-colors hover:bg-surface-50',
                      onRowClick && 'cursor-pointer active:bg-surface-100'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={cn(
                          'whitespace-nowrap px-6 py-4 text-sm text-surface-700',
                          cell.column.id === 'actions' &&
                            'sticky right-0 z-10 bg-white shadow-[inset_1px_0_0_rgba(226,232,240,1),-4px_0_8px_rgba(15,23,42,0.04)]'
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-surface-200 bg-surface-50/50 px-6 py-4">
          <p className="text-xs text-surface-500">
            Showing{' '}
            <span className="font-medium">
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}
            </span>{' '}
            of <span className="font-medium">{table.getFilteredRowModel().rows.length}</span> results
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-lg p-1.5 text-surface-500 transition-colors hover:bg-surface-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: table.getPageCount() }, (_, i) => i).slice(
              Math.max(0, table.getState().pagination.pageIndex - 2),
              Math.min(table.getPageCount(), table.getState().pagination.pageIndex + 3)
            ).map((page) => (
              <button
                key={page}
                onClick={() => table.setPageIndex(page)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  table.getState().pagination.pageIndex === page
                    ? 'bg-primary-600 text-white'
                    : 'text-surface-600 hover:bg-surface-200'
                )}
              >
                {page + 1}
              </button>
            ))}
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-lg p-1.5 text-surface-500 transition-colors hover:bg-surface-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
