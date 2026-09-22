'use client'

import { useEffect, useRef } from 'react'
import {
  BASE_GAZE,
  EYE_SCALE,
  LEFT_EYE_VERTICES,
  RIGHT_EYE_VERTICES,
  SURFACE_LIMIT,
  projectEyePath,
  scalePolygon,
  toPathData,
  type Point2D,
} from '@/lib/orbEyes'

const BODY_PATH = 'M228.541 114.228C228.541 130.133 225.184 145.994 218.738 160.534C212.674 174.217 203.904 186.669 193.065 196.988C155.933 232.34 99.497 238.596 55.5255 212.24C45.097 205.99 35.6851 198.072 27.7451 188.866C19.1926 178.953 12.3686 167.569 7.65781 155.351C2.60712 142.264 0 128.257 0 114.228C0 98.3219 3.35751 82.4611 9.80315 67.9215C15.8672 54.2382 24.6377 41.7862 35.4767 31.4668C72.6081 -3.88483 129.044 -10.1413 173.016 16.2153C183.444 22.4653 192.856 30.3829 200.796 39.5896C209.349 49.5018 216.173 60.8859 220.883 73.1037C225.934 86.1906 228.541 100.198 228.541 114.228Z'

const LEFT_EYE = scalePolygon(LEFT_EYE_VERTICES, EYE_SCALE)
const RIGHT_EYE = scalePolygon(RIGHT_EYE_VERTICES, EYE_SCALE)

function eyePath(points: Point2D[], target: Point2D) {
  return toPathData(projectEyePath(points, target))
}

const INITIAL_LEFT_PATH = eyePath(LEFT_EYE, BASE_GAZE)
const INITIAL_RIGHT_PATH = eyePath(RIGHT_EYE, BASE_GAZE)

export default function OrbCharacter() {
  const svgRef = useRef<SVGSVGElement>(null)
  const leftEyeRef = useRef<SVGPathElement>(null)
  const rightEyeRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    const leftEye = leftEyeRef.current
    const rightEye = rightEyeRef.current
    if (!svg || !leftEye || !rightEye) return

    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    let reducedMotion = motionQuery?.matches ?? false
    let current = { ...BASE_GAZE }
    let goal = { ...BASE_GAZE }
    const velocity = { x: 0, y: 0 }
    let animationFrame = 0
    let blinkTimer = 0
    let blinkEndTimer = 0

    const renderEyes = () => {
      leftEye.setAttribute('d', eyePath(LEFT_EYE, current))
      rightEye.setAttribute('d', eyePath(RIGHT_EYE, current))
    }

    const draw = () => {
      for (const key of ['x', 'y'] as const) {
        velocity[key] += (goal[key] - current[key]) * 0.11
        velocity[key] *= 0.7
        current[key] += velocity[key]
      }
      renderEyes()
      animationFrame = window.requestAnimationFrame(draw)
    }

    const pointAt = (event: PointerEvent) => {
      const rect = svg.getBoundingClientRect()
      let x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.55)
      let y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.55)
      const distance = Math.hypot(x, y)
      if (distance > 1) {
        x /= distance
        y /= distance
      }
      goal = { x: x * SURFACE_LIMIT, y: y * SURFACE_LIMIT }

      if (reducedMotion) {
        current = { ...goal }
        renderEyes()
      }
    }

    const reset = () => {
      goal = { ...BASE_GAZE }
      if (reducedMotion) {
        current = { ...goal }
        renderEyes()
      }
    }

    const scheduleBlink = () => {
      window.clearTimeout(blinkTimer)
      if (reducedMotion) return
      blinkTimer = window.setTimeout(() => {
        svg.classList.add('is-blinking')
        blinkEndTimer = window.setTimeout(() => svg.classList.remove('is-blinking'), 120)
        scheduleBlink()
      }, 2800 + Math.random() * 3500)
    }

    const updateMotion = () => {
      reducedMotion = motionQuery?.matches ?? false
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(blinkTimer)
      window.clearTimeout(blinkEndTimer)
      svg.classList.remove('is-blinking')

      if (reducedMotion) {
        current = { ...goal }
        renderEyes()
      } else {
        animationFrame = window.requestAnimationFrame(draw)
        scheduleBlink()
      }
    }

    window.addEventListener('pointermove', pointAt, { passive: true })
    document.documentElement.addEventListener('pointerleave', reset)
    window.addEventListener('blur', reset)
    motionQuery?.addEventListener('change', updateMotion)
    updateMotion()

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(blinkTimer)
      window.clearTimeout(blinkEndTimer)
      window.removeEventListener('pointermove', pointAt)
      document.documentElement.removeEventListener('pointerleave', reset)
      window.removeEventListener('blur', reset)
      motionQuery?.removeEventListener('change', updateMotion)
    }
  }, [])

  return (
    <div className="orb-wrap">
      <div className="orb-shadow" />
      <svg
        ref={svgRef}
        className="orb-character"
        viewBox="-15 -15 259 259"
        role="img"
        aria-label="Soft blue orb character looking toward the pointer"
      >
        <path className="orb-body" d={BODY_PATH} />
        <path className="orb-edge" d={BODY_PATH} />
        <g className="orb-eyes">
          <path ref={leftEyeRef} className="orb-eye" d={INITIAL_LEFT_PATH} />
          <path ref={rightEyeRef} className="orb-eye" d={INITIAL_RIGHT_PATH} />
        </g>
      </svg>
    </div>
  )
}
