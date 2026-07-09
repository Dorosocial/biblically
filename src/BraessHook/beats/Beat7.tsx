import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {BEATS} from '../constants';
import {ROUTE_LEFT, ROUTE_RIGHT} from '../geometry';

// Beat 7 (360-420, 12s-14s): HARD CUT — camera punches into the empty
// space between the two roads, creeping tighter across the beat.
export const Beat7: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat7.duration;

  const scale = interpolate(frame, [0, duration], [1.8, 2.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shot = {cx: 540, cy: 890, scale};

  return (
    <NetworkScene
      frame={frame}
      shot={shot}
      streams={[
        {route: ROUTE_LEFT, count: 8, speed: 0.006},
        {route: ROUTE_RIGHT, count: 8, speed: 0.006, phase: 0.5},
      ]}
    />
  );
};
