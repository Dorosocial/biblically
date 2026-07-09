import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {TrackedDot} from '../CarStream';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_LEFT, ROUTE_RIGHT, NODE_B} from '../geometry';

// Beat 3 (90-150, 3s-5s): camera pulls back from B, then locks onto and
// follows one specific car dot traveling the length of road_left —
// literal position-tracking, not a static wide shot of traffic.
export const Beat3: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat3.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const trackedT = interpolate(frame, [0, duration], [0.08, 0.92], clampOpts);
  const dotPos = ROUTE_LEFT(trackedT);
  const pullback = interpolate(frame, [0, 15], [0, 1], clampOpts);
  const scale = interpolate(frame, [0, 15], [3.4, 2.0], clampOpts);
  const shot = {
    cx: NODE_B.x * (1 - pullback) + dotPos.x * pullback,
    cy: NODE_B.y * (1 - pullback) + dotPos.y * pullback,
    scale,
  };

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        streams={[
          {route: ROUTE_LEFT, count: 8, speed: 0.006},
          {route: ROUTE_RIGHT, count: 8, speed: 0.006, phase: 0.5},
        ]}
      >
        <TrackedDot route={ROUTE_LEFT} t={trackedT} radius={13} />
      </NetworkScene>
      <Caption frame={frame} duration={duration} text="Traffic is very heavy but predictable." />
    </>
  );
};
