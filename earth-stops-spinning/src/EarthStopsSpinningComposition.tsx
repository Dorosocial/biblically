import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Hook} from './scenes/Hook';
import {FreezeFrame} from './scenes/FreezeFrame';
import {theme} from './theme';

export const HOOK_DURATION = 150; // 5s @ 30fps
export const FREEZE_FRAME_DURATION = 180; // 6s @ 30fps
export const TOTAL_DURATION = HOOK_DURATION + FREEZE_FRAME_DURATION;

export const EarthStopsSpinningComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: theme.color.background}}>
      <Sequence from={0} durationInFrames={HOOK_DURATION}>
        <Hook />
      </Sequence>
      <Sequence from={HOOK_DURATION} durationInFrames={FREEZE_FRAME_DURATION}>
        <FreezeFrame />
      </Sequence>
    </AbsoluteFill>
  );
};
