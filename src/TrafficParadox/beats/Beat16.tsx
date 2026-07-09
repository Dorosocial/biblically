import React from 'react';
import {useCurrentFrame} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {ROUTE_MIX_VIA_M1_FIRST, ROUTE_MIX_VIA_M2_FIRST} from '../geometry';

// Beat 16 (1860-2010, 1:02-1:07): HARD CUT back to the map, wide. All
// three roads are fully red and gridlocked.
export const Beat16: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat16.duration;

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
            radius: 9,
            congestion: 1,
            jam: 0.95,
          },
          {
            route: ROUTE_MIX_VIA_M2_FIRST,
            count: 13,
            speed: 0.004,
            phase: 0.55,
            radius: 9,
            congestion: 1,
            jam: 0.95,
          },
        ]}
      />
      <Caption
        frame={frame}
        duration={duration}
        text="The city added a new road but accidentally created a traffic jam."
      />
    </>
  );
};
