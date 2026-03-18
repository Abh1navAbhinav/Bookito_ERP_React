import { useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  BadgeCheck,
  CalendarDays,
  Building2,
  IndianRupee,
  Hash,
  Globe,
  CheckCircle2,
} from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button } from '@/components/FormElements'
import { StatusBadge } from '@/components/StatusBadge'
import type { BadgeVariant } from '@/components/StatusBadge'
import { travelAgents, locationHierarchy, type TravelAgent } from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'

/* ─── Helpers ─── */
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

/* ═════════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                         */
/* ═════════════════════════════════════════════════════════════════════════ */
export default function TravelAgentDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const navigationState = location.state as
    | {
        path?: string[]
        pathLabels?: string[]
      }
    | null

  const agent: TravelAgent | undefined = useMemo(
    () => travelAgents.find((a) => a.id === id),
    [id]
  )

  /* ─── navigation helpers ─── */
  const stateNode = useMemo(
    () => locationHierarchy.find((s) => s.name === agent?.state),
    [agent?.state]
  )
  const districtNode = useMemo(
    () => stateNode?.children?.find((d) => d.name === agent?.district),
    [stateNode, agent?.district]
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

  if (!agent) {
    return (
      <div className="space-y-4">
        <Button
          variant="secondary"
          onClick={() =>
            navigate('/travel-agents', {
              state: {
                path: resolvedPathToDistrict,
                pathLabels: resolvedPathLabelsToDistrict,
              },
            })
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <p className="text-sm text-surface-500">Travel agent not found.</p>
      </div>
    )
  }

  const breadcrumb = [
    {
      label: 'Travel Agents',
      onClick: () =>
        navigate('/travel-agents', {
          state: {
            path: resolvedPathToDistrict,
            pathLabels: resolvedPathLabelsToDistrict,
          },
        }),
    },
    {
      label: agent.state,
      ...(resolvedPathToState &&
        resolvedPathLabelsToState && {
          onClick: () =>
            navigate('/travel-agents', {
              state: {
                path: resolvedPathToState,
                pathLabels: resolvedPathLabelsToState,
              },
            }),
        }),
    },
    {
      label: agent.district,
      ...(resolvedPathToDistrict &&
        resolvedPathLabelsToDistrict && {
          onClick: () =>
            navigate('/travel-agents', {
              state: {
                path: resolvedPathToDistrict,
                pathLabels: resolvedPathLabelsToDistrict,
              },
            }),
        }),
    },
    { label: agent.agentName },
  ]

  const contractVariant: BadgeVariant =
    agent.contractType === 'Platinum'
      ? 'purple'
      : agent.contractType === 'Gold'
        ? 'warning'
        : agent.contractType === 'Silver'
          ? 'info'
          : 'default'


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
                navigate('/travel-agents', {
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
                  {agent.agentName}
                </h1>
                <StatusBadge
                  label={agent.contractType}
                  variant={contractVariant}
                  className="!bg-white/15 !text-white !ring-white/20 backdrop-blur-sm"
                />
                <StatusBadge
                  label={agent.trialStatus ? 'On Trial' : 'Active Plan'}
                  variant={agent.trialStatus ? 'warning' : 'success'}
                  dot
                  className="!bg-white/15 !text-white !ring-white/20 backdrop-blur-sm"
                />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/70">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {agent.location}, {agent.district}
                </span>
                <span className="h-3 w-px bg-white/20" />
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {agent.email}
                </span>
                <span className="h-3 w-px bg-white/20" />
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {agent.contactNumber}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── QUICK STATS ROW ─── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <QuickStat
          icon={CalendarDays}
          label="Plan Start"
          value={agent.planStartDate || '—'}
        />
        <QuickStat
          icon={CalendarDays}
          label="Plan End"
          value={agent.planEndDate || '—'}
        />
        <QuickStat
          icon={IndianRupee}
          label="Collected Amount"
          value={agent.collectedAmount ? formatCurrency(agent.collectedAmount) : '—'}
        />
        <QuickStat
          icon={IndianRupee}
          label="Pending Amount"
          value={agent.pendingAmount ? formatCurrency(agent.pendingAmount) : '—'}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Agent Information */}
          <SectionCard>
            <div className="border-b border-surface-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-surface-900">
                <Building2 className="h-4 w-4 text-primary-500" />
                Agent Information
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-0 px-5 py-3 sm:grid-cols-2">
              <InfoItem icon={Hash} label="SI No" value={String(agent.slno)} />
              <InfoItem
                icon={Globe}
                label="State / District"
                value={`${agent.state}, ${agent.district}`}
              />
              <InfoItem icon={MapPin} label="Location" value={agent.location || '—'} />
              <InfoItem
                icon={Mail}
                label="Email Address"
                value={agent.email || '—'}
                href={agent.email ? `mailto:${agent.email}` : undefined}
              />
              <InfoItem
                icon={Phone}
                label="Contact Number"
                value={agent.contactNumber || '—'}
                href={agent.contactNumber ? `tel:${agent.contactNumber}` : undefined}
              />
              <InfoItem icon={BadgeCheck} label="Contract Type" value={agent.contractType} />
            </div>
          </SectionCard>

          {/* Commercials & Subscription */}
          <SectionCard>
            <div className="border-b border-surface-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-surface-900">
                <IndianRupee className="h-4 w-4 text-primary-500" />
                Commercials & Subscription
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-0 px-5 py-3 sm:grid-cols-2">
              <InfoItem
                icon={CalendarDays}
                label="Plan Start Date"
                value={agent.planStartDate || '—'}
              />
              <InfoItem
                icon={CalendarDays}
                label="Plan End Date"
                value={agent.planEndDate || '—'}
              />
              <InfoItem
                icon={IndianRupee}
                label="Collected Amount"
                value={
                  agent.collectedAmount !== undefined
                    ? formatCurrency(agent.collectedAmount)
                    : '—'
                }
              />
              <InfoItem
                icon={IndianRupee}
                label="Pending Amount"
                value={
                  agent.pendingAmount !== undefined
                    ? formatCurrency(agent.pendingAmount)
                    : '—'
                }
              />
              <InfoItem
                icon={CheckCircle2}
                label="Trial Status"
                value={agent.trialStatus ? 'Active Trial' : 'No Trial'}
              />
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard>
            <div className="border-b border-surface-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-surface-900">
                <BadgeCheck className="h-4 w-4 text-primary-500" />
                Quick Summary
              </h2>
            </div>
            <div className="px-5 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-surface-200 bg-surface-50 p-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-white p-2 shadow-sm">
                      <Mail className="h-4 w-4 text-surface-500" />
                    </div>
                    <span className="font-medium text-surface-700">Email</span>
                  </div>
                  <span className="text-surface-600 truncate max-w-[150px]">{agent.email || '—'}</span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-surface-200 bg-surface-50 p-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-white p-2 shadow-sm">
                      <Phone className="h-4 w-4 text-surface-500" />
                    </div>
                    <span className="font-medium text-surface-700">Phone</span>
                  </div>
                  <span className="text-surface-600 truncate">{agent.contactNumber || '—'}</span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-surface-200 bg-surface-50 p-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-white p-2 shadow-sm">
                      <BadgeCheck className="h-4 w-4 text-surface-500" />
                    </div>
                    <span className="font-medium text-surface-700">Contract</span>
                  </div>
                  <StatusBadge label={agent.contractType} variant={contractVariant} />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}

