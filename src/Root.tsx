import React from 'react';
import {Composition} from 'remotion';
import {BraessParadox} from './BraessParadox';
import {
  FPS as BRAESS_FPS,
  DURATION_IN_FRAMES as BRAESS_DURATION,
  WIDTH as BRAESS_WIDTH,
  HEIGHT as BRAESS_HEIGHT,
} from './BraessParadox/constants';
import {TusiCouple} from './TusiCouple';
import {
  FPS as TUSI_FPS,
  DURATION_IN_FRAMES as TUSI_DURATION,
  WIDTH as TUSI_WIDTH,
  HEIGHT as TUSI_HEIGHT,
} from './TusiCouple/constants';
import {PercentageTrap} from './PercentageTrap';
import {
  FPS as PT_FPS,
  DURATION_IN_FRAMES as PT_DURATION,
  WIDTH as PT_WIDTH,
  HEIGHT as PT_HEIGHT,
} from './PercentageTrap/constants';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="BraessParadox"
        component={BraessParadox}
        durationInFrames={BRAESS_DURATION}
        fps={BRAESS_FPS}
        width={BRAESS_WIDTH}
        height={BRAESS_HEIGHT}
      />
      <Composition
        id="TusiCouple"
        component={TusiCouple}
        durationInFrames={TUSI_DURATION}
        fps={TUSI_FPS}
        width={TUSI_WIDTH}
        height={TUSI_HEIGHT}
      />
      <Composition
        id="PercentageTrap"
        component={PercentageTrap}
        durationInFrames={PT_DURATION}
        fps={PT_FPS}
        width={PT_WIDTH}
        height={PT_HEIGHT}
      />
    </>
  );
};
