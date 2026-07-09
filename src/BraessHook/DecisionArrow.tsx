import React from 'react';
import {COLORS} from './colors';

// A single "decision arrow" icon: a ringed dot with an arrow pointing in
// a given direction — used both for the sequential punch-ins (beat 17)
// and, at smaller scale, scattered as a summary group.
export const DecisionArrow: React.FC<{
  x: number;
  y: number;
  rotationDeg: number;
  scale?: number;
  opacity?: number;
  color?: string;
}> = ({x, y, rotationDeg, scale = 1, opacity = 1, color = COLORS.pink}) => {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotationDeg}) scale(${scale})`} opacity={opacity}>
      <circle cx={0} cy={0} r={30} fill="none" stroke={color} strokeWidth={7} />
      <line x1={0} y1={34} x2={0} y2={78} stroke={color} strokeWidth={7} strokeLinecap="round" />
      <polygon points="0,110 -18,72 18,72" fill={color} />
    </g>
  );
};
