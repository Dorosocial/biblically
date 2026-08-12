import React from 'react';
import {Composition} from 'remotion';
import {QuantumDoubleSlit} from './Composition';
import {DURATION_IN_FRAMES, FPS, WIDTH, HEIGHT} from './timeline';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="QuantumDoubleSlit"
      component={QuantumDoubleSlit}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
