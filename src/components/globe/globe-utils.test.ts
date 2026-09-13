import { describe, it, expect } from 'vitest'
import { toGlobeLabelText } from './globe-utils'

describe('toGlobeLabelText', () => {
  it('leaves plain ASCII names unchanged', () => {
    expect(toGlobeLabelText('New York')).toBe('New York')
  })

  it('strips diacritics the globe label font cannot render', () => {
    expect(toGlobeLabelText('Malmö')).toBe('Malmo')
    expect(toGlobeLabelText('Zürich')).toBe('Zurich')
    expect(toGlobeLabelText('São Paulo')).toBe('Sao Paulo')
  })
})
