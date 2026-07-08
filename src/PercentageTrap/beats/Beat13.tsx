import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {PriceTag} from '../PriceTag';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

// Beat 13 (1290-1440, 0:43-0:48): HARD CUT to the final reveal — a large
// glowing green $25, holding as the last frame. The Zombie Math wordmark
// fades in beneath it.
export const Beat13: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat13.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const scale = spring({frame, fps, config: {damping: 13, mass: 0.6, stiffness: 150}});
  const wordmarkOpacity = interpolate(frame, [40, 80], [0, 1], clampOpts);

  return (
    <>
      <Scene>
        <PriceTag amount="25" x={540} y={700} scale={scale} color={COLORS.green} fontSize={150} glow />
      </Scene>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 320,
          textAlign: 'center',
          opacity: wordmarkOpacity,
        }}
      >
        <span
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 800,
            fontSize: 34,
            letterSpacing: 6,
            color: COLORS.bone,
            textTransform: 'uppercase',
          }}
        >
          Zombie Math
        </span>
      </div>
      <Caption
        frame={frame}
        duration={duration}
        text="And if you take another $25 off, you are left paying only $25."
      />
    </>
  );
};
