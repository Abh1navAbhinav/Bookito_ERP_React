import { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, ExternalLink, Clock, User, MessageCircle } from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button, Input, Textarea, Select } from '@/components/FormElements'
import {
  locationHierarchy,
  properties,
  salesRecords,
  type Property,
  type SalesRecord,
  type VisitRecord,
} from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-xs font-medium uppercase tracking-wide text-surface-400">
        {label}
      </span>
      <span className="text-sm font-medium text-surface-800 text-right">{value || '—'}</span>
    </div>
  )
}

function getVisitTileClasses(status: string) {
  if (status === 'Closed') {
    return 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-100'
  }
  if (status === 'Interested') {
    return 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-100'
  }
  if (status === 'Requested Demo') {
    return 'bg-gradient-to-r from-orange-50 to-orange-200 border-orange-200'
  }
  if (status === 'Not Interested') {
    return 'bg-gradient-to-r from-red-50 to-red-200 border-red-200'
  }
  if (status === 'Rescheduled' || status === 'Installation Pending') {
    return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-100'
  }
  return 'bg-surface-50 border-surface-100'
}

type DemoRole = 'manager' | 'sales' | 'accountant' | 'crm'

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

  if (!property) {
    return (
      <div className="space-y-4">
        <Button
          variant="secondary"
          onClick={() =>
            navigate('/properties', {
              state: {
                path: navigationState?.path ?? derivedPathToDistrict,
                pathLabels: navigationState?.pathLabels ?? derivedPathLabelsToDistrict,
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
  const upcomingVisit = visitHistory[visitHistory.length - 1]

  const stateNode = useMemo(
    () => locationHierarchy.find((s) => s.name === property.state),
    [property.state]
  )

  const districtNode = useMemo(
    () => stateNode?.children?.find((d) => d.name === property.district),
    [stateNode, property.district]
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              navigate('/properties', {
                state: {
                  path: resolvedPathToDistrict,
                  pathLabels: resolvedPathLabelsToDistrict,
                },
              })
            }
            className="rounded-full bg-surface-100 p-2 text-surface-600 hover:bg-surface-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-surface-900">
              {property.name}
            </h1>
            <div className="mt-1 text-xs text-surface-500">
              <Breadcrumb items={breadcrumb} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-surface-900">Property Overview</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <DetailRow label="Property Type" value={property.propertyType} />
                <DetailRow label="Property Class" value={property.propertyClass} />
                <DetailRow label="Room Category" value={property.roomCategory} />
                <DetailRow label="Number of Rooms" value={String(property.numberOfRooms)} />
                <DetailRow
                  label="Multiple Properties"
                  value={property.hasMultipleProperty ? 'Yes' : 'No'}
                />
              </div>
              <div>
                <DetailRow label="State" value={property.state} />
                <DetailRow label="District" value={property.district} />
                <DetailRow label="Location" value={property.location} />
                <DetailRow label="Place" value={property.place} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-surface-900">Commercials</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <DetailRow
                  label="Proposed Price"
                  value={formatCurrency(property.proposedPrice)}
                />
                <DetailRow
                  label="Final Committed Price"
                  value={
                    property.finalCommittedPrice
                      ? formatCurrency(property.finalCommittedPrice)
                      : '—'
                  }
                />
                <DetailRow label="Tenure" value={property.tenure} />
                <DetailRow label="Plan Start" value={property.planStartDate || '—'} />
                <DetailRow label="Plan Expiry" value={property.planExpiryDate || '—'} />
              </div>
              <div>
                <DetailRow label="Current PMS" value={property.currentPMS} />
                <DetailRow
                  label="OTA Platforms"
                  value={property.connectedOTAPlatforms.join(', ') || 'None'}
                />
                <DetailRow
                  label="Closing Amount"
                  value={
                    property.closingAmount ? formatCurrency(property.closingAmount) : '—'
                  }
                />
                <DetailRow
                  label="Visit Status"
                  value={property.secondVisitStatus || property.firstVisitStatus || '—'}
                />
              </div>
            </div>
          </div>

          {salesRecord && (
            <div className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-surface-900 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary-600" />
                  Visit History
                </h2>
                <span className="text-xs text-surface-400">
                  {revisitCount} {revisitCount === 1 ? 'visit' : 'visits'}
                </span>
              </div>
              <div className="space-y-3">
                {visitHistory.map((visit, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg border px-3 py-2 text-xs ${getVisitTileClasses(
                      visit.status
                    )}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-surface-700">
                        {visit.status}
                      </span>
                      <div className="flex flex-col items-end text-[10px] text-surface-500">
                        <span>
                          {visit.date} • {visit.time}
                        </span>
                        {visit.createdBy && (
                          <span className="mt-0.5 text-[10px] text-surface-400">
                            by {visit.createdBy}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 text-surface-600">{visit.comment}</p>
                  </div>
                ))}
              </div>
              {upcomingVisit && (
                <div className="mt-4 rounded-lg bg-primary-50 px-3 py-2 text-xs text-primary-700 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    Upcoming revisit (latest activity): {upcomingVisit.date} at{' '}
                    {upcomingVisit.time}
                  </span>
                </div>
              )}

              {canAddVisit && (
                <div className="mt-6 rounded-lg border border-dashed border-surface-200 bg-surface-50 p-3">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-surface-500">
                    Add Visit Entry
                  </h3>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
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
                    <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-4">
                      <Input
                        type="date"
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        placeholder="Rescheduled date"
                      />
                    </div>
                  )}
                  <div className="mt-2 flex justify-end">
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
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-surface-900">Primary Contact</h2>
            <DetailRow
              label="Contact Person"
              value={`${property.contactPersonName} (${property.primaryContactPerson})`}
            />
            <DetailRow label="Email" value={property.email} />
            <DetailRow label="Contact Number" value={property.contactNumber} />
          </div>

          {property.locationLink && (
            <div className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-surface-900">Location Link</h2>
              <a
                href={property.locationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-primary-700 hover:border-primary-300 hover:bg-primary-50"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Open in Google Maps
                </span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}

          <div className="rounded-xl border border-surface-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-surface-900 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary-600" />
              Comments
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-surface-400">
                  Main comment
                </p>
                <p className="mt-1 text-sm text-surface-700">
                  {property.comments || 'No main comment added yet.'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-surface-400">
                  Follow up comments
                </p>
                {extraComments.length > 0 ? (
                  <ul className="mt-2 space-y-2 text-xs text-surface-600">
                    {extraComments.map((c, idx) => (
                      <li key={idx} className="rounded-md bg-surface-50 p-2">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-semibold">{c.author || 'Comment'}</span>
                          <span className="text-[10px] text-surface-400">{c.createdAt}</span>
                        </div>
                        <p>{c.comment}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs text-surface-400">
                    No follow up comments yet.
                  </p>
                )}
              </div>
            </div>
            {canAddComment && (
              <div className="mt-4 space-y-2">
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
                    Add Comment
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

