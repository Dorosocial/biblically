import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST} from '../geometry';

// Beat 5 (390-540): HARD PUNCH-IN, tight on the M2 chokepoint where the
// shortcut merges back into the original road. Density climbs, dots start
// bunching up.
export const Beat5: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat5.duration;
  const jam = interpolate(frame, [0, duration], [0.15, 0.7], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const congestion = interpolate(frame, [0, duration], [0.15, 0.45], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={SHOTS.chokepointTight}
        showShortcut
        showMidNodes
        leftCongestion={congestion * 0.5}
        rightCongestion={congestion * 0.5}
        shortcutCongestion={congestion}
        streams={[
          {
            route: ROUTE_MIX_VIA_M1_FIRST,
            count: 8,
            speed: 0.011,
            phase: 0.1,
            radius: 11,
            congestion,
            jam,
          },
          {
            route: ROUTE_MIX_VIA_M2_FIRST,
            count: 8,
            speed: 0.011,
            phase: 0.4,
            radius: 11,
            congestion,
            jam,
          },
        ]}
      />
      <Caption
        frame={frame}
        duration={duration}
        text={'So everyone makes the same "smart" choice — at the same time.'}
      />
    </>
  );
};
