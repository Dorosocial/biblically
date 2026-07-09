import React from 'react';
import {COLORS} from './colors';

// Simple geometric lightbulb: bulb circle, zigzag filament, base, and a
// few rays that lengthen with the pulse value — "an idea."
export const Lightbulb: React.FC<{
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  pulse?: number; // 0-1
  color?: string;
}> = ({x, y, scale = 1, opacity = 1, pulse = 0, color = COLORS.pink}) => {
  const rayLen = 20 + pulse * 26;
  const rays = Array.from({length: 8}, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    const rInner = 78;
    const rOuter = 78 + rayLen;
    return {
      x1: Math.cos(a) * rInner,
      y1: -20 + Math.sin(a) * rInner,
      x2: Math.cos(a) * rOuter,
      y2: -20 + Math.sin(a) * rOuter,
    };
  });

  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={opacity}>
      {rays.map((r, i) => (
        <line
          key={i}
          x1={r.x1}
          y1={r.y1}
          x2={r.x2}
          y2={r.y2}
          stroke={color}
          strokeWidth={5}
          strokeLinecap="round"
          opacity={0.25 + pulse * 0.55}
        />
      ))}
      <circle cx={0} cy={-20} r={62} fill="none" stroke={COLORS.bone} strokeWidth={7} />
      <path
        d="M -20,10 L -8,45 L 8,45 L 20,10"
        fill="none"
        stroke={COLORS.bone}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <rect x={-22} y={45} width={44} height={16} rx={4} fill="none" stroke={COLORS.bone} strokeWidth={6} />
      <path
        d="M -18,-45 L 4,-15 L -8,-15 L 18,15"
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
};
