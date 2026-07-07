import React from 'react';
import {useCurrentFrame, interpolate, Easing} from 'remotion';
import {BarGraph} from '../BarGraph';
import {Caption} from '../Caption';
import {TitleCard} from '../TitleCard';
import {BEATS} from '../constants';

// Beat 7 (1410-1650, 0:47-0:55): HARD CUT to the split-screen bar graph.
// Bars grow in, then the title fades in, then the city labels begin
// appearing, staggered — all within this one beat.
export const Beat7: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat7.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
  const ease = Easing.out(Easing.cubic);

  const beforeGrow = interpolate(frame, [10, 46], [0, 1], {...clampOpts, easing: ease});
  const afterGrow = interpolate(frame, [18, 62], [0, 1], {...clampOpts, easing: ease});
  const titleOpacity = interpolate(frame, [70, 108], [0, 1], clampOpts);
  const seoul = interpolate(frame, [130, 158], [0, 1], clampOpts);
  const stuttgart = interpolate(frame, [168, 198], [0, 1], clampOpts);

  return (
    <>
      <BarGraph
        beforeGrow={beforeGrow}
        afterGrow={afterGrow}
        cityLabelOpacity={{seoul, stuttgart}}
      />
      <TitleCard opacity={titleOpacity} top={340} />
      <Caption
        frame={frame}
        duration={duration}
        text="everyone. This is Braess's paradox. It's proven mathematically and confirmed in real cities like"
      />
    </>
  );
};
