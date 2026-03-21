/**
 * Clear stored auth and send user to login (e.g. on 401).
 * Uses window.location so it works from any context (no React router needed).
 */
export function clearAuthAndRedirectToLogin(): void {
  window.localStorage.removeItem('bookito_access_token')
  window.localStorage.removeItem('bookito_refresh_token')
  window.localStorage.removeItem('bookito_demo_user')
  const base = window.location.origin + window.location.pathname
  const loginUrl = base.endsWith('/') ? `${base}login` : `${base}/login`
  window.location.href = loginUrl
}

/** Auth headers for API calls. */
export function getAuthHeaders(): Record<string, string> {
  const token = window.localStorage.getItem('bookito_access_token')
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

const apiBase =
  (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL ??
  'http://localhost:8000'

/** User payload returned from `/api/accounts/login/` and JWT serializers. */
export interface SessionUser {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  is_active: boolean
}

export function persistAuthSession(access: string, refresh: string, user: SessionUser): void {
  window.localStorage.setItem('bookito_access_token', access)
  window.localStorage.setItem('bookito_refresh_token', refresh)
  const label =
    `${user.first_name} ${user.last_name}`.trim() || user.email || user.username
  window.localStorage.setItem('bookito_demo_user', JSON.stringify({ role: user.role, label }))
}

function parseLoginError(data: unknown, status: number): string {
  if (typeof data !== 'object' || data === null) return `Login failed (${status})`
  const d = data as Record<string, unknown>
  const nfe = d.non_field_errors
  if (Array.isArray(nfe) && nfe.length > 0) return String(nfe[0])
  if (typeof d.detail === 'string') return d.detail
  if (Array.isArray(d.detail) && d.detail.length > 0) return String(d.detail[0])
  return `Login failed (${status})`
}

/**
 * Email + password against `/api/accounts/login/`. Persists tokens and `bookito_demo_user`.
 */
export async function loginWithEmailPassword(email: string, password: string): Promise<SessionUser> {
  const res = await fetch(`${apiBase}/api/accounts/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  })
  const data = (await res.json().catch(() => ({}))) as unknown
  if (!res.ok) {
    throw new Error(parseLoginError(data, res.status))
  }
  const body = data as {
    access?: string
    refresh?: string
    user?: SessionUser
  }
  if (!body.access || !body.refresh || !body.user) {
    throw new Error('Invalid login response from server')
  }
  persistAuthSession(body.access, body.refresh, body.user)
  return body.user
}

/**
 * Try to refresh the access token using the refresh token. Returns new access token or null.
 */
export async function tryRefreshToken(): Promise<string | null> {
  const refresh = window.localStorage.getItem('bookito_refresh_token')
  if (!refresh) return null
  try {
    const res = await fetch(`${apiBase}/api/accounts/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { access?: string }
    const access = data?.access
    if (access) {
      window.localStorage.setItem('bookito_access_token', access)
      return access
    }
    return null
  } catch {
    return null
  }
}

/**
 * Fetch with auth headers and 401 handling: on Unauthorized, tries token refresh once, then retries;
 * if still 401 or refresh fails, clears auth and redirects to login.
 */
export async function guardedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const doFetch = (accessToken: string | null) => {
    const headers = new Headers(init?.headers as HeadersInit)
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
    return fetch(input, { ...init, headers })
  }

  let res = await doFetch(window.localStorage.getItem('bookito_access_token'))

  if (res.status === 401) {
    const newAccess = await tryRefreshToken()
    if (newAccess) {
      res = await doFetch(newAccess)
      if (res.status === 401) {
        clearAuthAndRedirectToLogin()
        throw new Error('Unauthorized')
      }
      return res
    }
    clearAuthAndRedirectToLogin()
    throw new Error('Unauthorized')
  }
  return res
}

