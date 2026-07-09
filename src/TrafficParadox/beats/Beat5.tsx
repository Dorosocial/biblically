import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {BigText} from '../BigText';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {AbsoluteFill} from 'remotion';
import {BEATS} from '../constants';

// Beat 5 (570-660, 0:19-0:22): HARD CUT, bold text fills the frame, the
// question mark pulsing.
export const Beat5: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat5.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const line1Opacity = interpolate(frame, [0, 10], [0, 1], clampOpts);
  const line2Opacity = interpolate(frame, [14, 26], [0, 1], clampOpts);
  const pulseScale = 1 + 0.08 * Math.sin(frame / 6);

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg}} />
      <BigText
        lines={[
          {text: 'MORE ROADS', opacity: line1Opacity, color: COLORS.bone, fontSize: 78},
          {
            text: '= LESS TRAFFIC?',
            opacity: line2Opacity,
            color: COLORS.pink,
            fontSize: 78,
            scale: pulseScale,
            glow: true,
          },
        ]}
      />
      <Caption frame={frame} duration={duration} text="More roads should mean less traffic, right?" />
    </>
  );
};
