import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST} from '../geometry';

// Beat 13 (1500-1590, 0:50-0:53): tighter punch on the two chokepoint
// junctions, each ringed. Congestion keeps climbing.
export const Beat13: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat13.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const congestion = interpolate(frame, [0, duration], [0.55, 0.78], clampOpts);
  const jam = interpolate(frame, [0, duration], [0.6, 0.8], clampOpts);

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={SHOTS.chokepointsTight}
        showShortcut
        showMidNodes
        chokepointRings
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
      <Caption frame={frame} duration={duration} text="the shortcut connects to the original roads." />
    </>
  );
};
