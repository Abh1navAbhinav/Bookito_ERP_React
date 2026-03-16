import { useState } from 'react'
import { Folder, MapPin, Search } from 'lucide-react'
import type { LocationNode } from '@/data/mockData'
import { properties } from '@/data/mockData'
import { cn } from '@/lib/utils'

interface FolderNavigatorProps {
  hierarchy: LocationNode[]
  path: string[]
  onNavigate: (path: string[], node?: LocationNode) => void
}

type SortMode = 'name' | 'items' | 'properties'

const statePropertyCounts: Record<string, number> = {}
const districtPropertyCounts: Record<string, Record<string, number>> = {}

for (const p of properties) {
  statePropertyCounts[p.state] = (statePropertyCounts[p.state] ?? 0) + 1
  if (!districtPropertyCounts[p.state]) {
    districtPropertyCounts[p.state] = {}
  }
  districtPropertyCounts[p.state][p.district] =
    (districtPropertyCounts[p.state][p.district] ?? 0) + 1
}

export function FolderNavigator({ hierarchy, path, onNavigate }: FolderNavigatorProps) {
  const [query, setQuery] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('properties')

  // Find the current level based on path
  let currentNodes = hierarchy
  let parentStateName: string | undefined

  for (const segment of path) {
    const found = currentNodes.find((n) => n.id === segment)
    if (found?.children) {
      currentNodes = found.children
      if (!parentStateName) {
        parentStateName = found.name
      }
    } else {
      currentNodes = []
      break
    }
  }

  if (currentNodes.length === 0) return null

  const level: 'state' | 'district' | 'other' =
    path.length === 0 ? 'state' : path.length === 1 ? 'district' : 'other'

  const effectiveSortMode: SortMode =
    level === 'state' ? sortMode : sortMode === 'items' ? 'name' : sortMode

  const visibleNodes = currentNodes.filter((node) =>
    node.name.toLowerCase().includes(query.toLowerCase())
  )

  const nodesWithMeta = visibleNodes.map((node) => {
    const itemsCount = node.children?.length ?? 0
    let propertyCount = 0

    if (level === 'state') {
      propertyCount = statePropertyCounts[node.name] ?? 0
    } else if (level === 'district' && parentStateName) {
      propertyCount = districtPropertyCounts[parentStateName]?.[node.name] ?? 0
    }

    return { node, itemsCount, propertyCount }
  })

  const sortedNodes = [...nodesWithMeta].sort((a, b) => {
    if (effectiveSortMode === 'items') {
      if (b.itemsCount !== a.itemsCount) return b.itemsCount - a.itemsCount
    } else if (effectiveSortMode === 'properties') {
      if (b.propertyCount !== a.propertyCount) return b.propertyCount - a.propertyCount
    }

    return a.node.name.localeCompare(b.node.name)
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search folders..."
            className="w-full rounded-lg border border-surface-300 py-2 pl-9 pr-4 text-sm text-surface-900 transition-colors placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-surface-500">Sort by</span>
          <select
            value={effectiveSortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="rounded-lg border border-surface-300 bg-white px-3 py-1.5 text-xs text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="name">Name (A–Z)</option>
            {level === 'state' && <option value="items">Number of districts</option>}
            <option value="properties">Number of properties</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {sortedNodes.map(({ node, itemsCount, propertyCount }) => {
          const hasChildren = node.children && node.children.length > 0
          return (
            <button
              key={node.id}
              onClick={() => {
                onNavigate([...path, node.id], node)
              }}
              className={cn(
                'group flex flex-col items-center gap-2 rounded-xl border border-surface-200 bg-white p-4 text-center transition-all duration-200',
                'hover:border-primary-300 hover:bg-primary-50 hover:shadow-md',
                'active:scale-[0.98]'
              )}
            >
              <div className="rounded-lg bg-primary-50 p-3 text-primary-600 transition-colors group-hover:bg-primary-100">
                <Folder className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-surface-800">{node.name}</p>
                <p className="mt-0.5 text-xs text-surface-400">
                  {level === 'state' && hasChildren && (
                    <>
                      {itemsCount}{' '}
                      {itemsCount === 1 ? 'district' : 'districts'}
                      {propertyCount > 0 && ' · '}
                    </>
                  )}
                  {propertyCount > 0
                    ? `${propertyCount} ${propertyCount === 1 ? 'property' : 'properties'}`
                    : level === 'district'
                      ? '0 properties'
                      : !hasChildren
                        ? ''
                        : null}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
