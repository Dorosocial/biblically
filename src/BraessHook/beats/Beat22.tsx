import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_LEFT, ROUTE_RIGHT, SHORTCUT, segmentPoint} from '../geometry';

// Beat 22 (2340-2430, 1:18-1:21): the camera follows the shortcut as it
// begins to fade/erase — reverse of its draw-in.
export const Beat22: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat22.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const eraseProgress = interpolate(frame, [0, duration], [1, 0.45], clampOpts);
  const leadPt = segmentPoint(SHORTCUT, eraseProgress);
  const congestion = interpolate(frame, [0, duration], [1, 0.5], clampOpts);
  const shot = {cx: leadPt.x, cy: leadPt.y, scale: 2.4};

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        showShortcut
        shortcutProgress={eraseProgress}
        shortcutCongestion={congestion}
        leftCongestion={congestion}
        rightCongestion={congestion}
        streams={[
          {route: ROUTE_LEFT, count: 9, speed: 0.006, congestion},
          {route: ROUTE_RIGHT, count: 9, speed: 0.006, phase: 0.5, congestion},
        ]}
      />
      <Caption frame={frame} duration={duration} text="Sometimes, removing a" />
    </>
  );
};
