import React from 'react';
import {useCurrentFrame, interpolate, Easing} from 'remotion';
import {Scene} from '../Scene';
import {PriceTag} from '../PriceTag';
import {Bar} from '../Bar';
import {Caption} from '../Caption';
import {fmt} from '../format';
import {BEATS} from '../constants';

const BAR_X = 240;
const BAR_Y = 940;
const BAR_MAX_W = 600;

// Beat 7 (690-840, 0:23-0:28): the first 50% off, animated for real. The
// number counts down 100 -> 50 via genuine per-frame interpolation, and
// the bar shrinks to exactly half alongside it.
export const Beat7: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat7.duration;

  const value = interpolate(frame, [15, 135], [100, 50], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <>
      <Scene>
        <PriceTag amount={fmt(value)} x={540} y={650} />
        <Bar value={value} maxValue={100} x={BAR_X} y={BAR_Y} maxWidth={BAR_MAX_W} />
      </Scene>
      <Caption frame={frame} duration={duration} text="The first 50% off takes $100 down to $50." />
    </>
  );
};
