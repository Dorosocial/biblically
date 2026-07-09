import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {BigText} from '../BigText';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

// Beat 13 (1200-1290, 0:40-0:43): "A CHOICE PROBLEM" — a calm punch-in.
export const Beat13: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat13.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const scale = interpolate(frame, [0, 16], [0.85, 1], clampOpts);
  const opacity = interpolate(frame, [0, 10], [0, 1], clampOpts);

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg}} />
      <BigText lines={[{text: 'A CHOICE PROBLEM', opacity, scale, color: COLORS.pink, fontSize: 66, glow: true}]} />
      <Caption
        frame={frame}
        duration={duration}
        text="is that everyone is making the same logical choice."
      />
    </>
  );
};
