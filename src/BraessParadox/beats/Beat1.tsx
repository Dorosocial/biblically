import React from 'react';
import {useCurrentFrame} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {ROUTE_LEFT, ROUTE_RIGHT} from '../geometry';

// Beat 1 (0-90): wide establishing shot, static hold, two roads with even
// stable flow.
export const Beat1: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat1.duration;

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={SHOTS.wide}
        streams={[
          {route: ROUTE_LEFT, count: 6, speed: 0.0055},
          {route: ROUTE_RIGHT, count: 6, speed: 0.0055, phase: 0.5},
        ]}
      />
      <Caption
        frame={frame}
        duration={duration}
        text="A city has two roads from A to B. Traffic is bad, but stable — everyone splits evenly between them."
      />
    </>
  );
};
