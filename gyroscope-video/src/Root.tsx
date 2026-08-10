import React from 'react';
import {Composition} from 'remotion';
import {GyroscopicPrecession} from './GyroscopicPrecession';
import {DURATION_IN_FRAMES, FPS, WIDTH, HEIGHT} from './timing';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="GyroscopicPrecession"
      component={GyroscopicPrecession}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
