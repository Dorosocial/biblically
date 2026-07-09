import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {GlobePin} from '../GlobePin';
import {Caption} from '../Caption';
import {BEATS} from '../constants';

// Beat 19 (2280-2370, 1:16-1:19): HARD CUT — a globe/pin icon appears,
// suggesting real-world application.
export const Beat19: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat19.duration;

  const scale = spring({frame, fps, config: {damping: 11, mass: 0.6, stiffness: 150}});
  const opacity = interpolate(frame, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <>
      <Scene>
        <GlobePin x={540} y={880} scale={scale} opacity={opacity} />
      </Scene>
      <Caption
        frame={frame}
        duration={duration}
        text="That's why some cities have discovered something surprising."
      />
    </>
  );
};
