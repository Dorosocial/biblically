import React from 'react';
import {AbsoluteFill} from 'remotion';
import {
  CX,
  CY,
  R,
  SMALL_R,
  smallCenterWorld,
  tracedPointWorld,
  toScreen,
  minCosSoFar,
  maxCosSoFar,
  buildCardioidGhostPath,
} from './geometry';
import {COLORS} from './colors';
import {WIDTH, HEIGHT} from './constants';

// Thin, elegant vector line art — no filter is ever applied to the
// horizontal trace line itself (a zero-height shape clips to nothing
// under an objectBoundingBox feGaussianBlur filter region); the glow
// filter is only ever applied to the marked point, which has a normal
// non-zero bounding box.
export const TusiScene: React.FC<{
  t: number;
  bigCircleProgress?: number;
  smallCircleProgress?: number;
  showPoint?: boolean;
  pointScale?: number;
  pulseProgress?: number; // 0-1; 1 (default) means the ping ring is inactive/faded
  showGhost?: boolean;
  ghostOpacity?: number;
  diagramOpacity?: number;
}> = ({
  t,
  bigCircleProgress = 1,
  smallCircleProgress = 1,
  showPoint = true,
  pointScale = 1,
  pulseProgress = 1,
  showGhost = false,
  ghostOpacity = 0,
  diagramOpacity = 1,
}) => {
  const smallCenter = toScreen(smallCenterWorld(t));
  const point = toScreen(tracedPointWorld(t));
  const leftX = CX + R * minCosSoFar(t);
  const rightX = CX + R * maxCosSoFar();

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={WIDTH}
        height={HEIGHT}
        style={{position: 'absolute', top: 0, left: 0}}
      >
        <defs>
          <filter id="tusiGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g opacity={diagramOpacity}>
          {showGhost ? (
            <path
              d={buildCardioidGhostPath()}
              fill="none"
              stroke={COLORS.boneDim}
              strokeWidth={2}
              strokeDasharray="6 8"
              opacity={ghostOpacity}
            />
          ) : null}

          {rightX - leftX > 0.5 ? (
            <line
              x1={leftX}
              y1={CY}
              x2={rightX}
              y2={CY}
              stroke={COLORS.green}
              strokeWidth={4}
              strokeLinecap="round"
            />
          ) : null}

          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={COLORS.bone}
            strokeWidth={2.5}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - bigCircleProgress}
          />

          {smallCircleProgress > 0 ? (
            <circle
              cx={smallCenter.x}
              cy={smallCenter.y}
              r={SMALL_R}
              fill="none"
              stroke={COLORS.bone}
              strokeWidth={2.5}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - smallCircleProgress}
            />
          ) : null}

          {pulseProgress < 1 ? (
            <circle
              cx={point.x}
              cy={point.y}
              r={10 + pulseProgress * 46}
              fill="none"
              stroke={COLORS.green}
              strokeWidth={3}
              opacity={1 - pulseProgress}
            />
          ) : null}

          {showPoint ? (
            <circle cx={point.x} cy={point.y} r={11 * pointScale} fill={COLORS.green} filter="url(#tusiGlow)" />
          ) : null}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
