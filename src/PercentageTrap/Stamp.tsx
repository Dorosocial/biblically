import React from 'react';
import {COLORS} from './colors';

// A "50% OFF" rubber-stamp look: a double rectangular border with the
// label stacked inside, positioned/rotated/scaled by the caller for a
// spring "slam" entrance.
export const Stamp: React.FC<{
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity?: number;
  color?: string;
  lines: string[];
}> = ({x, y, rotation, scale, opacity = 1, color = COLORS.bone, lines}) => {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotation}) scale(${scale})`} opacity={opacity}>
      <rect x={-150} y={-85} width={300} height={170} rx={12} fill="none" stroke={color} strokeWidth={8} />
      <rect x={-134} y={-69} width={268} height={138} rx={8} fill="none" stroke={color} strokeWidth={3} />
      {lines.map((line, i) => (
        <text
          key={i}
          x={0}
          y={-14 + i * 58}
          fill={color}
          fontSize={54}
          fontWeight={800}
          fontFamily="Helvetica, Arial, sans-serif"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {line}
        </text>
      ))}
    </g>
  );
};
