/**
 * Parse Django REST Framework error JSON into a readable multi-line string.
 */
export function drfErrorsToMessage(data: unknown): string {
  if (data == null) return 'Request failed'
  if (typeof data === 'string') return data || 'Request failed'

  if (typeof data !== 'object') return 'Request failed'

  const d = data as Record<string, unknown>
  const lines: string[] = []

  if (Array.isArray(d.non_field_errors)) {
    for (const x of d.non_field_errors) lines.push(String(x))
  }
  if (typeof d.detail === 'string') {
    lines.push(d.detail)
  } else if (Array.isArray(d.detail)) {
    for (const x of d.detail) lines.push(String(x))
  }

  for (const [key, val] of Object.entries(d)) {
    if (key === 'detail' || key === 'non_field_errors') continue
    if (Array.isArray(val)) {
      const msg = val.map(String).join(' ')
      if (msg) lines.push(`${humanizeField(key)}: ${msg}`)
    } else if (val != null && typeof val === 'object' && !Array.isArray(val)) {
      lines.push(`${humanizeField(key)}: ${JSON.stringify(val)}`)
    } else if (val != null && val !== '') {
      lines.push(`${humanizeField(key)}: ${String(val)}`)
    }
  }

  const out = lines.filter(Boolean).join('\n')
  return out || 'Request failed'
}

function humanizeField(key: string): string {
  return key.replace(/_/g, ' ')
}

export class ApiRequestError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.body = body
  }
}

/**
 * Build an error from a failed fetch Response (consumes the body).
 */
export async function apiErrorFromResponse(res: Response, fallbackLabel: string): Promise<ApiRequestError> {
  let raw: unknown
  try {
    const text = await res.text()
    raw = text ? JSON.parse(text) : null
  } catch {
    raw = null
  }
  const msg =
    typeof raw === 'object' && raw !== null ? drfErrorsToMessage(raw) : `${fallbackLabel} (HTTP ${res.status})`
  return new ApiRequestError(msg, res.status, raw)
}

export async function ensureOk(res: Response, fallbackLabel: string): Promise<void> {
  if (res.ok) return
  throw await apiErrorFromResponse(res, fallbackLabel)
}
