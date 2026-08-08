import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../theme';
import { headlineFontFamily, captionFontFamily } from '../../fonts';
import { EQUATOR_VELOCITY_MPS, SPEED_OF_SOUND_MPS, machNumber, msToKmh } from '../../physics/rotation';
import { Caption } from '../shared/Caption';
import { SceneHeading } from '../shared/SceneHeading';

type Reference = {
  label: string;
  mps: number;
  isHero?: boolean;
};

const REFERENCES: Reference[] = [
  { label: 'walking pace', mps: 1.4 },
  { label: 'highway driving', mps: 30 },
  { label: 'speed of sound', mps: SPEED_OF_SOUND_MPS },
  { label: 'you, at the equator', mps: EQUATOR_VELOCITY_MPS, isHero: true },
];

const CHART_LEFT = 460;
const CHART_MAX_WIDTH = 1000;
const MAX_SCALE_MPS = EQUATOR_VELOCITY_MPS * 1.08;
const BAR_HEIGHT = 68;
const ROW_GAP = 36;
const CHART_TOP = 270;

const mpsToPx = (mps: number) => (mps / MAX_SCALE_MPS) * CHART_MAX_WIDTH;

const BarRow: React.FC<{ ref_: Reference; index: number; startFrame: number }> = ({
  ref_,
  index,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const growFrom = startFrame + index * 20;
  const grow = interpolate(frame, [growFrom, growFrom + 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - (1 - t) * (1 - t),
  });

  const currentMps = ref_.mps * grow;
  const crossedSound = ref_.isHero && currentMps > SPEED_OF_SOUND_MPS;
  const barColor = ref_.isHero ? (crossedSound ? colors.coral : colors.gold) : colors.cyan;

  const y = CHART_TOP + index * (BAR_HEIGHT + ROW_GAP);
  const barWidth = Math.max(mpsToPx(currentMps), 3);

  const labelOpacity = interpolate(frame, [growFrom, growFrom + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <g>
      <text
        x={CHART_LEFT - 30}
        y={y + BAR_HEIGHT / 2}
        fill={colors.textPrimary}
        fontFamily={captionFontFamily}
        fontWeight={500}
        fontSize={30}
        textAnchor="end"
        dominantBaseline="middle"
        opacity={labelOpacity}
      >
        {ref_.label}
      </text>
      <rect x={CHART_LEFT} y={y} width={CHART_MAX_WIDTH} height={BAR_HEIGHT} fill={colors.panel} rx={10} />
      <rect x={CHART_LEFT} y={y} width={barWidth} height={BAR_HEIGHT} fill={barColor} rx={10} />
      <text
        x={CHART_LEFT + barWidth + 24}
        y={y + BAR_HEIGHT / 2 - 12}
        fill={barColor}
        fontFamily={headlineFontFamily}
        fontWeight={700}
        fontSize={32}
        dominantBaseline="middle"
        opacity={grow > 0.05 ? 1 : 0}
      >
        {currentMps.toFixed(1)} m/s
      </text>
      <text
        x={CHART_LEFT + barWidth + 24}
        y={y + BAR_HEIGHT / 2 + 22}
        fill={colors.textMuted}
        fontFamily={captionFontFamily}
        fontWeight={400}
        fontSize={22}
        dominantBaseline="middle"
        opacity={grow > 0.05 ? 1 : 0}
      >
        {msToKmh(currentMps).toFixed(0)} km/h · Mach {machNumber(currentMps).toFixed(2)}
      </text>
    </g>
  );
};

export const SpeedCompareScene: React.FC = () => {
  const frame = useCurrentFrame();

  const soundLineX = CHART_LEFT + mpsToPx(SPEED_OF_SOUND_MPS);
  const soundLineOpacity = interpolate(frame, [140, 165], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bigNumberOpacity = interpolate(frame, [200, 230], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <SceneHeading eyebrow="For comparison" title="465 m/s isn't a breeze." />

      <svg width={1920} height={1080} style={{ position: 'absolute', top: 0, left: 0 }}>
        {REFERENCES.map((r, i) => (
          <BarRow key={r.label} ref_={r} index={i} startFrame={20} />
        ))}

        <line
          x1={soundLineX}
          y1={CHART_TOP - 30}
          x2={soundLineX}
          y2={CHART_TOP + REFERENCES.length * (BAR_HEIGHT + ROW_GAP) - ROW_GAP + 10}
          stroke={colors.coral}
          strokeWidth={2}
          strokeDasharray="8 8"
          opacity={soundLineOpacity * 0.8}
        />
        <text
          x={soundLineX}
          y={CHART_TOP - 42}
          fill={colors.coral}
          fontFamily={headlineFontFamily}
          fontWeight={600}
          fontSize={24}
          textAnchor="middle"
          opacity={soundLineOpacity}
        >
          Mach 1
        </text>
      </svg>

      <div
        style={{
          position: 'absolute',
          right: 110,
          bottom: 150,
          textAlign: 'right',
          opacity: bigNumberOpacity,
        }}
      >
        <div
          style={{
            fontFamily: headlineFontFamily,
            fontWeight: 700,
            fontSize: 80,
            color: colors.coral,
          }}
        >
          Mach {machNumber(EQUATOR_VELOCITY_MPS).toFixed(2)}
        </div>
        <div style={{ fontFamily: captionFontFamily, fontSize: 24, color: colors.textMuted }}>
          faster than the speed of sound
        </div>
      </div>

      <Caption text="465 meters per second isn't a strong wind. It's Mach 1.3." fadeInStart={20} />
    </AbsoluteFill>
  );
};
