import { describe, it, expect } from 'vitest'
import { pickVisibleLabels, LabelBox } from './globe-utils'

const box = (id: string, left: number, top: number, width = 50, height = 16): LabelBox => ({
  id,
  left,
  top,
  right: left + width,
  bottom: top + height,
})

describe('pickVisibleLabels', () => {
  it('keeps every label when none overlap', () => {
    const visible = pickVisibleLabels([box('a', 0, 0), box('b', 100, 0), box('c', 0, 100)])
    expect([...visible].sort()).toEqual(['a', 'b', 'c'])
  })

  it('drops a later label that overlaps an earlier one', () => {
    const visible = pickVisibleLabels([box('london', 0, 0), box('oxford', 20, 5)])
    expect([...visible]).toEqual(['london'])
  })

  it('keeps a priority label even when it comes later, dropping the one it overlaps', () => {
    const visible = pickVisibleLabels([box('london', 0, 0), box('oxford', 20, 5)], ['oxford'])
    expect([...visible]).toEqual(['oxford'])
  })

  it('treats labels closer than the padding as overlapping', () => {
    const visible = pickVisibleLabels([box('a', 0, 0), box('b', 52, 0)], [], 4)
    expect([...visible]).toEqual(['a'])
  })

  it('lets a dropped label stop blocking others', () => {
    // b overlaps a and c; a and c do not overlap each other.
    const visible = pickVisibleLabels([box('a', 0, 0), box('b', 40, 0), box('c', 80, 0)])
    expect([...visible].sort()).toEqual(['a', 'c'])
  })

  it('drops a label that covers the dot of a city ranked before it', () => {
    const labels = [box('a', 0, 0), box('b', 100, 0)]
    const dots = [box('a', 110, 2, 10, 10), box('b', 90, 2, 10, 10)]
    expect([...pickVisibleLabels(labels, [], 2, dots)]).toEqual(['a'])
  })

  it('keeps a label that covers only the dots of cities ranked after it', () => {
    const labels = [box('a', 0, 0), box('b', 100, 0)]
    const dots = [box('a', -10, 2, 10, 10), box('b', 30, 2, 10, 10)]
    expect([...pickVisibleLabels(labels, [], 2, dots)].sort()).toEqual(['a', 'b'])
  })

  it('ranks priority labels first, so their dots block everyone else', () => {
    const labels = [box('a', 0, 0), box('b', 100, 0)]
    const dots = [box('a', -10, 2, 10, 10), box('b', 30, 2, 10, 10)]
    expect([...pickVisibleLabels(labels, ['b'], 2, dots)]).toEqual(['b'])
  })
})
