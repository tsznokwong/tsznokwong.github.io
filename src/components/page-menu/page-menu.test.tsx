import React from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { MemoryRouter } from 'react-router-dom'
import PageMenu from './page-menu'
import { PageContext, DefaultPageContext } from '../../containers/app/app-hooks'

const theme = createTheme()

const renderPageMenu = () =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <PageContext.Provider value={DefaultPageContext}>
          <PageMenu />
        </PageContext.Provider>
      </MemoryRouter>
    </ThemeProvider>
  )

describe('PageMenu', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a routed tab for every page with the correct href', () => {
    renderPageMenu()
    DefaultPageContext.pages.forEach((page) => {
      const tab = screen.getByRole('tab', { name: page.title })
      expect(tab).toHaveAttribute('href', page.path)
    })
  })

  it('renders without logging any console errors', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    renderPageMenu()
    expect(consoleError).not.toHaveBeenCalled()
  })
})
