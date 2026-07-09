import React from 'react';
import {COLORS} from './colors';

export const RoadCountIcon: React.FC<{
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  strikeProgress?: number;
}> = ({x, y, scale = 1, opacity = 1, strikeProgress = 0}) => {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={opacity}>
      <rect x={-140} y={-140} width={280} height={280} rx={24} fill="none" stroke={COLORS.bone} strokeWidth={6} />
      {[-70, 0, 70].map((offset, i) => (
        <line key={i} x1={-100} y1={offset} x2={100} y2={offset} stroke={COLORS.green} strokeWidth={10} strokeLinecap="round" />
      ))}
      {strikeProgress > 0 ? (
        <line
          x1={-165}
          y1={-165}
          x2={165}
          y2={165}
          stroke={COLORS.red}
          strokeWidth={16}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - strikeProgress}
        />
      ) : null}
    </g>
  );
};
