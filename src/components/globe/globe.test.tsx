import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ShaderMaterial } from 'three'
import GlobeComponent from './globe'
import { LocationData, GlobeConfig } from '../../types/location-type'

// Stand-in for react-globe.gl. Like three-globe, it rebuilds every HTML
// element whenever the htmlElement accessor or the data array changes.
const fake = vi.hoisted(() => ({
  scene: { add: vi.fn(), remove: vi.fn() },
  pointOfView: vi.fn(),
  pixelRatio: 2,
  htmlElementProps: [] as unknown[],
  lastProps: {} as Record<string, any>,
}))

vi.mock('react-globe.gl', () => ({
  default: forwardRef((props: Record<string, any>, ref) => {
    fake.lastProps = props
    fake.htmlElementProps.push(props.htmlElement)
    const container = useRef<HTMLDivElement>(null)
    useImperativeHandle(ref, () => ({
      scene: () => fake.scene,
      pointOfView: fake.pointOfView,
      renderer: () => ({ getPixelRatio: () => fake.pixelRatio }),
    }))
    const elements = useMemo(
      () => (props.htmlElementsData as object[]).map((d) => props.htmlElement(d) as HTMLElement),
      [props.htmlElementsData, props.htmlElement],
    )
    useEffect(() => {
      container.current?.replaceChildren(...elements)
    }, [elements])
    return <div ref={container} data-testid="fake-globe" />
  }),
}))

const locations: LocationData[] = [
  { id: 'london', city_name: 'London', description: '', color: '#ff0000', lat: 51.5, lng: -0.1 },
  { id: 'paris', city_name: 'Paris', description: '', color: '#0000ff', lat: 48.9, lng: 2.35 },
]

const config: GlobeConfig = {
  atmosphere_altitude: 0.12,
  initial_point_of_view: { lat: 51.5, lng: -0.1, altitude: 1.5 },
  animation_duration: 0,
}

const renderGlobe = (selectedLocationId: string | null = null, onLocationSelect = vi.fn()) =>
  render(
    <GlobeComponent
      locations={locations}
      selectedLocationId={selectedLocationId}
      onLocationSelect={onLocationSelect}
      config={config}
    />,
  )

describe('GlobeComponent', () => {
  beforeEach(() => {
    fake.scene.add.mockClear()
    fake.pointOfView.mockClear()
    fake.htmlElementProps = []
    fake.pixelRatio = 2
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders each city as a keyboard-focusable button', () => {
    renderGlobe()
    const london = screen.getByRole('button', { name: 'London' })
    expect(london.tabIndex).toBe(0)
    expect(screen.getByRole('button', { name: 'Paris' })).toBeTruthy()
  })

  it('selects a city and flies to it on click', () => {
    const onSelect = vi.fn()
    renderGlobe(null, onSelect)
    fireEvent.click(screen.getByRole('button', { name: 'Paris' }))
    expect(onSelect).toHaveBeenCalledWith('paris')
    expect(fake.pointOfView).toHaveBeenLastCalledWith(
      expect.objectContaining({ lat: 48.9, lng: 2.35 }),
      expect.any(Number),
    )
  })

  it.each(['Enter', ' '])('selects a city with the %j key', (key) => {
    const onSelect = vi.fn()
    renderGlobe(null, onSelect)
    fireEvent.keyDown(screen.getByRole('button', { name: 'London' }), { key })
    expect(onSelect).toHaveBeenCalledWith('london')
  })

  it('marks the selected city without rebuilding the markers', () => {
    const { rerender } = renderGlobe(null)
    const london = screen.getByRole('button', { name: 'London' })
    const accessor = fake.htmlElementProps[fake.htmlElementProps.length - 1]

    rerender(
      <GlobeComponent
        locations={locations}
        selectedLocationId="london"
        onLocationSelect={vi.fn()}
        config={config}
      />,
    )

    expect(fake.htmlElementProps[fake.htmlElementProps.length - 1]).toBe(accessor)
    expect(screen.getByRole('button', { name: 'London' })).toBe(london)
    expect(london.classList.contains('globe-marker--selected')).toBe(true)
    expect(london.getAttribute('aria-pressed')).toBe('true')
    expect(
      screen.getByRole('button', { name: 'Paris' }).classList.contains('globe-marker--selected'),
    ).toBe(false)
  })

  it("adds a starfield sized to the renderer's pixel ratio and removes it on unmount", () => {
    vi.spyOn(window, 'devicePixelRatio', 'get').mockReturnValue(3)
    fake.pixelRatio = 2
    const { unmount } = renderGlobe()

    const stars = fake.scene.add.mock.calls[fake.scene.add.mock.calls.length - 1]?.[0]
    expect((stars.material as ShaderMaterial).uniforms.pixelRatio.value).toBe(2)

    const dispose = vi.spyOn(stars.geometry, 'dispose')
    unmount()
    expect(dispose).toHaveBeenCalled()
  })

  it('removes its resize listener on unmount', () => {
    const remove = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderGlobe()
    unmount()
    expect(remove).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('skips label layout while labels are hidden', () => {
    const queued: FrameRequestCallback[] = []
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      queued.push(cb)
      return queued.length
    })
    const flushFrames = () => {
      while (queued.length) queued.shift()!(0)
    }
    renderGlobe()
    act(flushFrames)
    raf.mockClear()
    act(() => fake.lastProps.onZoom({ lat: 0, lng: 0, altitude: 2.5 }))
    expect(raf).not.toHaveBeenCalled()
    act(() => fake.lastProps.onZoom({ lat: 0, lng: 0, altitude: 0.8 }))
    expect(raf).toHaveBeenCalled()
  })

  it('does not leave stray spaces in the root class name', () => {
    const { container } = renderGlobe()
    const root = container.firstElementChild as HTMLElement
    expect(root.className).toBe(root.className.trim().replace(/\s+/g, ' '))
  })
})
