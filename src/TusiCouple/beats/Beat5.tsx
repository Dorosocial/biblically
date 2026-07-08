import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {TusiScene} from '../TusiScene';
import {Caption} from '../Caption';
import {TitleBlock} from '../TitleBlock';
import {BEATS} from '../constants';
import {rollAngleAt} from '../motion';

// Beat 5 (810-1020, 0:27-0:34): the completed trace holds; the title and
// its byline fade in, staggered.
export const Beat5: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat5.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const t = rollAngleAt(BEATS.beat5.from + frame);
  const titleOpacity = interpolate(frame, [20, 60], [0, 1], clampOpts);
  const subOpacity = interpolate(frame, [70, 110], [0, 1], clampOpts);

  return (
    <>
      <TusiScene t={t} showPoint />
      <TitleBlock opacity={titleOpacity} subOpacity={subOpacity} />
      <Caption
        frame={frame}
        duration={duration}
        text="This is the Tusi Couple, and it was discovered in the 1200s, centuries before it helped explain planetary motion."
      />
    </>
  );
};
