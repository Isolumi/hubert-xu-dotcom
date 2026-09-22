import { stepLife } from '../gameOfLife'

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
})
