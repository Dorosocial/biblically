import React from 'react';
import {Composition} from 'remotion';
import {CentrifugalForce} from './Composition';
import {DURATION_IN_FRAMES, FPS, WIDTH, HEIGHT} from './timeline';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CentrifugalForce"
      component={CentrifugalForce}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
