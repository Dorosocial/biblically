import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {
  ROUTE_LEFT,
  ROUTE_RIGHT,
  ROUTE_MIX_VIA_M1_FIRST,
  ROUTE_MIX_VIA_M2_FIRST,
} from '../geometry';

// Beat 4 (270-390): HARD PULL-BACK to the wide network view. Traffic from
// both original roads visibly converges toward the shortcut.
export const Beat4: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat4.duration;
  const creep = interpolate(frame, [0, duration], [0, 0.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={SHOTS.wide}
        showShortcut
        showMidNodes
        leftCongestion={creep * 0.4}
        rightCongestion={creep * 0.4}
        shortcutCongestion={creep}
        streams={[
          {route: ROUTE_LEFT, count: 2, speed: 0.0055, congestion: creep * 0.4},
          {route: ROUTE_RIGHT, count: 2, speed: 0.0055, phase: 0.5, congestion: creep * 0.4},
          {
            route: ROUTE_MIX_VIA_M1_FIRST,
            count: 6,
            speed: 0.011,
            phase: 0.1,
            radius: 10,
            congestion: creep,
          },
          {
            route: ROUTE_MIX_VIA_M2_FIRST,
            count: 6,
            speed: 0.011,
            phase: 0.4,
            radius: 10,
            congestion: creep,
          },
        ]}
      />
      <Caption
        frame={frame}
        duration={duration}
        text={'But every driver is thinking the same thing: "this new route is faster for me."'}
      />
    </>
  );
};
