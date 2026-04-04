import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { usePage, PageContext, DefaultPageContext } from './app-hooks'
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

  it('returns journey page when on /journey route', () => {
    const { result } = renderHook(() => usePage(), {
      wrapper: ({ children }) => <MemoryRouter initialEntries={['/journey']}>{children}</MemoryRouter>
         })
    expect(result.current.currentPage).toBe(PageType.Experience)
             })

  it('returns travel page when on /travel route', () => {
    const { result } = renderHook(() => usePage(), {
      wrapper: ({ children }) => <MemoryRouter initialEntries={['/travel']}>{children}</MemoryRouter>
         })
    expect(result.current.currentPage).toBe(PageType.Travel)
             })

  it('calls onPageChange when navigating', () => {
    const { result } = renderHook(() => usePage(), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>
         })
    const spy = vi.fn()
    result.current.onPageChange(PageType.Experience)
    expect(spy).not.toHaveBeenCalled()
    })
})
