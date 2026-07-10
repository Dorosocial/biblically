import React from 'react';
import {useCurrentFrame} from 'remotion';
import {TusiScene} from '../TusiScene';
import {PhraseCaption} from '../PhraseCaption';
import {BEATS} from '../constants';
import {rollAngleAt} from '../motion';

// Caption starts 20 frames in, leaving the opening beat truly silent —
// pure visual payoff — before the VO ("but a circle rolling inside a
// circle draws a perfectly straight line...") catches up.
const PHRASES = [
  {at: 20, words: [{text: 'BUT'}, {text: 'A'}, {text: 'CIRCLE'}, {text: 'ROLLING'}]},
  {at: 55, words: [{text: 'INSIDE'}, {text: 'A'}, {text: 'CIRCLE'}]},
  {at: 85, words: [{text: 'DRAWS'}, {text: 'A'}, {text: 'PERFECTLY'}]},
  {at: 112, words: [{text: 'STRAIGHT'}, {text: 'LINE'}]},
  {at: 132, words: [{text: 'EVERY'}, {text: 'SINGLE'}, {text: 'ROTATION'}]},
];

// Beat 4 (450-600, 0:15-0:20): the core "wow" moment — genuine per-frame
// hypocycloid motion, driven by rollAngleAt(globalFrame), so the roll is
// mathematically real, not a canned animation. No camera move at all;
// this beat's only job is to let the reveal breathe.
export const Beat4: React.FC = () => {
  const frame = useCurrentFrame();
  const globalFrame = BEATS.beat4.from + frame;
  const t = rollAngleAt(globalFrame);

  return (
    <>
      <TusiScene t={t} showPoint />
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
