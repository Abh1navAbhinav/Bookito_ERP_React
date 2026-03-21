import { guardedFetch } from '@/lib/auth'
import { ensureOk } from '@/lib/apiErrors'

const apiBase =
  (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL ??
  'http://localhost:8000'

export interface LocationNode {
  id: string
  name: string
  children?: LocationNode[]
}

export interface AppConfig {
  location_hierarchy: LocationNode[]
  property_types: string[]
  property_classes: string[]
  room_categories: string[]
  tenure_options: string[]
  primary_contact_options: string[]
  visit_status_options: string[]
  first_visit_status_options: string[]
  plan_type_options: string[]
}

let cachedConfig: AppConfig | null = null

export async function fetchConfig(): Promise<AppConfig> {
  if (cachedConfig) return cachedConfig
  const res = await guardedFetch(`${apiBase}/api/reports/config/`)
  await ensureOk(res, 'Could not load app configuration')
  cachedConfig = (await res.json()) as AppConfig
  return cachedConfig
}
