import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST, NODE_M2} from '../geometry';

// Beat 15 (1500-1560, 0:50-0:52): one tight punch-in on the junction point
// where the shortcut connects.
export const Beat15: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat15.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const scale = interpolate(frame, [0, duration], [2.7, 3.6], clampOpts);
  const shot = {cx: NODE_M2.x, cy: NODE_M2.y, scale};

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        showShortcut
        showMidNodes
        leftCongestion={0.35}
        rightCongestion={0.35}
        shortcutCongestion={0.6}
        streams={[
          {route: ROUTE_MIX_VIA_M1_FIRST, count: 11, speed: 0.009, phase: 0.1, radius: 10, congestion: 0.55, jam: 0.55},
          {route: ROUTE_MIX_VIA_M2_FIRST, count: 11, speed: 0.009, phase: 0.55, radius: 10, congestion: 0.55, jam: 0.55},
        ]}
      />
      <Caption frame={frame} duration={duration} text="connects to the original route." />
    </>
  );
};
