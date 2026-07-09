import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_LEFT, ROUTE_RIGHT} from '../geometry';

const WIDE = {cx: 540, cy: 910, scale: 1};
const START = {cx: 540, cy: 1460, scale: 2.0};

// Beat 5 (210-300, 7s-10s): fast pull-back reveals both roads — the wide
// framing itself holds under a second, then keeps drifting (a slow
// breathing zoom) for the rest of the beat so it never sits dead still.
export const Beat5: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat5.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const pullback = interpolate(frame, [0, 15], [0, 1], clampOpts);
  const breathe = frame > 15 ? Math.sin((frame - 15) / 22) * 0.06 : 0;
  const shot = {
    cx: START.cx + (WIDE.cx - START.cx) * pullback,
    cy: START.cy + (WIDE.cy - START.cy) * pullback,
    scale: (START.scale + (WIDE.scale - START.scale) * pullback) * (1 + breathe),
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
      />
      <Caption frame={frame} duration={duration} text="And drivers split between the two routes" />
    </>
  );
};
