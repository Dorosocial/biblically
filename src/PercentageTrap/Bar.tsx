import React from 'react';
import {COLORS} from './colors';

// A depletion bar: a dim full-width track with a solid colored fill
// showing the current value as a fraction of maxValue. Always uses <rect>
// (never a zero-height <line>) so it's safe to glow if ever needed.
export const Bar: React.FC<{
  value: number;
  maxValue: number;
  x: number;
  y: number;
  maxWidth: number;
  height?: number;
  color?: string;
}> = ({value, maxValue, x, y, maxWidth, height = 44, color = COLORS.green}) => {
  const w = Math.max(0, maxWidth * (value / maxValue));
  return (
    <g>
      <rect x={x} y={y} width={maxWidth} height={height} rx={10} fill="none" stroke={COLORS.boneDim} strokeWidth={3} />
      <rect x={x} y={y} width={w} height={height} rx={10} fill={color} />
    </g>
  );
};
