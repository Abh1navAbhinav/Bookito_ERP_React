import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Zap } from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { features, type Feature } from '@/data/mockData'

export default function FeatureDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const feature: Feature | undefined = useMemo(
    () => features.find((f) => f.id === id),
    [id]
  )

  if (!feature) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate('/admin/features')}
          className="inline-flex items-center gap-2 rounded-full bg-surface-100 px-3 py-1.5 text-xs font-medium text-surface-700 hover:bg-surface-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to feature list
        </button>
        <p className="text-sm text-surface-500">Feature not found.</p>
      </div>
    )
  }

  const breadcrumb = [
    { label: 'PMS', onClick: () => navigate('/admin/features') },
    { label: 'Feature List', onClick: () => navigate('/admin/features') },
    { label: feature.name },
  ]

  return (
    <div className="space-y-6">
      <div className="mb-4 text-xs text-surface-500">
        <Breadcrumb items={breadcrumb} />
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/features')}
            className="rounded-full bg-surface-100 p-2 text-surface-600 shadow-sm transition-colors hover:bg-surface-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-500">
              Pms module
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-surface-900">
              {feature.name}
            </h1>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-indigo-500 px-4 py-1.5 text-xs font-medium text-white shadow-md">
          <Zap className="h-3.5 w-3.5" />
          Version {feature.version}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-surface-200 bg-white/80 p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-surface-900">
              Feature overview
            </h2>
            <p className="text-sm leading-relaxed text-surface-700">
              {feature.description}
            </p>
          </div>

          <div className="rounded-2xl border border-surface-200 bg-gradient-to-br from-surface-50 via-white to-primary-50/40 p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-surface-900">
              Ideal demo flow
            </h2>
            <ul className="space-y-2 text-sm text-surface-700">
              <li>• Start with the problem this module solves for hoteliers.</li>
              <li>• Walk through a real property example from the sales pipeline.</li>
              <li>• Highlight 2–3 key benefits that impact revenue or operations.</li>
              <li>• End with how it connects to other modules in Bookito PMS.</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-surface-200 bg-white/90 p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-surface-900">
              Release details
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-surface-400">
                  Feature
                </dt>
                <dd className="text-sm font-medium text-surface-800 text-right">
                  {feature.name}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-surface-400">
                  Version
                </dt>
                <dd className="text-sm font-medium text-surface-800">
                  {feature.version}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-surface-400">
                  Release date
                </dt>
                <dd className="text-sm font-medium text-surface-800">
                  {feature.date}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-surface-200 bg-surface-50 p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-surface-900">
              Talk track for sales / CRM
            </h2>
            <p className="text-xs text-surface-500">
              Use this as a guide while explaining the module to prospects.
            </p>
            <ul className="mt-3 space-y-2 text-sm text-surface-700">
              <li>• When to pitch this module.</li>
              <li>• Which property segments benefit the most.</li>
              <li>• Two example objections and how to handle them.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

