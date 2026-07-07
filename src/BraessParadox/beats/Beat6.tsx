import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST} from '../geometry';

// Beat 6 (1140-1410, 0:38-0:47): congestion keeps intensifying under
// continuous narration (no silent gap — the tight chokepoint framing
// carries the payoff instead of a music-only pause). Partway through the
// beat there's a HARD PULL-BACK cut to the wide network, fully red.
const SPLIT_FRAME = 140;

export const Beat6: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat6.duration;
  const jam = interpolate(frame, [0, SPLIT_FRAME], [0.65, 0.95], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const congestion = interpolate(frame, [0, SPLIT_FRAME], [0.5, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const count = Math.round(
    interpolate(frame, [0, SPLIT_FRAME], [9, 13], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const shot = frame < SPLIT_FRAME ? SHOTS.chokepointTight : SHOTS.wide;

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        showShortcut
        showMidNodes
        leftCongestion={congestion}
        rightCongestion={congestion}
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
      <Caption
        frame={frame}
        duration={duration}
        text="at the same time. Every driver made the same locally smart choice and the result was a slower city for"
      />
    </>
  );
};
