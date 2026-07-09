import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {GlobePin} from '../GlobePin';
import {Flash} from '../Flash';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {shakeOffset, flashOpacityAt} from '../shake';

const IMPACT_FRAME = 0;

// Beat 24 (2040-2130, 1:16-1:19): HARD CUT — a globe/pin icon snaps in,
// with a slow continuous rotation so it never sits dead still.
export const Beat24: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = BEATS.beat24.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const scale = spring({frame, fps, config: {damping: 11, mass: 0.6, stiffness: 200}});
  const opacity = interpolate(frame, [0, 6], [0, 1], clampOpts);
  const rotation = frame * 0.6;
  const shake = shakeOffset(frame, IMPACT_FRAME, 14, 10);
  const flash = flashOpacityAt(frame, IMPACT_FRAME, 0.4, 6);

  return (
    <>
      <Scene>
        <g transform={`translate(${shake.x} ${shake.y})`}>
          <GlobePin x={540} y={880} scale={scale} opacity={opacity} rotationDeg={rotation} />
        </g>
      </Scene>
      <Flash opacity={flash} />
      <Caption frame={frame} duration={duration} text="That's why some cities have discovered something surprising." />
    </>
  );
};
