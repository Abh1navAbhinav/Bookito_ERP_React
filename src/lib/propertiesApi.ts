import { guardedFetch } from '@/lib/auth'
import { ensureOk } from '@/lib/apiErrors'

const apiBase =
  (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL ??
  'http://localhost:8000'

export interface Property {
  id: string
  slno: number
  name: string
  property_type: string
  property_class: string
  room_category: string
  number_of_rooms: number
  has_multiple_property: boolean
  number_of_properties: number | null
  email: string
  proposed_price: string
  final_committed_price: string
  tenure: string
  place: string
  primary_contact_person: string
  contact_person_name: string
  contact_number: string
  primary_person_position: string | null
  executive_name: string | null
  first_visit_date: string
  first_visit_status: string
  committed_proposed_rate: string | null
  comments: string
  rescheduled_date: string | null
  rescheduled_comment: string | null
  second_visit_executive: string | null
  second_visit_date: string | null
  second_visit_status: string | null
  second_visit_comments: string | null
  currently_assigned_to: string | null
  plan_type: string | null
  closing_amount: string | null
  plan_start_date: string
  plan_expiry_date: string
  location_link: string
  current_pms: string
  connected_ota_platforms: string[]
  state: string
  district: string
  location: string
  created_at: string
  updated_at: string
  is_deleted?: boolean
  deleted_at?: string | null
  is_draft?: boolean
}

export interface PropertyListParams {
  state?: string
  district?: string
  tenure?: string
  property_type?: string
  property_class?: string
  room_category?: string
  second_visit_status?: string
  is_draft?: boolean
  search?: string
  ordering?: string
}

type Paginated<T> = { results: T[]; count?: number } | T[]

function asList<T>(data: Paginated<T>): T[] {
  if (Array.isArray(data)) return data
  const r = (data as { results?: T[] }).results
  return r ?? []
}

export async function fetchProperties(params?: PropertyListParams): Promise<Property[]> {
  const search = new URLSearchParams()
  if (params?.state) search.set('state', params.state)
  if (params?.district) search.set('district', params.district)
  if (params?.tenure) search.set('tenure', params.tenure)
  if (params?.property_type) search.set('property_type', params.property_type)
  if (params?.property_class) search.set('property_class', params.property_class)
  if (params?.room_category) search.set('room_category', params.room_category)
  if (params?.second_visit_status) search.set('second_visit_status', params.second_visit_status)
  if (params?.is_draft !== undefined) search.set('is_draft', String(params.is_draft))
  if (params?.search) search.set('search', params.search)
  if (params?.ordering) search.set('ordering', params.ordering)
  const q = search.toString()
  const url = `${apiBase}/api/properties/${q ? `?${q}` : ''}`
  const res = await guardedFetch(url)
  await ensureOk(res, 'Could not load properties')
  const data = (await res.json()) as Paginated<Property>
  return asList(data)
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  const res = await guardedFetch(`${apiBase}/api/properties/${id}/`)
  if (res.status === 404) return null
  await ensureOk(res, 'Could not load property')
  return res.json() as Promise<Property>
}

export async function createProperty(payload: Partial<Property>): Promise<Property> {
  const res = await guardedFetch(`${apiBase}/api/properties/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  await ensureOk(res, 'Could not create property')
  return res.json() as Promise<Property>
}

export async function updateProperty(id: string, payload: Partial<Property>): Promise<Property> {
  const res = await guardedFetch(`${apiBase}/api/properties/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  await ensureOk(res, 'Could not update property')
  return res.json() as Promise<Property>
}

export async function softDeleteProperty(id: string): Promise<void> {
  const res = await guardedFetch(`${apiBase}/api/properties/${id}/soft-delete/`, {
    method: 'POST',
    body: '{}',
  })
  await ensureOk(res, 'Could not move property to trash')
}

export async function restoreProperty(id: string): Promise<Property> {
  const res = await guardedFetch(`${apiBase}/api/properties/${id}/restore/`, {
    method: 'POST',
    body: '{}',
  })
  await ensureOk(res, 'Could not restore property')
  return res.json() as Promise<Property>
}

export async function deleteProperty(id: string): Promise<void> {
  const res = await guardedFetch(`${apiBase}/api/properties/${id}/`, {
    method: 'DELETE',
  })
  await ensureOk(res, 'Could not permanently delete property')
}

export async function fetchDeletedProperties(params?: { retention_days?: number }): Promise<Property[]> {
  const q = params?.retention_days != null ? `?retention_days=${params.retention_days}` : ''
  const res = await guardedFetch(`${apiBase}/api/properties/deleted/${q}`)
  await ensureOk(res, 'Could not load deleted properties')
  const data = (await res.json()) as Paginated<Property>
  return asList(data)
}
