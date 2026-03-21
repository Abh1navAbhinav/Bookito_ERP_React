import { getAuthHeaders, guardedFetch } from '@/lib/auth'
import { ensureOk } from '@/lib/apiErrors'

const apiBase =
  (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL ??
  'http://localhost:8000'

export function getPartnersAuthHeaders(): Record<string, string> {
  return getAuthHeaders()
}

async function get<T>(path: string): Promise<T> {
  const res = await guardedFetch(`${apiBase}${path}`)
  await ensureOk(res, 'Partners request failed')
  return res.json() as Promise<T>
}

async function post(path: string, body: unknown): Promise<unknown> {
  const res = await guardedFetch(`${apiBase}${path}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  await ensureOk(res, 'Partners request failed')
  return res.status === 204 ? undefined : res.json()
}

async function patch(path: string, body: unknown): Promise<unknown> {
  const res = await guardedFetch(`${apiBase}${path}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
  await ensureOk(res, 'Partners request failed')
  return res.status === 204 ? undefined : res.json()
}

async function del(path: string): Promise<void> {
  const res = await guardedFetch(`${apiBase}${path}`, { method: 'DELETE' })
  await ensureOk(res, 'Partners request failed')
}

type Paginated<T> = { results: T[] } | T[]

function asList<T>(data: Paginated<T>): T[] {
  return Array.isArray(data) ? data : (data as { results: T[] }).results ?? []
}

// ---------- API types (snake_case from backend) ----------
export interface ApiTravelAgent {
  id: string
  slno: number
  agent_name: string
  contact_number: string
  email: string
  trial_status: boolean
  trial_remaining_days: number
  plan_start_date: string
  plan_end_date: string
  pending_amount: string
  collected_amount: string
  contract_type: string
  state: string
  district: string
  location: string
  is_deleted?: boolean
  deleted_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface ApiTradeFairVenue {
  id: string
  location: string
  city: string
  venue: string
  date: string
  is_deleted?: boolean
  deleted_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface ApiTradeFairProperty {
  id: string
  fair: string
  fair_id?: string
  fair_venue?: string
  fair_date?: string
  property_name: string
  contact_person: string
  contact_number: string
  email: string
  location: string
  status: string
  is_deleted?: boolean
  deleted_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface ApiTradeFairAgent {
  id: string
  fair: string
  fair_id?: string
  fair_venue?: string
  fair_date?: string
  agent_name: string
  contact_number: string
  email: string
  location: string
  is_dmc: boolean
  status: string
  is_deleted?: boolean
  deleted_at?: string | null
  created_at?: string
  updated_at?: string
}

// ---------- Frontend-facing types (camelCase, match mockData) ----------
export interface TravelAgent {
  id: string
  slno: number
  agentName: string
  contactNumber: string
  email: string
  trialStatus: boolean
  trialRemainingDays: number
  planStartDate: string
  planEndDate: string
  pendingAmount: number
  collectedAmount: number
  contractType: string
  state: string
  district: string
  location: string
  isDeleted?: boolean
  deletedAt?: string
}

export interface TradeFairVenue {
  id: string
  location: string
  city: string
  venue: string
  date: string
  isDeleted?: boolean
  deletedAt?: string
}

export interface TradeFairProperty {
  id: string
  fairId: string
  fairVenue?: string
  fairDate?: string
  propertyName: string
  contactPerson: string
  contactNumber: string
  email: string
  location: string
  status: string
  isDeleted?: boolean
  deletedAt?: string
}

export interface TradeFairAgent {
  id: string
  fairId: string
  fairVenue?: string
  fairDate?: string
  agentName: string
  contactNumber: string
  email: string
  location: string
  isDMC: boolean
  status: string
  isDeleted?: boolean
  deletedAt?: string
}

function mapApiAgentToAgent(a: ApiTravelAgent): TravelAgent {
  return {
    id: a.id,
    slno: a.slno,
    agentName: a.agent_name,
    contactNumber: a.contact_number,
    email: a.email,
    trialStatus: a.trial_status,
    trialRemainingDays: a.trial_remaining_days,
    planStartDate: a.plan_start_date,
    planEndDate: a.plan_end_date,
    pendingAmount: Number(a.pending_amount),
    collectedAmount: Number(a.collected_amount),
    contractType: a.contract_type,
    state: a.state,
    district: a.district,
    location: a.location,
    isDeleted: a.is_deleted,
    deletedAt: a.deleted_at ?? undefined,
  }
}

function mapApiVenueToVenue(v: ApiTradeFairVenue): TradeFairVenue {
  return {
    id: v.id,
    location: v.location,
    city: v.city,
    venue: v.venue,
    date: v.date,
    isDeleted: v.is_deleted,
    deletedAt: v.deleted_at ?? undefined,
  }
}

function mapApiFairPropertyToProperty(p: ApiTradeFairProperty): TradeFairProperty {
  return {
    id: p.id,
    fairId: p.fair,
    fairVenue: p.fair_venue,
    fairDate: p.fair_date,
    propertyName: p.property_name,
    contactPerson: p.contact_person,
    contactNumber: p.contact_number,
    email: p.email,
    location: p.location,
    status: p.status,
    isDeleted: p.is_deleted,
    deletedAt: p.deleted_at ?? undefined,
  }
}

function mapApiFairAgentToAgent(a: ApiTradeFairAgent): TradeFairAgent {
  return {
    id: a.id,
    fairId: a.fair,
    fairVenue: a.fair_venue,
    fairDate: a.fair_date,
    agentName: a.agent_name,
    contactNumber: a.contact_number,
    email: a.email,
    location: a.location,
    isDMC: a.is_dmc,
    status: a.status,
    isDeleted: a.is_deleted,
    deletedAt: a.deleted_at ?? undefined,
  }
}

// ---------- Travel Agents ----------
export async function fetchTravelAgentById(id: string): Promise<TravelAgent | null> {
  try {
    const out = await get<ApiTravelAgent>(`/api/partners/agents/${id}/`)
    return mapApiAgentToAgent(out)
  } catch {
    return null
  }
}

export async function fetchTravelAgents(params?: { state?: string; district?: string }): Promise<TravelAgent[]> {
  const search = new URLSearchParams()
  if (params?.state) search.set('state', params.state)
  if (params?.district) search.set('district', params.district)
  const q = search.toString() ? `?${search}` : ''
  const data = await get<Paginated<ApiTravelAgent>>(`/api/partners/agents/${q}`)
  return asList(data).map(mapApiAgentToAgent)
}

export async function fetchDeletedTravelAgents(): Promise<TravelAgent[]> {
  const data = await get<ApiTravelAgent[]>(`/api/partners/agents/deleted/`)
  const list = Array.isArray(data) ? data : []
  return list.map(mapApiAgentToAgent)
}

export async function createTravelAgent(payload: {
  id?: string
  slno: number
  agentName: string
  contactNumber: string
  email: string
  trialStatus?: boolean
  trialRemainingDays?: number
  planStartDate: string
  planEndDate: string
  pendingAmount?: number
  collectedAmount?: number
  contractType: string
  state: string
  district: string
  location: string
}): Promise<TravelAgent> {
  const body = {
    id: payload.id,
    slno: payload.slno,
    agent_name: payload.agentName,
    contact_number: payload.contactNumber,
    email: payload.email,
    trial_status: payload.trialStatus ?? false,
    trial_remaining_days: payload.trialRemainingDays ?? 0,
    plan_start_date: payload.planStartDate,
    plan_end_date: payload.planEndDate,
    pending_amount: String(payload.pendingAmount ?? 0),
    collected_amount: String(payload.collectedAmount ?? 0),
    contract_type: payload.contractType,
    state: payload.state,
    district: payload.district,
    location: payload.location,
  }
  const out = await post('/api/partners/agents/', body) as ApiTravelAgent
  return mapApiAgentToAgent(out)
}

export async function updateTravelAgent(id: string, payload: Partial<TravelAgent>): Promise<TravelAgent> {
  const body: Record<string, unknown> = {}
  if (payload.slno !== undefined) body.slno = payload.slno
  if (payload.agentName !== undefined) body.agent_name = payload.agentName
  if (payload.contactNumber !== undefined) body.contact_number = payload.contactNumber
  if (payload.email !== undefined) body.email = payload.email
  if (payload.trialStatus !== undefined) body.trial_status = payload.trialStatus
  if (payload.trialRemainingDays !== undefined) body.trial_remaining_days = payload.trialRemainingDays
  if (payload.planStartDate !== undefined) body.plan_start_date = payload.planStartDate
  if (payload.planEndDate !== undefined) body.plan_end_date = payload.planEndDate
  if (payload.pendingAmount !== undefined) body.pending_amount = String(payload.pendingAmount)
  if (payload.collectedAmount !== undefined) body.collected_amount = String(payload.collectedAmount)
  if (payload.contractType !== undefined) body.contract_type = payload.contractType
  if (payload.state !== undefined) body.state = payload.state
  if (payload.district !== undefined) body.district = payload.district
  if (payload.location !== undefined) body.location = payload.location
  const out = await patch(`/api/partners/agents/${id}/`, body) as ApiTravelAgent
  return mapApiAgentToAgent(out)
}

export async function softDeleteTravelAgent(id: string): Promise<void> {
  await post(`/api/partners/agents/${id}/soft-delete/`, {})
}

export async function restoreTravelAgent(id: string): Promise<TravelAgent> {
  const out = await post(`/api/partners/agents/${id}/restore/`, {}) as ApiTravelAgent
  return mapApiAgentToAgent(out)
}

// ---------- Trade Fair Venues ----------
export async function fetchVenues(): Promise<TradeFairVenue[]> {
  const data = await get<Paginated<ApiTradeFairVenue>>('/api/partners/venues/')
  return asList(data).map(mapApiVenueToVenue)
}

export async function fetchDeletedVenues(): Promise<TradeFairVenue[]> {
  const data = await get<ApiTradeFairVenue[]>('/api/partners/venues/deleted/')
  return (Array.isArray(data) ? data : []).map(mapApiVenueToVenue)
}

export async function createVenue(payload: { id?: string; location: string; city: string; venue: string; date: string }): Promise<TradeFairVenue> {
  const body = {
    id: payload.id,
    location: payload.location,
    city: payload.city,
    venue: payload.venue,
    date: payload.date,
  }
  const out = await post('/api/partners/venues/', body) as ApiTradeFairVenue
  return mapApiVenueToVenue(out)
}

export async function updateVenue(id: string, payload: Partial<TradeFairVenue>): Promise<TradeFairVenue> {
  const body: Record<string, unknown> = {}
  if (payload.location !== undefined) body.location = payload.location
  if (payload.city !== undefined) body.city = payload.city
  if (payload.venue !== undefined) body.venue = payload.venue
  if (payload.date !== undefined) body.date = payload.date
  const out = await patch(`/api/partners/venues/${id}/`, body) as ApiTradeFairVenue
  return mapApiVenueToVenue(out)
}

export async function softDeleteVenue(id: string): Promise<void> {
  await post(`/api/partners/venues/${id}/soft-delete/`, {})
}

export async function restoreVenue(id: string): Promise<TradeFairVenue> {
  const out = await post(`/api/partners/venues/${id}/restore/`, {}) as ApiTradeFairVenue
  return mapApiVenueToVenue(out)
}

// ---------- Trade Fair Properties ----------
export async function fetchFairPropertyById(id: string): Promise<TradeFairProperty | null> {
  try {
    const out = await get<ApiTradeFairProperty>(`/api/partners/fair-properties/${id}/`)
    return mapApiFairPropertyToProperty(out)
  } catch {
    return null
  }
}

export async function fetchFairProperties(fairId?: string): Promise<TradeFairProperty[]> {
  const q = fairId ? `?fair=${fairId}` : ''
  const data = await get<Paginated<ApiTradeFairProperty>>(`/api/partners/fair-properties/${q}`)
  return asList(data).map(mapApiFairPropertyToProperty)
}

export async function fetchDeletedFairProperties(): Promise<TradeFairProperty[]> {
  const data = await get<Paginated<ApiTradeFairProperty>>('/api/partners/fair-properties/deleted/')
  return asList(data).map(mapApiFairPropertyToProperty)
}

export async function createFairProperty(payload: {
  id?: string
  fairId: string
  propertyName: string
  contactPerson: string
  contactNumber: string
  email: string
  location: string
  status: string
}): Promise<TradeFairProperty> {
  const body = {
    id: payload.id,
    fair_id: payload.fairId,
    property_name: payload.propertyName,
    contact_person: payload.contactPerson,
    contact_number: payload.contactNumber,
    email: payload.email,
    location: payload.location,
    status: payload.status,
  }
  const out = await post('/api/partners/fair-properties/', body) as ApiTradeFairProperty
  return mapApiFairPropertyToProperty(out)
}

export async function updateFairProperty(id: string, payload: Partial<TradeFairProperty>): Promise<TradeFairProperty> {
  const body: Record<string, unknown> = {}
  if (payload.fairId !== undefined) body.fair_id = payload.fairId
  if (payload.propertyName !== undefined) body.property_name = payload.propertyName
  if (payload.contactPerson !== undefined) body.contact_person = payload.contactPerson
  if (payload.contactNumber !== undefined) body.contact_number = payload.contactNumber
  if (payload.email !== undefined) body.email = payload.email
  if (payload.location !== undefined) body.location = payload.location
  if (payload.status !== undefined) body.status = payload.status
  const out = await patch(`/api/partners/fair-properties/${id}/`, body) as ApiTradeFairProperty
  return mapApiFairPropertyToProperty(out)
}

export async function softDeleteFairProperty(id: string): Promise<void> {
  await post(`/api/partners/fair-properties/${id}/soft-delete/`, {})
}

export async function restoreFairProperty(id: string): Promise<TradeFairProperty> {
  const out = await post(`/api/partners/fair-properties/${id}/restore/`, {}) as ApiTradeFairProperty
  return mapApiFairPropertyToProperty(out)
}

// ---------- Trade Fair Agents ----------
export async function fetchFairAgentById(id: string): Promise<TradeFairAgent | null> {
  try {
    const out = await get<ApiTradeFairAgent>(`/api/partners/fair-agents/${id}/`)
    return mapApiFairAgentToAgent(out)
  } catch {
    return null
  }
}

export async function fetchFairAgents(fairId?: string): Promise<TradeFairAgent[]> {
  const q = fairId ? `?fair=${fairId}` : ''
  const data = await get<Paginated<ApiTradeFairAgent>>(`/api/partners/fair-agents/${q}`)
  return asList(data).map(mapApiFairAgentToAgent)
}

export async function fetchDeletedFairAgents(): Promise<TradeFairAgent[]> {
  const data = await get<Paginated<ApiTradeFairAgent>>('/api/partners/fair-agents/deleted/')
  return asList(data).map(mapApiFairAgentToAgent)
}

export async function createFairAgent(payload: {
  id?: string
  fairId: string
  agentName: string
  contactNumber: string
  email: string
  location: string
  isDMC: boolean
  status: string
}): Promise<TradeFairAgent> {
  const body = {
    id: payload.id,
    fair_id: payload.fairId,
    agent_name: payload.agentName,
    contact_number: payload.contactNumber,
    email: payload.email,
    location: payload.location,
    is_dmc: payload.isDMC,
    status: payload.status,
  }
  const out = await post('/api/partners/fair-agents/', body) as ApiTradeFairAgent
  return mapApiFairAgentToAgent(out)
}

export async function updateFairAgent(id: string, payload: Partial<TradeFairAgent>): Promise<TradeFairAgent> {
  const body: Record<string, unknown> = {}
  if (payload.fairId !== undefined) body.fair_id = payload.fairId
  if (payload.agentName !== undefined) body.agent_name = payload.agentName
  if (payload.contactNumber !== undefined) body.contact_number = payload.contactNumber
  if (payload.email !== undefined) body.email = payload.email
  if (payload.location !== undefined) body.location = payload.location
  if (payload.isDMC !== undefined) body.is_dmc = payload.isDMC
  if (payload.status !== undefined) body.status = payload.status
  const out = await patch(`/api/partners/fair-agents/${id}/`, body) as ApiTradeFairAgent
  return mapApiFairAgentToAgent(out)
}

export async function softDeleteFairAgent(id: string): Promise<void> {
  await post(`/api/partners/fair-agents/${id}/soft-delete/`, {})
}

export async function restoreFairAgent(id: string): Promise<TradeFairAgent> {
  const out = await post(`/api/partners/fair-agents/${id}/restore/`, {}) as ApiTradeFairAgent
  return mapApiFairAgentToAgent(out)
}
