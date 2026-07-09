import React from 'react';
import {COLORS} from './colors';

const DOT_POSITIONS = [
  {x: -180, y: -140},
  {x: 0, y: -200},
  {x: 180, y: -140},
  {x: -110, y: -10},
  {x: 110, y: -10},
];

const TARGET = {x: 0, y: 220};

// Several identical dots, each with the same arrow pointing toward one
// shared point — "everyone making the same logical choice."
export const DecisionArrowDots: React.FC<{
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  reveal?: number; // 0-1, how many dots have appeared (staggers in)
}> = ({x, y, scale = 1, opacity = 1, reveal = 1}) => {
  const visibleCount = Math.round(reveal * DOT_POSITIONS.length);

  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={opacity}>
      <circle cx={TARGET.x} cy={TARGET.y} r={22} fill={COLORS.green} />
      {DOT_POSITIONS.slice(0, visibleCount).map((p, i) => {
        const angle = Math.atan2(TARGET.y - p.y, TARGET.x - p.x);
        const arrowLen = 60;
        const tipX = p.x + Math.cos(angle) * arrowLen;
        const tipY = p.y + Math.sin(angle) * arrowLen;
        const backX = p.x + Math.cos(angle) * (arrowLen - 26);
        const backY = p.y + Math.sin(angle) * (arrowLen - 26);
        const perpX = Math.cos(angle + Math.PI / 2) * 14;
        const perpY = Math.sin(angle + Math.PI / 2) * 14;

        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={26} fill="none" stroke={COLORS.pink} strokeWidth={6} />
            <line
              x1={p.x + Math.cos(angle) * 30}
              y1={p.y + Math.sin(angle) * 30}
              x2={backX}
              y2={backY}
              stroke={COLORS.pink}
              strokeWidth={6}
              strokeLinecap="round"
            />
            <polygon
              points={`${tipX},${tipY} ${backX + perpX},${backY + perpY} ${backX - perpX},${backY - perpY}`}
              fill={COLORS.pink}
            />
          </g>
        );
      })}
    </g>
  );
};
