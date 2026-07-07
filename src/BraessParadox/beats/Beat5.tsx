import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST} from '../geometry';

// Beat 5 (900-1140, 0:30-0:38): HARD PUNCH-IN, tight on the M2 chokepoint
// where the shortcut merges back into the original road. Density climbs,
// dots start bunching up, color begins amber -> red. This continues
// directly from beat 4's ramp, playing under continuous narration (no
// silent gap) and carries on into beat 6.
export const Beat5: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat5.duration;
  const jam = interpolate(frame, [0, duration], [0.15, 0.65], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const congestion = interpolate(frame, [0, duration], [0.15, 0.5], {
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
        text="choice at the same time. The new road didn't add capacity. It just gave everyone the same idea"
      />
    </>
  );
};
