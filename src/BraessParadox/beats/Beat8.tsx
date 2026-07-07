import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {TitleCard} from '../TitleCard';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {ROUTE_LEFT, ROUTE_RIGHT} from '../geometry';

// Beat 8 (1650-1890, 0:55-1:03): HARD CUT back to the original two-road
// map. The shortcut fades out (removed), even flow is restored. The title
// already faded in during beat 7, so it just holds here through the end.
export const Beat8: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat8.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
  const shortcutOpacity = interpolate(frame, [0, 24], [0.55, 0], clampOpts);

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
        text="Seoul and Stuttgart. Some cities have actually closed roads on purpose and traffic got better."
      />
      <TitleCard opacity={1} />
    </>
  );
};
