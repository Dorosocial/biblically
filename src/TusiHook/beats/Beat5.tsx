import React from 'react';
import {useCurrentFrame} from 'remotion';
import {TusiScene} from '../TusiScene';
import {PhraseCaption} from '../PhraseCaption';
import {FINAL_ANGLE} from '../motion';

const PHRASES = [{at: 0, words: [{text: 'THIS'}, {text: 'IS'}, {text: 'THE'}]}];

// Beat 5 (600-630, 0:20-0:21): a brief hold — the trace is complete, the
// line sits still, one beat of quiet before the name lands.
export const Beat5: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <>
      <TusiScene t={FINAL_ANGLE} showPoint />
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
