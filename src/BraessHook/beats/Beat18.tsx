import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST, NODE_M2} from '../geometry';

// Beat 18 (1860-1980, 1:02-1:06): hard cut back to the map — one
// pull-back reveals the full congested network, all red.
export const Beat18: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat18.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const pullback = interpolate(frame, [0, duration], [0, 1], clampOpts);
  const cx = NODE_M2.x + (540 - NODE_M2.x) * pullback;
  const cy = NODE_M2.y + (910 - NODE_M2.y) * pullback;
  const scale = 2.6 - 1.5 * pullback;
  const shot = {cx, cy, scale};

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        showShortcut
        showMidNodes
        leftCongestion={1}
        rightCongestion={1}
        shortcutCongestion={1}
        streams={[
          {route: ROUTE_MIX_VIA_M1_FIRST, count: 13, speed: 0.004, phase: 0.1, radius: 9, congestion: 1, jam: 0.95},
          {route: ROUTE_MIX_VIA_M2_FIRST, count: 13, speed: 0.004, phase: 0.55, radius: 9, congestion: 1, jam: 0.95},
        ]}
      />
      <Caption
        frame={frame}
        duration={duration}
        text="The city added a new road but accidentally created a traffic jam."
      />
    </>
  );
};
