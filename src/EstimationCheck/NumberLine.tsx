import React from 'react';
import {COLORS} from './colors';

export type Flag = {value: number; color: string; label: string; opacity?: number; scale?: number};

// A horizontal number line with a linear min-max scale, optional flag
// pins (a pole + colored pennant + value label), and an optional
// highlighted "warning zone" band between two values on the line.
export const NumberLine: React.FC<{
  x: number;
  y: number;
  width: number;
  min: number;
  max: number;
  drawProgress?: number;
  flags?: Flag[];
  warningZone?: {from: number; to: number; opacity: number};
}> = ({x, y, width, min, max, drawProgress = 1, flags = [], warningZone}) => {
  const toX = (v: number) => x + ((v - min) / (max - min)) * width;

  return (
    <g>
      <line
        x1={x}
        y1={y}
        x2={x + width}
        y2={y}
        stroke={COLORS.bone}
        strokeWidth={4}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - drawProgress}
      />
      <line x1={x} y1={y - 14} x2={x} y2={y + 14} stroke={COLORS.boneDim} strokeWidth={3} opacity={drawProgress} />
      <line x1={x + width} y1={y - 14} x2={x + width} y2={y + 14} stroke={COLORS.boneDim} strokeWidth={3} opacity={drawProgress} />

      {warningZone ? (
        <rect
          x={toX(warningZone.from)}
          y={y - 30}
          width={Math.max(0, toX(warningZone.to) - toX(warningZone.from))}
          height={60}
          fill={COLORS.red}
          opacity={warningZone.opacity * 0.28}
        />
      ) : null}

      {flags.map((f, i) => {
        const fx = toX(f.value);
        const opacity = f.opacity ?? 1;
        const scale = f.scale ?? 1;
        return (
          <g key={i} opacity={opacity} transform={`translate(${fx} ${y}) scale(${scale})`}>
            <line x1={0} y1={0} x2={0} y2={-64} stroke={f.color} strokeWidth={5} strokeLinecap="round" />
            <polygon points="0,-64 34,-52 0,-40" fill={f.color} />
            <circle cx={0} cy={0} r={7} fill={f.color} />
            <text
              x={0}
              y={-84}
              fill={f.color}
              fontSize={26}
              fontWeight={800}
              textAnchor="middle"
              fontFamily="Helvetica, Arial, sans-serif"
            >
              {f.label}
            </text>
          </g>
        );
      })}
    </g>
  );
};
