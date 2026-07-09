import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {CheckoutScene} from '../CheckoutScene';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

const EXPRESS_LANE = 2;

// Beat 14 (1590-1740, 0:53-0:58): HARD CUT to a fresh scene — checkout
// lanes, the express lane sign appearing.
export const Beat14: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat14.duration;

  const signOpacity = interpolate(frame, [10, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const expressQueue = Math.round(
    interpolate(frame, [55, duration], [1, 3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
  );

  return (
    <>
      <Scene>
        <CheckoutScene
          expressLaneIndex={EXPRESS_LANE}
          signOpacity={signOpacity}
          signColor={COLORS.green}
          lanes={[
            {queueCount: 2, congestion: 0},
            {queueCount: 2, congestion: 0},
            {queueCount: expressQueue, congestion: 0},
            {queueCount: 2, congestion: 0},
          ]}
        />
      </Scene>
      <Caption
        frame={frame}
        duration={duration}
        text="It's like adding a faster check-out lane at a store, only for everyone to rush into"
      />
    </>
  );
};
