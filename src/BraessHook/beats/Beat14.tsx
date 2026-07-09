import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST, NODE_M2} from '../geometry';

// Beat 14 (1290-1500, 0:43-0:50): one slow, steady push toward the
// chokepoint as the pile-up builds and the color shifts toward amber.
export const Beat14: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat14.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const congestion = interpolate(frame, [0, duration], [0, 0.55], clampOpts);
  const jam = interpolate(frame, [0, duration], [0, 0.55], clampOpts);
  const scale = interpolate(frame, [0, duration], [1.9, 2.7], clampOpts);
  const shot = {cx: NODE_M2.x, cy: NODE_M2.y, scale};

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        showShortcut
        showMidNodes
        leftCongestion={congestion * 0.6}
        rightCongestion={congestion * 0.6}
        shortcutCongestion={congestion}
        streams={[
          {route: ROUTE_MIX_VIA_M1_FIRST, count: 11, speed: 0.012, phase: 0.1, radius: 10, congestion, jam},
          {route: ROUTE_MIX_VIA_M2_FIRST, count: 11, speed: 0.012, phase: 0.55, radius: 10, congestion, jam},
        ]}
      />
      <Caption
        frame={frame}
        duration={duration}
        text="Instead of traffic spreading out, cars pile onto the shortcut, creating bottlenecks where the shortcut"
      />
    </>
  );
};
