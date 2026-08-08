import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../../theme';
import { headlineFontFamily, captionFontFamily } from '../../fonts';
import {
  OMEGA,
  VISUAL_SPEEDUP_FACTOR,
  tangentialVelocity,
  msToKmh,
} from '../../physics/rotation';
import { Earth, EarthMarker, earthPointPosition } from '../shared/Earth';
import { VelocityVector } from '../shared/VelocityVector';
import { Caption } from '../shared/Caption';
import { SceneHeading } from '../shared/SceneHeading';

const DEG_PER_SEC = OMEGA * (180 / Math.PI) * VISUAL_SPEEDUP_FACTOR;
const PX_PER_MPS = 0.6;

const EARTH_CX = 1330;
const EARTH_CY = 500;
const EARTH_R = 300;

const EQUATOR_V = tangentialVelocity(0);
const LAT45_V = tangentialVelocity(45);

const ReadoutRow: React.FC<{
  label: string;
  mps: number;
  color: string;
  opacity: number;
}> = ({ label, mps, color, opacity }) => (
  <div style={{ opacity, marginBottom: 36 }}>
    <div
      style={{
        fontFamily: captionFontFamily,
        fontSize: 26,
        color: colors.textMuted,
        marginBottom: 6,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: headlineFontFamily,
        fontWeight: 700,
        fontSize: 56,
        color,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {mps.toFixed(1)} m/s
    </div>
    <div
      style={{
        fontFamily: headlineFontFamily,
        fontWeight: 500,
        fontSize: 28,
        color: colors.textMuted,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {msToKmh(mps).toFixed(0)} km/h
    </div>
  </div>
);

export const RotationExplainerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rotationDeg = DEG_PER_SEC * (frame / fps);

  const equationOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const equatorVectorGrow = interpolate(frame, [60, 150], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lat45VectorGrow = interpolate(frame, [150, 240], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const readoutOpacity = interpolate(frame, [180, 210], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const equatorPos = earthPointPosition(EARTH_CX, EARTH_CY, EARTH_R, 0, rotationDeg);
  const lat45Pos = earthPointPosition(EARTH_CX, EARTH_CY, EARTH_R, 45, rotationDeg + 140);

  return (
    <AbsoluteFill>
      <SceneHeading eyebrow="Why" title="The ground is moving too." />

      <div style={{ position: 'absolute', left: 96, top: 300, opacity: equationOpacity }}>
        <div
          style={{
            fontFamily: headlineFontFamily,
            fontWeight: 700,
            fontSize: 76,
            color: colors.textPrimary,
          }}
        >
          v = ωR·cos(lat)
        </div>
        <div
          style={{
            fontFamily: captionFontFamily,
            fontSize: 28,
            color: colors.textMuted,
            marginTop: 14,
            maxWidth: 620,
            lineHeight: 1.5,
          }}
        >
          Angular speed ω is the same everywhere on Earth. But the radius of
          the circle you sweep — R·cos(latitude) — shrinks away from the
          equator, so your tangential speed shrinks with it.
        </div>
      </div>

      <div style={{ position: 'absolute', left: 96, top: 660 }}>
        <ReadoutRow label="equator (0°)" mps={EQUATOR_V} color={colors.gold} opacity={readoutOpacity} />
        <ReadoutRow label="45° latitude" mps={LAT45_V} color={colors.cyan} opacity={readoutOpacity} />
      </div>

      <svg width={1920} height={1080} style={{ position: 'absolute', top: 0, left: 0 }}>
        <Earth cx={EARTH_CX} cy={EARTH_CY} radius={EARTH_R} rotationDeg={rotationDeg} latitudeRingsDeg={[45]} />

        <EarthMarker
          cx={EARTH_CX}
          cy={EARTH_CY}
          radius={EARTH_R}
          latitudeDeg={0}
          angleDeg={rotationDeg}
          color={colors.gold}
          label="equator"
          labelFontFamily={headlineFontFamily}
        />
        <VelocityVector
          x={equatorPos.x}
          y={equatorPos.y}
          angleDeg={rotationDeg + 90}
          length={EQUATOR_V * PX_PER_MPS * equatorVectorGrow}
          color={colors.gold}
          label={equatorVectorGrow > 0.85 ? `${msToKmh(EQUATOR_V).toFixed(0)} km/h` : undefined}
        />

        <EarthMarker
          cx={EARTH_CX}
          cy={EARTH_CY}
          radius={EARTH_R}
          latitudeDeg={45}
          angleDeg={rotationDeg + 140}
          color={colors.cyan}
          label="45°"
          labelFontFamily={headlineFontFamily}
        />
        <VelocityVector
          x={lat45Pos.x}
          y={lat45Pos.y}
          angleDeg={rotationDeg + 140 + 90}
          length={LAT45_V * PX_PER_MPS * lat45VectorGrow}
          color={colors.cyan}
          label={lat45VectorGrow > 0.85 ? `${msToKmh(LAT45_V).toFixed(0)} km/h` : undefined}
        />
      </svg>

      <Caption
        text="That's just the ground under your feet. v equals omega R — plug in Earth's numbers and the equator moves about 465 meters a second. Everywhere else moves slower: a smaller circle from the axis."
        fadeInStart={10}
      />
    </AbsoluteFill>
  );
};
