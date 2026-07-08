import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {EquationText} from '../EquationText';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

const FULL_OPACITY = [1, 1, 1, 1, 1];

// Beat 4 (480-510, 0:16-0:17): HARD CUT, fast. The equation is already
// fully formed (no build this time), a one-frame red flash hits, and a
// bold red X slams across it.
export const Beat4: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat4.duration;

  const flashOpacity = interpolate(frame, [0, 1, 6], [0, 0.55, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const xScale = spring({frame, fps, config: {damping: 10, mass: 0.35, stiffness: 320}});
  const xOpacity = interpolate(frame, [0, 3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      <EquationText tokenOpacities={FULL_OPACITY} />
      <Scene>
        <g
          transform={`translate(540 800) scale(${xScale})`}
          opacity={xOpacity}
          filter="url(#glowRed)"
        >
          <line x1={-260} y1={-200} x2={260} y2={200} stroke={COLORS.red} strokeWidth={40} strokeLinecap="round" />
          <line x1={260} y1={-200} x2={-260} y2={200} stroke={COLORS.red} strokeWidth={40} strokeLinecap="round" />
        </g>
      </Scene>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: COLORS.red,
          opacity: flashOpacity,
        }}
      />
      <Caption frame={frame} duration={duration} text="Wrong." color={COLORS.red} caps />
    </>
  );
};
