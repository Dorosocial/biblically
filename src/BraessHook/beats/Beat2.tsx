import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_LEFT, ROUTE_RIGHT, NODE_B} from '../geometry';
import {easeOutCubic} from '../ease';

const WIDE = {cx: 540, cy: 910, scale: 1.05};
const START = {cx: NODE_B.x, cy: NODE_B.y, scale: 3.4};

// Beat 2 (120-210, 0:04-0:07): a single pull-back reveals both roads,
// dense but steady traffic flowing.
export const Beat2: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat2.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const t = easeOutCubic(interpolate(frame, [0, duration], [0, 1], clampOpts));
  const shot = {
    cx: START.cx + (WIDE.cx - START.cx) * t,
    cy: START.cy + (WIDE.cy - START.cy) * t,
    scale: START.scale + (WIDE.scale - START.scale) * t,
  };

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        streams={[
          {route: ROUTE_LEFT, count: 9, speed: 0.006},
          {route: ROUTE_RIGHT, count: 9, speed: 0.006, phase: 0.5},
        ]}
      />
      <Caption frame={frame} duration={duration} text="Traffic is very heavy but predictable." />
    </>
  );
};
