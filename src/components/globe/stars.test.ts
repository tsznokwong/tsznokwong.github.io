import { describe, it, expect } from 'vitest'
import { generateStars, MILKY_WAY_NORMAL } from './stars'

const options = { count: 4000, radius: 1000, seed: 7 }

describe('generateStars', () => {
  it('returns one position, size, colour and phase per star', () => {
    const stars = generateStars(options)
    expect(stars.positions).toHaveLength(4000 * 3)
    expect(stars.colors).toHaveLength(4000 * 3)
    expect(stars.sizes).toHaveLength(4000)
    expect(stars.phases).toHaveLength(4000)
  })

  it('is deterministic for a seed and differs between seeds', () => {
    expect(generateStars(options).positions).toEqual(generateStars(options).positions)
    expect(generateStars({ ...options, seed: 8 }).positions).not.toEqual(
      generateStars(options).positions,
    )
  })

  it('places every star on the sky sphere', () => {
    const { positions } = generateStars(options)
    for (let i = 0; i < positions.length; i += 3) {
      const r = Math.hypot(positions[i], positions[i + 1], positions[i + 2])
      expect(r).toBeCloseTo(1000, 1)
    }
  })

  it('makes most stars faint and a few bright', () => {
    const sizes = Array.from(generateStars(options).sizes)
    const min = Math.min(...sizes)
    const max = Math.max(...sizes)
    const bright = sizes.filter((s) => s > min + (max - min) / 2).length
    expect(min).toBeGreaterThan(0)
    expect(bright / sizes.length).toBeLessThan(0.15)
  })

  it('keeps colours in range', () => {
    for (const c of generateStars(options).colors) {
      expect(c).toBeGreaterThanOrEqual(0)
      expect(c).toBeLessThanOrEqual(1)
    }
  })

  it('concentrates stars in a Milky Way band', () => {
    const { positions } = generateStars(options)
    const [nx, ny, nz] = MILKY_WAY_NORMAL
    let inBand = 0
    for (let i = 0; i < positions.length; i += 3) {
      const sinLat = (positions[i] * nx + positions[i + 1] * ny + positions[i + 2] * nz) / 1000
      if (Math.abs(sinLat) < Math.sin((15 * Math.PI) / 180)) inBand++
    }
    // A uniform sky puts ~26% of stars within 15° of any great circle.
    expect(inBand / 4000).toBeGreaterThan(0.4)
  })
})
