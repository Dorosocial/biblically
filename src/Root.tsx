import React from 'react';
import {Composition} from 'remotion';
import {BraessParadox} from './BraessParadox';
import {FPS, DURATION_IN_FRAMES, WIDTH, HEIGHT} from './BraessParadox/constants';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="BraessParadox"
        component={BraessParadox}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
