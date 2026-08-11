import React from 'react';
import {Composition} from 'remotion';
import {ColorOfNothing} from './ColorOfNothing';
import {FPS, DURATION_FRAMES} from './timing';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ColorOfNothing"
      component={ColorOfNothing}
      durationInFrames={DURATION_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
