import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

// Beat 2 (270-330, 0:09-0:11): HARD CUT to a huge glowing green "?" that
// pulses once.
export const Beat2: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat2.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const opacity = interpolate(frame, [0, 8], [0, 1], clampOpts);
  const pulse = 1 + 0.16 * Math.sin(Math.PI * Math.min(1, frame / duration));

  return (
    <>
      <Scene>
        <text
          x={540}
          y={800}
          fill={COLORS.green}
          fontSize={420}
          fontWeight={800}
          fontFamily="Helvetica, Arial, sans-serif"
          textAnchor="middle"
          dominantBaseline="central"
          opacity={opacity}
          transform={`translate(540 800) scale(${pulse}) translate(-540 -800)`}
          filter="url(#glowGreen)"
        >
          ?
        </text>
      </Scene>
      <Caption frame={frame} duration={duration} text="So how much do you actually pay?" />
    </>
  );
};
