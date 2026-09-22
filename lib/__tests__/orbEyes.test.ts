import {
  BASE_GAZE,
  EYE_SCALE,
  LEFT_EYE_VERTICES,
  SPHERE_RADIUS,
  projectEyePath,
  projectEyePoint,
  scalePolygon,
} from '../orbEyes'
import * as orbEyes from '../orbEyes'

describe('orb eye geometry', () => {
  it('enlarges an eye around its own center without shifting it', () => {
    const rectangle = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 2 },
      { x: 0, y: 2 },
    ]

    expect(EYE_SCALE).toBe(1.12)
    expect(scalePolygon(rectangle, EYE_SCALE)).toEqual([
      { x: -0.2400000000000002, y: -0.1200000000000001 },
      { x: 4.24, y: -0.1200000000000001 },
      { x: 4.24, y: 2.12 },
      { x: -0.2400000000000002, y: 2.12 },
    ])
  })

  it('keeps the approved top-right pose exact at rest', () => {
    for (const point of LEFT_EYE_VERTICES) {
      const projected = projectEyePoint(point, BASE_GAZE)
      expect(projected.x).toBeCloseTo(point.x, 6)
      expect(projected.y).toBeCloseTo(point.y, 6)
    }
  })

  it('turns the eye slant with the sphere surface', () => {
    const top = { x: 130.36, y: 45.98 }
    const bottom = { x: 142.56, y: 87.93 }
    const axisAt = (target: { x: number; y: number }) => {
      const projectedTop = projectEyePoint(top, target)
      const projectedBottom = projectEyePoint(bottom, target)
      return {
        x: projectedBottom.x - projectedTop.x,
        y: projectedBottom.y - projectedTop.y,
      }
    }

    expect(axisAt({ x: 0.4, y: -0.45 }).x).toBeGreaterThan(0)
    expect(axisAt({ x: -0.4, y: -0.45 }).x).toBeLessThan(0)
    expect(Math.abs(axisAt({ x: 0, y: 0 }).x)).toBeLessThan(4)
  })

  it('densifies the outline and keeps every point on the visible sphere', () => {
    const points = projectEyePath(
      scalePolygon(LEFT_EYE_VERTICES, EYE_SCALE),
      { x: -0.58, y: 0.2 },
      1.5,
    )

    expect(points.length).toBeGreaterThan(LEFT_EYE_VERTICES.length)
    for (const point of points) {
      expect(point.z).toBeGreaterThan(0)
      expect(Math.hypot(point.x - 114.2705, point.y - 114.228)).toBeLessThanOrEqual(
        SPHERE_RADIUS + 0.0001,
      )
    }
  })

  it('serializes projected points as a closed SVG path', () => {
    expect(typeof orbEyes.toPathData).toBe('function')

    const path = orbEyes.toPathData([
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 5, y: 6 },
    ])

    expect(path).toBe('M1.00 2.00L3.00 4.00L5.00 6.00Z')
  })
})
