import React from 'react';
import {useCurrentFrame} from 'remotion';
import {TusiScene} from '../TusiScene';
import {BEATS} from '../constants';
import {rollAngleAt} from '../motion';

// Beat 4 (540-810, 0:18-0:27): SILENT — the visual payoff. Real parametric
// rolling motion (interpolate() driven by useCurrentFrame(), continuous
// across the whole beat), three full revolutions, eased in and out. The
// traced point's path resolves into a straight line within the first
// revolution, then keeps oscillating along it for the rest of the beat.
// No Caption here — the narration has nothing to say during this beat.
export const Beat4: React.FC = () => {
  const frame = useCurrentFrame();
  const t = rollAngleAt(BEATS.beat4.from + frame);

  return <TusiScene t={t} showPoint />;
};
