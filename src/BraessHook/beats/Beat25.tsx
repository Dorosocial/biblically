import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Wordmark} from '../Wordmark';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_LEFT, ROUTE_RIGHT, SHORTCUT, segmentPoint} from '../geometry';
import {lerpShot} from '../ease';

const ERASE_END = 55;
const PULLBACK_END = 100;
// Shifted up from the standard wide framing so node B has clearance below
// it for the wordmark, instead of colliding with it.
const FINAL_SHOT = {cx: 540, cy: 1060, scale: 1};

// Beat 25 (2130-2310, 1:19-1:25): the camera FOLLOWS the shortcut as it
// visibly erases, then pulls back to track both roads speeding back up
// and returning to green. Holds the final frame with the wordmark.
export const Beat25: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat25.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const eraseProgress = interpolate(frame, [5, ERASE_END], [1, 0], clampOpts);
  const leadPt = segmentPoint(SHORTCUT, eraseProgress);
  const eraseShot = {cx: leadPt.x, cy: leadPt.y, scale: 2.4};

  const pullbackT = interpolate(frame, [ERASE_END, PULLBACK_END], [0, 1], clampOpts);
  const shot = lerpShot(eraseShot, FINAL_SHOT, pullbackT);

  const congestion = interpolate(frame, [0, PULLBACK_END], [1, 0], clampOpts);
  const wordmarkOpacity = interpolate(frame, [120, 160], [0, 1], clampOpts);

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
      <Caption frame={frame} duration={duration} text="Sometimes, removing a road can make traffic flow faster." />
    </>
  );
};
