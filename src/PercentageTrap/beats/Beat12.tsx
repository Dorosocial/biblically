import React from 'react';
import {useCurrentFrame, interpolate, Easing} from 'remotion';
import {Scene} from '../Scene';
import {PriceTag} from '../PriceTag';
import {Bar} from '../Bar';
import {Caption} from '../Caption';
import {fmt} from '../format';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

const BAR_X = 240;
const BAR_Y = 940;
const BAR_MAX_W = 600;

// Beat 12 (1170-1290, 0:39-0:43): the second 50% off, animated for real —
// $50 counts down to $25, bar shrinks to half again.
export const Beat12: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat12.duration;

  const value = interpolate(frame, [10, 105], [50, 25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <>
      <Scene>
        <PriceTag amount={fmt(value)} x={540} y={650} color={COLORS.green} glow />
        <Bar value={value} maxValue={50} x={BAR_X} y={BAR_Y} maxWidth={BAR_MAX_W} />
      </Scene>
      <Caption frame={frame} duration={duration} text="So half of $50 is $25." />
    </>
  );
};
