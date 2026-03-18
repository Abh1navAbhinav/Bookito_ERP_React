import { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  ExternalLink,
  Clock,
  MessageCircle,
  Building2,
  Phone,
  Mail,
  User,
  CalendarDays,
  IndianRupee,
  Wifi,
  Monitor,
  Bed,
  Star,
  ChevronRight,
  Globe,
  Send,
  CheckCircle2,
  Circle,
  Tag,
  FileText,
  Shield,
  UserCheck,
  Hash,
} from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button, Input, Textarea, Select } from '@/components/FormElements'
import { StatusBadge } from '@/components/StatusBadge'
import type { BadgeVariant } from '@/components/StatusBadge'
import {
  locationHierarchy,
  properties,
  salesRecords,
  type Property,
  type SalesRecord,
  type VisitRecord,
} from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'

/* ─── Helper: Section card wrapper ─── */
function SectionCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-surface-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md ${className}`}
    >
      {children}
    </div>
  )
}

/* ─── Helper: Inline info item with icon ─── */
function InfoItem({
  icon: Icon,
  label,
  value,
  mono = false,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  mono?: boolean
  href?: string
}) {
  const content = (
    <div className="flex items-start gap-3 py-2.5">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-surface-400">
          {label}
        </p>
        <p
          className={`mt-0.5 text-sm font-semibold text-surface-800 ${mono ? 'font-mono' : ''} ${href ? 'text-primary-600 hover:underline' : ''}`}
        >
          {value || '—'}
        </p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }
  return content
}

/* ─── Lifecycle stepper ─── */
function LifecycleStepper({
  current,
}: {
  current: 'Prospect' | 'Demo' | 'Trial' | 'Live'
}) {
  const steps = ['Prospect', 'Demo', 'Trial', 'Live'] as const
  const currentIndex = steps.indexOf(current)

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, idx) => {
        const isPast = idx < currentIndex
        const isCurrent = idx === currentIndex

        return (
          <div key={step} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                  isCurrent
                    ? 'bg-primary-600 text-white ring-4 ring-primary-100 scale-110'
                    : isPast
                      ? 'bg-accent-500 text-white'
                      : 'bg-surface-100 text-surface-400'
                }`}
              >
                {isPast ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wide ${
                  isCurrent
                    ? 'text-primary-700'
                    : isPast
                      ? 'text-accent-600'
                      : 'text-surface-400'
                }`}
              >
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`mb-4 h-0.5 w-6 rounded-full transition-all duration-300 ${
                  isPast ? 'bg-accent-400' : 'bg-surface-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Quick stat pill ─── */
function QuickStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-4 py-3 transition-all duration-200 hover:border-primary-200 hover:shadow-md hover:scale-[1.02] cursor-default"
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-100 text-surface-500"
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-surface-400">
          {label}
        </p>
        <p className="text-base font-bold text-surface-800">{value}</p>
      </div>
    </div>
  )
}

/* ─── Visit tile ─── */
function getVisitTileClasses(status: string) {
  if (status === 'Closed')
    return 'border-l-emerald-500 bg-gradient-to-r from-emerald-50/80 to-white'
  if (status === 'Interested')
    return 'border-l-blue-500 bg-gradient-to-r from-blue-50/80 to-white'
  if (status === 'Requested Demo')
    return 'border-l-purple-500 bg-gradient-to-r from-purple-50/80 to-white'
  if (status === 'Not Interested')
    return 'border-l-red-500 bg-gradient-to-r from-red-50/80 to-white'
  if (status === 'Rescheduled' || status === 'Installation Pending')
    return 'border-l-amber-500 bg-gradient-to-r from-amber-50/80 to-white'
  return 'border-l-surface-300 bg-surface-50'
}

function getVisitStatusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    Closed: 'success',
    Interested: 'info',
    'Requested Demo': 'purple',
    'Not Interested': 'danger',
    Rescheduled: 'warning',
    'Installation Pending': 'warning',
  }
  return map[status] || 'default'
}

/* ─── Tabs ─── */
type TabKey = 'overview' | 'commercials' | 'visits'
const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'overview', label: 'Overview', icon: Building2 },
  { key: 'commercials', label: 'Commercials', icon: IndianRupee },
  { key: 'visits', label: 'Visits & History', icon: CalendarDays },
]

