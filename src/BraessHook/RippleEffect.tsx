import React from 'react';
import {COLORS} from './colors';

export const RippleEffect: React.FC<{
  cx: number;
  cy: number;
  frame: number;
  maxRadius?: number;
  ringCount?: number;
  stagger?: number;
  growFrames?: number;
  color?: string;
}> = ({cx, cy, frame, maxRadius = 720, ringCount = 4, stagger = 18, growFrames = 60, color = COLORS.pink}) => {
  const rings = [];
  for (let i = 0; i < ringCount; i++) {
    const localFrame = frame - i * stagger;
    if (localFrame < 0) continue;
    const progress = Math.min(1, localFrame / growFrames);
    const radius = 20 + progress * maxRadius;
    const opacity = (1 - progress) * 0.75;
    if (opacity <= 0.01) continue;
    rings.push(
      <circle key={i} cx={cx} cy={cy} r={radius} fill="none" stroke={color} strokeWidth={6} opacity={opacity} />
    );
  }
  return <>{rings}</>;
};
