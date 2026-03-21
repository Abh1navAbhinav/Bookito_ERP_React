import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { clearAuthAndRedirectToLogin, getAuthHeaders } from './auth'

describe('getAuthHeaders', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('returns Content-Type and no Authorization when no token', () => {
    const headers = getAuthHeaders()
    expect(headers['Content-Type']).toBe('application/json')
    expect(headers['Authorization']).toBeUndefined()
  })

  it('returns Authorization Bearer when token is set', () => {
    localStorage.setItem('bookito_access_token', 'abc123')
    const headers = getAuthHeaders()
    expect(headers['Content-Type']).toBe('application/json')
    expect(headers['Authorization']).toBe('Bearer abc123')
  })
})

describe('clearAuthAndRedirectToLogin', () => {
  const originalLocation = window.location

  beforeEach(() => {
    localStorage.setItem('bookito_access_token', 'at')
    localStorage.setItem('bookito_refresh_token', 'rt')
    localStorage.setItem('bookito_demo_user', 'demo')
    Object.defineProperty(window, 'location', {
      value: { ...originalLocation, href: '', assign: vi.fn() },
      writable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'location', { value: originalLocation, writable: true })
    localStorage.clear()
  })

  it('removes auth tokens and demo user from localStorage', () => {
    clearAuthAndRedirectToLogin()
    expect(localStorage.getItem('bookito_access_token')).toBeNull()
    expect(localStorage.getItem('bookito_refresh_token')).toBeNull()
    expect(localStorage.getItem('bookito_demo_user')).toBeNull()
  })

  it('sets location.href to login URL', () => {
    clearAuthAndRedirectToLogin()
    expect(window.location.href).toMatch(/\/login$/)
  })
})
