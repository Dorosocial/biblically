import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { GridBackground } from './GridBackground';
import { HookScene } from './scenes/HookScene';
import { RotationExplainerScene } from './scenes/RotationExplainerScene';
import { FreezeFrameScene } from './scenes/FreezeFrameScene';
import { SpeedCompareScene } from './scenes/SpeedCompareScene';
import { LatitudeGraphScene } from './scenes/LatitudeGraphScene';
import { OutroScene } from './scenes/OutroScene';

/** Scene timing table — the single source of truth for the cut points. */
export const SCENES = [
  { name: 'Hook', from: 0, durationInFrames: 240 },
  { name: 'RotationExplainer', from: 240, durationInFrames: 480 },
  { name: 'FreezeFrame', from: 720, durationInFrames: 540 },
  { name: 'SpeedCompare', from: 1260, durationInFrames: 360 },
  { name: 'LatitudeGraph', from: 1620, durationInFrames: 360 },
  { name: 'Outro', from: 1980, durationInFrames: 120 },
] as const;

export const TOTAL_DURATION_IN_FRAMES = SCENES.reduce(
  (max, s) => Math.max(max, s.from + s.durationInFrames),
  0,
);

export const EarthStopsSpinning: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />

      <Sequence from={SCENES[0].from} durationInFrames={SCENES[0].durationInFrames}>
        <HookScene />
      </Sequence>

      <Sequence from={SCENES[1].from} durationInFrames={SCENES[1].durationInFrames}>
        <RotationExplainerScene />
      </Sequence>

      <Sequence from={SCENES[2].from} durationInFrames={SCENES[2].durationInFrames}>
        <FreezeFrameScene />
      </Sequence>

      <Sequence from={SCENES[3].from} durationInFrames={SCENES[3].durationInFrames}>
        <SpeedCompareScene />
      </Sequence>

      <Sequence from={SCENES[4].from} durationInFrames={SCENES[4].durationInFrames}>
        <LatitudeGraphScene />
      </Sequence>

      <Sequence from={SCENES[5].from} durationInFrames={SCENES[5].durationInFrames}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
