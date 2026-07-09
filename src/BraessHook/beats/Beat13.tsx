import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROAD_LEFT, segmentPoint, ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST, ROUTE_LEFT, ROUTE_RIGHT} from '../geometry';

// Beat 13 (840-900, 30s-32s): the camera whip-pans across road_left,
// following the mass of dots beginning to turn toward the shortcut.
export const Beat13: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat13.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const t = interpolate(frame, [0, duration], [0.2, 0.52], clampOpts);
  const pt = segmentPoint(ROAD_LEFT, t);
  const shot = {cx: pt.x, cy: pt.y, scale: 1.7};

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        showShortcut
        showMidNodes
        streams={[
          {route: ROUTE_LEFT, count: 5, speed: 0.006},
          {route: ROUTE_RIGHT, count: 5, speed: 0.006, phase: 0.5},
          {route: ROUTE_MIX_VIA_M1_FIRST, count: 6, speed: 0.012, phase: 0.15, radius: 9},
          {route: ROUTE_MIX_VIA_M2_FIRST, count: 6, speed: 0.012, phase: 0.6, radius: 9},
        ]}
      />
      <Caption frame={frame} duration={duration} text="Soon, almost every driver" />
    </>
  );
};
