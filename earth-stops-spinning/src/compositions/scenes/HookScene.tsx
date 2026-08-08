import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../../theme';
import { headlineFontFamily, captionFontFamily } from '../../fonts';
import {
  EQUATOR_VELOCITY_KMH,
  OMEGA,
  VISUAL_SPEEDUP_FACTOR,
} from '../../physics/rotation';
import { Earth, EarthMarker } from '../shared/Earth';
import { Caption } from '../shared/Caption';
import { SceneHeading } from '../shared/SceneHeading';

const DEG_PER_SEC = OMEGA * (180 / Math.PI) * VISUAL_SPEEDUP_FACTOR;

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rotationDeg = DEG_PER_SEC * (frame / fps);

  const readoutRaw = interpolate(frame, [30, 150], [0, EQUATOR_VELOCITY_KMH], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const introOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <SceneHeading eyebrow="Right now" title="You are moving." />

      <div
        style={{
          position: 'absolute',
          left: 96,
          top: 420,
          opacity: introOpacity,
        }}
      >
        <div
          style={{
            fontFamily: captionFontFamily,
            fontSize: 30,
            color: colors.textMuted,
            marginBottom: 8,
          }}
        >
          your speed, standing still, at the equator
        </div>
        <div
          style={{
            fontFamily: headlineFontFamily,
            fontWeight: 700,
            fontSize: 140,
            color: colors.gold,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {Math.round(readoutRaw).toLocaleString()}
        </div>
        <div
          style={{
            fontFamily: headlineFontFamily,
            fontWeight: 600,
            fontSize: 40,
            color: colors.textPrimary,
            marginTop: 4,
          }}
        >
          km/h
        </div>
      </div>

      <svg
        width={1920}
        height={1080}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Earth cx={1330} cy={500} radius={300} rotationDeg={rotationDeg} latitudeRingsDeg={[30, 60]} />
        <EarthMarker
          cx={1330}
          cy={500}
          radius={300}
          latitudeDeg={0}
          angleDeg={rotationDeg}
          color={colors.gold}
          label="you"
          labelFontFamily={headlineFontFamily}
        />
      </svg>

      <Caption
        text="Right now, you're moving at 1,670 kilometers an hour. You don't feel a thing."
        fadeInStart={20}
      />
    </AbsoluteFill>
  );
};
