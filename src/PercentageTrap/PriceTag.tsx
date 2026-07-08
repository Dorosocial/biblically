import React from 'react';
import {COLORS} from './colors';

const W = 460;
const H = 230;

// Classic price-tag silhouette: a rectangle with a pointed right edge and
// a small punched hole near the left, drawn purely in vector.
const TAG_PATH = `M ${-W / 2},${-H / 2} L ${W / 2 - 90},${-H / 2} L ${W / 2},0 L ${
  W / 2 - 90
},${H / 2} L ${-W / 2},${H / 2} Z`;

export const PriceTag: React.FC<{
  amount: string;
  x?: number;
  y?: number;
  scale?: number;
  opacity?: number;
  color?: string;
  fontSize?: number;
  strikeProgress?: number; // 0-1, draws a diagonal strike-through across the tag
  glow?: boolean;
}> = ({
  amount,
  x = 540,
  y = 650,
  scale = 1,
  opacity = 1,
  color = COLORS.bone,
  fontSize = 110,
  strikeProgress = 0,
  glow = false,
}) => {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={opacity}>
      <path
        d={TAG_PATH}
        fill="none"
        stroke={color}
        strokeWidth={7}
        strokeLinejoin="round"
        filter={glow ? 'url(#glowGreen)' : undefined}
      />
      <circle cx={-W / 2 + 70} cy={0} r={18} fill="none" stroke={color} strokeWidth={5} />
      <text
        x={26}
        y={4}
        fill={color}
        fontSize={fontSize}
        fontWeight={800}
        fontFamily="Helvetica, Arial, sans-serif"
        textAnchor="middle"
        dominantBaseline="central"
        filter={glow ? 'url(#glowGreen)' : undefined}
      >
        ${amount}
      </text>
      {strikeProgress > 0 ? (
        <line
          x1={-W / 2 + 30}
          y1={-H / 2 + 24}
          x2={W / 2 - 70}
          y2={H / 2 - 24}
          stroke={COLORS.red}
          strokeWidth={11}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - strikeProgress}
        />
      ) : null}
    </g>
  );
};
