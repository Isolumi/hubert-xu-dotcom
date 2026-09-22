export type Point2D = { x: number; y: number }
export type Point3D = Point2D & { z: number }

export const SPHERE_CENTER = { x: 114.2705, y: 114.228 }
export const SPHERE_RADIUS = 114.228
export const SURFACE_LIMIT = 0.62
export const EYE_SCALE = 1.12

const EYE_ANCHOR = { x: 160, y: 62.5 }

export const LEFT_EYE_VERTICES: Point2D[] = [
  { x: 130.36, y: 45.98 },
  { x: 134.98, y: 46.81 },
  { x: 138.97, y: 49.28 },
  { x: 141.68, y: 53.12 },
  { x: 146.79, y: 63.76 },
  { x: 150.52, y: 72.43 },
  { x: 152.1, y: 79.26 },
  { x: 150.59, y: 83.68 },
  { x: 147.1, y: 86.78 },
  { x: 142.56, y: 87.93 },
  { x: 137.98, y: 86.99 },
  { x: 134.17, y: 84.24 },
  { x: 131.69, y: 80.25 },
  { x: 125.05, y: 65.12 },
  { x: 121.03, y: 56.59 },
  { x: 121.1, y: 51.93 },
  { x: 123.75, y: 48.1 },
  { x: 128.01, y: 46.19 },
]

export const RIGHT_EYE_VERTICES: Point2D[] = [
  { x: 176.61, y: 37.08 },
  { x: 182.52, y: 39.65 },
  { x: 187.03, y: 44.31 },
  { x: 192.23, y: 53.84 },
  { x: 196.53, y: 63.8 },
  { x: 198.63, y: 72.18 },
  { x: 197.58, y: 76.33 },
  { x: 193.83, y: 78.08 },
  { x: 189.76, y: 76.69 },
  { x: 186.53, y: 73.82 },
  { x: 183.4, y: 68.14 },
  { x: 179.39, y: 58.05 },
  { x: 174.59, y: 48.31 },
  { x: 171.86, y: 42.42 },
  { x: 172.62, y: 38.3 },
]

function dot(a: Point3D, b: Point3D) {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

function cross(a: Point3D, b: Point3D): Point3D {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }
}

function length(vector: Point3D) {
  return Math.hypot(vector.x, vector.y, vector.z)
}

function scale(vector: Point3D, amount: number): Point3D {
  return {
    x: vector.x * amount,
    y: vector.y * amount,
    z: vector.z * amount,
  }
}

function add(a: Point3D, b: Point3D): Point3D {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }
}

function subtract(a: Point3D, b: Point3D): Point3D {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }
}

function normalize(vector: Point3D) {
  return scale(vector, 1 / length(vector))
}

function liftPoint(point: Point2D): Point3D {
  const x = point.x - SPHERE_CENTER.x
  const y = point.y - SPHERE_CENTER.y
  const z = Math.sqrt(Math.max(0, SPHERE_RADIUS ** 2 - x ** 2 - y ** 2))
  return { x, y, z }
}

function normalFromTarget(target: Point2D): Point3D {
  let { x, y } = target
  const distance = Math.hypot(x, y)
  if (distance > SURFACE_LIMIT) {
    x *= SURFACE_LIMIT / distance
    y *= SURFACE_LIMIT / distance
  }
  return { x, y, z: Math.sqrt(Math.max(0, 1 - x ** 2 - y ** 2)) }
}

type SurfaceFrame = {
  right: Point3D
  down: Point3D
  normal: Point3D
}

function frameFromNormal(normal: Point3D): SurfaceFrame {
  const worldDown = { x: 0, y: 1, z: 0 }
  const projectedDown = subtract(worldDown, scale(normal, dot(worldDown, normal)))
  const down = normalize(projectedDown)
  const right = normalize(cross(down, normal))
  return { right, down, normal }
}

const baseNormal = normalize(liftPoint(EYE_ANCHOR))
const baseFrame = frameFromNormal(baseNormal)

export const BASE_GAZE = { x: baseNormal.x, y: baseNormal.y }

function rotateBetweenFrames(point: Point3D, from: SurfaceFrame, to: SurfaceFrame) {
  const localRight = dot(point, from.right)
  const localDown = dot(point, from.down)
  const localNormal = dot(point, from.normal)
  return add(
    add(scale(to.right, localRight), scale(to.down, localDown)),
    scale(to.normal, localNormal),
  )
}

export function projectEyePoint(point: Point2D, target: Point2D): Point3D {
  const targetFrame = frameFromNormal(normalFromTarget(target))
  const rotated = rotateBetweenFrames(liftPoint(point), baseFrame, targetFrame)
  return {
    x: SPHERE_CENTER.x + rotated.x,
    y: SPHERE_CENTER.y + rotated.y,
    z: rotated.z,
  }
}

export function scalePolygon(points: Point2D[], amount: number): Point2D[] {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const point of points) {
    minX = Math.min(minX, point.x)
    minY = Math.min(minY, point.y)
    maxX = Math.max(maxX, point.x)
    maxY = Math.max(maxY, point.y)
  }

  const center = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 }
  return points.map(point => ({
    x: center.x + (point.x - center.x) * amount,
    y: center.y + (point.y - center.y) * amount,
  }))
}

function densifyPolygon(points: Point2D[], spacing: number) {
  const dense: Point2D[] = []
  for (let index = 0; index < points.length; index += 1) {
    const start = points[index]
    const end = points[(index + 1) % points.length]
    const steps = Math.max(
      1,
      Math.ceil(Math.hypot(end.x - start.x, end.y - start.y) / spacing),
    )

    for (let step = 0; step < steps; step += 1) {
      const amount = step / steps
      dense.push({
        x: start.x + (end.x - start.x) * amount,
        y: start.y + (end.y - start.y) * amount,
      })
    }
  }
  return dense
}

export function projectEyePath(points: Point2D[], target: Point2D, spacing = 1.5) {
  return densifyPolygon(points, spacing).map(point => projectEyePoint(point, target))
}
