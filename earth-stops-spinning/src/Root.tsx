import React from 'react';
import { Composition } from 'remotion';
import { EarthStopsSpinning } from './compositions/EarthStopsSpinning';
import { layout } from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="EarthStopsSpinning"
        component={EarthStopsSpinning}
        durationInFrames={2100}
        fps={layout.fps}
        width={layout.width}
        height={layout.height}
      />
    </>
  );
};
