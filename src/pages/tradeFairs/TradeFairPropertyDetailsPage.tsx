import { useMemo } from 'react'
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
  MessageSquare
} from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { StatusBadge, getStatusVariant } from '@/components/StatusBadge'
import { 
  tradeFairProperties, 
  tradeFairVenues, 
  type TradeFairProperty,
  type TradeFairVenue
} from '@/data/mockData'

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
    ...(fair ? [{ label: fair.venue, onClick: () => navigate(`/trade-fairs?fairId=${fair.id}`) }] : []),
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
              onClick={() => navigate(`/trade-fairs?fairId=${property.fairId}`)}
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
              <MessageSquare className="h-4 w-4" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-50 px-4 py-3 text-sm font-bold text-primary-600 transition-all hover:bg-primary-100">
                Send Welcome Email
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-50 px-4 py-3 text-sm font-bold text-accent-600 transition-all hover:bg-accent-100">
                Convert to Property
              </button>
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
        </div>
      </div>
    </div>
  )
}
