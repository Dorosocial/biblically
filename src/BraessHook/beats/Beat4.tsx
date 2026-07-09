import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {TrackedDot} from '../CarStream';
import {BEATS} from '../constants';
import {ROUTE_LEFT, ROUTE_RIGHT} from '../geometry';

// Beat 4 (150-210, 5s-7s): HARD CUT — camera snaps to follow a different
// car dot, now on road_right, tracking its movement at speed.
export const Beat4: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat4.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const trackedT = interpolate(frame, [0, duration], [0.08, 0.92], clampOpts);
  const dotPos = ROUTE_RIGHT(trackedT);
  const shot = {cx: dotPos.x, cy: dotPos.y, scale: 2.0};

  return (
    <NetworkScene
      frame={frame}
      shot={shot}
      streams={[
        {route: ROUTE_LEFT, count: 8, speed: 0.006},
        {route: ROUTE_RIGHT, count: 8, speed: 0.006, phase: 0.5},
      ]}
    >
      <TrackedDot route={ROUTE_RIGHT} t={trackedT} radius={13} />
    </NetworkScene>
  );
};
