import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {PriceTag} from '../PriceTag';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

// Beat 8 (840-870, 0:28-0:29): HARD CUT, tight punch-in on the $50 result
// with a brief green glow pulse.
export const Beat8: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat8.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const scale = interpolate(frame, [0, 10], [0.8, 1.5], clampOpts);

  return (
    <>
      <Scene>
        <PriceTag amount="50" x={540} y={800} scale={scale} color={COLORS.green} glow />
      </Scene>
      <Caption frame={frame} duration={duration} text="That part is easy." />
    </>
  );
};
