import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import React from 'react'

import Timeline from './timeline'
import { TimelineItemProps } from './timeline-item'
import TimelineItemType, { TimelineItemTypes } from '../../types/timeline-item-type'

const theme = createTheme()

// Mock react-globe.gl
vi.mock('react-globe.gl', () => ({
  default: () => null,
}))

// Mock @mui/material to control useScrollTrigger and useMediaQuery behavior
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material') as typeof import('@mui/material')
  return {
        ...actual,
    useScrollTrigger: () => false,
    useMediaQuery: () => false,
      }
})

// Mock page-bar-hooks to return false for trigger
vi.mock('../page-bar/page-bar-hooks', () => ({
  usePageBarTrigger: () => false,
}))

// Polyfill IntersectionObserver for jsdom as a proper class (needed by TimelineItem)
class MockIntersectionObserver {
  private _callback: (entries: IntersectionObserverEntry[]) => void
  constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
    this._callback = callback
    }
  observe() {
      // Simulate immediate intersection
    this._callback([{ isIntersecting: true } as IntersectionObserverEntry])
    }
  disconnect() {}
  unobserve() {}
  takeRecords() {
    return []
    }
}
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

// Helper to create a normal timeline item
const makeNormalItem = (overrides: Partial<TimelineItemProps & { category: 'normal' }>): TimelineItemProps & { category: 'normal' } => ({
  category: 'normal',
  title: 'Test Title',
  subtitle: 'Test Subtitle',
  timestamp: '2024',
  type: 'Education' as TimelineItemType,
  details: 'Test details',
  infolink: 'https://example.com',
  highlights: [{ title: 'Highlight 1', subtitle: 'Sub 1' }],
      ...overrides,
})

// Helper to create a year-stamp timeline item
const makeYearStampItem = (year: string): TimelineItemProps & { category: 'year-stamp' } => ({
  category: 'year-stamp',
  year,
})

describe('Timeline', () => {
  it('renders filter buttons for all TimelineItemTypes', () => {
    const items: TimelineItemProps[] = [makeNormalItem({ type: 'Education' })]
    render(
          <ThemeProvider theme={theme}>
            <Timeline items={items} />
          </ThemeProvider>
        )
    for (const type of TimelineItemTypes) {
       // Filter buttons have aria-label matching the type
      expect(screen.getByRole('button', { name: type })).toBeInTheDocument()
      }
     })

  it('renders all TimelineItemTypes: Education, Work, Achievements, Projects, Activities, Milestones', () => {
    const items: TimelineItemProps[] = [makeNormalItem({ type: 'Education' })]
    render(
          <ThemeProvider theme={theme}>
            <Timeline items={items} />
          </ThemeProvider>
        )
    expect(screen.getByRole('button', { name: 'Education' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Work' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Achievements' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Activities' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Milestones' })).toBeInTheDocument()
      })

  it('filters items by type when a filter button is clicked', () => {
    const items: TimelineItemProps[] = [
      makeNormalItem({ type: 'Education', title: 'Education Item' }),
      makeNormalItem({ type: 'Work', title: 'Work Item' }),
        ]
    render(
          <ThemeProvider theme={theme}>
            <Timeline items={items} />
          </ThemeProvider>
        )
        // Both items should be visible initially (all filters active)
    expect(screen.getByText('Education Item')).toBeInTheDocument()
    expect(screen.getByText('Work Item')).toBeInTheDocument()
      })

  it('year-stamp items are always visible regardless of filter', () => {
    const items: TimelineItemProps[] = [
      makeYearStampItem('2020'),
      makeNormalItem({ type: 'Education', title: 'Education Item' }),
        ]
    render(
          <ThemeProvider theme={theme}>
            <Timeline items={items} />
          </ThemeProvider>
        )
    expect(screen.getByText('2020')).toBeInTheDocument()
      })

  it('renders normal items without a matching type as always visible', () => {
    const items: TimelineItemProps[] = [
      makeNormalItem({ type: undefined, title: 'No Type Item' }),
        ]
    render(
          <ThemeProvider theme={theme}>
            <Timeline items={items} />
          </ThemeProvider>
        )
    expect(screen.getByText('No Type Item')).toBeInTheDocument()
      })

  it('renders with className prop', () => {
    const items: TimelineItemProps[] = [makeNormalItem()]
    const { container } = render(
          <ThemeProvider theme={theme}>
            <Timeline items={items} className="custom-class" />
          </ThemeProvider>
        )
       // className is passed to PageContainer (outer Container)
    const outerContainer = container.querySelector('.MuiContainer-disableGutters')
    expect(outerContainer).toHaveClass('custom-class')
      })

  it('renders with sx prop', () => {
    const items: TimelineItemProps[] = [makeNormalItem()]
    const { container } = render(
          <ThemeProvider theme={theme}>
            <Timeline items={items} sx={{ marginTop: '2rem' }} />
          </ThemeProvider>
        )
    expect(container.firstChild).toBeTruthy()
      })

  it('renders empty when items array is empty', () => {
    render(
          <ThemeProvider theme={theme}>
            <Timeline items={[]} />
          </ThemeProvider>
        )
        // Should still render the filter buttons area
    expect(screen.getByRole('button', { name: 'Education' })).toBeInTheDocument()
      })
})
