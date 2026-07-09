import React from 'react';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Lightbulb} from '../Lightbulb';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_LEFT, ROUTE_RIGHT} from '../geometry';

const SHOT = {cx: 540, cy: 890, scale: 2.4};

// Beat 5 (450-540, 0:15-0:18): hard cut to the empty space between the
// roads — a lightbulb pops in cleanly, no shake.
export const Beat5: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat5.duration;

  const bulbScale = spring({frame, fps, config: {damping: 12, mass: 0.6, stiffness: 200}});
  const pulse = 0.5 + 0.5 * Math.sin(frame / 6);

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={SHOT}
        streams={[
          {route: ROUTE_LEFT, count: 8, speed: 0.006},
          {route: ROUTE_RIGHT, count: 8, speed: 0.006, phase: 0.5},
        ]}
      >
        <Lightbulb x={540} y={890} scale={bulbScale} pulse={pulse} />
      </NetworkScene>
      <Caption frame={frame} duration={duration} text="So the city has an idea: build a new shortcut." />
    </>
  );
};
