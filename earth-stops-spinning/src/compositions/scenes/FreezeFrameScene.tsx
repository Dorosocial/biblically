import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../../theme';
import { headlineFontFamily, captionFontFamily } from '../../fonts';
import {
  EQUATOR_VELOCITY_MPS,
  OMEGA,
  VISUAL_SPEEDUP_FACTOR,
} from '../../physics/rotation';
import { Earth, EarthMarker, earthPointPosition } from '../shared/Earth';
import { VelocityVector } from '../shared/VelocityVector';
import { Caption } from '../shared/Caption';
import { SceneHeading } from '../shared/SceneHeading';

const DEG_PER_SEC = OMEGA * (180 / Math.PI) * VISUAL_SPEEDUP_FACTOR;

const EARTH_CX = 620;
const EARTH_CY = 500;
const EARTH_R = 300;

/**
 * Local frame (within this scene) at which the ground stops instantly.
 * Chosen so the equator point is at the bottom of the (top-down) view at
 * the moment of freeze — its tangent direction is then purely horizontal,
 * so the inertial drift travels sideways across open canvas instead of
 * down into the caption band.
 */
const FREEZE_LOCAL_FRAME = 269;

export const FreezeFrameScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isFrozen = frame >= FREEZE_LOCAL_FRAME;
  const rotationDeg = DEG_PER_SEC * (Math.min(frame, FREEZE_LOCAL_FRAME) / fps);

  // Person's tangential direction at the exact instant of freeze.
  const freezeTangentDeg = rotationDeg + 90;
  const freezeTangentRad = (freezeTangentDeg * Math.PI) / 180;

  const groundPoint = earthPointPosition(EARTH_CX, EARTH_CY, EARTH_R, 0, rotationDeg);

  // Same px/video-second speed the marker had while riding the circle
  // (derivative of radius * angle(t), angle in radians) — so motion stays
  // continuous through the freeze instant, no speed jump.
  const personPxSpeedPerSec = EARTH_R * OMEGA * VISUAL_SPEEDUP_FACTOR;
  const framesSinceFreeze = Math.max(0, frame - FREEZE_LOCAL_FRAME);
  const secondsSinceFreeze = framesSinceFreeze / fps;
  const personTravelPx = personPxSpeedPerSec * secondsSinceFreeze;

  const personPoint = isFrozen
    ? {
        x: groundPoint.x + personTravelPx * Math.cos(freezeTangentRad),
        y: groundPoint.y + personTravelPx * Math.sin(freezeTangentRad),
      }
    : groundPoint;

  // Real drift distance: tangentialVelocity(0) [m/s, real physics] times
  // elapsed time. Elapsed time is expressed on the same accelerated clock
  // (VISUAL_SPEEDUP_FACTOR) used for the rotation animation, so the number
  // keeps meaning "real seconds represented" rather than video-seconds.
  const apparentSecondsSinceFreeze = secondsSinceFreeze * VISUAL_SPEEDUP_FACTOR;
  const driftMeters = EQUATOR_VELOCITY_MPS * apparentSecondsSinceFreeze;

  const flashOpacity = interpolate(
    frame,
    [FREEZE_LOCAL_FRAME - 2, FREEZE_LOCAL_FRAME, FREEZE_LOCAL_FRAME + 10],
    [0, 0.55, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const readoutOpacity = interpolate(frame, [FREEZE_LOCAL_FRAME, FREEZE_LOCAL_FRAME + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const introOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const driftLabel =
    driftMeters < 1000
      ? `${driftMeters.toFixed(0)} m`
      : `${(driftMeters / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })} km`;

  return (
    <AbsoluteFill>
      <SceneHeading eyebrow={isFrozen ? 'T + 0' : 'Thought experiment'} title={isFrozen ? 'You keep going.' : 'Now imagine the ground stops.'} />

      <div style={{ position: 'absolute', left: 1160, top: 300, opacity: introOpacity, maxWidth: 660 }}>
        <div
          style={{
            fontFamily: headlineFontFamily,
            fontWeight: 700,
            fontSize: 44,
            color: colors.textPrimary,
            marginBottom: 18,
          }}
        >
          Newton's First Law
        </div>
        <div
          style={{
            fontFamily: captionFontFamily,
            fontSize: 28,
            color: colors.textMuted,
            lineHeight: 1.6,
          }}
        >
          An object in motion stays in motion, in a straight line, at a
          constant speed — unless a force acts on it. Friction between your
          feet and the ground is that force. Take the ground away and the
          force disappears with it.
        </div>

        <div style={{ marginTop: 44, opacity: readoutOpacity }}>
          <div style={{ fontFamily: captionFontFamily, fontSize: 24, color: colors.textMuted, marginBottom: 6 }}>
            straight-line drift since the freeze
          </div>
          <div
            style={{
              fontFamily: headlineFontFamily,
              fontWeight: 700,
              fontSize: 88,
              color: colors.gold,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {driftLabel}
          </div>
        </div>
      </div>

      <svg width={1920} height={1080} style={{ position: 'absolute', top: 0, left: 0 }}>
        <Earth cx={EARTH_CX} cy={EARTH_CY} radius={EARTH_R} rotationDeg={rotationDeg} latitudeRingsDeg={[30, 60]} />

        {isFrozen ? (
          <>
            <line
              x1={groundPoint.x}
              y1={groundPoint.y}
              x2={personPoint.x}
              y2={personPoint.y}
              stroke={colors.gold}
              strokeWidth={4}
              strokeDasharray="2 10"
              strokeLinecap="round"
            />
            <EarthMarker
              cx={EARTH_CX}
              cy={EARTH_CY}
              radius={EARTH_R}
              latitudeDeg={0}
              angleDeg={rotationDeg}
              color={colors.cyan}
              label="ground (stopped)"
              labelFontFamily={headlineFontFamily}
            />
            <circle cx={personPoint.x} cy={personPoint.y} r={10} fill={colors.gold} />
            <circle cx={personPoint.x} cy={personPoint.y} r={15} fill="none" stroke={colors.gold} strokeOpacity={0.5} strokeWidth={2} />
            <text
              x={personPoint.x}
              y={personPoint.y - 26}
              fill={colors.gold}
              fontFamily={headlineFontFamily}
              fontWeight={600}
              fontSize={24}
              textAnchor="middle"
            >
              you (still moving)
            </text>
            <VelocityVector
              x={personPoint.x}
              y={personPoint.y}
              angleDeg={freezeTangentDeg}
              length={90}
              color={colors.gold}
            />
          </>
        ) : (
          <EarthMarker
            cx={EARTH_CX}
            cy={EARTH_CY}
            radius={EARTH_R}
            latitudeDeg={0}
            angleDeg={rotationDeg}
            color={colors.gold}
            label="you"
            labelFontFamily={headlineFontFamily}
          />
        )}
      </svg>

      <AbsoluteFill style={{ backgroundColor: colors.textPrimary, opacity: flashOpacity, pointerEvents: 'none' }} />

      <Caption
        text="Now imagine the ground stops. Instantly. Newton's first law — you keep moving in a straight line until something forces you not to."
        fadeInStart={10}
      />
    </AbsoluteFill>
  );
};
