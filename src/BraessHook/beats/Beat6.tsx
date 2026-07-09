import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_LEFT, ROUTE_RIGHT, SHORTCUT, segmentPoint} from '../geometry';

// Beat 6 (540-600, 0:18-0:20): the camera follows the shortcut's leading
// edge as it draws in, at a steady, unhurried pace.
export const Beat6: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat6.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const drawProgress = interpolate(frame, [0, duration], [0, 0.7], clampOpts);
  const leadPt = segmentPoint(SHORTCUT, drawProgress);
  const shot = {cx: leadPt.x, cy: leadPt.y, scale: 2.5};

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        showShortcut
        shortcutProgress={drawProgress}
        showMidNodes
        streams={[
          {route: ROUTE_LEFT, count: 8, speed: 0.006},
          {route: ROUTE_RIGHT, count: 8, speed: 0.006, phase: 0.5},
        ]}
      />
      <Caption frame={frame} duration={duration} text="More roads should" />
    </>
  );
};
