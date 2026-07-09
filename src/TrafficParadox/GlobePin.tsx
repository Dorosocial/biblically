import React from 'react';
import {COLORS} from './colors';

// A minimal globe (circle + latitude/longitude arcs) with a map pin
// resting on it — "real-world application."
export const GlobePin: React.FC<{
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
}> = ({x, y, scale = 1, opacity = 1}) => {
  const r = 150;
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={opacity}>
      <circle cx={0} cy={0} r={r} fill="none" stroke={COLORS.bone} strokeWidth={6} />
      <ellipse cx={0} cy={0} rx={r * 0.42} ry={r} fill="none" stroke={COLORS.boneDim} strokeWidth={4} />
      <ellipse cx={0} cy={0} rx={r} ry={r * 0.42} fill="none" stroke={COLORS.boneDim} strokeWidth={4} />
      <line x1={-r} y1={0} x2={r} y2={0} stroke={COLORS.boneDim} strokeWidth={4} />
      <path
        d={`M ${r * 0.62},${r * 0.68} A ${r * 1.15} ${r * 1.15} 0 0 1 ${-r * 0.62},${r * 0.68}`}
        fill="none"
        stroke={COLORS.boneDim}
        strokeWidth={4}
      />

      <g transform={`translate(${r * 0.55} ${-r * 0.9})`}>
        <path
          d="M 0,-70 C 40,-70 66,-42 66,-8 C 66,32 0,70 0,70 C 0,70 -66,32 -66,-8 C -66,-42 -40,-70 0,-70 Z"
          fill={COLORS.pink}
        />
        <circle cx={0} cy={-8} r={22} fill={COLORS.bg} />
      </g>
    </g>
  );
};
