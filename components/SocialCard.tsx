import {
  BASE_GAZE,
  EYE_SCALE,
  LEFT_EYE_VERTICES,
  RIGHT_EYE_VERTICES,
  projectEyePath,
  scalePolygon,
  toPathData,
} from '@/lib/orbEyes'
import { ORB_BODY_PATH, ORB_VIEW_BOX } from '@/lib/orbArt'

const ACCENT = '#87b9ff'
const INK = '#050605'
const TEXT = '#e8ece9'
const MUTED = '#818a85'

const LEFT_EYE_PATH = toPathData(
  projectEyePath(scalePolygon(LEFT_EYE_VERTICES, EYE_SCALE), BASE_GAZE),
)
const RIGHT_EYE_PATH = toPathData(
  projectEyePath(scalePolygon(RIGHT_EYE_VERTICES, EYE_SCALE), BASE_GAZE),
)

const CELLS = [
  [0, 2], [1, 2], [2, 2], [2, 1], [1, 0],
  [5, 1], [6, 1], [7, 1], [7, 2], [6, 3],
  [10, 0], [10, 1], [10, 2], [11, 2], [12, 1],
  [14, 4], [15, 4], [16, 4], [16, 3], [15, 2],
  [19, 1], [20, 2], [18, 3], [19, 3], [20, 3],
  [3, 11], [4, 12], [2, 13], [3, 13], [4, 13],
  [8, 10], [9, 10], [10, 10], [8, 11], [9, 12],
  [13, 12], [14, 12], [15, 12], [15, 11], [14, 10],
  [19, 11], [20, 11], [21, 11], [20, 10], [20, 9],
] as const

export default function SocialCard() {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: INK,
        color: TEXT,
        fontFamily: 'sans-serif',
      }}
    >
      {CELLS.map(([column, row], index) => (
        <div
          key={`${column}-${row}`}
          style={{
            position: 'absolute',
            left: column * 58 - 16,
            top: row * 58 - 20,
            width: 42,
            height: 42,
            border: `1px solid rgba(135, 185, 255, ${index % 6 === 0 ? 0.2 : 0.09})`,
            borderRadius: 9,
            background: index % 6 === 0 ? 'rgba(135, 185, 255, 0.06)' : 'transparent',
          }}
        />
      ))}

      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: 570,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 102,
            bottom: 80,
            width: 330,
            height: 42,
            borderRadius: 999,
            background: 'rgba(0, 0, 0, 0.72)',
          }}
        />
        <svg width="430" height="430" viewBox={ORB_VIEW_BOX}>
          <path d={ORB_BODY_PATH} fill={ACCENT} />
          <path d={ORB_BODY_PATH} fill="none" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1" />
          <path d={LEFT_EYE_PATH} fill="#0a1625" />
          <path d={RIGHT_EYE_PATH} fill="#0a1625" />
        </svg>
      </div>

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          paddingRight: 76,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 78,
            fontWeight: 700,
            letterSpacing: '-4px',
            lineHeight: 1,
          }}
        >
          Hubert Xu
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            color: ACCENT,
            fontSize: 29,
            fontWeight: 500,
            letterSpacing: '-0.7px',
          }}
        >
          software engineer · builder
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 112,
            color: MUTED,
            fontSize: 21,
            letterSpacing: '0.4px',
          }}
        >
          hubert-xu.com
        </div>
      </div>
    </div>
  )
}
