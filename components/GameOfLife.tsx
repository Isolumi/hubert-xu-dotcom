'use client'

import { useEffect, useRef } from 'react'
import { getPointerGlow, stepLife, type LifeGrid } from '@/lib/gameOfLife'

const GLOW_RADIUS = 170

type Props = {
  cellSize: number
  stepDelay: number
  glowStrength: number
  refresh: number
}

function createGrid(rows: number, columns: number): LifeGrid {
  return Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => Number(Math.random() > 0.86)),
  )
}

export default function GameOfLife({ cellSize, stepDelay, glowStrength, refresh }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stepDelayRef = useRef(stepDelay)
  const glowStrengthRef = useRef(glowStrength)
  const restartRef = useRef<() => void>(() => {})
  const paintRef = useRef<() => void>(() => {})

  useEffect(() => {
    stepDelayRef.current = stepDelay
    restartRef.current()
  }, [stepDelay])

  useEffect(() => {
    glowStrengthRef.current = glowStrength
    paintRef.current()
  }, [glowStrength])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    let columns = 0
    let rows = 0
    let grid: LifeGrid = []
    let pointer = { x: -999, y: -999 }
    let intervalId: ReturnType<typeof setInterval> | undefined

    const paint = () => {
      context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < columns; x += 1) {
          if (grid[y][x] !== 1) continue
          const cellX = x * cellSize
          const cellY = y * cellSize
          const distance = Math.hypot(pointer.x - cellX, pointer.y - cellY)
          const glow = getPointerGlow(distance, GLOW_RADIUS)
          const red = Math.round(205 - 70 * glow)
          const green = Math.round(218 - 33 * glow)
          const blue = Math.round(210 + 45 * glow)
          const alpha = Math.min(1, 0.1 + 0.4 * glow * glowStrengthRef.current)
          context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`
          context.fillRect(cellX + 1, cellY + 1, cellSize - 2, cellSize - 2)
        }
      }
    }

    const resize = () => {
      const density = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(rect.width * density))
      canvas.height = Math.max(1, Math.floor(rect.height * density))
      context.setTransform(density, 0, 0, density, 0, 0)
      columns = Math.ceil(rect.width / cellSize)
      rows = Math.ceil(rect.height / cellSize)
      grid = createGrid(rows, columns)
      paint()
    }

    const updatePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top }
      paint()
    }

    const stop = () => {
      if (intervalId) clearInterval(intervalId)
      intervalId = undefined
    }

    const start = () => {
      stop()
      if (motionQuery?.matches) return
      intervalId = setInterval(() => {
        grid = stepLife(grid)
        paint()
      }, stepDelayRef.current)
    }

    const updateMotion = () => start()

    paintRef.current = paint
    restartRef.current = start

    resize()
    start()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', updatePointer, { passive: true })
    motionQuery?.addEventListener('change', updateMotion)

    return () => {
      stop()
      paintRef.current = () => {}
      restartRef.current = () => {}
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', updatePointer)
      motionQuery?.removeEventListener('change', updateMotion)
    }
  }, [cellSize, refresh])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
    />
  )
}
