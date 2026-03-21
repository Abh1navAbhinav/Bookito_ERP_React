import { guardedFetch } from '@/lib/auth'
import { ensureOk } from '@/lib/apiErrors'

const apiBase =
  (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL ??
  'http://localhost:8000'

export type RoomSlab = '1-10' | '11-20' | '21-30' | '30+'

export interface ApiPricingRow {
  rooms: string
  six_months: number
  one_year: number
}

export interface ApiFeatureGroup {
  title: string
  items: string[]
}

export interface ApiSubscriptionPlan {
  id: string
  name: string
  description: string
  popular: boolean
  promo: string
  color: string
  footer_note: string
  pricing: ApiPricingRow[]
  features: ApiFeatureGroup[]
  sort_order: number
  is_deleted: boolean
  deleted_at: string | null
  created_at?: string
  updated_at?: string
}

export interface SubscriptionPlanUi {
  id: string
  name: string
  description: string
  popular?: boolean
  promo?: string
  color: string
  sortOrder: number
  pricing: { rooms: RoomSlab; sixMonths: number; oneYear: number }[]
  features: { title: string; items: string[] }[]
  footerNote?: string
}

export interface DeletedSubscriptionPlanUi extends SubscriptionPlanUi {
  deletedAt: string
}

export function mapApiToUiPlan(p: ApiSubscriptionPlan): SubscriptionPlanUi {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    popular: p.popular,
    promo: p.promo || undefined,
    color: p.color,
    sortOrder: p.sort_order ?? 0,
    footerNote: p.footer_note || undefined,
    pricing: (p.pricing || []).map((row) => ({
      rooms: row.rooms as RoomSlab,
      sixMonths: row.six_months,
      oneYear: row.one_year,
    })),
    features: (p.features || []).map((g) => ({
      title: g.title,
      items: [...(g.items || [])],
    })),
  }
}

export function mapApiToDeletedUi(p: ApiSubscriptionPlan): DeletedSubscriptionPlanUi {
  const base = mapApiToUiPlan(p)
  return {
    ...base,
    deletedAt: p.deleted_at || new Date().toISOString(),
  }
}

function buildWritePayload(plan: SubscriptionPlanUi): Record<string, unknown> {
  return {
    id: plan.id,
    name: plan.name,
    description: plan.description,
    popular: plan.popular ?? false,
    promo: plan.promo ?? '',
    color: plan.color,
    footer_note: plan.footerNote ?? '',
    sort_order: plan.sortOrder,
    pricing: plan.pricing.map((row) => ({
      rooms: row.rooms,
      six_months: row.sixMonths,
      one_year: row.oneYear,
    })),
    features: plan.features
      .filter((f) => f.title.trim() !== '')
      .map((f) => ({
        title: f.title.trim(),
        items: f.items.map((i) => i.trim()).filter(Boolean),
      })),
  }
}

export async function fetchActiveSubscriptionPlans(): Promise<SubscriptionPlanUi[]> {
  const res = await guardedFetch(`${apiBase}/api/subscriptions/plans/`)
  await ensureOk(res, 'Could not load subscription plans')
  const data = (await res.json()) as ApiSubscriptionPlan[]
  return Array.isArray(data) ? data.map(mapApiToUiPlan) : []
}

export async function fetchTrashedSubscriptionPlans(): Promise<DeletedSubscriptionPlanUi[]> {
  const res = await guardedFetch(`${apiBase}/api/subscriptions/plans/?trash=1`)
  await ensureOk(res, 'Could not load deleted plans')
  const data = (await res.json()) as ApiSubscriptionPlan[]
  return Array.isArray(data) ? data.map(mapApiToDeletedUi) : []
}

export async function createSubscriptionPlan(plan: SubscriptionPlanUi): Promise<SubscriptionPlanUi> {
  const body = buildWritePayload(plan)
  const res = await guardedFetch(`${apiBase}/api/subscriptions/plans/`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `Create plan failed: ${res.status}`)
  }
  const created = (await res.json()) as ApiSubscriptionPlan
  return mapApiToUiPlan(created)
}

export async function updateSubscriptionPlan(id: string, plan: SubscriptionPlanUi): Promise<SubscriptionPlanUi> {
  const body = buildWritePayload(plan)
  const { id: _drop, ...patch } = body
  const res = await guardedFetch(`${apiBase}/api/subscriptions/plans/${encodeURIComponent(id)}/`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
  await ensureOk(res, 'Could not update plan')
  const updated = (await res.json()) as ApiSubscriptionPlan
  return mapApiToUiPlan(updated)
}

export async function softDeleteSubscriptionPlan(id: string): Promise<void> {
  const res = await guardedFetch(
    `${apiBase}/api/subscriptions/plans/${encodeURIComponent(id)}/soft-delete/`,
    { method: 'POST' }
  )
  await ensureOk(res, 'Could not delete plan')
}

export async function restoreSubscriptionPlan(id: string): Promise<SubscriptionPlanUi> {
  const res = await guardedFetch(
    `${apiBase}/api/subscriptions/plans/${encodeURIComponent(id)}/restore/`,
    { method: 'POST' }
  )
  await ensureOk(res, 'Could not restore plan')
  const data = (await res.json()) as ApiSubscriptionPlan
  return mapApiToUiPlan(data)
}
