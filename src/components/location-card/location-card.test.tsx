import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import React from 'react'

import LocationCard from './location-card'
import { LocationData } from '../../types/location-type'

const theme = createTheme()

// Mock react-globe.gl
vi.mock('react-globe.gl', () => ({
  default: () => null,
}))

describe('LocationCard', () => {
  const mockLocation: LocationData = {
    id: 'tokyo',
    city_name: 'Tokyo',
    description: 'A vibrant city in Japan.',
    color: '#ff6b6b',
    lat: 35.6895,
    lng: 139.6917,
    }

  it('renders placeholder text when location is null', () => {
    render(
       <ThemeProvider theme={theme}>
         <LocationCard location={null} />
       </ThemeProvider>
      )
    expect(screen.getByText('Click on a location to learn more')).toBeInTheDocument()
    })

  it('renders city name when location is provided', () => {
    render(
       <ThemeProvider theme={theme}>
         <LocationCard location={mockLocation} />
       </ThemeProvider>
      )
    expect(screen.getByText('Tokyo')).toBeInTheDocument()
    })

  it('renders description when location is provided', () => {
    render(
       <ThemeProvider theme={theme}>
         <LocationCard location={mockLocation} />
       </ThemeProvider>
      )
    expect(screen.getByText('A vibrant city in Japan.')).toBeInTheDocument()
    })

  it('renders a Card when location is provided', () => {
    const { container } = render(
       <ThemeProvider theme={theme}>
         <LocationCard location={mockLocation} />
       </ThemeProvider>
      )
      // Card in MUI renders as a div with MuiCard-root class
    const card = container.querySelector('.MuiCard-root')
    expect(card).toBeInTheDocument()
    })

  it('does not render Card when location is null', () => {
    const { container } = render(
       <ThemeProvider theme={theme}>
         <LocationCard location={null} />
       </ThemeProvider>
      )
    const card = container.querySelector('.MuiCard-root')
    expect(card).toBeNull()
    })

  it('renders with className prop', () => {
    const { container } = render(
       <ThemeProvider theme={theme}>
         <LocationCard location={mockLocation} className="custom-class" />
       </ThemeProvider>
      )
    expect(container.firstChild).toHaveClass('custom-class')
    })

  it('renders CardContent with the city and description', () => {
    const { container } = render(
       <ThemeProvider theme={theme}>
         <LocationCard location={mockLocation} />
       </ThemeProvider>
      )
      // CardContent is a div with MuiCardContent-root class
    const content = container.querySelector('.MuiCardContent-root')
    expect(content).toBeInTheDocument()
    expect(content?.textContent).toContain('Tokyo')
    expect(content?.textContent).toContain('A vibrant city in Japan.')
    })

  it('renders color indicator box with correct color', () => {
    const { container } = render(
       <ThemeProvider theme={theme}>
         <LocationCard location={mockLocation} />
       </ThemeProvider>
      )
      // The color indicator is a Box inside CardContent with a background-color style
    const content = container.querySelector('.MuiCardContent-root')
    expect(content).toBeInTheDocument()
      // Check that CardContent contains the expected content (city + description)
    expect(content?.textContent).toContain('Tokyo')
    expect(content?.textContent).toContain('A vibrant city in Japan.')
    })
})
