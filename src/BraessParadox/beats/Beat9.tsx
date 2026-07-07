import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {BarGraph} from '../BarGraph';
import {Caption} from '../Caption';
import {BEATS} from '../constants';

// Beat 9 (960-1080): the graph holds at its grown state; city names fade in
// beside it, staggered.
export const Beat9: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat9.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
  const seoul = interpolate(frame, [20, 42], [0, 1], clampOpts);
  const stuttgart = interpolate(frame, [52, 76], [0, 1], clampOpts);

  return (
    <>
      <BarGraph
        beforeGrow={1}
        afterGrow={1}
        cityLabelOpacity={{seoul, stuttgart}}
      />
      <Caption
        frame={frame}
        duration={duration}
        text="This is Braess's Paradox — proven mathematically, and confirmed in real cities like Seoul and Stuttgart."
      />
    </>
  );
};
