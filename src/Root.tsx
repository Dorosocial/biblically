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
import {TrafficParadox} from './TrafficParadox';
import {
  FPS as TP_FPS,
  DURATION_IN_FRAMES as TP_DURATION,
  WIDTH as TP_WIDTH,
  HEIGHT as TP_HEIGHT,
} from './TrafficParadox/constants';
import {BraessHook} from './BraessHook';
import {
  FPS as BH_FPS,
  DURATION_IN_FRAMES as BH_DURATION,
  WIDTH as BH_WIDTH,
  HEIGHT as BH_HEIGHT,
} from './BraessHook/constants';
import {TusiHook} from './TusiHook';
import {
  FPS as TH_FPS,
  DURATION_IN_FRAMES as TH_DURATION,
  WIDTH as TH_WIDTH,
  HEIGHT as TH_HEIGHT,
} from './TusiHook/constants';

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
      <Composition
        id="TrafficParadox"
        component={TrafficParadox}
        durationInFrames={TP_DURATION}
        fps={TP_FPS}
        width={TP_WIDTH}
        height={TP_HEIGHT}
      />
      <Composition
        id="BraessHook"
        component={BraessHook}
        durationInFrames={BH_DURATION}
        fps={BH_FPS}
        width={BH_WIDTH}
        height={BH_HEIGHT}
      />
      <Composition
        id="TusiHook"
        component={TusiHook}
        durationInFrames={TH_DURATION}
        fps={TH_FPS}
        width={TH_WIDTH}
        height={TH_HEIGHT}
      />
    </>
  );
};
