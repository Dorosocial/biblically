import React from 'react';
import {Pt} from './geometry';
import {COLORS} from './colors';

export const NodeDot: React.FC<{
  pt: Pt;
  label: string;
  radius?: number;
  opacity?: number;
  fontSize?: number;
  color?: string;
  dim?: boolean;
}> = ({pt, label, radius = 28, opacity = 1, fontSize = 32, color = COLORS.bone, dim = false}) => {
  return (
    <g opacity={opacity}>
      <circle cx={pt.x} cy={pt.y} r={radius + 9} fill="none" stroke={color} strokeOpacity={0.22} strokeWidth={5} />
      <circle
        cx={pt.x}
        cy={pt.y}
        r={radius}
        fill={COLORS.bg}
        stroke={dim ? COLORS.boneDim : color}
        strokeWidth={dim ? 2 : 5}
      />
      <text
        x={pt.x}
        y={pt.y}
        fill={dim ? COLORS.boneDim : color}
        fontSize={fontSize}
        fontWeight={800}
        fontFamily="Helvetica, Arial, sans-serif"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {label}
      </text>
    </g>
  );
};
