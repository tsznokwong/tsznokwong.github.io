import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePageBarTrigger } from './page-bar-hooks'

let scrollTriggerValue = false

vi.mock('@mui/material', () => ({
  ...require('@mui/material'),
  useScrollTrigger: () => scrollTriggerValue
}))

describe('usePageBarTrigger', () => {
  beforeEach(() => {
    scrollTriggerValue = false
      })

  it('returns true when at top of page (trigger = false)', () => {
    scrollTriggerValue = false
    const { result } = renderHook(() => usePageBarTrigger())
    expect(result.current).toBe(true)
       })

  it('returns false when scrolled down (trigger = true)', () => {
    scrollTriggerValue = true
    const { result } = renderHook(() => usePageBarTrigger())
    expect(result.current).toBe(false)
       })
})
