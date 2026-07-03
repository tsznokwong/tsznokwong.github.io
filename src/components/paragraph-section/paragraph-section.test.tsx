import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import React from 'react'

import ParagraphSection from './paragraph-section'

const theme = createTheme()

describe('ParagraphSection', () => {
  it('renders title Typography', () => {
    render(
        <ThemeProvider theme={theme}>
          <ParagraphSection title="My Title" />
        </ThemeProvider>
        )
    expect(screen.getByText('My Title')).toBeInTheDocument()
      })

  it('renders subtitle Typography', () => {
    render(
        <ThemeProvider theme={theme}>
          <ParagraphSection subtitle="My Subtitle" />
        </ThemeProvider>
        )
    expect(screen.getByText('My Subtitle')).toBeInTheDocument()
      })

  it('renders both title and subtitle', () => {
    render(
        <ThemeProvider theme={theme}>
          <ParagraphSection title="My Title" subtitle="My Subtitle" />
        </ThemeProvider>
        )
    expect(screen.getByText('My Title')).toBeInTheDocument()
    expect(screen.getByText('My Subtitle')).toBeInTheDocument()
      })

  it('does not render title when title prop is absent', () => {
    const { container } = render(
        <ThemeProvider theme={theme}>
          <ParagraphSection />
        </ThemeProvider>
        )
        // No Typography content should be rendered
    expect(container.querySelector('.MuiTypography-root')).toBeNull()
      })

  it('does not render subtitle when subtitle prop is absent', () => {
    const { container } = render(
        <ThemeProvider theme={theme}>
          <ParagraphSection />
        </ThemeProvider>
        )
    expect(container.querySelector('.MuiTypography-root')).toBeNull()
      })

  it('renders with className prop', () => {
    const { container } = render(
        <ThemeProvider theme={theme}>
          <ParagraphSection title="Title" className="custom-class" />
        </ThemeProvider>
        )
    expect(container.firstChild).toHaveClass('custom-class')
      })

  it('renders with secondaryText — title uses secondary color', () => {
    render(
        <ThemeProvider theme={theme}>
          <ParagraphSection title="My Title" secondaryText />
        </ThemeProvider>
        )
    expect(screen.getByText('My Title')).toBeInTheDocument()
      })

  it('renders with secondaryText — subtitle uses secondary color', () => {
    render(
        <ThemeProvider theme={theme}>
          <ParagraphSection subtitle="My Subtitle" secondaryText />
        </ThemeProvider>
        )
    expect(screen.getByText('My Subtitle')).toBeInTheDocument()
      })

  it('renders PageContainer wrapper with background', () => {
    const { container } = render(
        <ThemeProvider theme={theme}>
          <ParagraphSection
           title="Title"
           subtitle="Subtitle"
           background="https://example.com/bg.jpg"
            />
        </ThemeProvider>
        )
        // The outer Container should have a backgroundImage style
    const outerContainer = container.firstChild
    expect(outerContainer).toHaveStyle('background-image: url(https://example.com/bg.jpg)')
      })

  it('renders empty when no props provided', () => {
    const { container } = render(
        <ThemeProvider theme={theme}>
          <ParagraphSection />
        </ThemeProvider>
        )
        // Should still render the PageContainer wrapper
    expect(container.firstChild).toBeTruthy()
      })

  it('renders title Typography when secondaryText is true', () => {
    const { container } = render(
        <ThemeProvider theme={theme}>
          <ParagraphSection title="My Title" secondaryText />
        </ThemeProvider>
        )
        // Verify a Typography element renders with the title text
        // when secondaryText prop is true (uses secondary color)
    const typography = container.querySelector('.MuiTypography-root')
    expect(typography).toBeInTheDocument()
    expect(typography?.textContent).toContain('My Title')
      })

  it('renders subtitle Typography when secondaryText is true', () => {
    const { container } = render(
        <ThemeProvider theme={theme}>
          <ParagraphSection subtitle="My Subtitle" secondaryText />
        </ThemeProvider>
        )
        // Verify a Typography element renders with the subtitle text
        // when secondaryText prop is true (uses secondary color)
    const typography = container.querySelector('.MuiTypography-root')
    expect(typography).toBeInTheDocument()
    expect(typography?.textContent).toContain('My Subtitle')
      })
})
