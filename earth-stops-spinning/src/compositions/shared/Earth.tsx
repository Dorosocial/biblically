import React from 'react';
import { colors } from '../../theme';

type EarthProps = {
  cx: number;
  cy: number;
  radius: number;
  /** Current rotation of the surface pattern, in degrees. */
  rotationDeg: number;
  /** Latitude rings to draw, in degrees (drawn as concentric circles — this
   * is a top-down/polar view, so a latitude circle has radius R*cos(lat)). */
  latitudeRingsDeg?: number[];
  meridianCount?: number;
};

/**
 * Earth, drawn in top-down (polar) projection: looking straight down the
 * rotation axis. In this projection the equator is the outer rim, and
 * latitude circles are concentric circles of radius R*cos(latitude) — the
 * same shrinking-circle geometry that makes v = ωR·cos(latitude) true, so
 * the picture and the equation agree.
 */
export const Earth: React.FC<EarthProps> = ({
  cx,
  cy,
  radius,
  rotationDeg,
  latitudeRingsDeg = [30, 60],
  meridianCount = 12,
}) => {
  const meridians = new Array(meridianCount).fill(0).map((_, i) => {
    const angle = ((360 / meridianCount) * i + rotationDeg) * (Math.PI / 180);
    const x2 = cx + radius * Math.cos(angle);
    const y2 = cy + radius * Math.sin(angle);
    return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke={colors.textMuted} strokeOpacity={0.22} strokeWidth={1.5} />;
  });

  return (
    <g>
      <defs>
        <radialGradient id="earthFill" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#1B2740" />
          <stop offset="70%" stopColor="#131B2E" />
          <stop offset="100%" stopColor="#0E1626" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={radius} fill="url(#earthFill)" stroke={colors.cyan} strokeWidth={3} strokeOpacity={0.9} />
      {meridians}
      {latitudeRingsDeg.map((lat) => (
        <circle
          key={lat}
          cx={cx}
          cy={cy}
          r={radius * Math.cos((lat * Math.PI) / 180)}
          fill="none"
          stroke={colors.cyan}
          strokeOpacity={0.28}
          strokeDasharray="6 8"
          strokeWidth={2}
        />
      ))}
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={colors.cyan} strokeWidth={3} />
      {/* Rotation axis marker */}
      <circle cx={cx} cy={cy} r={4} fill={colors.textMuted} />
    </g>
  );
};

type EarthMarkerProps = {
  cx: number;
  cy: number;
  radius: number;
  latitudeDeg: number;
  angleDeg: number;
  color: string;
  size?: number;
  label?: string;
  labelFontFamily?: string;
};

/** A point riding the surface of `Earth`, at a given latitude and current angle. */
export const EarthMarker: React.FC<EarthMarkerProps> = ({
  cx,
  cy,
  radius,
  latitudeDeg,
  angleDeg,
  color,
  size = 10,
  label,
  labelFontFamily,
}) => {
  const ringRadius = radius * Math.cos((latitudeDeg * Math.PI) / 180);
  const angleRad = (angleDeg * Math.PI) / 180;
  const x = cx + ringRadius * Math.cos(angleRad);
  const y = cy + ringRadius * Math.sin(angleRad);

  return (
    <g>
      <circle cx={x} cy={y} r={size} fill={color} />
      <circle cx={x} cy={y} r={size + 5} fill="none" stroke={color} strokeOpacity={0.5} strokeWidth={2} />
      {label ? (
        <text
          x={x}
          y={y - size - 14}
          fill={color}
          fontFamily={labelFontFamily}
          fontWeight={600}
          fontSize={24}
          textAnchor="middle"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
};

export const earthPointPosition = (
  cx: number,
  cy: number,
  radius: number,
  latitudeDeg: number,
  angleDeg: number,
): { x: number; y: number } => {
  const ringRadius = radius * Math.cos((latitudeDeg * Math.PI) / 180);
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + ringRadius * Math.cos(angleRad),
    y: cy + ringRadius * Math.sin(angleRad),
  };
};
