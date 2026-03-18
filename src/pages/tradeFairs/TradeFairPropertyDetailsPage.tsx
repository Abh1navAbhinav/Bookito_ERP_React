import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Building2, 
  User, 
  Phone, 
  Mail, 
   MapPin, 
  CalendarDays,
  ExternalLink,
  MessageCircle,
  Clock,
  Send,
  Eye
} from 'lucide-react'
import { Button, Textarea } from '@/components/FormElements'
import { Breadcrumb } from '@/components/Breadcrumb'
import { StatusBadge, getStatusVariant } from '@/components/StatusBadge'
import { 
  tradeFairProperties, 
  tradeFairVenues, 
  type TradeFairProperty,
  type TradeFairVenue,
  propertyTypes,
  propertyClasses,
  roomCategories,
  tenureOptions,
  primaryContactOptions,
  firstVisitStatusOptions,
  visitStatusOptions,
  planTypeOptions,
  type Property
} from '@/data/mockData'
import { Modal, FormField, Input, Select } from '@/components/FormElements'
import { AddPropertyModal } from '@/components/modals/AddPropertyModal'

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
    <div className="flex items-start gap-3 group">
      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-50 text-surface-400 transition-colors group-hover:bg-primary-50 group-hover:text-primary-500">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-400">
          {label}
        </p>
        <p className={`mt-0.5 text-sm font-bold text-surface-900 truncate ${href ? 'text-primary-600 group-hover:underline' : ''}`}>
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

