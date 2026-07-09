import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {Scene} from '../Scene';
import {BigText} from '../BigText';
import {DecisionArrowDots} from '../DecisionArrowDots';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

// Beat 11 (1200-1320, 0:40-0:44): "A CHOICE PROBLEM" — identical
// decision-arrows all converging on the same point.
export const Beat11: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat11.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const textOpacity = interpolate(frame, [0, 12], [0, 1], clampOpts);
  const reveal = interpolate(frame, [20, 70], [0, 1], clampOpts);

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg}} />
      <BigText lines={[{text: 'A CHOICE PROBLEM', opacity: textOpacity, color: COLORS.pink, fontSize: 66, glow: true}]} top={340} />
      <Scene>
        <DecisionArrowDots x={540} y={1050} reveal={reveal} />
      </Scene>
      <Caption
        frame={frame}
        duration={duration}
        text="The problem is that everyone is making the same logical choice."
      />
    </>
  );
};
