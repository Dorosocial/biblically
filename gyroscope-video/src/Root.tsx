import React from 'react';
import {Composition} from 'remotion';
import {GyroscopicPrecession} from './GyroscopicPrecession';
import {DURATION_IN_FRAMES, FPS, WIDTH, HEIGHT} from './timing';
import {HowSmallIsAProton} from './proton/HowSmallIsAProton';
import {
  DURATION_IN_FRAMES as PROTON_DURATION_IN_FRAMES,
  FPS as PROTON_FPS,
  WIDTH as PROTON_WIDTH,
  HEIGHT as PROTON_HEIGHT,
} from './proton/timing';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GyroscopicPrecession"
        component={GyroscopicPrecession}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="HowSmallIsAProton"
        component={HowSmallIsAProton}
        durationInFrames={PROTON_DURATION_IN_FRAMES}
        fps={PROTON_FPS}
        width={PROTON_WIDTH}
        height={PROTON_HEIGHT}
      />
    </>
  );
};
