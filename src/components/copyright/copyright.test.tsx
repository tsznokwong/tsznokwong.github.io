import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Copyright from './copyright'

describe('Copyright', () => {
  it('renders copyright text with current year', () => {
    render(<Copyright />)
    const text = screen.getByText(/WONG Tsz Nok, Joshua/i)
    expect(text).toBeInTheDocument()
    expect(text).toHaveTextContent(new Date().getFullYear().toString())
         })
})
