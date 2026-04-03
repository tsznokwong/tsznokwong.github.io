import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePageBarTrigger } from './page-bar-hooks'

describe('usePageBarTrigger', () => {
  it('returns true when scroll trigger is true', () => {
    const { result } = renderHook(() => usePageBarTrigger())
    expect(result.current).toBe(true)
  })
})
