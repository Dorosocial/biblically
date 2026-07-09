import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {TitleCard} from '../TitleCard';
import {Flash} from '../Flash';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';
import {shakeOffset, flashOpacityAt} from '../shake';

const IMPACT_FRAME = 0;

// Beat 22 (1770-1860, 1:07-1:10): the title card slams in with a
// camera-shake impact.
export const Beat22: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat22.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const scale = spring({frame, fps, config: {damping: 10, mass: 0.6, stiffness: 190}});
  const opacity = interpolate(frame, [0, 6], [0, 1], clampOpts);
  const kickerOpacity = interpolate(frame, [14, 30], [0, 1], clampOpts);
  const glowPulse = 0.8 + 0.3 * Math.sin(frame / 9);
  const shake = shakeOffset(frame, IMPACT_FRAME, 20, 14);
  const flash = flashOpacityAt(frame, IMPACT_FRAME, 0.5, 8);

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg}} />
      <TitleCard scale={scale} opacity={opacity} kickerOpacity={kickerOpacity} glowPulse={glowPulse} shake={shake} />
      <Flash opacity={flash} />
      <Caption frame={frame} duration={duration} text="This is called Braess's Paradox." />
    </>
  );
};
