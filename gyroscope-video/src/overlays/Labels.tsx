import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CUE} from '../timing';
import {kf} from '../physics';

/**
 * 2D HTML/CSS text labels. These are plain overlays (not 3D objects) per
 * spec — they're just text, not spatial vectors, so they don't need to live
 * inside the Three.js scene.
 */
const fadeOpacity = (frame: number, inStart: number, inEnd: number, outStart: number, outEnd: number) => {
  if (frame < inStart || frame > outEnd) return 0;
  if (frame < inEnd) return kf(frame, inStart, inEnd, 0, 1, true);
  if (frame > outStart) return kf(frame, outStart, outEnd, 1, 0, true);
  return 1;
};

const labelStyle: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  bottom: '14%',
  transform: 'translateX(-50%)',
  fontFamily: '"Helvetica Neue", Arial, sans-serif',
  fontWeight: 700,
  letterSpacing: '0.12em',
  color: '#eaf3ff',
  textShadow: '0 0 22px rgba(94,200,255,0.85), 0 2px 8px rgba(0,0,0,0.6)',
  padding: '0.5em 1.1em',
  border: '1px solid rgba(234,243,255,0.35)',
  borderRadius: 6,
  background: 'rgba(10,14,24,0.35)',
  backdropFilter: 'blur(2px)',
};

export const Labels: React.FC<{frame: number}> = ({frame}) => {
  const angularMomentumOpacity = fadeOpacity(frame, CUE.holdWheel + 4, CUE.holdWheel + 20, CUE.pointingAlongAxle - 10, CUE.pointingAlongAxle + 6);
  const angularMomentumOpacity2 = fadeOpacity(frame, CUE.secretAngular, CUE.secretAngular + 14, CUE.changeDirection - 10, CUE.changeDirection + 4);
  const gyroOpacity = fadeOpacity(frame, CUE.gyroscopicPrecession + 4, CUE.gyroscopicPrecession + 22, 1e9, 1e9 + 1);

  const showAngular = Math.max(angularMomentumOpacity, angularMomentumOpacity2);

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {showAngular > 0.001 && (
        <div style={{...labelStyle, fontSize: 30, opacity: showAngular}}>ANGULAR MOMENTUM</div>
      )}
      {gyroOpacity > 0.001 && (
        <div style={{...labelStyle, fontSize: 38, bottom: '18%', opacity: gyroOpacity}}>
          GYROSCOPIC PRECESSION
        </div>
      )}
    </AbsoluteFill>
  );
};
