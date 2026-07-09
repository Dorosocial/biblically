import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Road} from '../Road';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {ROUTE_LEFT, ROUTE_RIGHT, PATH_D} from '../geometry';
import {COLORS} from '../colors';

// Beat 2 (270-420, 0:09-0:14): both roads highlight in sync, and a small
// "≈ SAME TIME" readout compares the routes.
export const Beat2: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat2.duration;
  const pulse = 0.08 + 0.87 * (0.5 + 0.5 * Math.sin(frame / 11));
  const readoutOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={SHOTS.wide}
        streams={[
          {route: ROUTE_LEFT, count: 9, speed: 0.006},
          {route: ROUTE_RIGHT, count: 9, speed: 0.006, phase: 0.5},
        ]}
      >
        <Road d={PATH_D.roadLeft} color={COLORS.bone} width={12} opacity={pulse} />
        <Road d={PATH_D.roadRight} color={COLORS.bone} width={12} opacity={pulse} />
        <text
          x={540}
          y={150}
          fill={COLORS.pink}
          fontSize={44}
          fontWeight={800}
          fontFamily="Helvetica, Arial, sans-serif"
          textAnchor="middle"
          opacity={readoutOpacity}
        >
          ≈ SAME TIME
        </text>
      </NetworkScene>
      <Caption
        frame={frame}
        duration={duration}
        text="And drivers split between the two routes and everyone gets there in about the same amount of time."
      />
    </>
  );
};
