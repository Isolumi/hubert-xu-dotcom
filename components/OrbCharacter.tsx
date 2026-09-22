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
import { ORB_BODY_PATH, ORB_VIEW_BOX } from '@/lib/orbArt'

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
        viewBox={ORB_VIEW_BOX}
        role="img"
        aria-label="Soft blue orb character looking toward the pointer"
      >
        <path className="orb-body" d={ORB_BODY_PATH} />
        <path className="orb-edge" d={ORB_BODY_PATH} />
        <g className="orb-eyes">
          <path ref={leftEyeRef} className="orb-eye" d={INITIAL_LEFT_PATH} />
          <path ref={rightEyeRef} className="orb-eye" d={INITIAL_RIGHT_PATH} />
        </g>
      </svg>
    </div>
  )
}
