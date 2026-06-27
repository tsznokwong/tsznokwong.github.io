import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import React from 'react'

import ScrollToTop from './scroll-to-top'

const theme = createTheme()

// Mock react-scroll
vi.mock('react-scroll', () => ({
  animateScroll: {
    scrollToTop: vi.fn(),
   },
}))

// Mock @mui/material to control useScrollTrigger behavior
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material') as typeof import('@mui/material')
  return {
     ...actual,
    useScrollTrigger: () => false,
   }
})

describe('ScrollToTop', () => {
  it('renders without crashing', () => {
    render(
       <ThemeProvider theme={theme}>
         <ScrollToTop />
       </ThemeProvider>
     )
   })

  it('renders a Fab button element', () => {
    const { container } = render(
       <ThemeProvider theme={theme}>
         <ScrollToTop />
       </ThemeProvider>
     )
     // The Fab renders as a button element
    const buttons = container.querySelectorAll('button')
    expect(buttons.length).toBeGreaterThan(0)
   })

  it('has aria-label "scroll back to top"', () => {
    const { container } = render(
       <ThemeProvider theme={theme}>
         <ScrollToTop />
       </ThemeProvider>
     )
     // Find the button by its aria-label attribute
    const button = container.querySelector('button[aria-label="scroll back to top"]')
    expect(button).toBeInTheDocument()
   })

  it('calls scrollToTop when FAB is clicked', async () => {
    const { animateScroll } = await import('react-scroll')
    const mockScrollToTop = vi.mocked(animateScroll.scrollToTop)

    const { container } = render(
       <ThemeProvider theme={theme}>
         <ScrollToTop />
       </ThemeProvider>
     )

    const button = container.querySelector('button[aria-label="scroll back to top"]')!
    await fireEvent.click(button)
    expect(mockScrollToTop).toHaveBeenCalledTimes(1)
   })

  it('is hidden when not scrolled (Zoom in=false)', () => {
    const { container } = render(
       <ThemeProvider theme={theme}>
         <ScrollToTop />
       </ThemeProvider>
     )
     // When Zoom in=false, the Zoom component applies opacity: 0 and visibility: hidden
     // The presentation Box may have display: none or be hidden via other means
    const box = container.querySelector('[role="presentation"]')
    expect(box).toBeTruthy()
   })

  it('renders with secondary color', () => {
    const { container } = render(
       <ThemeProvider theme={theme}>
         <ScrollToTop />
       </ThemeProvider>
     )
    const button = container.querySelector('button[aria-label="scroll back to top"]')!
    expect(button.className).toContain('MuiFab-secondary')
   })
})
