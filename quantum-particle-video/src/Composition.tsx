// Top-level composition: narration audio (synced from frame 1, real
// transcribed timing — see timeline.ts), the R3F scene, and HTML caption
// overlays on top.
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {QuantumScene, BACKDROP_COLOR} from './scene/QuantumScene';
import {Captions} from './overlays/Captions';
import {WIDTH, HEIGHT} from './timeline';

export const QuantumDoubleSlit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: BACKDROP_COLOR}}>
      <Audio src={staticFile('narration.mp3')} />

      {/* SOUND DESIGN — frame ~241: ball-to-particle dissolve. Placeholder for a soft granular "shimmer" whoosh. */}
      {/* SOUND DESIGN — frame ~802: interference pattern begins forming. Placeholder for a rising shimmer/pad swell. */}
      {/* SOUND DESIGN — frame ~1454: measurement / collapse moment. Placeholder for a sharp, decisive "click"/snap sting. */}
      {/* SOUND DESIGN — frame ~2141: final rapid montage into freeze-frame. Placeholder for a fast rising sweep into a hard stop. */}

      {/* toneMappingExposure boosts overall brightness on top of the light/
          material tuning in QuantumScene — the previous render read too
          dark on typical phone/laptop screens. */}
      <ThreeCanvas width={WIDTH} height={HEIGHT} linear gl={{toneMappingExposure: 1.5}}>
        <QuantumScene />
      </ThreeCanvas>

      <Captions />
    </AbsoluteFill>
  );
};
