import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {TusiScene} from '../TusiScene';
import {PhraseCaption} from '../PhraseCaption';

const PHRASES = [
  {at: 0, words: [{text: 'NOW'}, {text: 'MARK'}, {text: 'ONE'}, {text: 'POINT'}]},
  {at: 45, words: [{text: 'ON'}, {text: 'THE'}, {text: 'SMALL'}, {text: 'CIRCLE'}]},
  {at: 90, words: [{text: 'WATCH'}, {text: 'WHAT'}, {text: 'IT'}, {text: 'TRACES'}]},
  {at: 125, words: [{text: 'AS'}, {text: 'IT'}, {text: 'ROLLS'}]},
];

// Beat 2 (180-330, 0:06-0:11): a bright glowing dot pops in at the point
// of tangency, with a brief ping ring, then holds — a pause to let the
// viewer register the marked point.
export const Beat2: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const pointScale = spring({frame, fps, config: {damping: 12, mass: 0.5, stiffness: 220}});
  const pulseProgress = interpolate(frame, [0, 40], [0, 1], clampOpts);

  return (
    <>
      <TusiScene t={0} showPoint pointScale={pointScale} pulseProgress={pulseProgress} />
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
