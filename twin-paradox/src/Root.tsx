import React from 'react';
import {Composition} from 'remotion';
import {TwinParadoxComposition} from './TwinParadoxComposition';
import {DURATION_IN_FRAMES, FPS, WIDTH, HEIGHT} from './timing';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TwinParadox"
      component={TwinParadoxComposition}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
