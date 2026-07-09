import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {RippleEffect} from '../RippleEffect';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_LEFT, ROUTE_RIGHT, ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST} from '../geometry';

// Beat 12 (780-840, 27s-30s): fast pull-back to wide, then a ripple
// spreads outward from the shortcut — the camera keeps pulling back to
// track its growth.
export const Beat12: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat12.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const pullback = interpolate(frame, [0, 15], [0, 1], clampOpts);
  const rippleTrack = interpolate(frame, [15, duration], [0, 1], clampOpts);
  const scale = 2.3 - 1.0 * pullback - 0.3 * rippleTrack;
  const shot = {cx: 540, cy: 890, scale};

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
          {route: ROUTE_MIX_VIA_M1_FIRST, count: 3, speed: 0.013, phase: 0.15, radius: 9},
          {route: ROUTE_MIX_VIA_M2_FIRST, count: 3, speed: 0.013, phase: 0.6, radius: 9},
        ]}
      >
        <RippleEffect cx={540} cy={890} frame={frame} />
      </NetworkScene>
      <Caption frame={frame} duration={duration} text="and save time. But then, everyone notices." />
    </>
  );
};
