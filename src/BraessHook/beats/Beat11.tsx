import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {BigText} from '../BigText';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

// Beat 11 (990-1050, 0:33-0:35): a simple hard cut — no glitch, no shake
// — just a brief tone-shift text flash.
export const Beat11: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat11.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const opacity = interpolate(frame, [0, 8, duration - 10, duration], [0, 1, 1, 0], clampOpts);

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg}} />
      <BigText lines={[{text: 'THINGS GET WEIRD', opacity, color: COLORS.pink, fontSize: 68, glow: true}]} />
      <Caption frame={frame} duration={duration} text="And that's where things get weird." />
    </>
  );
};
