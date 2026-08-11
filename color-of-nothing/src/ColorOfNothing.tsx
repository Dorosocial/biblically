import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Scene} from './three/Scene';
import {PossibilityWords, BlackQuestionText, FourStageLabels, KeyTransitionLabels} from './overlays/Overlays';
import {FPS} from './timing';

/**
 * "What Is the Color of Absolutely Nothing?"
 *
 * Atmospheric, minimal — near-total darkness by default, punctuated by three
 * deliberate, richly-saturated color-burst moments. See src/timing.ts for
 * the full transcribed beat map this composition is built from.
 */
export const ColorOfNothing: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const seconds = frame / FPS;

  return (
    <AbsoluteFill style={{backgroundColor: '#000000'}}>
      {/*
        AUDIO — synced from frame 1 using real Whisper-transcribed timing
        (see src/timing.ts). This video calls for near-silence / a restrained
        ambient tone rather than typical SFX hits — sound design deserves its
        own pass once the visual cut is locked. Placeholder cues left below
        at the moments most likely to want a discreet audio touch:

        - [0.00s]  eyes appear (opening) — sub-bass room tone fades in under narration
        - [7.08s]  eyes appear (dark-room POV) — near-silent room ambience
        - [43.98s] eyes appear (BLACK? text beat) — held low drone
        - [65.08s] eyes appear (just before the ending) — same low drone returns
        - [27.80s] COLOR MOMENT 1 (color cycle) — a soft, brief swell
        - [38.50s] COLOR MOMENT 2 (world floods with color) — the one moment
                   that could support a real (but restrained) sonic bloom
        - [59.88s] COLOR MOMENT 3 (rainbow spectrum) — a soft, brief swell
        - [56.04s] KEY TRANSITION (sequential disappearance) — each of the
                   five stages (WORLD/LIGHT/EYE/OBSERVER/gone) could get its
                   own tiny, almost-inaudible drop-out in the room tone
      */}
      <Audio src={staticFile('audio/narration.mp3')} />

      <ThreeCanvas width={width} height={height} linear>
        <Scene seconds={seconds} />
      </ThreeCanvas>

      <PossibilityWords />
      <BlackQuestionText />
      <FourStageLabels />
      <KeyTransitionLabels />
    </AbsoluteFill>
  );
};