type DemoRole = 'manager' | 'sales' | 'accountant' | 'crm'

/* ═════════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                         */
/* ═════════════════════════════════════════════════════════════════════════ */
export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const navigationState = location.state as
    | {
        path?: string[]
        pathLabels?: string[]
      }
    | null

  const property: Property | undefined = useMemo(
    () => properties.find((p) => p.id === id),
    [id]
  )

  const salesRecord: SalesRecord | undefined = useMemo(
    () => (property ? salesRecords.find((s) => s.propertyName === property.name) : undefined),
    [property]
  )

  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [visitHistory, setVisitHistory] = useState<VisitRecord[]>(
    salesRecord?.visitHistory ?? []
  )
  const [newVisit, setNewVisit] = useState<VisitRecord>({
    date: '',
    time: '',
    status: '',
    comment: '',
    createdBy: 'Current User',
  })
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [extraComments, setExtraComments] = useState<
    { author: string; comment: string; createdAt: string }[]
  >([])
  const [newComment, setNewComment] = useState({
    author: '',
    comment: '',
  })

  const [currentRole, setCurrentRole] = useState<DemoRole | null>(null)

  useEffect(() => {
    try {
      const rawUser = window.localStorage.getItem('bookito_demo_user')
      if (rawUser) {
        const parsed = JSON.parse(rawUser) as { role?: DemoRole }
        if (parsed.role) {
          setCurrentRole(parsed.role)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  const canAddVisit = currentRole === 'sales'
  const canAddComment = currentRole === 'crm'

  /* ─── navigation helpers ─── */
  const stateNode = useMemo(
    () => locationHierarchy.find((s) => s.name === property?.state),
    [property?.state]
  )
  const districtNode = useMemo(
    () => stateNode?.children?.find((d) => d.name === property?.district),
    [stateNode, property?.district]
  )

  const derivedPathToDistrict =
    stateNode && districtNode ? [stateNode.id, districtNode.id] : undefined
  const derivedPathLabelsToDistrict =
    stateNode && districtNode ? [stateNode.name, districtNode.name] : undefined

  const resolvedPathToDistrict = navigationState?.path?.length
    ? navigationState.path
    : derivedPathToDistrict
  const resolvedPathLabelsToDistrict = navigationState?.pathLabels?.length
    ? navigationState.pathLabels
    : derivedPathLabelsToDistrict

  const resolvedPathToState = resolvedPathToDistrict?.length
    ? [resolvedPathToDistrict[0]]
    : stateNode
      ? [stateNode.id]
      : undefined
  const resolvedPathLabelsToState = resolvedPathLabelsToDistrict?.length
    ? [resolvedPathLabelsToDistrict[0]]
    : stateNode
      ? [stateNode.name]
      : undefined

  if (!property) {
    return (
      <div className="space-y-4">
        <Button
          variant="secondary"
          onClick={() =>
            navigate('/properties', {
              state: {
                path: derivedPathToDistrict,
                pathLabels: derivedPathLabelsToDistrict,
              },
            })
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <p className="text-sm text-surface-500">Property not found.</p>
      </div>
    )
  }

  const revisitCount = visitHistory.length

  const lifecycleStatus = useMemo(() => {
    if (!salesRecord) return { label: 'Prospect' as const, demo: 'No', trial: 'No', live: 'No' }

    const live = salesRecord.isLive ? 'Yes' : 'No'
    const trial = salesRecord.trialProvided ? 'Yes' : 'No'
    const demo = salesRecord.demoProvided ? 'Yes' : 'No'

    let label: 'Live' | 'Trial' | 'Demo' | 'Prospect' = 'Prospect'
    if (salesRecord.isLive) label = 'Live'
    else if (salesRecord.trialProvided) label = 'Trial'
    else if (salesRecord.demoProvided) label = 'Demo'

    return { label, demo, trial, live }
  }, [salesRecord])

  const breadcrumb = [
    {
      label: 'Properties',
      onClick: () =>
        navigate('/properties', {
          state: {
            path: resolvedPathToDistrict,
            pathLabels: resolvedPathLabelsToDistrict,
          },
        }),
    },
    {
      label: property.state,
      ...(resolvedPathToState &&
        resolvedPathLabelsToState && {
          onClick: () =>
            navigate('/properties', {
              state: {
                path: resolvedPathToState,
                pathLabels: resolvedPathLabelsToState,
              },
            }),
        }),
    },
    {
      label: property.district,
      ...(resolvedPathToDistrict &&
        resolvedPathLabelsToDistrict && {
          onClick: () =>
            navigate('/properties', {
              state: {
                path: resolvedPathToDistrict,
                pathLabels: resolvedPathLabelsToDistrict,
              },
            }),
        }),
    },
    { label: property.name },
  ]

  const propertyClassVariant: BadgeVariant =
    property.propertyClass === 'Luxury'
      ? 'purple'
      : property.propertyClass === 'Premium'
        ? 'info'
        : property.propertyClass === 'Standard'
          ? 'warning'
          : 'default'

  const daysUntilExpiry = property.planExpiryDate
    ? Math.ceil(
        (new Date(property.planExpiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null

  /* ═══════════════════════ RENDER ═══════════════════════ */
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Breadcrumb items={breadcrumb} />
      </div>
      {/* ─── HEADER ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-surface-200 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 px-6 py-6 shadow-lg">
        {/* Decorative circles */}
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/5" />
        <div className="absolute left-1/2 -top-8 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <button
              onClick={() =>
                navigate('/properties', {
                  state: {
                    path: resolvedPathToDistrict,
                    pathLabels: resolvedPathLabelsToDistrict,
                  },
                })
              }
              className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {property.name}
                </h1>
                <StatusBadge
                  label={property.propertyClass}
                  variant={propertyClassVariant}
                  className="!bg-white/15 !text-white !ring-white/20 backdrop-blur-sm"
                />
                <StatusBadge
                  label={lifecycleStatus.label}
                  variant={lifecycleStatus.label === 'Live' ? 'success' : lifecycleStatus.label === 'Trial' ? 'warning' : lifecycleStatus.label === 'Demo' ? 'info' : 'default'}
                  dot
                  className="!bg-white/15 !text-white !ring-white/20 backdrop-blur-sm"
                />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/70">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {property.propertyType}
                </span>
                <span className="h-3 w-px bg-white/20" />
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {property.place}, {property.district}
                </span>
                <span className="h-3 w-px bg-white/20" />
                <span className="flex items-center gap-1">
                  <Bed className="h-3 w-3" />
                  {property.numberOfRooms} rooms
                </span>
              </div>
            </div>
          </div>

          {/* Lifecycle stepper */}
          <div className="hidden lg:block">
            <LifecycleStepper current={lifecycleStatus.label} />
          </div>
        </div>
      </div>

      {/* ─── QUICK STATS ROW ─── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <QuickStat
          icon={Bed}
          label="Rooms"
          value={`${property.numberOfRooms} (${property.roomCategory})`}
        />
        <QuickStat
          icon={IndianRupee}
          label="Proposed Price"
          value={formatCurrency(property.proposedPrice)}
        />
        <QuickStat
          icon={Tag}
          label="Final Price"
          value={
            property.finalCommittedPrice
              ? formatCurrency(property.finalCommittedPrice)
              : '—'
          }
        />
        <QuickStat
          icon={CalendarDays}
          label="Tenure"
          value={property.tenure}
        />
      </div>

      {/* ─── Lifecycle stepper (mobile) ─── */}
      <div className="flex justify-center lg:hidden">
        <LifecycleStepper current={lifecycleStatus.label} />
      </div>

      {/* ─── TAB BAR ─── */}
      <div className="flex gap-1 rounded-xl border border-surface-200 bg-surface-50 p-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          const TabIcon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-surface-500 hover:text-surface-700 hover:bg-surface-100'
              }`}
            >
              <TabIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT 2/3 */}
        <div className="space-y-5 lg:col-span-2">
          {/* ──── TAB: OVERVIEW ──── */}
          {activeTab === 'overview' && (
            <>
              {/* Property Details */}
              <SectionCard>
                <div className="border-b border-surface-100 px-5 py-4">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-surface-900">
                    <Building2 className="h-4 w-4 text-primary-500" />
                    Property Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-0 px-5 py-3 sm:grid-cols-2">
                  <InfoItem icon={Tag} label="Property Type" value={property.propertyType} />
                  <InfoItem icon={Star} label="Property Class" value={property.propertyClass} />
                  <InfoItem icon={Bed} label="Room Category" value={property.roomCategory} />
                  <InfoItem icon={Hash} label="Number of Rooms" value={String(property.numberOfRooms)} />
                  <InfoItem icon={MapPin} label="Location" value={property.location || '—'} />
                  <InfoItem icon={Globe} label="State / District" value={`${property.state}, ${property.district}`} />
                  <InfoItem icon={MapPin} label="Place" value={property.place} />
                  <InfoItem icon={Mail} label="Property Email" value={property.email || '—'} href={property.email ? `mailto:${property.email}` : undefined} />
                  <InfoItem
                    icon={Building2}
                    label="Multiple Properties"
                    value={property.hasMultipleProperty ? `Yes${property.numberOfProperties ? ` (${property.numberOfProperties})` : ''}` : 'No'}
                  />
                </div>
              </SectionCard>

              {/* Software & Integrations */}
              <SectionCard>
                <div className="border-b border-surface-100 px-5 py-4">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-surface-900">
                    <Monitor className="h-4 w-4 text-primary-500" />
                    Software & Integrations
                  </h2>
                </div>
                <div className="px-5 py-3 space-y-3">
                  <InfoItem icon={Monitor} label="Currently Using (PMS)" value={property.currentPMS || 'None'} />
                  <div className="flex items-start gap-3 py-2.5">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                      <Wifi className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-surface-400">
                        Connected OTA Platforms
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {property.connectedOTAPlatforms?.length ? (
                          property.connectedOTAPlatforms.map((platform) => (
                            <span
                              key={platform}
                              className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-200"
                            >
                              {platform}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-surface-400">None connected</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </>
          )}

          {/* ──── TAB: COMMERCIALS ──── */}
          {activeTab === 'commercials' && (
            <>
              {/* Pricing */}
              <SectionCard>
                <div className="border-b border-surface-100 px-5 py-4">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-surface-900">
                    <IndianRupee className="h-4 w-4 text-primary-500" />
                    Pricing & Plan
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-0 px-5 py-3 sm:grid-cols-2">
                  <InfoItem icon={IndianRupee} label="Proposed Price" value={formatCurrency(property.proposedPrice)} />
                  <InfoItem
                    icon={IndianRupee}
                    label="Final Committed Price"
                    value={property.finalCommittedPrice ? formatCurrency(property.finalCommittedPrice) : '—'}
                  />
                  <InfoItem icon={Tag} label="Committed / Proposed Rate" value={property.committedProposedRate || '—'} />
                  <InfoItem icon={CalendarDays} label="Tenure" value={property.tenure} />
                  <InfoItem icon={FileText} label="Plan Type" value={property.planType || '—'} />
                  <InfoItem
                    icon={IndianRupee}
                    label="Closing Amount"
                    value={property.closingAmount ? formatCurrency(property.closingAmount) : '—'}
                  />
                </div>
              </SectionCard>

              {/* Plan Timeline */}
              <SectionCard>
                <div className="border-b border-surface-100 px-5 py-4">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-surface-900">
                    <CalendarDays className="h-4 w-4 text-primary-500" />
                    Plan Timeline
                  </h2>
                </div>
                <div className="px-5 py-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                    <div className="flex-1 space-y-1">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-surface-400">Start Date</p>
                      <p className="text-lg font-bold text-surface-800">
                        {property.planStartDate || '—'}
                      </p>
                    </div>
                    <div className="hidden sm:flex flex-col items-center">
                      <ChevronRight className="h-5 w-5 text-surface-300" />
                      {property.planStartDate && property.planExpiryDate && (
                        <span className="text-[10px] text-surface-400 mt-1">{property.tenure}</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-surface-400">Expiry Date</p>
                      <p className="text-lg font-bold text-surface-800">
                        {property.planExpiryDate || '—'}
                      </p>
                    </div>
                    {daysUntilExpiry !== null && property.planExpiryDate && (
                      <div className="flex-1 space-y-1">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-surface-400">
                          Days Remaining
                        </p>
                        <p
                          className={`text-lg font-bold ${
                            daysUntilExpiry <= 30
                              ? 'text-red-600'
                              : daysUntilExpiry <= 90
                                ? 'text-amber-600'
                                : 'text-accent-600'
                          }`}
                        >
                          {daysUntilExpiry > 0 ? daysUntilExpiry : 'Expired'}
                        </p>
                      </div>
                    )}
                  </div>
                  {/* Progress bar */}
                  {property.planStartDate && property.planExpiryDate && (
                    <div className="mt-5">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            daysUntilExpiry != null && daysUntilExpiry <= 30
                              ? 'bg-red-500'
                              : daysUntilExpiry != null && daysUntilExpiry <= 90
                                ? 'bg-amber-500'
                                : 'bg-primary-500'
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                ((Date.now() - new Date(property.planStartDate).getTime()) /
                                  (new Date(property.planExpiryDate).getTime() -
                                    new Date(property.planStartDate).getTime())) *
                                  100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* Status Details */}
              <SectionCard>
                <div className="border-b border-surface-100 px-5 py-4">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-surface-900">
                    <Shield className="h-4 w-4 text-primary-500" />
                    Status Details
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-0 px-5 py-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3 py-2.5">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-surface-400">
                        Lifecycle Status
                      </p>
                      <div className="mt-1">
                        <StatusBadge
                          label={lifecycleStatus.label}
                          variant={
                            lifecycleStatus.label === 'Live'
                              ? 'success'
                              : lifecycleStatus.label === 'Trial'
                                ? 'warning'
                                : lifecycleStatus.label === 'Demo'
                                  ? 'info'
                                  : 'default'
                          }
                          dot
                        />
                      </div>
                    </div>
                  </div>
                  <InfoItem icon={CheckCircle2} label="Demo Provided" value={lifecycleStatus.demo} />
                  <InfoItem icon={CheckCircle2} label="Trial Provided" value={lifecycleStatus.trial} />
                  <InfoItem icon={CheckCircle2} label="Live Property" value={lifecycleStatus.live} />
                </div>
              </SectionCard>
            </>
          )}

          {/* ──── TAB: VISITS ──── */}
          {activeTab === 'visits' && (
            <>
              {/* Assignment */}
              <SectionCard>
                <div className="border-b border-surface-100 px-5 py-4">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-surface-900">
                    <UserCheck className="h-4 w-4 text-primary-500" />
                    Executive Assignment
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-0 px-5 py-3 sm:grid-cols-2">
                  <InfoItem icon={User} label="First Visit Executive" value={property.executiveName || '—'} />
                  <InfoItem icon={CalendarDays} label="First Visit Date" value={property.firstVisitDate || '—'} />
                  <InfoItem icon={CheckCircle2} label="First Visit Status" value={property.firstVisitStatus || '—'} />
                  <InfoItem icon={User} label="Second Visit Executive" value={property.secondVisitExecutive || '—'} />
                  <InfoItem icon={CalendarDays} label="Second Visit Date" value={property.secondVisitDate || '—'} />
                  <InfoItem icon={CheckCircle2} label="Second Visit Status" value={property.secondVisitStatus || '—'} />
                  <InfoItem icon={MessageCircle} label="Second Visit Comments" value={property.secondVisitComments || '—'} />
                  <InfoItem icon={UserCheck} label="Currently Assigned To" value={property.currentlyAssignedTo || '—'} />
                </div>
              </SectionCard>

              {/* Visit History Timeline */}
              {salesRecord && (
                <SectionCard>
                  <div className="border-b border-surface-100 px-5 py-4 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-sm font-bold text-surface-900">
                      <Clock className="h-4 w-4 text-primary-500" />
                      Visit History
                    </h2>
                    <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                      {revisitCount} {revisitCount === 1 ? 'visit' : 'visits'}
                    </span>
                  </div>
                  <div className="px-5 py-4">
                    {visitHistory.length > 0 ? (
                      <div className="relative space-y-3">
                        {/* timeline line */}
                        <div className="absolute left-[15px] top-3 bottom-3 w-px bg-surface-200" />
                        {visitHistory.map((visit, idx) => (
                          <div
                            key={idx}
                            className={`relative flex gap-4 rounded-xl border border-l-4 px-4 py-3 transition-all duration-200 hover:shadow-sm ${getVisitTileClasses(visit.status)}`}
                          >
                            {/* timeline dot */}
                            <div className="absolute -left-[5px] top-4 h-2.5 w-2.5 rounded-full border-2 border-white bg-primary-400 ring-2 ring-primary-100" />
                            <div className="flex-1 pl-4">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <StatusBadge
                                  label={visit.status}
                                  variant={getVisitStatusVariant(visit.status)}
                                  dot
                                />
                                <div className="flex items-center gap-2 text-xs text-surface-400">
                                  <CalendarDays className="h-3 w-3" />
                                  <span>{visit.date}</span>
                                  <span>•</span>
                                  <Clock className="h-3 w-3" />
                                  <span>{visit.time}</span>
                                </div>
                              </div>
                              {visit.comment && (
                                <p className="mt-2 text-sm text-surface-600">{visit.comment}</p>
                              )}
                              {visit.createdBy && (
                                <p className="mt-1.5 text-[11px] text-surface-400 flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  by {visit.createdBy}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-surface-400">
                        <Clock className="h-8 w-8 mb-2" />
                        <p className="text-sm">No visit history recorded yet.</p>
                      </div>
                    )}

                    {/* Add visit form */}
                    {canAddVisit && (
                      <div className="mt-6 rounded-xl border border-dashed border-surface-300 bg-surface-50 p-4">
                        <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-surface-500">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Add Visit Entry
                        </h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                          <Select
                            value={newVisit.status}
                            onChange={(value) => {
                              setNewVisit((prev) => ({ ...prev, status: value }))
                              if (value !== 'Rescheduled') {
                                setRescheduleDate('')
                              }
                            }}
                            options={[
                              { label: 'Closed', value: 'Closed' },
                              { label: 'Interested', value: 'Interested' },
                              { label: 'Not Interested', value: 'Not Interested' },
                              { label: 'Rescheduled', value: 'Rescheduled' },
                              { label: 'Demo Requested', value: 'Requested Demo' },
                            ]}
                            placeholder="Status"
                          />
                          <Input
                            type="date"
                            value={newVisit.date}
                            onChange={(e) =>
                              setNewVisit((prev) => ({ ...prev, date: e.target.value }))
                            }
                          />
                          <Input
                            type="time"
                            value={newVisit.time}
                            onChange={(e) =>
                              setNewVisit((prev) => ({ ...prev, time: e.target.value }))
                            }
                          />
                          <Input
                            placeholder="Short comment"
                            value={newVisit.comment}
                            onChange={(e) =>
                              setNewVisit((prev) => ({ ...prev, comment: e.target.value }))
                            }
                          />
                        </div>
                        {newVisit.status === 'Rescheduled' && (
                          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
                            <Input
                              type="date"
                              value={rescheduleDate}
                              onChange={(e) => setRescheduleDate(e.target.value)}
                              placeholder="Rescheduled date"
                            />
                          </div>
                        )}
                        <div className="mt-3 flex justify-end">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              if (!newVisit.status || !newVisit.date || !newVisit.time) return
                              if (newVisit.status === 'Rescheduled' && !rescheduleDate) return

                              const visitToAdd: VisitRecord = {
                                ...newVisit,
                                createdBy: 'Current User',
                                comment:
                                  newVisit.status === 'Rescheduled' && rescheduleDate
                                    ? `${newVisit.comment ? newVisit.comment + ' ' : ''}(Rescheduled to ${rescheduleDate})`
                                    : newVisit.comment,
                              }

                              setVisitHistory((prev) => [...prev, visitToAdd])
                              setNewVisit({ date: '', time: '', status: '', comment: '' })
                              setRescheduleDate('')
                            }}
                          >
                            Add Visit
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </SectionCard>
              )}
            </>
          )}
        </div>

        {/* ─── RIGHT SIDEBAR ─── */}
        <div className="space-y-5">
          {/* Primary Contact */}
          <SectionCard>
            <div className="border-b border-surface-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-surface-900">
                <User className="h-4 w-4 text-primary-500" />
                Primary Contact
              </h2>
            </div>
            <div className="px-5 py-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-lg">
                  {property.contactPersonName?.[0]?.toUpperCase() || 'C'}
                </div>
                <div>
                  <p className="text-sm font-bold text-surface-800">
                    {property.contactPersonName}
                  </p>
                  <p className="text-xs text-surface-500">
                    {property.primaryPersonPosition || property.primaryContactPerson}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <a
                  href={`mailto:${property.email}`}
                  className="flex items-center gap-3 rounded-lg border border-surface-100 bg-surface-50 px-3 py-2.5 text-sm font-medium text-surface-700 transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                >
                  <Mail className="h-4 w-4 text-surface-400" />
                  <span className="truncate">{property.email}</span>
                </a>
                <a
                  href={`tel:${property.contactNumber}`}
                  className="flex items-center gap-3 rounded-lg border border-surface-100 bg-surface-50 px-3 py-2.5 text-sm font-medium text-surface-700 transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                >
                  <Phone className="h-4 w-4 text-surface-400" />
                  <span>{property.contactNumber}</span>
                </a>
              </div>
            </div>
          </SectionCard>

          {/* Location Link */}
          {property.locationLink && (
            <SectionCard>
              <div className="border-b border-surface-100 px-5 py-4">
                <h2 className="flex items-center gap-2 text-sm font-bold text-surface-900">
                  <MapPin className="h-4 w-4 text-primary-500" />
                  Location
                </h2>
              </div>
              <div className="p-5">
                <a
                  href={property.locationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl border border-primary-200 bg-gradient-to-r from-primary-50 to-primary-100/50 px-4 py-3 text-sm font-semibold text-primary-700 transition-all hover:shadow-md hover:from-primary-100 hover:to-primary-100"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Open in Google Maps
                  </span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </SectionCard>
          )}

          {/* Comments */}
          <SectionCard>
            <div className="border-b border-surface-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-surface-900">
                <MessageCircle className="h-4 w-4 text-primary-500" />
                Comments
              </h2>
            </div>
            <div className="px-5 py-4 space-y-4">
              {/* Main comment */}
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-surface-400 mb-1.5">
                  Main Comment
                </p>
                <div className="rounded-lg bg-surface-50 px-3 py-2.5">
                  <p className="text-sm text-surface-700 leading-relaxed">
                    {property.comments || 'No main comment added yet.'}
                  </p>
                </div>
              </div>

              {/* Follow-up comments */}
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-surface-400 mb-1.5">
                  Follow Up Comments
                </p>
                {extraComments.length > 0 ? (
                  <ul className="space-y-2">
                    {extraComments.map((c, idx) => (
                      <li
                        key={idx}
                        className="rounded-lg border border-surface-100 bg-surface-50 px-3 py-2.5"
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs font-semibold text-surface-700 flex items-center gap-1">
                            <User className="h-3 w-3 text-surface-400" />
                            {c.author || 'Comment'}
                          </span>
                          <span className="text-[10px] text-surface-400">{c.createdAt}</span>
                        </div>
                        <p className="text-sm text-surface-600">{c.comment}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-surface-400 italic">
                    No follow up comments yet.
                  </p>
                )}
              </div>

              {/* Add comment form */}
              {canAddComment && (
                <div className="space-y-2 pt-2 border-t border-surface-100">
                  <Textarea
                    rows={2}
                    placeholder="Add a comment..."
                    value={newComment.comment}
                    onChange={(e) =>
                      setNewComment((prev) => ({ ...prev, comment: e.target.value }))
                    }
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        if (!newComment.comment.trim()) return
                        setExtraComments((prev) => [
                          ...prev,
                          {
                            author: 'Current User',
                            comment: newComment.comment.trim(),
                            createdAt: new Date().toLocaleString(),
                          },
                        ])
                        setNewComment({ author: '', comment: '' })
                      }}
                    >
                      <Send className="mr-1.5 h-3 w-3" />
                      Add Comment
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
