import { describe, expect, it } from 'vitest'
import { cn, formatCurrency, formatNumber } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', true && 'visible')).toBe('base visible')
  })
})

describe('formatCurrency', () => {
  it('formats INR with no decimals', () => {
    expect(formatCurrency(1000)).toMatch(/1,?000/)
    expect(formatCurrency(50000)).toMatch(/50,?000/)
  })
})

describe('formatNumber', () => {
  it('formats thousands as K', () => {
    expect(formatNumber(1500)).toBe('1.5K')
  })
  it('formats lakhs as L', () => {
    expect(formatNumber(150000)).toBe('1.5L')
  })
  it('formats crores as Cr', () => {
    expect(formatNumber(15000000)).toBe('1.5Cr')
  })
  it('returns small numbers as string', () => {
    expect(formatNumber(500)).toBe('500')
  })
})
