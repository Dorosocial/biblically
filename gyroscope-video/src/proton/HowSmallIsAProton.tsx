import React, {Suspense, useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {WIDTH, HEIGHT, CUE} from './timing';
import {Scene} from './scene/Scene';
import {Labels} from './overlays/Labels';
import {getSceneState} from './physics';
import {BACKDROP_COLOR} from './scene/Lighting';

// During the "freeze" beat the scene must render as a genuinely still
// frame (not just a slow camera) — pin every per-frame calculation to the
// shot's first frame instead of letting `frame` advance through it.
const getFrozenFrame = (frame: number): number =>
  frame >= CUE.freezeReset && frame < CUE.reverseToEmptySpace ? CUE.freezeReset : frame;

/**
 * Signals Remotion once every suspending descendant inside the enclosing
 * <Suspense> has resolved (a plain, non-suspending sibling's effects only
 * run after the whole boundary commits) — this is what actually gates
 * frame capture on texture readiness.
 *
 * Why this is needed: drei's `useTexture` (used by Basketball/Earth/
 * Silhouette) integrates with React Suspense, but Suspense alone doesn't
 * tell Remotion's headless capture to wait — nothing was registering a
 * `delayRender()`. Under concurrent rendering (multiple browser tabs each
 * loading the page fresh), that raced: whichever tab's textures hadn't
 * finished decoding yet would get its frame captured against a blank/
 * still-suspended canvas. Confirmed via bisection on the real rendered
 * output — scattered blank frames through the first ~200 frames wherever
 * a texture-using object was newly visible, not a single contiguous range,
 * exactly what a per-worker startup race looks like.
 */
const RenderReadySignal: React.FC<{handle: number}> = ({handle}) => {
  useEffect(() => {
    continueRender(handle);
  }, [handle]);
  return null;
};

/**
 * "How Small Is a Proton?" — a continuous scale-zoom explainer.
 *
 * One persistent <ThreeCanvas> for the whole video (no per-shot remounts).
 * Every visual is a pure function of `frame` — see physics.ts (choreography)
 * and camera/cameraTimeline.ts (camera language). The "continuous zoom"
 * illusion is built from crossfades between fixed-scale objects rather than
 * one true 19-orders-of-magnitude 3D coordinate system — see physics.ts's
 * top comment for why.
 *
 * Motion blur for the massive scale transitions is faked cheaply with a
 * CSS blur on the canvas container, driven by `blurPx` from physics.ts,
 * rather than a full postprocessing pipeline.
 */
export const HowSmallIsAProton: React.FC = () => {
  const frame = useCurrentFrame();
  const {blurPx, freeze} = getSceneState(frame);
  // Registered once per mount (not per frame) — gates the very first frame
  // capture until textures are ready, same as it would for a single still.
  const [renderHandle] = useState(() => delayRender('Waiting for R3F textures to load'));

  return (
    <AbsoluteFill style={{backgroundColor: BACKDROP_COLOR}}>
      <Audio src={staticFile('proton-narration.mp3')} />
      <AbsoluteFill style={{filter: blurPx > 0.05 ? `blur(${blurPx.toFixed(2)}px)` : undefined}}>
        <ThreeCanvas width={WIDTH} height={HEIGHT}>
          <Suspense fallback={null}>
            <Scene frame={freeze ? getFrozenFrame(frame) : frame} />
            <RenderReadySignal handle={renderHandle} />
          </Suspense>
        </ThreeCanvas>
      </AbsoluteFill>
      <Labels frame={frame} />
    </AbsoluteFill>
  );
};
