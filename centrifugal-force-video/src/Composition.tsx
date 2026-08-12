// Top-level composition: narration audio (synced from frame 1, real
// transcribed timing — see timeline.ts), the R3F scene, and HTML caption
// overlays on top.
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {PhysicsScene, BACKDROP_COLOR} from './scene/PhysicsScene';
import {Captions} from './overlays/Captions';
import {WIDTH, HEIGHT} from './timeline';

export const CentrifugalForce: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: BACKDROP_COLOR}}>
      <Audio src={staticFile('narration.mp3')} />

      {/* SOUND DESIGN — frame ~261: the release moment, arm disconnects. Placeholder for a sharp mechanical "snap"/release sting. */}
      {/* SOUND DESIGN — frame ~741: perspective switch, rotating-frame POV takes over the same release. Placeholder for a whoosh/pitch-shift transition. */}
      {/* SOUND DESIGN — frame ~1470: final merge back to a single resolved view. Placeholder for a settling/resolving chord. */}

      <ThreeCanvas width={WIDTH} height={HEIGHT} linear gl={{toneMappingExposure: 1.5}}>
        <PhysicsScene />
      </ThreeCanvas>

      <Captions />
    </AbsoluteFill>
  );
};
