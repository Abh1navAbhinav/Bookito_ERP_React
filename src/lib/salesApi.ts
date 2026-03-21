import { guardedFetch } from '@/lib/auth'
import { ensureOk } from '@/lib/apiErrors'

const apiBase =
  (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL ??
  'http://localhost:8000'

export interface VisitRecord {
  date: string
  time: string
  status: string
  comment: string
  createdBy?: string
}

export interface SalesRecord {
  id: string
  slno: number
  property: string | null
  property_name: string
  number_of_rooms: number
  email: string
  primary_contact_person: string
  designation: string
  proposed_price: string | number
  plan_type: string
  status: string
  comments: string
  demo_provided: boolean
  trial_provided: boolean
  installed: boolean
  executive: string
  state: string
  district: string
  location: string
  location_link: string
  is_live: boolean
  visit_history: VisitRecord[]
  created_at?: string
  updated_at?: string
  is_deleted?: boolean
  deleted_at?: string | null
}

export type SalesAttendanceLocation = { lat: number; lng: number; name?: string }

export interface SalesAttendanceRecord {
  id: string
  user: string
  user_name: string
  username: string
  date: string
  check_in_time: string | null
  check_out_time: string | null
  notes: string | null
  check_in_location?: SalesAttendanceLocation | null
  check_out_location?: SalesAttendanceLocation | null
  check_in_selfie?: string | null
  check_out_selfie?: string | null
  created_at?: string
  updated_at?: string
}

type Paginated<T> = { results: T[] } | T[]

function asList<T>(data: Paginated<T>): T[] {
  return Array.isArray(data) ? data : (data as { results: T[] }).results ?? []
}

export async function fetchSalesRecords(params?: { executive?: string }): Promise<SalesRecord[]> {
  const q = params?.executive ? `?executive=${encodeURIComponent(params.executive)}` : ''
  const res = await guardedFetch(`${apiBase}/api/sales/records/${q}`)
  await ensureOk(res, 'Could not load sales records')
  const data = (await res.json()) as Paginated<SalesRecord>
  const list = asList(data)
  return list.map((r) => ({ ...r, proposed_price: Number(r.proposed_price) }))
}

export async function fetchSalesRecordById(id: string): Promise<SalesRecord | null> {
  try {
    const res = await guardedFetch(`${apiBase}/api/sales/records/${id}/`)
    if (!res.ok) return null
    const r = (await res.json()) as SalesRecord
    return { ...r, proposed_price: Number(r.proposed_price) }
  } catch {
    return null
  }
}

export async function fetchSalesAttendanceForDate(date: string): Promise<SalesAttendanceRecord | null> {
  const res = await guardedFetch(`${apiBase}/api/sales/attendance/?date=${encodeURIComponent(date)}`)
  await ensureOk(res, 'Could not load attendance')
  const data = (await res.json()) as SalesAttendanceRecord[]
  return data?.[0] ?? null
}

/** All sales punches in a calendar month (manager / HR register). */
export async function fetchSalesAttendanceForMonth(month: string): Promise<SalesAttendanceRecord[]> {
  const res = await guardedFetch(`${apiBase}/api/sales/attendance/?month=${encodeURIComponent(month)}`)
  await ensureOk(res, 'Could not load attendance')
  const data = (await res.json()) as SalesAttendanceRecord[]
  return Array.isArray(data) ? data : []
}

export async function salesCheckIn(
  date: string,
  time: string,
  options?: {
    notes?: string
    check_in_selfie?: string
    check_in_location?: SalesAttendanceLocation | null
  }
): Promise<SalesAttendanceRecord> {
  const res = await guardedFetch(`${apiBase}/api/sales/attendance/`, {
    method: 'POST',
    body: JSON.stringify({
      date,
      check_in_time: time,
      notes: options?.notes ?? '',
      check_in_selfie: options?.check_in_selfie ?? '',
      check_in_location: options?.check_in_location ?? null,
    }),
  })
  await ensureOk(res, 'Check-in failed')
  return (await res.json()) as SalesAttendanceRecord
}

export async function salesCheckOut(
  id: string,
  time: string,
  options?: {
    notes?: string
    check_out_selfie?: string
    check_out_location?: SalesAttendanceLocation | null
  }
): Promise<SalesAttendanceRecord> {
  const res = await guardedFetch(`${apiBase}/api/sales/attendance/${encodeURIComponent(id)}/`, {
    method: 'PATCH',
    body: JSON.stringify({
      check_out_time: time,
      notes: options?.notes ?? '',
      check_out_selfie: options?.check_out_selfie ?? '',
      check_out_location: options?.check_out_location ?? null,
    }),
  })
  await ensureOk(res, 'Check-out failed')
  return (await res.json()) as SalesAttendanceRecord
}
