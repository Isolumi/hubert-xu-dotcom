import { getPointerGlow, stepLife } from '../gameOfLife'

describe('stepLife', () => {
  it('turns a horizontal blinker into a vertical blinker', () => {
    expect(stepLife([
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ])).toEqual([
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ])
  })

  it('does not mutate the current generation', () => {
    const current = [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ]
    const copy = current.map(row => [...row])

    stepLife(current)

    expect(current).toEqual(copy)
  })

  it('fades the pointer glow smoothly instead of using a hard edge', () => {
    expect(getPointerGlow(0, 140)).toBe(1)
    expect(getPointerGlow(70, 140)).toBeGreaterThan(getPointerGlow(125, 140))
    expect(getPointerGlow(125, 140)).toBeGreaterThan(0)
    expect(getPointerGlow(140, 140)).toBe(0)
  })
})
