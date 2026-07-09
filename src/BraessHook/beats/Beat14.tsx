import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST} from '../geometry';

// Beat 14 (900-960, 32s-34s): HARD CUT, punch-in tight on the shortcut
// itself, now dense with converging dots.
export const Beat14: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat14.duration;

  const scale = interpolate(frame, [0, duration], [2.0, 2.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shot = {cx: 540, cy: 890, scale};

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        showShortcut
        showMidNodes
        streams={[
          {route: ROUTE_MIX_VIA_M1_FIRST, count: 9, speed: 0.012, phase: 0.15, radius: 10},
          {route: ROUTE_MIX_VIA_M2_FIRST, count: 9, speed: 0.012, phase: 0.6, radius: 10},
        ]}
      />
      <Caption frame={frame} duration={duration} text="chooses the new, faster route." />
    </>
  );
};
