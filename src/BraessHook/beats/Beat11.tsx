import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {TrackedDot} from '../CarStream';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_LEFT, ROUTE_RIGHT, ROUTE_MIX_VIA_M1_FIRST} from '../geometry';
import {easeInOutCubic} from '../ease';

// Beat 11 (660-780, 22s-27s): the camera FOLLOWS one specific car dot as
// it discovers and turns onto the shortcut — tracking the exact turning
// path, not a wide shot of it happening.
export const Beat11: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat11.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const trackedT = easeInOutCubic(interpolate(frame, [0, duration], [0.04, 0.58], clampOpts));
  const dotPos = ROUTE_MIX_VIA_M1_FIRST(trackedT);
  const shot = {cx: dotPos.x, cy: dotPos.y, scale: 2.3};

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        showShortcut
        showMidNodes
        streams={[
          {route: ROUTE_LEFT, count: 6, speed: 0.006},
          {route: ROUTE_RIGHT, count: 6, speed: 0.006, phase: 0.5},
        ]}
      >
        <TrackedDot route={ROUTE_MIX_VIA_M1_FIRST} t={trackedT} radius={13} />
      </NetworkScene>
      <Caption frame={frame} duration={duration} text="At first it works, a few drivers discover the shortcut" />
    </>
  );
};
