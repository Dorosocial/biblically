import React from 'react';
import {useCurrentFrame, interpolate, Easing} from 'remotion';
import {BarGraph} from '../BarGraph';
import {Caption} from '../Caption';
import {BEATS} from '../constants';

// Beat 8 (810-960): HARD CUT to a split-screen bar graph. Bars grow in on
// entry.
export const Beat8: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat8.duration;
  const ease = Easing.out(Easing.cubic);
  const beforeGrow = interpolate(frame, [10, 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  const afterGrow = interpolate(frame, [18, 62], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

  return (
    <>
      <BarGraph beforeGrow={beforeGrow} afterGrow={afterGrow} />
      <Caption
        frame={frame}
        duration={duration}
        text="Every driver made the locally smart choice. The result was a slower city for everyone."
      />
    </>
  );
};
