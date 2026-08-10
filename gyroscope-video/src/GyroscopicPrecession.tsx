import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {WIDTH, HEIGHT} from './timing';
import {Scene} from './scene/Scene';
import {Labels} from './overlays/Labels';
import {BACKDROP_COLOR} from './scene/Lighting';

/**
 * "Gyroscopic Precession Bicycle Wheel"
 *
 * One persistent <ThreeCanvas> for the whole video (no per-shot remounts),
 * so the wheel/camera/trails stay continuous across cuts and the final
 * frame can rhyme with frame 0 for a seamless loop. Every visual is a pure
 * function of `frame` — see physics.ts and camera/cameraTimeline.ts.
 */
export const GyroscopicPrecession: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: BACKDROP_COLOR}}>
      <Audio src={staticFile('narration.mp3')} />
      <ThreeCanvas width={WIDTH} height={HEIGHT}>
        <Scene frame={frame} />
      </ThreeCanvas>
      <Labels frame={frame} />
    </AbsoluteFill>
  );
};
