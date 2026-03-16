import { useState } from 'react'
import { Folder, ChevronRight, MapPin } from 'lucide-react'
import type { LocationNode } from '@/data/mockData'
import { cn } from '@/lib/utils'

interface FolderNavigatorProps {
  hierarchy: LocationNode[]
  path: string[]
  onNavigate: (path: string[], node?: LocationNode) => void
}

export function FolderNavigator({ hierarchy, path, onNavigate }: FolderNavigatorProps) {
  // Find the current level based on path
  let currentNodes = hierarchy
  for (const segment of path) {
    const found = currentNodes.find((n) => n.id === segment)
    if (found?.children) {
      currentNodes = found.children
    } else {
      currentNodes = []
      break
    }
  }

  if (currentNodes.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {currentNodes.map((node) => {
        const hasChildren = node.children && node.children.length > 0
        return (
          <button
            key={node.id}
            onClick={() => {
              if (hasChildren) {
                onNavigate([...path, node.id], node)
              } else {
                onNavigate([...path, node.id], node)
              }
            }}
            className={cn(
              'group flex flex-col items-center gap-2 rounded-xl border border-surface-200 bg-white p-4 text-center transition-all duration-200',
              'hover:border-primary-300 hover:bg-primary-50 hover:shadow-md',
              'active:scale-[0.98]'
            )}
          >
            <div className="rounded-lg bg-primary-50 p-3 text-primary-600 transition-colors group-hover:bg-primary-100">
              {hasChildren ? (
                <Folder className="h-6 w-6" />
              ) : (
                <MapPin className="h-6 w-6" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-surface-800">{node.name}</p>
              {hasChildren && (
                <p className="mt-0.5 text-xs text-surface-400">
                  {node.children!.length} {node.children!.length === 1 ? 'item' : 'items'}
                </p>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
