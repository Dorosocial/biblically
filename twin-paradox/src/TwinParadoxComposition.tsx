import React, {Suspense} from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Scene} from './Scene';
import {Overlay} from './Overlay';
import {WIDTH, HEIGHT} from './timing';

// Plain dark-navy backdrop -- no grid pattern, no HDRI/environment file.
// Chosen to make the cool clock/grid glow and the warm engine/Earth-city
// highlights pop, while staying calm enough for the split-frame text beats.
const BACKDROP = '#070b14';

export const TwinParadoxComposition: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: BACKDROP}}>
      <Audio src={staticFile('narration.mp3')} />
      <Suspense fallback={null}>
        <ThreeCanvas
          width={WIDTH}
          height={HEIGHT}
          linear
          flat
          legacy
          gl={{antialias: false, alpha: false, powerPreference: 'high-performance'}}
        >
          <color attach="background" args={[BACKDROP]} />
          <Scene frame={frame} />
        </ThreeCanvas>
      </Suspense>
      <AbsoluteFill>
        <Overlay frame={frame} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
