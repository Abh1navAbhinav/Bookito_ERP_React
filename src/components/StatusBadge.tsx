import { cn } from '@/lib/utils'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'outline'

interface StatusBadgeProps {
  label: string
  variant?: BadgeVariant
  dot?: boolean
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-100 text-surface-700',
  success: 'bg-accent-50 text-accent-700 ring-1 ring-accent-200',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  danger: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  info: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  purple: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  outline: 'bg-transparent text-surface-600 ring-1 ring-surface-300',
}

const dotStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-400',
  success: 'bg-accent-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  purple: 'bg-purple-500',
  outline: 'bg-surface-400',
}

export function StatusBadge({ label, variant = 'default', dot = false, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotStyles[variant])} />}
      {label}
    </span>
  )
}

// Convenience mapping for common statuses
export function getStatusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    'Closed': 'success',
    'Payment Done': 'success',
    'Interested': 'info',
    'Connected': 'info',
    'Installation Pending': 'warning',
    'Requested Demo': 'purple',
    'Not Interested': 'danger',
    'Rescheduled': 'warning',
    'Platinum': 'purple',
    'Gold': 'warning',
    'Silver': 'default',
    'Bronze': 'outline',
  }
  return map[status] || 'default'
}
