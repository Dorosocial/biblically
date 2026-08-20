import React, {Suspense, useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {WIDTH, HEIGHT} from './timing';
import {getSceneState} from './physics';
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
 * "Scientists Are Terrified of This Black Hole" — NO narration audio.
 * See timing.ts for why the cue points are a fixed pacing estimate, not a
 * transcription, and overlays/Overlays.tsx for the on-screen captions that
 * carry every narration line instead.
 *
 * Gravitational lensing is a simplified geometric approximation, not a
 * ray-traced shader — see scene/BlackHole.tsx and shared/Starfield.tsx for
 * why and what was built instead.
 */
export const ScientistsAreTerrifiedOfThisBlackHole: React.FC = () => {
  const frame = useCurrentFrame();
  const s = getSceneState(frame);
  const [renderHandle] = useState(() => delayRender('Waiting for R3F scene to be ready'));

  return (
    <AbsoluteFill style={{backgroundColor: BACKDROP_COLOR}}>
      <ThreeCanvas width={WIDTH} height={HEIGHT}>
        <Suspense fallback={null}>
          <Scene frame={frame} s={s} />
          <RenderReadySignal handle={renderHandle} />
        </Suspense>
      </ThreeCanvas>
      <Overlays frame={frame} s={s} />
    </AbsoluteFill>
  );
};
