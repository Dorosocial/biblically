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

export const TusiScene: React.FC<{
  t: number;
  bigCircleProgress?: number;
  smallCircleProgress?: number;
  showPoint?: boolean;
  pointScale?: number;
  pulseProgress?: number; // 0-1; 1 (default) means the ping ring is inactive/faded
  showGhost?: boolean;
  ghostOpacity?: number;
  showLabels?: boolean;
  labelOpacity?: number;
}> = ({
  t,
  bigCircleProgress = 1,
  smallCircleProgress = 1,
  showPoint = true,
  pointScale = 1,
  pulseProgress = 1,
  showGhost = false,
  ghostOpacity = 0,
  showLabels = false,
  labelOpacity = 1,
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

        {showGhost ? (
          <path
            d={buildCardioidGhostPath()}
            fill="none"
            stroke={COLORS.circleDim}
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
            stroke={COLORS.accent}
            strokeWidth={5}
            strokeLinecap="round"
          />
        ) : null}

        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke={COLORS.circle}
          strokeWidth={3}
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
            stroke={COLORS.circle}
            strokeWidth={3}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - smallCircleProgress}
          />
        ) : null}

        {showLabels ? (
          <g opacity={labelOpacity} fontFamily="Helvetica, Arial, sans-serif" fill={COLORS.textDim}>
            <text x={CX} y={CY - R - 34} fontSize={28} textAnchor="middle">
              R
            </text>
            <text x={smallCenter.x} y={smallCenter.y - SMALL_R - 24} fontSize={24} textAnchor="middle">
              r
            </text>
          </g>
        ) : null}

        {pulseProgress < 1 ? (
          <circle
            cx={point.x}
            cy={point.y}
            r={10 + pulseProgress * 46}
            fill="none"
            stroke={COLORS.accent}
            strokeWidth={3}
            opacity={1 - pulseProgress}
          />
        ) : null}

        {showPoint ? (
          <circle cx={point.x} cy={point.y} r={12 * pointScale} fill={COLORS.accent} filter="url(#tusiGlow)" />
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};
