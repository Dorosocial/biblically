import React from 'react';
import {useCurrentFrame} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {Road} from '../Road';
import {BEATS} from '../constants';
import {SHOTS} from '../shots';
import {ROUTE_LEFT, ROUTE_RIGHT, PATH_D} from '../geometry';
import {COLORS} from '../colors';

// Beat 3 (420-450, 0:14-0:15): brief silent connector — map holds, one
// subtle pulse.
export const Beat3: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat3.duration;
  const pulse = 0.25 * Math.sin((Math.PI * frame) / duration);

  return (
    <NetworkScene
      frame={frame}
      shot={SHOTS.wide}
      streams={[
        {route: ROUTE_LEFT, count: 9, speed: 0.006},
        {route: ROUTE_RIGHT, count: 9, speed: 0.006, phase: 0.5},
      ]}
    >
      <Road d={PATH_D.roadLeft} color={COLORS.bone} width={12} opacity={Math.max(0, pulse)} />
      <Road d={PATH_D.roadRight} color={COLORS.bone} width={12} opacity={Math.max(0, pulse)} />
    </NetworkScene>
  );
};
