import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {TitleCard} from '../TitleCard';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

// Beat 17 (2010-2100, 1:07-1:10): title card, spring-bounce entrance.
export const Beat17: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat17.duration;

  const scale = spring({frame, fps, config: {damping: 11, mass: 0.6, stiffness: 150}});
  const opacity = interpolate(frame, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const kickerOpacity = interpolate(frame, [16, 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg}} />
      <TitleCard scale={scale} opacity={opacity} kickerOpacity={kickerOpacity} />
      <Caption frame={frame} duration={duration} text="This is called Braess's Paradox." />
    </>
  );
};
