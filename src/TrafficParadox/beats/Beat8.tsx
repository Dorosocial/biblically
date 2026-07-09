import React from 'react';
import {useCurrentFrame} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {ROUTE_LEFT, ROUTE_RIGHT, ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST} from '../geometry';

// Beat 8 (900-1020, 0:30-0:34): HARD PULL-BACK to wide. A mass of dots
// now floods toward the shortcut from both roads.
export const Beat8: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat8.duration;

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={SHOTS.wide}
        showShortcut
        showMidNodes
        streams={[
          {route: ROUTE_LEFT, count: 2, speed: 0.006},
          {route: ROUTE_RIGHT, count: 2, speed: 0.006, phase: 0.5},
          {route: ROUTE_MIX_VIA_M1_FIRST, count: 10, speed: 0.012, phase: 0.1, radius: 9},
          {route: ROUTE_MIX_VIA_M2_FIRST, count: 10, speed: 0.012, phase: 0.55, radius: 9},
        ]}
      />
      <Caption
        frame={frame}
        duration={duration}
        text="Soon, almost every driver chooses the new, faster route."
      />
    </>
  );
};
