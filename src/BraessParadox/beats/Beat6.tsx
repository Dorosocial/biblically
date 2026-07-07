import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST} from '../geometry';

// Beat 6 (540-690): SILENT, music only. Hard cut to a medium framing that
// reveals both chokepoints at once. This is the visual payoff: congestion
// builds to a crawl and color bleeds from amber to red across the network.
export const Beat6: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat6.duration;
  const jam = interpolate(frame, [0, duration], [0.7, 0.98], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const congestion = interpolate(frame, [0, duration], [0.45, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const count = Math.round(interpolate(frame, [0, duration], [8, 13], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));

  return (
    <NetworkScene
      frame={frame}
      shot={SHOTS.bothChokepoints}
      showShortcut
      showMidNodes
      leftCongestion={congestion * 0.7}
      rightCongestion={congestion * 0.7}
      shortcutCongestion={congestion}
      streams={[
        {
          route: ROUTE_MIX_VIA_M1_FIRST,
          count,
          speed: 0.011,
          phase: 0.1,
          radius: 11,
          congestion,
          jam,
        },
        {
          route: ROUTE_MIX_VIA_M2_FIRST,
          count,
          speed: 0.011,
          phase: 0.4,
          radius: 11,
          congestion,
          jam,
        },
      ]}
    />
  );
};
