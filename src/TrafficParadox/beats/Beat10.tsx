import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {Scene} from '../Scene';
import {BigText} from '../BigText';
import {RoadCountIcon} from '../RoadCountIcon';
import {Caption} from '../Caption';
import {COLORS} from '../colors';
import {BEATS} from '../constants';

// Beat 10 (1110-1200, 0:37-0:40): "NOT A ROAD PROBLEM" with a road-count
// icon struck through.
export const Beat10: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat10.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const textOpacity = interpolate(frame, [0, 12], [0, 1], clampOpts);
  const iconOpacity = interpolate(frame, [8, 22], [0, 1], clampOpts);
  const strikeProgress = interpolate(frame, [26, 50], [0, 1], clampOpts);

  return (
    <>
      <AbsoluteFill style={{backgroundColor: COLORS.bg}} />
      <BigText lines={[{text: 'NOT A ROAD PROBLEM', opacity: textOpacity, color: COLORS.bone, fontSize: 66}]} top={340} />
      <Scene>
        <RoadCountIcon x={540} y={1050} opacity={iconOpacity} strikeProgress={strikeProgress} />
      </Scene>
      <Caption frame={frame} duration={duration} text="The problem isn't that there isn't enough roads." />
    </>
  );
};
