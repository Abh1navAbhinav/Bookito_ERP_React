import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: { value: number; isPositive: boolean }
  variant?: 'default' | 'primary' | 'accent' | 'warning' | 'danger' | 'success'
  className?: string
}

const variantStyles = {
  default: 'bg-white border-surface-200',
  primary: 'bg-gradient-to-br from-primary-500 to-primary-700 text-white border-primary-600',
  accent: 'bg-gradient-to-br from-accent-500 to-accent-700 text-white border-accent-600',
  warning: 'bg-gradient-to-br from-amber-500 to-amber-700 text-white border-amber-600',
  danger: 'bg-gradient-to-br from-red-500 to-red-700 text-white border-red-600',
  success: 'bg-gradient-to-br from-accent-500 to-accent-700 text-white border-accent-600',
}

const iconBgStyles = {
  default: 'bg-primary-50 text-primary-600',
  primary: 'bg-white/20 text-white',
  accent: 'bg-white/20 text-white',
  warning: 'bg-white/20 text-white',
  danger: 'bg-white/20 text-white',
  success: 'bg-white/20 text-white',
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className={cn(
              'text-sm font-medium',
              variant === 'default' ? 'text-surface-500' : 'text-white/80'
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              'mt-1.5 text-2xl font-bold tracking-tight',
              variant === 'default' ? 'text-surface-900' : 'text-white'
            )}
          >
            {value}
          </p>
          {subtitle && (
            <p
              className={cn(
                'mt-1 text-xs',
                variant === 'default' ? 'text-surface-400' : 'text-white/60'
              )}
            >
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  'text-xs font-semibold',
                  variant === 'default'
                    ? trend.isPositive
                      ? 'text-accent-600'
                      : 'text-red-500'
                    : 'text-white/90'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span
                className={cn(
                  'text-xs',
                  variant === 'default' ? 'text-surface-400' : 'text-white/60'
                )}
              >
                vs last month
              </span>
            </div>
          )}
        </div>
        <div className={cn('rounded-lg p-2.5', iconBgStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {/* Decorative element */}
      {variant !== 'default' && (
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
      )}
    </div>
  )
}
