import { CreditCard, Check, Plus } from 'lucide-react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Button } from '@/components/FormElements'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: '6 Month Plan',
    price: '₹35,000',
    period: '6 months',
    description: 'Ideal for small properties looking to try Bookito PMS',
    features: [
      'Property Management System',
      'Up to 20 rooms',
      'Basic Channel Manager',
      '2 OTA Integrations',
      'Email Support',
      'Basic Reports',
    ],
    popular: false,
    color: 'from-surface-600 to-surface-800',
  },
  {
    name: 'Standard 1 Year',
    price: '₹55,000',
    period: '1 year',
    description: 'Best for growing properties with channel management needs',
    features: [
      'Full PMS Suite',
      'Up to 30 rooms',
      'Advanced Channel Manager',
      '5 OTA Integrations',
      'Priority Email Support',
      'Smart Reports & Analytics',
      'Guest Reviews Management',
      'Rate Intelligence',
    ],
    popular: true,
    color: 'from-primary-600 to-primary-800',
  },
  {
    name: 'Premium 1 Year',
    price: '₹1,20,000',
    period: '1 year',
    description: 'For large properties & chains requiring enterprise features',
    features: [
      'Enterprise PMS Suite',
      'Unlimited rooms',
      'AI-Powered Channel Manager',
      'All OTA Integrations',
      '24/7 Phone & Chat Support',
      'Advanced Analytics Dashboard',
      'Smart Pricing Engine',
      'Custom API Integrations',
      'Multi-Property Management',
      'Dedicated Account Manager',
    ],
    popular: false,
    color: 'from-purple-600 to-purple-800',
  },
]

export default function PricingPlanPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-surface-900">Pricing Plans</h1>
        <div className="mt-2">
          <Breadcrumb items={[{ label: 'Pricing Plan' }]} />
        </div>
        <p className="mt-3 text-sm text-surface-500">
          Manage and update Bookito PMS subscription plans offered to properties and travel agents.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              'relative flex flex-col rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:shadow-lg',
              plan.popular ? 'border-primary-300 ring-2 ring-primary-100' : 'border-surface-200'
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                Most Popular
              </div>
            )}

            {/* Header */}
            <div className={cn('rounded-t-2xl bg-gradient-to-br p-6 text-white', plan.color)}>
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-5 w-5" />
                <span className="text-sm font-medium opacity-90">{plan.period}</span>
              </div>
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-3">
                <span className="text-3xl font-extrabold">{plan.price}</span>
                <span className="ml-1 text-sm opacity-75">/{plan.period}</span>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-6">
              <p className="text-sm text-surface-500">{plan.description}</p>

              <ul className="mt-4 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-surface-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? 'primary' : 'secondary'}
                className="mt-6 w-full"
              >
                Edit Plan
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Plan */}
      <button className="flex h-32 w-full items-center justify-center rounded-2xl border-2 border-dashed border-surface-300 bg-surface-50 text-surface-400 transition-all hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600">
        <div className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          <span className="text-sm font-medium">Add New Plan</span>
        </div>
      </button>
    </div>
  )
}
