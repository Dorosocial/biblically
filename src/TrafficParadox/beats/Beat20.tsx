import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {Wordmark} from '../Wordmark';
import {BEATS} from '../constants';
import {ROUTE_LEFT, ROUTE_RIGHT} from '../geometry';

// A dedicated shot for this beat only: shifted up from the standard wide
// framing so node B has clearance below it for the wordmark, instead of
// colliding with it the way the shared SHOTS.wide framing would.
const FINAL_SHOT = {cx: 540, cy: 1060, scale: 1};

// Beat 20 (2370-2550, 1:19-1:25): the shortcut erases (reverse of its
// draw-in), the original roads visibly smooth out and speed back up,
// color returning to green. Holds as the final frame with the wordmark.
export const Beat20: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat20.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const shortcutProgress = interpolate(frame, [0, 55], [1, 0], clampOpts);
  const congestion = interpolate(frame, [0, 100], [1, 0], clampOpts);
  const wordmarkOpacity = interpolate(frame, [100, 140], [0, 1], clampOpts);

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={FINAL_SHOT}
        showShortcut={shortcutProgress > 0.01}
        shortcutProgress={shortcutProgress}
        shortcutCongestion={congestion}
        leftCongestion={congestion}
        rightCongestion={congestion}
        streams={[
          {route: ROUTE_LEFT, count: 9, speed: 0.006, congestion},
          {route: ROUTE_RIGHT, count: 9, speed: 0.006, phase: 0.5, congestion},
        ]}
      />
      <Wordmark opacity={wordmarkOpacity} />
      <Caption
        frame={frame}
        duration={duration}
        text="Sometimes, removing a road can make traffic flow faster."
      />
    </>
  );
};
