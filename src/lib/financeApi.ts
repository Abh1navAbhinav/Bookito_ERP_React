import { guardedFetch } from '@/lib/auth'
import { ensureOk } from '@/lib/apiErrors'

const apiBase =
  (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL ??
  'http://localhost:8000'

type Paginated<T> = { results: T[] } | T[]

function asList<T>(data: Paginated<T>): T[] {
  return Array.isArray(data) ? data : (data as { results: T[] }).results ?? []
}

async function get<T>(path: string): Promise<T> {
  const res = await guardedFetch(`${apiBase}${path}`)
  await ensureOk(res, 'Finance request failed')
  return res.json() as Promise<T>
}

async function post(path: string, body: unknown): Promise<unknown> {
  const res = await guardedFetch(`${apiBase}${path}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  await ensureOk(res, 'Finance request failed')
  return res.status === 204 ? undefined : res.json()
}

async function patch(path: string, body: unknown): Promise<unknown> {
  const res = await guardedFetch(`${apiBase}${path}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
  await ensureOk(res, 'Finance request failed')
  return res.json()
}

// ——— Payments (invoices / finance records) ———
export interface ApiFinanceRecord {
  id: string
  property: string
  property_name: string
  state?: string
  district?: string
  location?: string
  closing_amount: string
  pending_amount: string
  collected_amount: string
  invoice_uploaded: boolean
  invoice_date?: string | null
  last_payment_date?: string | null
  executive: string
  is_deleted?: boolean
  deleted_at?: string | null
}

export async function fetchFinancePayments(): Promise<ApiFinanceRecord[]> {
  const data = await get<Paginated<ApiFinanceRecord>>('/api/finance/payments/')
  return asList(data)
}

export async function fetchDeletedFinancePayments(): Promise<ApiFinanceRecord[]> {
  const data = await get<Paginated<ApiFinanceRecord>>('/api/finance/payments/deleted/')
  return asList(data)
}

export async function softDeleteFinancePayment(id: string): Promise<void> {
  await post(`/api/finance/payments/${id}/soft-delete/`, {})
}

export async function restoreFinancePayment(id: string): Promise<ApiFinanceRecord> {
  return post(`/api/finance/payments/${id}/restore/`, {}) as Promise<ApiFinanceRecord>
}

export async function patchFinancePayment(
  id: string,
  body: Record<string, unknown>
): Promise<ApiFinanceRecord> {
  return patch(`/api/finance/payments/${id}/`, body) as Promise<ApiFinanceRecord>
}

export async function createFinancePayment(
  body: Record<string, unknown>
): Promise<ApiFinanceRecord> {
  return post('/api/finance/payments/', body) as Promise<ApiFinanceRecord>
}

// ——— Quotations ———
export interface ApiQuotation {
  id: string
  property: string
  property_name: string
  recipient_name: string
  date: string
  room_category: string
  standard_price: string
  selling_price: string
  tenure: string
  status: string
  executive: string
  is_deleted?: boolean
  deleted_at?: string | null
}

export async function fetchQuotations(): Promise<ApiQuotation[]> {
  const data = await get<Paginated<ApiQuotation>>('/api/finance/quotations/')
  return asList(data)
}

export async function fetchDeletedQuotations(): Promise<ApiQuotation[]> {
  const data = await get<Paginated<ApiQuotation>>('/api/finance/quotations/deleted/')
  return asList(data)
}

export async function createQuotation(body: Record<string, unknown>): Promise<ApiQuotation> {
  return post('/api/finance/quotations/', body) as Promise<ApiQuotation>
}

export async function patchQuotation(id: string, body: Record<string, unknown>): Promise<ApiQuotation> {
  return patch(`/api/finance/quotations/${id}/`, body) as Promise<ApiQuotation>
}

export async function softDeleteQuotation(id: string): Promise<void> {
  await post(`/api/finance/quotations/${id}/soft-delete/`, {})
}

export async function restoreQuotation(id: string): Promise<ApiQuotation> {
  return post(`/api/finance/quotations/${id}/restore/`, {}) as Promise<ApiQuotation>
}

// ——— Expenses ———
export interface ApiExpense {
  id: string
  category: string
  description: string
  amount: string
  date: string
  is_deleted?: boolean
  deleted_at?: string | null
}

export async function fetchExpenses(): Promise<ApiExpense[]> {
  const data = await get<Paginated<ApiExpense>>('/api/finance/expenses/')
  return asList(data)
}

export async function fetchDeletedExpenses(): Promise<ApiExpense[]> {
  const data = await get<Paginated<ApiExpense>>('/api/finance/expenses/deleted/')
  return asList(data)
}

export async function createExpense(body: Record<string, unknown>): Promise<ApiExpense> {
  return post('/api/finance/expenses/', body) as Promise<ApiExpense>
}

export async function patchExpense(id: string, body: Record<string, unknown>): Promise<ApiExpense> {
  return patch(`/api/finance/expenses/${id}/`, body) as Promise<ApiExpense>
}

export async function softDeleteExpense(id: string): Promise<void> {
  await post(`/api/finance/expenses/${id}/soft-delete/`, {})
}

export async function restoreExpense(id: string): Promise<ApiExpense> {
  return post(`/api/finance/expenses/${id}/restore/`, {}) as Promise<ApiExpense>
}

// ——— Vendors ———
export interface ApiVendor {
  id: string
  name: string
  company: string
  email: string
  phone: string
  category: string
  outstanding_amount: string
  status: string
}

export async function fetchVendors(): Promise<ApiVendor[]> {
  const data = await get<Paginated<ApiVendor>>('/api/finance/vendors/')
  return asList(data)
}

export async function createVendor(body: Record<string, unknown>): Promise<ApiVendor> {
  return post('/api/finance/vendors/', body) as Promise<ApiVendor>
}

export async function patchVendor(id: string, body: Record<string, unknown>): Promise<ApiVendor> {
  return patch(`/api/finance/vendors/${id}/`, body) as Promise<ApiVendor>
}

export async function softDeleteVendor(id: string): Promise<void> {
  await post(`/api/finance/vendors/${id}/soft-delete/`, {})
}

// ——— Tax records ———
export interface ApiTaxRecord {
  id: string
  transaction_type: string
  invoice_no: string
  date: string
  base_amount: string
  tax_rate: string
  tax_amount: string
}

export async function fetchTaxRecords(): Promise<ApiTaxRecord[]> {
  const data = await get<Paginated<ApiTaxRecord>>('/api/finance/tax-records/')
  return asList(data)
}
