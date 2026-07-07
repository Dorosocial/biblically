import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {ROUTE_LEFT, ROUTE_RIGHT} from '../geometry';

// Beat 2 (90-180): same wide framing continues. The shortcut draws itself
// in via stroke progress 0 -> 1 across the whole beat, gaining a glow as it
// completes. Traffic hasn't discovered it yet.
export const Beat2: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat2.duration;
  const progress = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={SHOTS.wide}
        showShortcut
        shortcutProgress={progress}
        shortcutGlow={progress > 0.85}
        showMidNodes={progress > 0.05}
        streams={[
          {route: ROUTE_LEFT, count: 6, speed: 0.0055},
          {route: ROUTE_RIGHT, count: 6, speed: 0.0055, phase: 0.5},
        ]}
      />
      <Caption
        frame={frame}
        duration={duration}
        text="So the city builds a brand new road, connecting the two — a shortcut, meant to fix everything."
      />
    </>
  );
};
