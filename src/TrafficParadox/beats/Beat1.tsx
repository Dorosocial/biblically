import React from 'react';
import {useCurrentFrame} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {ROUTE_LEFT, ROUTE_RIGHT} from '../geometry';

// Beat 1 (0-270, 0:00-0:09): wide establishing shot. Dense but even
// traffic on both roads — heavy but predictable.
export const Beat1: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat1.duration;

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={SHOTS.wide}
        streams={[
          {route: ROUTE_LEFT, count: 9, speed: 0.006},
          {route: ROUTE_RIGHT, count: 9, speed: 0.006, phase: 0.5},
        ]}
      />
      <Caption
        frame={frame}
        duration={duration}
        text="A city has two roads connecting point A to point B. Traffic is very heavy but predictable."
      />
    </>
  );
};
