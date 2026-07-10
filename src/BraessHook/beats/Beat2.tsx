import React from 'react';
import {useCurrentFrame} from 'remotion';
import {NetworkScene} from '../NetworkScene';
import {PhraseCaption} from '../PhraseCaption';
import {ROUTE_LEFT, ROUTE_RIGHT} from '../geometry';

const SHOT = {cx: 540, cy: 910, scale: 1.05};

const PHRASES = [
  {at: 0, words: [{text: 'DRIVERS'}, {text: 'SPLIT'}]},
  {at: 40, words: [{text: 'BETWEEN'}, {text: 'THE'}, {text: 'ROUTES', accent: true}]},
  {at: 80, words: [{text: 'EVERYONE'}, {text: 'GETS'}, {text: 'THERE'}]},
];

// Beat 2 (180-300, 0:06-0:10): camera holds steady on the wide shot — no
// move here, deliberately, so both roads read evenly.
export const Beat2: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <>
      <NetworkScene
        frame={frame}
        shot={SHOT}
        streams={[
          {route: ROUTE_LEFT, count: 9, speed: 0.006},
          {route: ROUTE_RIGHT, count: 9, speed: 0.006, phase: 0.5},
        ]}
      />
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
