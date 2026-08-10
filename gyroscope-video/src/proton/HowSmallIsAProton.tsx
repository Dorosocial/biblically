import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
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

  return (
    <AbsoluteFill style={{backgroundColor: BACKDROP_COLOR}}>
      <Audio src={staticFile('proton-narration.mp3')} />
      <AbsoluteFill style={{filter: blurPx > 0.05 ? `blur(${blurPx.toFixed(2)}px)` : undefined}}>
        <ThreeCanvas width={WIDTH} height={HEIGHT}>
          <Scene frame={freeze ? getFrozenFrame(frame) : frame} />
        </ThreeCanvas>
      </AbsoluteFill>
      <Labels frame={frame} />
    </AbsoluteFill>
  );
};
