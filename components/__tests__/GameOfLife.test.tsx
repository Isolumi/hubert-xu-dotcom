import { act, render } from '@testing-library/react'
import GameOfLife from '../GameOfLife'

describe('GameOfLife display settings', () => {
  const context = {
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    setTransform: jest.fn(),
    fillStyle: '',
  }

  beforeEach(() => {
    jest.useFakeTimers()
    jest.spyOn(Math, 'random').mockReturnValue(0.9)
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(context as unknown as CanvasRenderingContext2D)
    jest.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({
      x: 0, y: 0, left: 0, top: 0, right: 120, bottom: 120,
      width: 120, height: 120, toJSON: () => ({}),
    })
    context.clearRect.mockClear()
    context.fillRect.mockClear()
    context.setTransform.mockClear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  it('changes step speed without replacing the current pattern', () => {
    const { rerender } = render(
      <GameOfLife cellSize={12} stepDelay={520} glowStrength={1} refresh={0} />,
    )
    const seededCells = (Math.random as jest.Mock).mock.calls.length

    rerender(<GameOfLife cellSize={12} stepDelay={240} glowStrength={1} refresh={0} />)
    expect((Math.random as jest.Mock).mock.calls.length).toBe(seededCells)

    const paints = context.clearRect.mock.calls.length
    act(() => { jest.advanceTimersByTime(239) })
    expect(context.clearRect).toHaveBeenCalledTimes(paints)
    act(() => { jest.advanceTimersByTime(1) })
    expect(context.clearRect).toHaveBeenCalledTimes(paints + 1)
  })

  it('starts a new pattern when cell size changes or a new pattern is requested', () => {
    const { rerender } = render(
      <GameOfLife cellSize={12} stepDelay={520} glowStrength={1} refresh={0} />,
    )
    const initialSeeds = (Math.random as jest.Mock).mock.calls.length

    rerender(<GameOfLife cellSize={18} stepDelay={520} glowStrength={1} refresh={0} />)
    const sizeSeeds = (Math.random as jest.Mock).mock.calls.length
    expect(sizeSeeds).toBeGreaterThan(initialSeeds)

    rerender(<GameOfLife cellSize={18} stepDelay={520} glowStrength={1} refresh={1} />)
    expect((Math.random as jest.Mock).mock.calls.length).toBeGreaterThan(sizeSeeds)
  })
})
