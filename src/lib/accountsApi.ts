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
  await ensureOk(res, 'Accounts request failed')
  return res.json() as Promise<T>
}

async function post(path: string, body: unknown): Promise<unknown> {
  const res = await guardedFetch(`${apiBase}${path}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  await ensureOk(res, 'Accounts request failed')
  return res.status === 204 ? undefined : res.json()
}

async function patch(path: string, body: unknown): Promise<unknown> {
  const res = await guardedFetch(`${apiBase}${path}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
  await ensureOk(res, 'Accounts request failed')
  return res.json()
}

async function del(path: string): Promise<void> {
  const res = await guardedFetch(`${apiBase}${path}`, { method: 'DELETE' })
  await ensureOk(res, 'Accounts request failed')
}

// ——— Users (HR account management) ———
export interface ApiUserAccount {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  is_deleted: boolean
  deleted_at: string | null
}

export async function fetchUserAccounts(trash?: boolean): Promise<ApiUserAccount[]> {
  const q = trash ? '?trash=1' : ''
  const data = await get<Paginated<ApiUserAccount>>(`/api/accounts/users/${q}`)
  return asList(data)
}

export async function createUserAccount(body: {
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  password: string
}): Promise<ApiUserAccount> {
  return post('/api/accounts/users/', body) as Promise<ApiUserAccount>
}

export async function softDeleteUserAccount(id: number | string): Promise<void> {
  await post(`/api/accounts/users/${id}/soft-delete/`, {})
}

export async function restoreUserAccount(id: number | string): Promise<ApiUserAccount> {
  return post(`/api/accounts/users/${id}/restore/`, {}) as Promise<ApiUserAccount>
}

// ——— Feature catalogue (admin) ———
export interface ApiCatalogueFeature {
  id: string
  name: string
  version: string
  release_date: string
  description: string
  category: string
  status: string
  icon_key: string
}

export async function fetchCatalogueFeatures(): Promise<ApiCatalogueFeature[]> {
  const data = await get<Paginated<ApiCatalogueFeature>>('/api/accounts/catalogue-features/')
  return asList(data)
}

export async function createCatalogueFeature(
  body: Record<string, unknown>
): Promise<ApiCatalogueFeature> {
  return post('/api/accounts/catalogue-features/', body) as Promise<ApiCatalogueFeature>
}

export async function patchCatalogueFeature(
  id: string,
  body: Record<string, unknown>
): Promise<ApiCatalogueFeature> {
  return patch(`/api/accounts/catalogue-features/${id}/`, body) as Promise<ApiCatalogueFeature>
}

export async function deleteCatalogueFeature(id: string): Promise<void> {
  await del(`/api/accounts/catalogue-features/${id}/`)
}
