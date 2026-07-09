import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST} from '../geometry';

// Beat 12 (1320-1500, 0:44-0:50): HARD PUNCH-IN on the shortcut. Dots
// visibly pile up, color shifting from green to amber.
export const Beat12: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat12.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const congestion = interpolate(frame, [0, duration], [0, 0.55], clampOpts);
  const jam = interpolate(frame, [0, duration], [0, 0.6], clampOpts);

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={SHOTS.pileupPunch}
        showShortcut
        showMidNodes
        leftCongestion={congestion * 0.6}
        rightCongestion={congestion * 0.6}
        shortcutCongestion={congestion}
        streams={[
          {
            route: ROUTE_MIX_VIA_M1_FIRST,
            count: 11,
            speed: 0.012,
            phase: 0.1,
            radius: 10,
            congestion,
            jam,
          },
          {
            route: ROUTE_MIX_VIA_M2_FIRST,
            count: 11,
            speed: 0.012,
            phase: 0.55,
            radius: 10,
            congestion,
            jam,
          },
        ]}
      />
      <Caption
        frame={frame}
        duration={duration}
        text="Instead of traffic spreading out, cars pile onto the shortcut, creating bottlenecks where"
      />
    </>
  );
};
