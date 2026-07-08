import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {TusiScene} from '../TusiScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';

// Beat 1 (0-240, 0:00-0:08): draw the large circle in first, then the
// small circle tangent inside it. Static hold once both are drawn.
export const Beat1: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat1.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const bigCircleProgress = interpolate(frame, [0, 50], [0, 1], clampOpts);
  const smallCircleProgress = interpolate(frame, [70, 140], [0, 1], clampOpts);
  const labelOpacity = interpolate(frame, [150, 190], [0, 1], clampOpts);

  return (
    <>
      <TusiScene
        t={0}
        bigCircleProgress={bigCircleProgress}
        smallCircleProgress={smallCircleProgress}
        showPoint={false}
        showLabels
        labelOpacity={labelOpacity}
      />
      <Caption
        frame={frame}
        duration={duration}
        text="Take a small circle and roll it around the inside of a bigger circle, exactly half its size."
      />
    </>
  );
};
