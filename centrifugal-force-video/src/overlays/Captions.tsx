// HTML/CSS label overlays: INWARD FORCE, CENTRIFUGAL, TANGENTIAL MOTION,
// ROTATING FRAME, OUTSIDE VIEW, the split-screen contrast labels, etc.
// Animated drift+fade entrances (never a static pop-in) driven directly by
// frame — same determinism rule as the 3D scene.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {LABELS} from '../timeline';
import {clamp01, easeOut} from '../scene/math';

const labelStyle = (opacity: number, driftPx: number, small: boolean): React.CSSProperties => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: `translate(-50%, -50%) translateY(${driftPx}px)`,
  opacity,
  fontFamily: '"Helvetica Neue", Arial, sans-serif',
  fontWeight: 800,
  fontSize: small ? 26 : 42,
  letterSpacing: small ? 2 : 5,
  color: '#f5f8ff',
  textShadow: '0 0 20px rgba(150,190,255,0.85), 0 0 50px rgba(150,190,255,0.4)',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  maxWidth: '92%',
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
        const driftPx = (1 - easeOut(inT)) * 20 - easeOut(Math.max(0, outT)) * 12;
        return (
          <div
            key={label.text + label.start}
            style={{
              ...labelStyle(opacity, driftPx, Boolean(label.small)),
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
