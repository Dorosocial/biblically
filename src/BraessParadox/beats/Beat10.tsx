import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {TitleCard} from '../TitleCard';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {ROUTE_LEFT, ROUTE_RIGHT} from '../geometry';

// Beat 10 (1080-1200): HARD CUT back to the original two-road map. The
// shortcut fades out (removed), even flow is restored, and the title holds.
export const Beat10: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat10.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
  const shortcutOpacity = interpolate(frame, [0, 24], [0.55, 0], clampOpts);
  const titleOpacity = interpolate(frame, [60, 92], [0, 1], clampOpts);

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={SHOTS.wide}
        showShortcut={shortcutOpacity > 0.001}
        shortcutOpacity={shortcutOpacity}
        streams={[
          {route: ROUTE_LEFT, count: 6, speed: 0.0055},
          {route: ROUTE_RIGHT, count: 6, speed: 0.0055, phase: 0.5},
        ]}
      />
      <Caption
        frame={frame}
        duration={duration}
        text="Some cities have actually closed roads on purpose... and traffic got better."
      />
      <TitleCard opacity={titleOpacity} />
    </>
  );
};
