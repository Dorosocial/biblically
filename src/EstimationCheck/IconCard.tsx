import React from 'react';
import {COLORS} from './colors';

// A rounded card: a colored glyph up top, a label beneath, and an
// optional green checkmark stamp that pops in over the corner once the
// card has been "visited" by the narration.
export const IconCard: React.FC<{
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  glyph?: string;
  iconNode?: React.ReactNode;
  label: string;
  scale?: number;
  glow?: boolean;
  checkProgress?: number;
}> = ({x, y, width = 220, height = 260, color, glyph, iconNode, label, scale = 1, glow = false, checkProgress = 0}) => {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        rx={24}
        fill="none"
        stroke={color}
        strokeWidth={5}
        style={glow ? {filter: `drop-shadow(0 0 18px ${color})`} : undefined}
      />
      {iconNode ? (
        <g transform="translate(0 -30)">{iconNode}</g>
      ) : (
        <text
          x={0}
          y={-30}
          fill={color}
          fontSize={72}
          fontWeight={800}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Helvetica, Arial, sans-serif"
        >
          {glyph}
        </text>
      )}
      <text
        x={0}
        y={height / 2 - 40}
        fill={COLORS.bone}
        fontSize={24}
        fontWeight={700}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Helvetica, Arial, sans-serif"
      >
        {label}
      </text>
      {checkProgress > 0.01 ? (
        <g transform={`translate(${width / 2 - 10} ${-height / 2 + 10})`} opacity={checkProgress}>
          <circle cx={0} cy={0} r={26 * checkProgress} fill={COLORS.green} />
          <path
            d="M -11,0 L -3,9 L 12,-10"
            stroke={COLORS.bg}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - Math.min(1, Math.max(0, (checkProgress - 0.3) / 0.7))}
          />
        </g>
      ) : null}
    </g>
  );
};
