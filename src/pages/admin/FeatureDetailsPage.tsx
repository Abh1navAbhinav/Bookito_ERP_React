import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Zap, Info, Target, Sparkles, History, HardDrive, Share2, Settings2, Check, Users as UsersIcon } from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { features, type Feature } from '@/data/mockData'
import { Button } from '@/components/FormElements'
import { cn } from '@/lib/utils'

export default function FeatureDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const feature: Feature | undefined = useMemo(
    () => features.find((f) => f.id === id),
    [id]
  )

  if (!feature) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 rounded-3xl border border-surface-200 bg-white shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-50 text-surface-300">
          <Info className="h-8 w-8" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-surface-900">Module not found</h3>
          <p className="text-sm text-surface-500">The requested feature module does not exist in our library.</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate('/admin/features')}
          className="mt-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to library
        </Button>
      </div>
    )
  }

  const breadcrumb = [
    { label: 'Feature Library', onClick: () => navigate('/admin/features') },
    { label: feature.name },
  ]

  return (
    <div className="space-y-8 pb-10">
      {/* Navigation & Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/admin/features')}
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-surface-400 transition-colors hover:text-primary-600"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Back to Feature Library
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black tracking-tight text-surface-900 md:text-4xl">
              {feature.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700 ring-1 ring-primary-100">
              <Zap className="h-3.5 w-3.5" />
              v{feature.version}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="h-11 rounded-xl">
            <Share2 className="h-4 w-4" />
            Share Module
          </Button>
          <Button className="h-11 rounded-xl shadow-lg shadow-primary-200">
            Activate for Property
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-8 lg:col-span-2">
          {/* Overview Card */}
          <div className="relative overflow-hidden rounded-[2rem] border border-surface-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-xl">
            <div className="absolute right-0 top-0 -mr-12 -mt-12 h-40 w-40 rounded-full bg-primary-500/5 blur-3xl opacity-50" />
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-surface-900">Module Capabilities</h2>
            </div>
            <p className="text-lg leading-relaxed text-surface-600">
              {feature.description}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              {[
                { label: 'Category', value: 'Operations', icon: HardDrive },
                { label: 'Engine', value: 'Proprietary', icon: Settings2 },
                { label: 'Uptime', value: '99.9%', icon: Zap },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-surface-100 bg-surface-50 p-4">
                  <item.icon className="mb-2 h-4 w-4 text-surface-400" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-surface-400">{item.label}</p>
                  <p className="text-sm font-bold text-surface-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Training / Demo Guide */}
          <div className="rounded-[2rem] bg-surface-900 p-8 text-white shadow-2xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-primary-300">
                <Target className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold">Standard Demo Protocol</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                { t: 'The Hook', d: 'Start with the operational bottleneck this module solves for hoteliers today.' },
                { t: 'Live Walkthrough', d: 'Demonstrate a real-world scenario from check-in to final reporting.' },
                { t: 'Value Unlock', d: 'Connect the feature to revenue growth or 20%+ reduction in manual tasks.' },
                { t: 'Integration', d: 'How this module talks to the rest of the Bookito ecosystem effortlessly.' },
              ].map((step, i) => (
                <div key={step.t} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-primary-300">
                      0{i+1}
                    </span>
                    <h3 className="text-sm font-bold text-surface-200">{step.t}</h3>
                  </div>
                  <p className="pl-8 text-sm text-surface-400 leading-relaxed">
                    {step.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Detailed Info Card */}
          <div className="rounded-[2rem] border border-surface-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-sm font-black uppercase tracking-widest text-surface-400">
              Technical Ledger
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Last Release', value: feature.date, icon: History },
                { label: 'Stable Version', value: `v${feature.version}`, icon: Check },
                { label: 'Support Level', value: 'Enterprise Tier', icon: UsersIcon },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between border-b border-surface-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-surface-400" />
                    <span className="text-xs font-bold text-surface-500 uppercase tracking-tight">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-surface-900">{item.value}</span>
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-8 w-full border-surface-100 bg-surface-50 py-6 text-xs font-bold uppercase tracking-widest hover:bg-white ring-1 ring-surface-200">
              View Changelog
            </Button>
          </div>

          {/* Sales Tips */}
          <div className="group relative overflow-hidden rounded-[2rem] bg-primary-600 p-8 text-white shadow-xl transition-all hover:bg-primary-700">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform group-hover:scale-150" />
            <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-primary-200">
              Sales Intel
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-primary-50">
              "When pitching this module, emphasize that it isn't just a tool; it's an automated member of their team."
            </p>
            <ul className="space-y-3">
              {['Pitch to 50+ room hotels', 'Highlight labor savings', 'Demo mobile view'].map((tip) => (
                <li key={tip} className="flex items-center gap-2 text-xs font-bold">
                  <Check className="h-3.5 w-3.5 text-primary-300" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}


