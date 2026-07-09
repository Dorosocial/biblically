import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Wordmark} from '../Wordmark';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_LEFT, ROUTE_RIGHT, SHORTCUT, segmentPoint} from '../geometry';
import {lerpShot} from '../ease';

const ERASE_END = 30;
const PULLBACK_END = 55;
const FINAL_SHOT = {cx: 540, cy: 1060, scale: 1};

// Beat 23 (2430-2520, 1:21-1:24): the shortcut finishes erasing, both
// original roads flow smoothly green, the camera settles on the final
// wide frame, and the ZOMBIE MATH wordmark fades in.
export const Beat23: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat23.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const eraseProgress = interpolate(frame, [0, ERASE_END], [0.45, 0], clampOpts);
  const leadPt = segmentPoint(SHORTCUT, eraseProgress);
  const eraseShot = {cx: leadPt.x, cy: leadPt.y, scale: 2.4};

  const pullbackT = interpolate(frame, [ERASE_END, PULLBACK_END], [0, 1], clampOpts);
  const shot = lerpShot(eraseShot, FINAL_SHOT, pullbackT);

  const congestion = interpolate(frame, [0, PULLBACK_END], [0.5, 0], clampOpts);
  const wordmarkOpacity = interpolate(frame, [PULLBACK_END + 10, PULLBACK_END + 35], [0, 1], clampOpts);

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        showShortcut={eraseProgress > 0.01}
        shortcutProgress={eraseProgress}
        shortcutCongestion={congestion}
        leftCongestion={congestion}
        rightCongestion={congestion}
        streams={[
          {route: ROUTE_LEFT, count: 9, speed: 0.006, congestion},
          {route: ROUTE_RIGHT, count: 9, speed: 0.006, phase: 0.5, congestion},
        ]}
      />
      <Wordmark opacity={wordmarkOpacity} />
      <Caption frame={frame} duration={duration} text="road can make traffic flow faster." />
    </>
  );
};
