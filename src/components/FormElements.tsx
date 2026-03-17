import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { X, Search, ChevronDown, Check } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Content */}
      <div
        className={cn(
          'relative z-10 w-full rounded-xl border border-surface-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200',
          sizeMap[size]
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-surface-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Body */}
        <div className="max-h-[85vh] overflow-y-auto px-6 py-4">{children}</div>
      </div>
    </div>
  )
}

// Form field helper
interface FormFieldProps {
  label: string
  children: React.ReactNode
  className?: string
}

export function FormField({ label, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-sm font-medium text-surface-700">{label}</label>
      {children}
    </div>
  )
}

// Reusable input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 transition-colors placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
        className
      )}
      {...props}
    />
  )
}

// Reusable select
interface SelectOption {
  label: string
  value: string
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function Select({ options, value, onChange, placeholder, className, disabled }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className={cn(
        'w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-surface-50 disabled:text-surface-500 disabled:cursor-not-allowed',
        className
      )}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

// Searchable Select
export function SearchableSelect({ options, value, onChange, placeholder, className, disabled }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.value === value)
  
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'flex min-h-[38px] cursor-pointer items-center justify-between rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
          disabled && 'cursor-not-allowed bg-surface-50 text-surface-500 opacity-60',
          isOpen && 'border-primary-500 ring-2 ring-primary-500/20'
        )}
      >
        <span className={cn(!selectedOption && 'text-surface-400 truncate mr-2')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-surface-400 transition-transform', isOpen && 'rotate-180')} />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 z-[60] mt-1 overflow-hidden rounded-lg border border-surface-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="border-b border-surface-100 p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-surface-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                className="w-full bg-surface-50 pl-9 pr-3 py-1.5 text-sm outline-none rounded-md focus:bg-white focus:ring-1 focus:ring-primary-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-[240px] overflow-y-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange?.(opt.value)
                    setIsOpen(false)
                    setSearchTerm('')
                  }}
                  className={cn(
                    'flex items-center justify-between rounded-md px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-surface-50',
                    value === opt.value && 'bg-primary-50 text-primary-700 font-medium'
                  )}
                >
                  <span className="truncate mr-2">{opt.label}</span>
                  {value === opt.value && <Check className="h-4 w-4 shrink-0" />}
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-sm text-surface-400">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const buttonVariants = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 shadow-sm active:bg-primary-800',
  secondary:
    'bg-white text-surface-700 border border-surface-300 hover:bg-surface-50 shadow-sm',
  ghost: 'text-surface-600 hover:bg-surface-100 hover:text-surface-900',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// Textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full rounded-lg border border-surface-300 px-3 py-2 text-sm text-surface-900 transition-colors placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
        className
      )}
      {...props}
    />
  )
}
