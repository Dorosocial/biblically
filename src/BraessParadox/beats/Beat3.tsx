import React from 'react';
import {useCurrentFrame} from 'remotion';
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

// Beat 3 (480-690, 0:16-0:23): HARD PUNCH-IN onto the new road. A first
// wave of cars diverts onto it, visibly faster than the two original roads.
export const Beat3: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat3.duration;

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={SHOTS.shortcutPunch}
        showShortcut
        showMidNodes
        shortcutGlow
        streams={[
          {route: ROUTE_LEFT, count: 4, speed: 0.0055},
          {route: ROUTE_RIGHT, count: 4, speed: 0.0055, phase: 0.5},
          {route: ROUTE_MIX_VIA_M1_FIRST, count: 3, speed: 0.013, phase: 0.1, radius: 10},
          {route: ROUTE_MIX_VIA_M2_FIRST, count: 3, speed: 0.013, phase: 0.4, radius: 10},
        ]}
      />
      <Caption
        frame={frame}
        duration={duration}
        text="So it opens and at first it looks like a win. Drivers save time using it. But every driver"
      />
    </>
  );
};
