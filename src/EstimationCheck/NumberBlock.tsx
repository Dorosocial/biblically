import React from 'react';
import {COLORS} from './colors';

// A rounded tile showing a number that snaps from `from` to `to` at
// progress=0.5, with a scale "pop" right at the snap moment — a real
// per-frame transition, not two static states.
export const NumberBlock: React.FC<{
  x: number;
  y: number;
  from: number;
  to: number;
  progress: number;
  color: string;
  opacity?: number;
}> = ({x, y, from, to, progress, color, opacity = 1}) => {
  const value = progress < 0.5 ? from : to;
  const distFromSnap = Math.abs(progress - 0.5);
  const pop = 1 + 0.3 * Math.max(0, 1 - distFromSnap * 6);

  return (
    <g opacity={opacity} transform={`translate(${x} ${y})`}>
      <rect x={-110} y={-70} width={220} height={140} rx={20} fill="none" stroke={color} strokeWidth={5} />
      <g transform={`scale(${pop})`}>
        <text
          x={0}
          y={0}
          fill={color}
          fontSize={64}
          fontWeight={800}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Helvetica, Arial, sans-serif"
        >
          {value}
        </text>
      </g>
    </g>
  );
};
