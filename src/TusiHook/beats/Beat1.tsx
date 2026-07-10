import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {TusiScene} from '../TusiScene';
import {PhraseCaption} from '../PhraseCaption';

const BIG_DRAW_END = 70;
const SMALL_DRAW_START = 80;
const SMALL_DRAW_END = 150;

const PHRASES = [
  {at: 0, words: [{text: 'TAKE'}, {text: 'A'}, {text: 'SMALL'}, {text: 'CIRCLE'}]},
  {at: 40, words: [{text: 'AND'}, {text: 'ROLL'}, {text: 'IT'}, {text: 'AROUND'}]},
  {at: 85, words: [{text: 'THE'}, {text: 'INSIDE'}, {text: 'OF'}, {text: 'A'}, {text: 'BIGGER'}, {text: 'CIRCLE'}]},
  {at: 140, words: [{text: 'EXACTLY'}, {text: 'HALF'}, {text: 'ITS'}, {text: 'SIZE'}]},
];

// Beat 1 (0-180, 0:00-0:06): the camera holds perfectly steady. The big
// circle draws in first, then the small circle draws in tangent to it,
// sized at exactly half the diameter.
export const Beat1: React.FC = () => {
  const frame = useCurrentFrame();
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const bigCircleProgress = interpolate(frame, [0, BIG_DRAW_END], [0, 1], clampOpts);
  const smallCircleProgress = interpolate(frame, [SMALL_DRAW_START, SMALL_DRAW_END], [0, 1], clampOpts);

  return (
    <>
      <TusiScene t={0} bigCircleProgress={bigCircleProgress} smallCircleProgress={smallCircleProgress} showPoint={false} />
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
