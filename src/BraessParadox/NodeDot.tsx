import React from 'react';
import {Pt} from './geometry';
import {COLORS} from './colors';

export const NodeDot: React.FC<{
  pt: Pt;
  label: string;
  radius?: number;
  opacity?: number;
  fontSize?: number;
  dim?: boolean;
}> = ({pt, label, radius = 26, opacity = 1, fontSize = 30, dim = false}) => {
  return (
    <g opacity={opacity}>
      <circle
        cx={pt.x}
        cy={pt.y}
        r={radius}
        fill={COLORS.nodeFill}
        stroke={dim ? COLORS.panelLine : COLORS.nodeStroke}
        strokeWidth={dim ? 2 : 4}
      />
      <text
        x={pt.x}
        y={pt.y}
        fill={dim ? COLORS.textDim : COLORS.text}
        fontSize={fontSize}
        fontWeight={700}
        fontFamily="Helvetica, Arial, sans-serif"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {label}
      </text>
    </g>
  );
};
