import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {GlobePin} from '../GlobePin';
import {Caption} from '../Caption';
import {BEATS} from '../constants';

// Beat 21 (2250-2340, 1:15-1:18): hard cut — a globe/pin icon appears
// calmly, no shake.
export const Beat21: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat21.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const scale = spring({frame, fps, config: {damping: 14, mass: 0.6, stiffness: 170}});
  const opacity = interpolate(frame, [0, 10], [0, 1], clampOpts);
  const rotation = frame * 0.3;

  return (
    <>
      <Scene>
        <GlobePin x={540} y={880} scale={scale} opacity={opacity} rotationDeg={rotation} />
      </Scene>
      <Caption frame={frame} duration={duration} text="That's why some cities have discovered something surprising." />
    </>
  );
};
