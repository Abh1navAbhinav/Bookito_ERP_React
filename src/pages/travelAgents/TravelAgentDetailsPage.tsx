import { useMemo, useState } from 'react'
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
  Send,
  User,
  MessageCircle,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button, Textarea, Input } from '@/components/FormElements'
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

  const [extraComments, setExtraComments] = useState<
    { author: string; comment: string; createdAt: string }[]
  >([])
  const [newComment, setNewComment] = useState({
    author: '',
    comment: '',
  })
  const canAddComment = true // Simplified for now

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

  /* ─── pricing helpers ─── */
  const daysUntilExpiry = agent.planEndDate
    ? Math.ceil(
        (new Date(agent.planEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null

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
                Pricing & Plan Details
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
              <InfoItem icon={BadgeCheck} label="Membership" value={agent.contractType} />
            </div>

            {/* Plan Timeline (from PropertyDetailsPage) */}
            <div className="border-t border-surface-50 px-5 py-5 bg-surface-50/30">
              <h3 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-surface-400">Plan Timeline</h3>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
                <div className="flex-1 space-y-1">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-surface-400">Start Date</p>
                  <p className="text-base font-bold text-surface-800">
                    {agent.planStartDate || '—'}
                  </p>
                </div>
                <div className="hidden sm:flex flex-col items-center pt-2">
                  <ChevronRight className="h-4 w-4 text-surface-300" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-surface-400">Expiry Date</p>
                  <p className="text-base font-bold text-surface-800">
                    {agent.planEndDate || '—'}
                  </p>
                </div>
                {daysUntilExpiry !== null && agent.planEndDate && (
                  <div className="flex-1 space-y-1">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-surface-400">
                      Days Remaining
                    </p>
                    <p
                      className={`text-base font-bold ${
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
              {agent.planStartDate && agent.planEndDate && (
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
                            ((Date.now() - new Date(agent.planStartDate).getTime()) /
                              (new Date(agent.planEndDate).getTime() -
                                new Date(agent.planStartDate).getTime())) *
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

          {/* Comments Section (from PropertyDetailsPage) */}
          <SectionCard>
            <div className="border-b border-surface-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-surface-900">
                <MessageCircle className="h-4 w-4 text-primary-500" />
                Comments & Follow-ups
              </h2>
            </div>
            <div className="px-5 py-4 space-y-4">
              {/* Follow-up comments list */}
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-surface-400 mb-1.5">
                  Follow Up History
                </p>
                {extraComments.length > 0 ? (
                  <ul className="space-y-2">
                    {extraComments.map((c: { author: string; comment: string; createdAt: string }, idx: number) => (
                      <li
                        key={idx}
                        className="rounded-lg border border-surface-100 bg-surface-50 px-3 py-2.5 shadow-sm transition-all hover:border-primary-100"
                      >
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-xs font-bold text-surface-700 flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-primary-500" />
                            {c.author || 'Admin'}
                          </span>
                          <span className="text-[10px] font-medium text-surface-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {c.createdAt}
                          </span>
                        </div>
                        <p className="text-sm text-surface-600 leading-relaxed">{c.comment}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 rounded-xl border border-dashed border-surface-200 bg-surface-50">
                    <MessageCircle className="h-6 w-6 text-surface-300 mb-2" />
                    <p className="text-xs text-surface-400 italic">No follow up comments yet.</p>
                  </div>
                )}
              </div>

              {/* Add comment form */}
              {canAddComment && (
                <div className="space-y-3 pt-3 border-t border-surface-100">
                  <Textarea
                    rows={3}
                    placeholder="Capture follow-up details..."
                    value={newComment.comment}
                    onChange={(e) =>
                      setNewComment((prev) => ({ ...prev, comment: e.target.value }))
                    }
                    className="text-sm shadow-inner overflow-hidden"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => {
                        if (!newComment.comment.trim()) return
                        setExtraComments((prev: { author: string; comment: string; createdAt: string }[]) => [
                          ...prev,
                          {
                            author: 'Manager (Admin)',
                            comment: newComment.comment.trim(),
                            createdAt: new Date().toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            }),
                          },
                        ])
                        setNewComment((prev: { author: string; comment: string }) => ({ ...prev, comment: '' }))
                      }}
                      className="px-4 py-2 text-xs font-bold shadow-sm"
                    >
                      <Send className="mr-2 h-3.5 w-3.5" />
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

