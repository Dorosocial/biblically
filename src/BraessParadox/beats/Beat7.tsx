import React from 'react';
import {useCurrentFrame} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST} from '../geometry';

// Beat 7 (690-810): HARD PULL-BACK, wide network shot. Everything is red.
// Every road is gridlocked.
export const Beat7: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat7.duration;

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={SHOTS.wide}
        showShortcut
        showMidNodes
        leftCongestion={1}
        rightCongestion={1}
        shortcutCongestion={1}
        streams={[
          {
            route: ROUTE_MIX_VIA_M1_FIRST,
            count: 13,
            speed: 0.004,
            phase: 0.1,
            radius: 11,
            congestion: 1,
            jam: 0.95,
          },
          {
            route: ROUTE_MIX_VIA_M2_FIRST,
            count: 13,
            speed: 0.004,
            phase: 0.4,
            radius: 11,
            congestion: 1,
            jam: 0.95,
          },
        ]}
      />
      <Caption
        frame={frame}
        duration={duration}
        text="The new road didn't add capacity. It just gave everyone the same idea, at the same time."
      />
    </>
  );
};
