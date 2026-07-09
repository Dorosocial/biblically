import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {BigText} from '../BigText';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

// Beat 12 (1050-1200, 0:35-0:40): "NOT A ROAD PROBLEM" — a clean fade/pop,
// no shake.
export const Beat12: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat12.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const popScale = spring({frame, fps, config: {damping: 14, mass: 0.6, stiffness: 170}});
  const opacity = interpolate(frame, [0, 10], [0, 1], clampOpts);

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg}} />
      <BigText lines={[{text: 'NOT A ROAD PROBLEM', opacity, scale: popScale, color: COLORS.bone, fontSize: 66}]} />
      <Caption frame={frame} duration={duration} text="The problem isn't that there aren't enough roads." />
    </>
  );
};
