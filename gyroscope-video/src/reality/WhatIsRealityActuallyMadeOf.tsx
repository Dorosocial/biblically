import React, {Suspense, useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {WIDTH, HEIGHT} from './timing';
import {Scene} from './scene/Scene';
import {Overlays} from './overlays/Overlays';
import {BACKDROP_COLOR} from './scene/Lighting';

const RenderReadySignal: React.FC<{handle: number}> = ({handle}) => {
  useEffect(() => {
    continueRender(handle);
  }, [handle]);
  return null;
};

/**
 * "What Is Reality Actually Made Of?" — opening sequence (0-22s).
 *
 * NO narration audio: every cue point in timing.ts is a fixed shot-list
 * timestamp from the brief, not a transcription, and the narration lines
 * are carried entirely by the on-screen captions in overlays/Overlays.tsx.
 *
 * Same architecture as the proton composition: one persistent <ThreeCanvas>,
 * every visual a pure function of `frame` (physics.ts for choreography,
 * camera/cameraTimeline.ts for camera language).
 */
export const WhatIsRealityActuallyMadeOf: React.FC = () => {
  const frame = useCurrentFrame();
  const [renderHandle] = useState(() => delayRender('Waiting for R3F scene to be ready'));

  return (
    <AbsoluteFill style={{backgroundColor: BACKDROP_COLOR}}>
      <ThreeCanvas width={WIDTH} height={HEIGHT}>
        <Suspense fallback={null}>
          <Scene frame={frame} />
          <RenderReadySignal handle={renderHandle} />
        </Suspense>
      </ThreeCanvas>
      <Overlays frame={frame} />
    </AbsoluteFill>
  );
};
