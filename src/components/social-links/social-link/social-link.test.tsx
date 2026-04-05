import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import SocialLink from './social-link'
import SocialLinkType from '../../../types/social-link-type'

const theme = createTheme()

describe('SocialLink', () => {
  it('renders LinkedIn link with correct title', () => {
    render(
       <ThemeProvider theme={theme}>
          <SocialLink socialLink={SocialLinkType.LinkedIn} />
        </ThemeProvider>
        )
    const link = screen.getByRole('link', { name: /LinkedIn/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/joshua-wong-8b5101171/')
        })

  it('renders GitHub link with correct title', () => {
    render(
       <ThemeProvider theme={theme}>
          <SocialLink socialLink={SocialLinkType.GitHub} />
        </ThemeProvider>
        )
    const link = screen.getByRole('link', { name: /GitHub/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://github.com/tsznokwong')
        })

  it('opens link in new tab', () => {
    render(
       <ThemeProvider theme={theme}>
          <SocialLink socialLink={SocialLinkType.LinkedIn} />
        </ThemeProvider>
        )
    const link = screen.getByRole('link', { name: /LinkedIn/i }) as HTMLAnchorElement
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
        })
})
