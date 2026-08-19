import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CUE, DURATION_IN_FRAMES} from '../timing';
import {kf} from '../physics';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The "microscope lens" frame — a circular vignette that appears at
 * CUE.microscope and tightens gradually as the dive continues, selling the
 * idea that we're looking through an increasingly powerful lens rather
 * than just a camera push.
 */
const MicroscopeVignette: React.FC<{frame: number}> = ({frame}) => {
  if (frame < CUE.microscope) return null;
  const t = kf(frame, CUE.microscope, DURATION_IN_FRAMES, 0, 1, true);
  const introOpacity = kf(frame, CUE.microscope, CUE.microscope + 10, 0, 1, true);
  const radiusPct = lerp(38, 26, t); // tightens as the dive continues

  return (
    <div style={{position: 'absolute', inset: 0, opacity: introOpacity, pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, transparent ${radiusPct - 1.5}%, rgba(0,0,0,0.97) ${radiusPct + 1}%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: `${radiusPct * 2}%`,
          aspectRatio: '1 / 1',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: '2px solid rgba(234,243,255,0.55)',
          boxShadow: '0 0 40px rgba(234,243,255,0.25) inset',
        }}
      />
    </div>
  );
};

export const Overlays: React.FC<{frame: number}> = ({frame}) => (
  <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
    <MicroscopeVignette frame={frame} />
  </AbsoluteFill>
);
