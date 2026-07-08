import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {TusiScene} from '../TusiScene';
import {Caption} from '../Caption';
import {BEATS} from '../constants';
import {rollAngleAt} from '../motion';

// Beat 3 (420-540, 0:14-0:18): a tiny anticipatory nudge of rolling motion,
// plus a faint ghosted "you'd expect a loop" preview that fades in and out.
export const Beat3: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat3.duration;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const t = rollAngleAt(BEATS.beat3.from + frame);
  const ghostOpacity = interpolate(frame, [0, 30, 70, 120], [0, 0.3, 0.3, 0], clampOpts);

  return (
    <>
      <TusiScene t={t} showPoint showGhost ghostOpacity={ghostOpacity} />
      <Caption
        frame={frame}
        duration={duration}
        text="You'd expect a curve, a loop or something round."
      />
    </>
  );
};
