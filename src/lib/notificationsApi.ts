import { guardedFetch } from '@/lib/auth'

const apiBase =
  (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL ??
  'http://localhost:8000'

export interface Notification {
  id: string
  title: string
  message: string
  notification_type: string
  read: boolean
  created_at: string
}

export async function fetchNotifications(): Promise<Notification[]> {
  try {
    const res = await guardedFetch(`${apiBase}/api/accounts/notifications/`)
    if (!res.ok) return []
    const data = (await res.json()) as Notification[]
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}
