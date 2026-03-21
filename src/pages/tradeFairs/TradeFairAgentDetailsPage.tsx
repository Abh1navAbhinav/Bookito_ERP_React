import { useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Users, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CalendarDays,
  ExternalLink,
  MessageCircle,
  Clock,
  Send,
  Globe,
  Eye
} from 'lucide-react'
import { Button, Textarea, Modal, FormField, Input, Select } from '@/components/FormElements'
import { Breadcrumb } from '@/components/Breadcrumb'
import { StatusBadge, getStatusVariant } from '@/components/StatusBadge'
import { fetchFairAgentById, type TradeFairAgent } from '@/lib/partnersApi'
import { AddAgentModal } from '@/components/modals/AddAgentModal'

/* --- Helper Components --- */
function SectionCard({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-2 border-b border-surface-100 px-6 py-4">
        <Icon className="h-4 w-4 text-primary-500" />
        <h2 className="text-sm font-bold text-surface-900 uppercase tracking-wider">{title}</h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

function DetailItem({ label, value, icon: Icon, href }: { label: string, value: string, icon: any, href?: string }) {
  const content = (
    <div className="flex items-start gap-4 group">
      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-50 text-surface-400 transition-colors group-hover:bg-primary-50 group-hover:text-primary-500">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-400">
          {label}
        </p>
        <p className={`mt-0.5 text-base font-bold text-surface-900 truncate ${href ? 'text-primary-600 group-hover:underline' : ''}`}>
          {value || '—'}
        </p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block outline-none">
        {content}
      </a>
    )
  }
  return content
}

export default function TradeFairAgentDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [agent, setAgent] = useState<TradeFairAgent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setAgent(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    fetchFairAgentById(id).then((a) => {
      if (!cancelled) {
        setAgent(a ?? null)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [id])

  const [extraComments, setExtraComments] = useState<
    { author: string; comment: string; createdAt: string }[]
  >([])
  const [newComment, setNewComment] = useState({
    comment: '',
  })
  const [isKitSent, setIsKitSent] = useState(false)
  const [kitSentDate, setKitSentDate] = useState('')
  const [isOnboarded, setIsOnboarded] = useState(false)

  const [showKitModal, setShowKitModal] = useState(false)
  const [showViewSentKitModal, setShowViewSentKitModal] = useState(false)
  const [showOnboardModal, setShowOnboardModal] = useState(false)

  const initialOnboardData = useMemo(() => ({
    agentName: agent?.agentName || '',
    email: agent?.email || '',
    contactNumber: agent?.contactNumber || '',
    location: agent?.location || '',
  }), [agent])

  const onboardLockedFields = useMemo(
    () => ['agentName', 'contactNumber', 'email', 'location'] as const,
    []
  )

  const fair = useMemo(() => 
    agent ? { id: agent.fairId, venue: agent.fairVenue ?? '', date: agent.fairDate ?? '' } : null,
  [agent])

  if (loading) {
    return (
      <div className="rounded-xl border border-surface-200 bg-surface-50 p-12 text-center text-surface-500">
        Loading agent…
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-surface-100 p-4">
          <Users className="h-8 w-8 text-surface-400" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-surface-900">Agent Not Found</h2>
          <p className="text-sm text-surface-500">The agent details you're looking for aren't available.</p>
        </div>
        <button 
          onClick={() => navigate('/trade-fairs')}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Trade Fairs
        </button>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: 'Trade Fairs', onClick: () => navigate('/trade-fairs') },
    ...(fair ? [{ label: fair.venue, onClick: () => navigate(`/trade-fairs?fairId=${fair.id}&tab=agents`) }] : []),
    { label: agent.agentName }
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-surface-200 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 p-6 shadow-xl md:p-8">
        {/* Decor */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-5">
            <button
              onClick={() => navigate(`/trade-fairs?fairId=${agent.fairId}&tab=agents`)}
              className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                  {agent.agentName}
                </h1>
                <StatusBadge 
                  label={agent.status} 
                  variant={getStatusVariant(agent.status)}
                  dot
                  className="!bg-white/15 !text-white !ring-white/20 backdrop-blur-md"
                />
                {agent.isDMC && (
                  <StatusBadge 
                    label="DMC" 
                    variant="success"
                    className="!bg-accent-500/20 !text-white !ring-accent-500/30 backdrop-blur-md"
                  />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/80">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-white/60" />
                  {agent.location}
                </span>
                {fair && (
                  <>
                    <span className="h-4 w-px bg-white/20 hidden sm:block" />
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4 text-white/60" />
                      {fair.venue} ({fair.date})
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-white/20 backdrop-blur-sm">
              <Globe className="h-4 w-4" />
              Visit Website
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Contact info column */}
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title="Agency Details" icon={Users}>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <DetailItem 
                icon={Users} 
                label="Agency Name" 
                value={agent.agentName} 
              />
              <DetailItem 
                icon={Phone} 
                label="Primary Contact No" 
                value={agent.contactNumber} 
                href={`tel:${agent.contactNumber}`}
              />
              <DetailItem 
                icon={Mail} 
                label="Agency Email" 
                value={agent.email} 
                href={`mailto:${agent.email}`}
              />
              <DetailItem 
                icon={MapPin} 
                label="Operating Location" 
                value={agent.location} 
              />
              <DetailItem 
                icon={Globe} 
                label="Is DMC?" 
                value={agent.isDMC ? 'Yes' : 'No'} 
              />
            </div>
          </SectionCard>

          <SectionCard title="Trade Fair History" icon={CalendarDays}>
            <div className="space-y-6">
              <div className="flex items-center gap-4 rounded-xl bg-surface-50 p-4 border border-surface-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-surface-900">{fair?.venue || 'Unknown Event'}</h3>
                  <p className="text-sm text-surface-500">
                    {agent?.location ?? '—'} • {fair?.date}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-surface-600 border-l-4 border-indigo-500 pl-4 py-1">
                The agent was contacted at the <strong>{fair?.venue}</strong>. 
                Focus of interest included luxury properties in {agent.location} region. 
                Current relationship status: <StatusBadge label={agent.status} variant={getStatusVariant(agent.status)} className="scale-90 inline-block -mt-1 ml-1" />.
              </p>
            </div>
          </SectionCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-xl" />
            <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-surface-400 relative z-10">
              <MessageCircle className="h-4 w-4 text-indigo-500" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-2 relative z-10">
              {isKitSent ? (
                <div className="space-y-2">
                  <div className="rounded-xl bg-indigo-50/50 px-4 py-3 border border-indigo-100">
                    <div className="flex items-center gap-2 text-indigo-700 mb-1">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm font-bold">Agency Kit Sent</span>
                    </div>
                    <p className="text-[10px] text-indigo-600 font-medium">Sent on {kitSentDate}</p>
                  </div>
                  <button 
                    onClick={() => setShowViewSentKitModal(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2 text-xs font-bold text-indigo-600 transition-all hover:bg-indigo-50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Sent Kit
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowKitModal(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-600 transition-all hover:bg-indigo-100 active:scale-95"
                >
                  Send Agency Kit
                </button>
              )}

              {isOnboarded ? (
                <div className="rounded-xl bg-emerald-50 px-4 py-3 border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-bold">Onboarded as {agent?.isDMC ? 'DMC' : 'Agent'}</span>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowOnboardModal(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-50 px-4 py-3 text-sm font-bold text-accent-600 transition-all hover:bg-accent-100 active:scale-95"
                >
                  {agent?.isDMC ? 'Onboard as DMC' : 'Onboard as Agent'}
                </button>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-surface-200 bg-surface-50 p-6">
            <h3 className="mb-2 text-sm font-bold text-surface-900">Lead Metadata</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-surface-500">Record ID</span>
                <span className="font-mono font-medium text-surface-900 uppercase">#{agent.id}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-surface-500">Agent Class</span>
                <span className="font-medium text-surface-900">{agent.isDMC ? 'Destination Mgmt' : 'Standard'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-surface-500">Event Date</span>
                <span className="font-medium text-surface-900">{fair?.date}</span>
              </div>
            </div>
          </div>

          <SectionCard title="Follow Up Comments" icon={MessageCircle}>
            <div className="space-y-5">
              {/* Follow-up comments list */}
              <div className="space-y-4">
                {extraComments.length > 0 ? (
                  <ul className="space-y-3">
                    {extraComments.map((c, idx) => (
                      <li
                        key={idx}
                        className="rounded-xl border border-surface-100 bg-surface-50 px-4 py-3 shadow-sm transition-all hover:border-indigo-100"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-bold text-surface-700 flex items-center gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            {c.author}
                          </span>
                          <span className="text-[10px] font-medium text-surface-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {c.createdAt}
                          </span>
                        </div>
                        <p className="text-sm text-surface-600 leading-relaxed italic">"{c.comment}"</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-surface-200 bg-surface-50/50">
                    <MessageCircle className="h-8 w-8 text-surface-200 mb-2" />
                    <p className="text-xs text-surface-400 font-medium italic">No follow up comments logged yet.</p>
                  </div>
                )}
              </div>

              {/* Add comment form */}
              <div className="space-y-4 pt-4 border-t border-surface-100">
                <Textarea
                  rows={3}
                  placeholder="Capture agent interaction..."
                  value={newComment.comment}
                  onChange={(e) =>
                    setNewComment({ comment: e.target.value })
                  }
                  className="text-sm shadow-inner resize-none bg-surface-50/30 focus:bg-white border-none"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => {
                      if (!newComment.comment.trim()) return
                      setExtraComments((prev) => [
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
                      setNewComment({ comment: '' })
                    }}
                    className="px-4 py-2 text-xs font-bold shadow-sm bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Send className="mr-2 h-3.5 w-3.5" />
                    Add Comment
                  </Button>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Agency Kit Preview Modal */}
      <Modal
        isOpen={showKitModal}
        onClose={() => setShowKitModal(false)}
        title="Agency Kit Preview"
        size="lg"
      >
        <div className="space-y-6">
          <div className="rounded-xl border border-surface-200 bg-indigo-50/30 p-4">
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="font-bold text-surface-500 w-16">To:</span>
                <span className="text-surface-900">{agent!.email}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-surface-500 w-16">Subject:</span>
                <span className="text-surface-900">Partnership Opportunity with Bookito ERP – {agent!.agentName}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-surface-100 bg-white p-6 shadow-inner min-h-[300px] text-surface-700 leading-relaxed font-serif">
            <p>Dear Partners at {agent!.agentName},</p>
            <br />
            <p>It was fantastic connecting with you at the trade fair. We've been following the great work <strong>{agent!.agentName}</strong> has been doing in the {agent!.location} market.</p>
            <br />
            <p>We are excited to share our exclusive <strong>Agency Kit</strong> with you, outlining how our ERP can help you manage your property portfolios more effectively and maximize commissions.</p>
            <br />
            <p>Our platform is designed to ease the collaboration between agents and properties, providing real-time availability and seamless booking management.</p>
            <br />
            <p>I've attached our agency partnership deck for your reference. Let's discuss how we can build a fruitful partnership.</p>
            <br />
            <p>Best Regards,</p>
            <p className="font-bold text-indigo-600">Partnerships Team | Bookito ERP</p>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowKitModal(false)}>
              Discard
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => {
                setIsKitSent(true)
                setKitSentDate(new Date().toLocaleString('en-IN', {
                  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                }))
                setShowKitModal(false)
              }}
            >
              <Send className="mr-2 h-4 w-4" />
              Send Agency Kit
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Sent Kit Modal */}
      <Modal
        isOpen={showViewSentKitModal}
        onClose={() => setShowViewSentKitModal(false)}
        title="Sent Agency Kit"
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-xl bg-indigo-50 px-4 py-2 border border-indigo-100 text-indigo-700 text-xs font-bold">
            <span className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              Agency Kit Delivered
            </span>
            <span>{kitSentDate}</span>
          </div>

          <div className="rounded-xl border border-surface-100 bg-white p-6 shadow-inner min-h-[300px] text-surface-700 leading-relaxed font-serif relative">
            <div className="absolute -top-3 left-6 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[10px] font-black uppercase text-indigo-500">Sent Content</div>
            <p>Dear Partners at {agent!.agentName},</p>
            <br />
            <p>It was fantastic connecting with you at the trade fair. We've been following the great work <strong>{agent!.agentName}</strong> has been doing in the {agent!.location} market.</p>
            <br />
            <p>We are excited to share our exclusive <strong>Agency Kit</strong> with you, outlining how our ERP can help you manage your property portfolios more effectively and maximize commissions.</p>
            <br />
            <p>Our platform is designed to ease the collaboration between agents and properties, providing real-time availability and seamless booking management.</p>
            <br />
            <p>I've attached our agency partnership deck for your reference. Let's discuss how we can build a fruitful partnership.</p>
            <br />
            <p>Best Regards,</p>
            <p className="font-bold text-indigo-600">Partnerships Team | Bookito ERP</p>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setShowViewSentKitModal(false)}>Close</Button>
          </div>
        </div>
      </Modal>

      {/* Onboard Agent Modal (Reused from Agents Module) */}
      <AddAgentModal
        isOpen={showOnboardModal}
        onClose={() => setShowOnboardModal(false)}
        initialData={initialOnboardData}
        lockedFields={[...onboardLockedFields]}
        title={`Onboard ${agent!.agentName} as ${agent!.isDMC ? 'DMC' : 'Agent'}`}
        onSave={(data: any) => {
          console.log('Onboarded Agent Data:', data)
          setIsOnboarded(true)
        }}
      />
    </div>
  )
}
