import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../theme';
import { headlineFontFamily, captionFontFamily } from '../../fonts';
import { VelocityVector } from '../shared/VelocityVector';
import { Caption } from '../shared/Caption';

const CX = 960;
const CY = 380;
const RADIUS = 280;
const FROZEN_ANGLE_DEG = -35;

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const arcOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const vectorScale = interpolate(frame, [10, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - (1 - t) * (1 - t),
  });
  const titleOpacity = interpolate(frame, [40, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(frame, [40, 65], [24, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const angleRad = (FROZEN_ANGLE_DEG * Math.PI) / 180;
  const pointX = CX + RADIUS * Math.cos(angleRad);
  const pointY = CY + RADIUS * Math.sin(angleRad);
  const tangentDeg = FROZEN_ANGLE_DEG + 90;

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: 'absolute', top: 0, left: 0 }}>
        <circle
          cx={CX}
          cy={CY}
          r={RADIUS}
          fill="none"
          stroke={colors.cyan}
          strokeOpacity={0.35}
          strokeWidth={2}
          strokeDasharray="6 10"
          opacity={arcOpacity}
        />
        <circle cx={pointX} cy={pointY} r={10} fill={colors.gold} opacity={vectorScale} />
        <g opacity={vectorScale}>
          <VelocityVector x={pointX} y={pointY} angleDeg={tangentDeg} length={220} color={colors.gold} strokeWidth={7} />
        </g>
      </svg>

      <div style={{ position: 'absolute', left: 0, right: 0, top: 690, display: 'flex', justifyContent: 'center' }}>
        <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, textAlign: 'center' }}>
          <div
            style={{
              fontFamily: headlineFontFamily,
              fontWeight: 700,
              fontSize: 84,
              color: colors.textPrimary,
              maxWidth: 1400,
            }}
          >
            Physics You Were Never Taught
          </div>
          <div
            style={{
              fontFamily: captionFontFamily,
              fontSize: 30,
              color: colors.textMuted,
              marginTop: 24,
            }}
          >
            gravity was never the danger — inertia was.
          </div>
        </div>
      </div>

      <Caption text="Gravity was never the danger. Inertia was." fadeInStart={0} />
    </AbsoluteFill>
  );
};
