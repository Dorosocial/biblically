import React from 'react';
import {useCurrentFrame} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {RippleEffect} from '../RippleEffect';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {
  ROUTE_LEFT,
  ROUTE_RIGHT,
  ROUTE_MIX_VIA_M1_FIRST,
  ROUTE_MIX_VIA_M2_FIRST,
} from '../geometry';

// Beat 7 (810-900, 0:27-0:30): HARD CUT. A ripple spreads outward from
// the shortcut across the map — awareness spreading.
export const Beat7: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat7.duration;

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={SHOTS.rippleMedium}
        showShortcut
        showMidNodes
        streams={[
          {route: ROUTE_LEFT, count: 6, speed: 0.006},
          {route: ROUTE_RIGHT, count: 6, speed: 0.006, phase: 0.5},
          {route: ROUTE_MIX_VIA_M1_FIRST, count: 4, speed: 0.013, phase: 0.15, radius: 9},
          {route: ROUTE_MIX_VIA_M2_FIRST, count: 4, speed: 0.013, phase: 0.6, radius: 9},
        ]}
      >
        <RippleEffect cx={540} cy={890} frame={frame} />
      </NetworkScene>
      <Caption frame={frame} duration={duration} text="But then, everyone notices." />
    </>
  );
};
