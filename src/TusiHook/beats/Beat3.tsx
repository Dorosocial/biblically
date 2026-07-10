import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {TusiScene} from '../TusiScene';
import {PhraseCaption} from '../PhraseCaption';
import {BEATS} from '../constants';
import {rollAngleAt} from '../motion';

const PHRASES = [
  {at: 0, words: [{text: "YOU'D"}, {text: 'EXPECT'}, {text: 'A'}, {text: 'CURVE'}]},
  {at: 45, words: [{text: 'A'}, {text: 'LOOP'}]},
  {at: 75, words: [{text: 'OR'}, {text: 'SOMETHING'}, {text: 'ROUND'}]},
];

// Beat 3 (330-450, 0:11-0:15): a small anticipation wiggle begins the
// roll — one confident, gentle nudge, not a full sweep yet — while a
// faint ghosted cardioid (the "wrong guess") fades in and back out.
export const Beat3: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = BEATS.beat3.duration;
  const globalFrame = BEATS.beat3.from + frame;
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  const t = rollAngleAt(globalFrame);
  const ghostOpacity = interpolate(frame, [10, 40, 90, duration], [0, 0.5, 0.5, 0], clampOpts);

  return (
    <>
      <TusiScene t={t} showPoint showGhost ghostOpacity={ghostOpacity} />
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
