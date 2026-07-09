import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Lightbulb} from '../Lightbulb';
import {Flash} from '../Flash';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {ROUTE_LEFT, ROUTE_RIGHT} from '../geometry';
import {shakeOffset, flashOpacityAt} from '../shake';

const IMPACT_FRAME = 8;

// Beat 8 (420-480, 14s-16s): extreme close-up on a lightbulb snapping in
// with a flash/impact frame.
export const Beat8: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat8.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const scale = interpolate(frame, [0, duration], [2.3, 2.7], clampOpts);
  const shake = shakeOffset(frame, IMPACT_FRAME, 10, 10);
  const shot = {cx: 540 + shake.x, cy: 890 + shake.y, scale};

  const bulbScale = spring({
    frame: Math.max(0, frame - IMPACT_FRAME),
    fps,
    config: {damping: 8, mass: 0.6, stiffness: 200},
  });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 6);
  const flash = flashOpacityAt(frame, IMPACT_FRAME, 0.5, 6);

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={shot}
        streams={[
          {route: ROUTE_LEFT, count: 8, speed: 0.006},
          {route: ROUTE_RIGHT, count: 8, speed: 0.006, phase: 0.5},
        ]}
      >
        {frame >= IMPACT_FRAME ? <Lightbulb x={540} y={890} scale={bulbScale} pulse={pulse} /> : null}
      </NetworkScene>
      <Flash opacity={flash} />
      <Caption frame={frame} duration={duration} text="So the city has an idea," />
    </>
  );
};
