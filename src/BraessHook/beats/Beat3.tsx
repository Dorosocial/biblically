import React from 'react';
import {useCurrentFrame} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_LEFT, ROUTE_RIGHT} from '../geometry';

const SHOT = {cx: 540, cy: 910, scale: 1.05};

// Beat 3 (210-300, 0:07-0:10): camera holds steady on the wide shot — no
// move here, deliberately, so both roads read evenly.
export const Beat3: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat3.duration;

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={SHOT}
        streams={[
          {route: ROUTE_LEFT, count: 9, speed: 0.006},
          {route: ROUTE_RIGHT, count: 9, speed: 0.006, phase: 0.5},
        ]}
      />
      <Caption frame={frame} duration={duration} text="And drivers split between" />
    </>
  );
};
