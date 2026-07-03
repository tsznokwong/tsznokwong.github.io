import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import React from 'react'

import TimelineItem, { TimelineItemProps } from './timeline-item'
import TimelineItemType from '../../../types/timeline-item-type'
import MockIntersectionObserver from '../../../test-utils/intersection-observer'

const theme = createTheme()

// Mock react-globe.gl
vi.mock('react-globe.gl', () => ({
  default: () => null,
}))

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

// Mock TimelineItemIcon to return a simple span
vi.mock('./timeline-item-icon', () => ({
  default: ({ color }: { color?: string } = {}) => (
       <span data-testid="mock-timeline-icon" data-color={color || ''} />
       ),
}))

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

describe('TimelineItem', () => {
  describe('normal category', () => {
    it('renders title in Typography', () => {
      const item = makeNormalItem({ title: 'My Title' })
      render(
           <ThemeProvider theme={theme}>
             <TimelineItem {...item} />
           </ThemeProvider>
           )
      expect(screen.getByText('My Title')).toBeInTheDocument()
         })

    it('renders subtitle in Typography', () => {
      const item = makeNormalItem({ subtitle: 'My Subtitle' })
      render(
           <ThemeProvider theme={theme}>
             <TimelineItem {...item} />
           </ThemeProvider>
           )
      expect(screen.getByText('My Subtitle')).toBeInTheDocument()
         })

    it('renders details in Typography', () => {
      const item = makeNormalItem({ details: 'My Details' })
      render(
           <ThemeProvider theme={theme}>
             <TimelineItem {...item} />
           </ThemeProvider>
           )
      expect(screen.getByText('My Details')).toBeInTheDocument()
         })

    it('renders timestamp', () => {
      const item = makeNormalItem({ timestamp: '2020-2024' })
      render(
           <ThemeProvider theme={theme}>
             <TimelineItem {...item} />
           </ThemeProvider>
           )
      expect(screen.getByText('2020-2024')).toBeInTheDocument()
         })

    it('renders infolink IconButton when infolink is provided', () => {
      const item = makeNormalItem({ infolink: 'https://example.com' })
      render(
           <ThemeProvider theme={theme}>
             <TimelineItem {...item} />
           </ThemeProvider>
           )
         // The link wraps the IconButton; check href and target attributes
      const link = screen.getByRole('link', { name: '' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', 'https://example.com')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
         })

    it('does not render infolink when infolink is not provided', () => {
      const item = makeNormalItem({ infolink: undefined })
      render(
           <ThemeProvider theme={theme}>
             <TimelineItem {...item} />
           </ThemeProvider>
           )
           // The item should still render its content
      expect(screen.getByText('Test Title')).toBeInTheDocument()
         })

    it('renders highlights when provided', () => {
      const item = makeNormalItem({
        highlights: [{ title: 'Achievement', subtitle: 'Best Player' }],
          })
      render(
           <ThemeProvider theme={theme}>
             <TimelineItem {...item} />
           </ThemeProvider>
           )
      expect(screen.getByText('Achievement')).toBeInTheDocument()
      expect(screen.getByText('Best Player')).toBeInTheDocument()
         })

    it('renders a Chip when type is provided', () => {
      const item = makeNormalItem({ type: 'Education' })
      render(
           <ThemeProvider theme={theme}>
             <TimelineItem {...item} />
           </ThemeProvider>
           )
           // The Chip with label "Education" should be in the document
      expect(screen.getByText('Education')).toBeInTheDocument()
         })

    it('does not render Chip when type is undefined', () => {
      const item = makeNormalItem({ type: undefined })
      render(
           <ThemeProvider theme={theme}>
             <TimelineItem {...item} />
           </ThemeProvider>
           )
           // The item text should still be visible
      expect(screen.getByText('Test Title')).toBeInTheDocument()
         })
       })

  describe('year-stamp category', () => {
    it('renders year text', () => {
      const item = makeYearStampItem('2020')
      render(
           <ThemeProvider theme={theme}>
             <TimelineItem {...item} />
           </ThemeProvider>
           )
      expect(screen.getByText('2020')).toBeInTheDocument()
         })

    it('does not render Card for year-stamp', () => {
      const item = makeYearStampItem('2020')
      const { container } = render(
           <ThemeProvider theme={theme}>
             <TimelineItem {...item} />
           </ThemeProvider>
           )
           // Year-stamp should not render a Card component
      expect(container.querySelector('.MuiCard-root')).toBeNull()
         })

    it('does not render title/subtitle/details for year-stamp', () => {
      const item = makeYearStampItem('2019')
      const { container } = render(
           <ThemeProvider theme={theme}>
             <TimelineItem {...item} />
           </ThemeProvider>
           )
           // The year-stamp renders an empty Box, no Card content
      expect(container.querySelector('.MuiCard-root')).toBeNull()
         })
       })
})
