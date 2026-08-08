import React from 'react';
import { headlineFontFamily } from '../../fonts';

type VelocityVectorProps = {
  /** Vector tail, in SVG-local coordinates. */
  x: number;
  y: number;
  /** Direction in degrees, 0 = pointing right (+x), increases clockwise (SVG y-down). */
  angleDeg: number;
  /** Arrow length in px — the visual encoding of the vector's magnitude. */
  length: number;
  color: string;
  strokeWidth?: number;
  label?: string;
};

/**
 * A single arrow used everywhere a velocity vector needs drawing: the gold
 * motion motif at the equator, the cyan reference vectors, etc. Meant to be
 * rendered inside an <svg>.
 */
export const VelocityVector: React.FC<VelocityVectorProps> = ({
  x,
  y,
  angleDeg,
  length,
  color,
  strokeWidth = 6,
  label,
}) => {
  const angleRad = (angleDeg * Math.PI) / 180;
  const tipX = x + length * Math.cos(angleRad);
  const tipY = y + length * Math.sin(angleRad);

  const headSize = 16;
  const headAngle = Math.PI / 7;
  const leftX = tipX - headSize * Math.cos(angleRad - headAngle);
  const leftY = tipY - headSize * Math.sin(angleRad - headAngle);
  const rightX = tipX - headSize * Math.cos(angleRad + headAngle);
  const rightY = tipY - headSize * Math.sin(angleRad + headAngle);

  const labelOffset = 30;
  const labelX = tipX + labelOffset * Math.cos(angleRad);
  const labelY = tipY + labelOffset * Math.sin(angleRad);

  return (
    <g>
      <line x1={x} y1={y} x2={tipX} y2={tipY} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <polygon points={`${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`} fill={color} />
      {label ? (
        <text
          x={labelX}
          y={labelY}
          fill={color}
          fontFamily={headlineFontFamily}
          fontWeight={600}
          fontSize={28}
          textAnchor={Math.cos(angleRad) >= 0 ? 'start' : 'end'}
          dominantBaseline="middle"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
};
