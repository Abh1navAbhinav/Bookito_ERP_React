import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center gap-1 text-sm', className)}>
      <Link
        to="/"
        className="flex items-center text-surface-400 transition-colors hover:text-primary-600"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5 text-surface-300" />
          {item.href ? (
            <Link
              to={item.href}
              className="text-surface-500 transition-colors hover:text-primary-600"
            >
              {item.label}
            </Link>
          ) : item.onClick ? (
            <button
              onClick={item.onClick}
              className="text-surface-500 transition-colors hover:text-primary-600"
            >
              {item.label}
            </button>
          ) : (
            <span className="font-medium text-surface-900">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
