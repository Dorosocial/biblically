import React, {Suspense, useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
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
 * "What If Our Entire Universe Is Inside a Black Hole?" — long-form (16:9)
 * documentary explainer. Real 3-part narration, concatenated + transcribed
 * with Whisper into one continuous timeline (see timing.ts). NO on-screen
 * narration captions anywhere — only specific beats' own diagram text
 * (equations, "∞", etc., added as later sections are built) render in
 * Overlays. Being built section-by-section; currently: Section 1 only.
 */
export const WhatIfOurUniverseIsInsideABlackHole: React.FC = () => {
  const frame = useCurrentFrame();
  const s = getSceneState(frame);
  const [renderHandle] = useState(() => delayRender('Waiting for R3F scene to be ready'));

  return (
    <AbsoluteFill style={{backgroundColor: BACKDROP_COLOR}}>
      <Audio src={staticFile('audio/blackhole-universe/narration.mp3')} />
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
