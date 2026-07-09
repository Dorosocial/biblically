import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST, NODE_M2} from '../geometry';

// Beat 21 (1650-1770, 1:02-1:07): HARD CUT back to the map — fast
// pull-back revealing the full congested network, all three roads red.
export const Beat21: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat21.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const pullback = interpolate(frame, [0, 32], [0, 1], clampOpts);
  const breathe = frame > 32 ? Math.sin((frame - 32) / 24) * 0.05 : 0;
  const cx = NODE_M2.x * (1 - pullback) + 540 * pullback;
  const cy = NODE_M2.y * (1 - pullback) + 910 * pullback;
  const scale = (2.6 - 1.6 * pullback) * (1 + breathe);
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
