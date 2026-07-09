import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Scene} from '../Scene';
import {CheckoutScene} from '../CheckoutScene';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

const EXPRESS_LANE = 2;

// Beat 15 (1740-1860, 0:58-1:02): same checkout scene — the express lane
// is now the longest, most congested line; the others sit empty.
export const Beat15: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat15.duration;

  return (
    <>
      <Scene>
        <CheckoutScene
          expressLaneIndex={EXPRESS_LANE}
          signOpacity={1}
          signColor={COLORS.red}
          lanes={[
            {queueCount: 0, congestion: 0},
            {queueCount: 1, congestion: 0},
            {queueCount: 8, congestion: 1},
            {queueCount: 0, congestion: 0},
          ]}
        />
      </Scene>
      <Caption frame={frame} duration={duration} text="that one lane until it becomes the slowest line." />
    </>
  );
};
