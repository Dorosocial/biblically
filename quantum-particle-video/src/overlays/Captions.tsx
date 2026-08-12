// HTML/CSS label overlays: IMPOSSIBLE?, ONE PARTICLE, LEFT, RIGHT, NO,
// WHICH PATH?, ONE RESULT. Animated drift+fade entrances (never a static
// pop-in) driven directly by frame — same determinism rule as the 3D scene.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {LABELS} from '../timeline';
import {clamp01, easeOut} from '../scene/math';

const labelStyle = (opacity: number, driftPx: number, big: boolean): React.CSSProperties => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: `translate(-50%, -50%) translateY(${driftPx}px)`,
  opacity,
  fontFamily: '"Helvetica Neue", Arial, sans-serif',
  fontWeight: 800,
  fontSize: big ? 120 : 46,
  letterSpacing: big ? 2 : 6,
  color: '#eaf6ff',
  textShadow: '0 0 24px rgba(120,200,255,0.85), 0 0 60px rgba(120,200,255,0.4)',
  whiteSpace: 'nowrap',
});

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {LABELS.map((label) => {
        if (frame < label.start - 6 || frame > label.end + 6) return null;
        const inT = clamp01((frame - label.start) / 12);
        const outT = clamp01((frame - (label.end - 10)) / 10);
        const opacity = easeOut(inT) * (1 - easeOut(Math.max(0, outT)));
        const driftPx = (1 - easeOut(inT)) * 22 - easeOut(Math.max(0, outT)) * 14;
        const big = label.text === 'NO';
        return (
          <div
            key={label.text + label.start}
            style={{
              ...labelStyle(opacity, driftPx, big),
              left: `${label.x}%`,
              top: `${label.y}%`,
            }}
          >
            {label.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
