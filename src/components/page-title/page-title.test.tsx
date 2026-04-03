import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material'
import PageTitle from './page-title'

vi.mock('react-globe.gl', () => ({
  default: () => null
}))

const theme = createTheme()

const renderWithTitle = () => {
  return render(
     <MemoryRouter>
        <ThemeProvider theme={theme}>
          <PageTitle />
        </ThemeProvider>
      </MemoryRouter>
        )
}

describe('PageTitle', () => {
  it('renders main title Joshua', () => {
    renderWithTitle()
    expect(screen.getByText(/Joshua/i)).toBeInTheDocument()
            })

  it('renders h5 element when not on home page', () => {
    render(
       <MemoryRouter initialEntries={['/journey']}>
            <ThemeProvider theme={theme}>
              <PageTitle />
            </ThemeProvider>
          </MemoryRouter>
            )
    const h5 = document.querySelector('h5')
    expect(h5).not.toBeNull()
            })

  it('does not render subtitle on home page', () => {
    renderWithTitle()
    expect(screen.queryByRole('heading', { level: 5 })).not.toBeInTheDocument()
            })
})
