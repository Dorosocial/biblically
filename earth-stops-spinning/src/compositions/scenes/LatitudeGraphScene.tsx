import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../theme';
import { headlineFontFamily, captionFontFamily } from '../../fonts';
import { EQUATOR_VELOCITY_MPS, msToKmh, tangentialVelocity } from '../../physics/rotation';
import { Caption } from '../shared/Caption';
import { SceneHeading } from '../shared/SceneHeading';

const CHART_X0 = 260;
const CHART_X1 = 1780;
const CHART_Y0 = 780; // v = 0
const CHART_Y1 = 350; // v = max

const MAX_V = EQUATOR_VELOCITY_MPS;

const xForLat = (lat: number) => CHART_X0 + (lat / 90) * (CHART_X1 - CHART_X0);
const yForV = (v: number) => CHART_Y0 + (v / MAX_V) * (CHART_Y1 - CHART_Y0);

const CURVE_SAMPLES = 91;
const curvePoints = new Array(CURVE_SAMPLES).fill(0).map((_, lat) => ({
  lat,
  v: tangentialVelocity(lat),
}));
const curvePath = curvePoints
  .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xForLat(p.lat).toFixed(1)} ${yForV(p.v).toFixed(1)}`)
  .join(' ');

const MARKERS = [
  { lat: 0, label: 'equator', frame: 60 },
  { lat: 45, label: '45°', frame: 120 },
  { lat: 90, label: 'pole', frame: 180 },
];

const AXIS_TICKS = [0, 15, 30, 45, 60, 75, 90];

export const LatitudeGraphScene: React.FC = () => {
  const frame = useCurrentFrame();

  const drawProgress = interpolate(frame, [15, 110], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - (1 - t) * (1 - t),
  });

  const axisOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <SceneHeading eyebrow="Not uniform" title="v = ωR·cos(latitude)" />

      <svg width={1920} height={1080} style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Axes */}
        <g opacity={axisOpacity}>
          <line x1={CHART_X0} y1={CHART_Y0} x2={CHART_X1} y2={CHART_Y0} stroke={colors.textMuted} strokeWidth={2} />
          <line x1={CHART_X0} y1={CHART_Y0} x2={CHART_X0} y2={CHART_Y1 - 30} stroke={colors.textMuted} strokeWidth={2} />
          {AXIS_TICKS.map((t) => (
            <g key={t}>
              <line x1={xForLat(t)} y1={CHART_Y0} x2={xForLat(t)} y2={CHART_Y0 + 10} stroke={colors.textMuted} strokeWidth={2} />
              <text x={xForLat(t)} y={CHART_Y0 + 42} fill={colors.textMuted} fontFamily={captionFontFamily} fontSize={24} textAnchor="middle">
                {t}°
              </text>
            </g>
          ))}
          <text
            x={(CHART_X0 + CHART_X1) / 2}
            y={CHART_Y0 + 90}
            fill={colors.textMuted}
            fontFamily={captionFontFamily}
            fontSize={26}
            textAnchor="middle"
          >
            latitude
          </text>
          <text
            x={CHART_X0 + 220}
            y={200}
            fill={colors.textMuted}
            fontFamily={captionFontFamily}
            fontSize={26}
            textAnchor="start"
          >
            tangential velocity (m/s)
          </text>
        </g>

        {/* Cosine curve, drawn on */}
        <path
          d={curvePath}
          fill="none"
          stroke={colors.gold}
          strokeWidth={6}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - drawProgress}
        />

        {/* Markers */}
        {MARKERS.map((m) => {
          const v = tangentialVelocity(m.lat);
          const mx = xForLat(m.lat);
          const my = yForV(v);
          const popIn = interpolate(frame, [m.frame, m.frame + 18], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: (t) => 1 - (1 - t) * (1 - t),
          });
          if (popIn <= 0) return null;
          return (
            <g key={m.lat} opacity={popIn}>
              <line x1={mx} y1={CHART_Y0} x2={mx} y2={my} stroke={colors.cyan} strokeOpacity={0.4} strokeDasharray="4 8" strokeWidth={2} />
              <circle cx={mx} cy={my} r={9 * popIn + 4} fill={colors.gold} />
              <text x={mx} y={my - 26} fill={colors.textPrimary} fontFamily={headlineFontFamily} fontWeight={600} fontSize={26} textAnchor="middle">
                {m.label}
              </text>
              <text x={mx} y={my - 60} fill={colors.gold} fontFamily={headlineFontFamily} fontWeight={700} fontSize={28} textAnchor="middle">
                {v.toFixed(0)} m/s
              </text>
              <text x={mx} y={my - 92} fill={colors.textMuted} fontFamily={captionFontFamily} fontSize={22} textAnchor="middle">
                {msToKmh(v).toFixed(0)} km/h
              </text>
            </g>
          );
        })}
      </svg>

      <Caption text="It's not uniform. v equals omega R cosine latitude — it fades toward the poles." fadeInStart={10} />
    </AbsoluteFill>
  );
};
