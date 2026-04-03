import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { usePage } from './app-hooks'
import PageType from '../../types/page-type'

vi.mock('react-globe.gl', () => ({
  default: () => null
}))

describe('usePage', () => {
  it('returns home page by default', () => {
    const { result } = renderHook(() => usePage(), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>
      })
    expect(result.current.currentPage).toBe(PageType.Home)
         })

  it('has pages array', () => {
    const { result } = renderHook(() => usePage(), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>
      })
    expect(result.current.pages).toContain(PageType.Home)
         })
})
