import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {PriceTag} from '../PriceTag';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

// Beat 11 (1140-1170, 0:38-0:39): quick punch-in confirming $50.
export const Beat11: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat11.duration;

  const scale = interpolate(frame, [0, 10], [0.8, 1.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      <Scene>
        <PriceTag amount="50" x={540} y={800} scale={scale} color={COLORS.green} glow />
      </Scene>
      <Caption frame={frame} duration={duration} text="That's the $50." />
    </>
  );
};
