import React from 'react';
import {COLORS} from './colors';

const toRad = (deg: number) => (deg * Math.PI) / 180;

// A speedometer-style semicircular gauge: red "GUESSING" zone on the
// left (180deg), green "METHOD" zone on the right (0deg), needle angle
// driven directly by the caller per-frame.
export const Gauge: React.FC<{
  cx: number;
  cy: number;
  radius?: number;
  needleAngleDeg: number;
  opacity?: number;
}> = ({cx, cy, radius = 220, needleAngleDeg, opacity = 1}) => {
  const arcPoint = (deg: number) => ({
    x: cx + radius * Math.cos(toRad(deg)),
    y: cy - radius * Math.sin(toRad(deg)),
  });
  const redStart = arcPoint(180);
  const redEnd = arcPoint(90);
  const greenStart = arcPoint(90);
  const greenEnd = arcPoint(0);

  const needleRad = toRad(needleAngleDeg);
  const tipX = cx + (radius - 34) * Math.cos(needleRad);
  const tipY = cy - (radius - 34) * Math.sin(needleRad);

  return (
    <g opacity={opacity}>
      <path
        d={`M ${redStart.x} ${redStart.y} A ${radius} ${radius} 0 0 1 ${redEnd.x} ${redEnd.y}`}
        stroke={COLORS.red}
        strokeWidth={30}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M ${greenStart.x} ${greenStart.y} A ${radius} ${radius} 0 0 1 ${greenEnd.x} ${greenEnd.y}`}
        stroke={COLORS.green}
        strokeWidth={30}
        fill="none"
        strokeLinecap="round"
      />
      <text
        x={cx - radius * 0.62}
        y={cy + 56}
        fill={COLORS.red}
        fontSize={28}
        fontWeight={800}
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
      >
        GUESSING
      </text>
      <text
        x={cx + radius * 0.62}
        y={cy + 56}
        fill={COLORS.green}
        fontSize={28}
        fontWeight={800}
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
      >
        METHOD
      </text>
      <line x1={cx} y1={cy} x2={tipX} y2={tipY} stroke={COLORS.bone} strokeWidth={9} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={18} fill={COLORS.bone} />
    </g>
  );
};
