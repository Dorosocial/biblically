import React from 'react';
import {interpolate, AbsoluteFill} from 'remotion';
import {WIDTH, HEIGHT} from './constants';
import {COLORS} from './colors';

const BAR_COUNT = 20;
const BAR_COLORS = [COLORS.green, COLORS.pink, COLORS.red];
const BAR_OPACITY = [0.22, 0.13, 0.09];

// A brief deterministic glitch/flash — no Math.random(), just a frame-
// seeded sine for horizontal jitter only (never for opacity), so peak
// intensity is always known and bounded. Signals a tone shift.
export const Glitch: React.FC<{frame: number}> = ({frame}) => {
  const flashOpacity = interpolate(frame, [0, 2, 7], [0, 0.35, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const barsOpacity = interpolate(frame, [0, 3, 16, 22], [1, 1, 0.2, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bars = Array.from({length: BAR_COUNT}, (_, i) => {
    const seed = i * 37.13 + frame * 12.7;
    const xOffset = Math.sin(seed * 0.6) * 110;
    const barH = HEIGHT / BAR_COUNT;
    const barY = i * barH;
    const color = BAR_COLORS[i % BAR_COLORS.length];
    const opacity = BAR_OPACITY[i % BAR_OPACITY.length];
    return <rect key={i} x={xOffset} y={barY} width={WIDTH} height={barH} fill={color} opacity={opacity * barsOpacity} />;
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT} style={{position: 'absolute', top: 0, left: 0}}>
        {bars}
      </svg>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: COLORS.bone, opacity: flashOpacity}} />
    </AbsoluteFill>
  );
};