export default function TradeFairPropertyDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const property = useMemo(() => 
    tradeFairProperties.find(p => p.id === id),
  [id])

  const [extraComments, setExtraComments] = useState<
    { author: string; comment: string; createdAt: string }[]
  >([])
  const [newComment, setNewComment] = useState({
    comment: '',
  })
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [emailSentDate, setEmailSentDate] = useState('')
  const [isConverted, setIsConverted] = useState(false)

  const [showMailModal, setShowMailModal] = useState(false)
  const [showViewSentMailModal, setShowViewSentMailModal] = useState(false)
  const [showConvertModal, setShowConvertModal] = useState(false)

  const initialConvertData = useMemo(() => ({
    name: property?.propertyName || '',
    email: property?.email || '',
    contactPersonName: property?.contactPerson || '',
    contactNumber: property?.contactNumber || '',
    location: property?.location || '',
  }), [property])

  const fair = useMemo(() => 
    property ? tradeFairVenues.find(v => v.id === property.fairId) : null,
  [property])

  if (!property) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-surface-100 p-4">
          <Building2 className="h-8 w-8 text-surface-400" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-surface-900">Property Not Found</h2>
          <p className="text-sm text-surface-500">The property details you're looking for aren't available.</p>
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
    ...(fair ? [{ label: fair.venue, onClick: () => navigate(`/trade-fairs?fairId=${fair.id}&tab=properties`) }] : []),
    { label: property.propertyName }
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-surface-200 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-6 shadow-xl md:p-8">
        {/* Decor */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-5">
            <button
              onClick={() => navigate(`/trade-fairs?fairId=${property.fairId}&tab=properties`)}
              className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                  {property.propertyName}
                </h1>
                <StatusBadge 
                  label={property.status} 
                  variant={getStatusVariant(property.status)}
                  dot
                  className="!bg-white/15 !text-white !ring-white/20 backdrop-blur-md"
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/80">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-white/60" />
                  {property.location}
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
              <ExternalLink className="h-4 w-4" />
              Visit Website
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Contact info column */}
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title="Contact Information" icon={User}>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <DetailItem 
                icon={User} 
                label="Primary Contact Person" 
                value={property.contactPerson} 
              />
              <DetailItem 
                icon={Phone} 
                label="Contact Number" 
                value={property.contactNumber} 
                href={`tel:${property.contactNumber}`}
              />
              <DetailItem 
                icon={Mail} 
                label="Email Address" 
                value={property.email} 
                href={`mailto:${property.email}`}
              />
              <DetailItem 
                icon={MapPin} 
                label="Office Location" 
                value={property.location} 
              />
            </div>
          </SectionCard>

          <SectionCard title="Trade Fair Context" icon={CalendarDays}>
            <div className="space-y-6">
              <div className="flex items-center gap-4 rounded-xl bg-surface-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-surface-900">{fair?.venue || 'Unknown Event'}</h3>
                  <p className="text-sm text-surface-500">{fair?.city}, {fair?.location} • {fair?.date}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-surface-600">
                This lead was captured during the <strong>{fair?.venue}</strong> event. 
                The current status is marked as <StatusBadge label={property.status} variant={getStatusVariant(property.status)} className="scale-90 inline-block -mt-1 ml-1" />. 
                Initial discussions focused on property features and channel management requirements.
              </p>
            </div>
          </SectionCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-surface-400">
              <MessageCircle className="h-4 w-4" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {isEmailSent ? (
                <div className="space-y-2">
                  <div className="rounded-xl bg-primary-50 px-4 py-3 border border-primary-100">
                    <div className="flex items-center gap-2 text-primary-700 mb-1">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm font-bold">Welcome Email Sent</span>
                    </div>
                    <p className="text-[10px] text-primary-600 font-medium tracking-tight">Sent on {emailSentDate}</p>
                  </div>
                  <button 
                    onClick={() => setShowViewSentMailModal(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary-200 bg-white px-4 py-2 text-xs font-bold text-primary-600 transition-all hover:bg-primary-50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Sent Mail
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowMailModal(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-50 px-4 py-3 text-sm font-bold text-primary-600 transition-all hover:bg-primary-100 active:scale-95"
                >
                  Send Welcome Email
                </button>
              )}
              
              {isConverted ? (
                <div className="rounded-xl bg-emerald-50 px-4 py-3 border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm font-bold">Converted to Property</span>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowConvertModal(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-50 px-4 py-3 text-sm font-bold text-accent-600 transition-all hover:bg-accent-100 active:scale-95"
                >
                  Convert to Property
                </button>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-surface-200 bg-surface-50 p-6">
            <h3 className="mb-2 text-sm font-bold text-surface-900">Lead Metadata</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-surface-500">Scanned ID</span>
                <span className="font-mono font-medium text-surface-900 uppercase">#{property.id}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-surface-500">Capture Source</span>
                <span className="font-medium text-surface-900">Business Card Scan</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-surface-500">Capture Date</span>
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
                        className="rounded-xl border border-surface-100 bg-surface-50 px-4 py-3 shadow-sm transition-all hover:border-primary-100"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-bold text-surface-700 flex items-center gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
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
                  placeholder="Type a follow-up note..."
                  value={newComment.comment}
                  onChange={(e) =>
                    setNewComment({ comment: e.target.value })
                  }
                  className="text-sm shadow-inner resize-none bg-surface-50/30 focus:bg-white"
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
                    className="px-4 py-2 text-xs font-bold shadow-sm"
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

      {/* Mail Template Preview Modal */}
      <Modal
        isOpen={showMailModal}
        onClose={() => setShowMailModal(false)}
        title="Welcome Email Preview"
        size="lg"
      >
        <div className="space-y-6">
          <div className="rounded-xl border border-surface-200 bg-surface-50 p-4">
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="font-bold text-surface-500 w-16">To:</span>
                <span className="text-surface-900">{property!.email}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-surface-500 w-16">Subject:</span>
                <span className="text-surface-900">Welcome to Bookito ERP – Transforming {property!.propertyName}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-surface-100 bg-white p-6 shadow-inner min-h-[300px] text-surface-700 leading-relaxed font-serif">
            <p>Dear {property!.contactPerson},</p>
            <br />
            <p>It was a pleasure meeting you at <strong>{fair?.venue}</strong>. We were impressed by <strong>{property!.propertyName}</strong> and believe our ERP solution can significantly streamline your operations and maximize your revenue.</p>
            <br />
            <p>At Bookito, we specialize in providing all-in-one management tools tailored for properties like yours in {property!.location}.</p>
            <br />
            <p>We've attached our digital brochure for your review. I would love to schedule a brief 10-minute demo to show you how we can help {property!.propertyName} grow.</p>
            <br />
            <p>Best Regards,</p>
            <p className="font-bold text-indigo-600">Sales Team | Bookito ERP</p>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowMailModal(false)}>
              Discard
            </Button>
            <Button
              onClick={() => {
                setIsEmailSent(true)
                setEmailSentDate(new Date().toLocaleString('en-IN', {
                  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                }))
                setShowMailModal(false)
              }}
            >
              <Send className="mr-2 h-4 w-4" />
              Send Email Now
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Sent Mail Modal */}
      <Modal
        isOpen={showViewSentMailModal}
        onClose={() => setShowViewSentMailModal(false)}
        title="Sent Welcome Email"
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-2 border border-emerald-100 text-emerald-700 text-xs font-bold">
            <span className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              Delivered Successfully
            </span>
            <span>{emailSentDate}</span>
          </div>

          <div className="rounded-xl border border-surface-100 bg-white p-6 shadow-inner min-h-[300px] text-surface-700 leading-relaxed font-serif relative">
            <div className="absolute -top-3 left-6 bg-surface-50 border border-surface-200 px-2 py-0.5 rounded text-[10px] font-black uppercase text-surface-500">Sent Content</div>
            <p>Dear {property!.contactPerson},</p>
            <br />
            <p>It was a pleasure meeting you at <strong>{fair?.venue}</strong>. We were impressed by <strong>{property!.propertyName}</strong> and believe our ERP solution can significantly streamline your operations and maximize your revenue.</p>
            <br />
            <p>At Bookito, we specialize in providing all-in-one management tools tailored for properties like yours in {property!.location}.</p>
            <br />
            <p>We've attached our digital brochure for your review. I would love to schedule a brief 10-minute demo to show you how we can help {property!.propertyName} grow.</p>
            <br />
            <p>Best Regards,</p>
            <p className="font-bold text-indigo-600">Sales Team | Bookito ERP</p>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setShowViewSentMailModal(false)}>Close</Button>
          </div>
        </div>
      </Modal>

      {/* Convert to Property Modal (Reused from Properties Module) */}
      <AddPropertyModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        initialData={initialConvertData}
        onSave={(data) => {
          console.log('Converted Property Data:', data)
          setIsConverted(true)
        }}
      />
    </div>
  )
}
