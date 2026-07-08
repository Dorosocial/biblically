import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {TusiScene} from '../TusiScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';

// Beat 2 (240-420, 0:08-0:14): the marked point pops in at the point of
// tangency with a one-shot attention pulse, then holds still — a beat to
// register it before any motion begins.
export const Beat2: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat2.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const pointScale = interpolate(frame, [0, 20], [0, 1], clampOpts);
  const pulseProgress = interpolate(frame, [10, 60], [0, 1], clampOpts);

  return (
    <>
      <TusiScene
        t={0}
        showPoint
        pointScale={pointScale}
        pulseProgress={pulseProgress}
        showLabels
        labelOpacity={1}
      />
      <Caption
        frame={frame}
        duration={duration}
        text="Now, mark one point on the small circle and watch for the traces as it rolls."
      />
    </>
  );
};
