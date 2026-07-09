import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {TitleCard} from '../TitleCard';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

// Beat 19 (1980-2130, 1:06-1:11): the title card pops in cleanly — no
// shake — with Zombie Math branding.
export const Beat19: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat19.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const scale = spring({frame, fps, config: {damping: 14, mass: 0.6, stiffness: 170}});
  const opacity = interpolate(frame, [0, 10], [0, 1], clampOpts);
  const kickerOpacity = interpolate(frame, [16, 34], [0, 1], clampOpts);
  const glowPulse = 0.8 + 0.3 * Math.sin(frame / 9);

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg}} />
      <TitleCard scale={scale} opacity={opacity} kickerOpacity={kickerOpacity} glowPulse={glowPulse} />
      <Caption
        frame={frame}
        duration={duration}
        text="This is called Braess's Paradox. It's a mathematical phenomenon"
      />
    </>
  );
};
