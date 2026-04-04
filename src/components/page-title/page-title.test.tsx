import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material'
import PageTitle from './page-title'
import { PageContext } from '../../containers/app/app-hooks'
import PageType from '../../types/page-type'

vi.mock('react-globe.gl', () => ({
  default: () => null
}))

const theme = createTheme()

const renderWithTitle = (initialEntries: string[] = ['/']) => {
  return render(
      <PageContext.Provider value={{
        pages: [PageType.Home, PageType.Experience, PageType.Travel],
        currentPage: PageType.Home,
        onPageChange: () => {},
        title: 'Joshua',
      }}>
        <MemoryRouter initialEntries={initialEntries}>
          <ThemeProvider theme={theme}>
            <PageTitle />
          </ThemeProvider>
        </MemoryRouter>
      </PageContext.Provider>
  )
}

describe('PageTitle', () => {
  it('renders main title Joshua', () => {
    renderWithTitle()
    expect(screen.getByText(/Joshua/i)).toBeInTheDocument()
  })

  it('renders subtitle on journey page', () => {
    renderWithTitle(['/journey'])
    expect(document.querySelector('h5')).not.toBeNull()
  })

  it('does not render subtitle on home page', () => {
    renderWithTitle()
    expect(screen.queryByText(/Journey/i)).not.toBeInTheDocument()
  })
})
