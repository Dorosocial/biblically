import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {NumberText} from '../NumberText';
import {PhraseCaption} from '../PhraseCaption';
import {COLORS} from '../colors';
import {easeInExpo} from '../ease';

const PHASE_A_END = 230;
const PHASE_A_MAX = 55;
const PHASE_B_MAX = 24000;

const PHRASES = [
  {at: 0, words: [{text: 'COULD'}, {text: 'YOU'}, {text: 'COUNT'}]},
  {at: 35, words: [{text: 'FOREVER?'}]},
  {at: 65, words: [{text: 'SEEMS'}, {text: 'IMPOSSIBLE'}]},
  {at: 100, words: [{text: 'EVENTUALLY'}, {text: "YOU'D"}, {text: 'GET'}, {text: 'TIRED'}]},
  {at: 140, words: [{text: 'RUN'}, {text: 'OUT'}, {text: 'OF'}, {text: 'TIME'}]},
  {at: 175, words: [{text: 'OR'}, {text: 'JUST'}, {text: 'STOP'}]},
  {at: 205, words: [{text: "BUT"}, {text: "HERE'S"}, {text: 'THE'}, {text: 'STRANGE'}, {text: 'THING'}]},
  {at: 245, words: [{text: 'NUMBERS'}, {text: 'THEMSELVES'}]},
  {at: 270, words: [{text: 'NEVER'}, {text: 'RUN'}, {text: 'OUT'}]},
];

// Beat 1 (0-300, 0:00-0:10): the count starts at 1 and climbs with a
// naturally decelerating, human pace (a sqrt curve — the gap between
// each number grows, like getting tired), then on "numbers themselves
// never run out" breaks free into a dramatic, exponential acceleration.
export const Beat1: React.FC = () => {
  const frame = useCurrentFrame();
  const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

  let count: number;
  let scale = 1;
  if (frame < PHASE_A_END) {
    const u = frame / PHASE_A_END;
    count = Math.max(1, Math.floor(PHASE_A_MAX * Math.sqrt(u)));
  } else {
    const u = interpolate(frame, [PHASE_A_END, 300], [0, 1], clampOpts);
    const eased = easeInExpo(u);
    count = Math.floor(PHASE_A_MAX + (PHASE_B_MAX - PHASE_A_MAX) * eased);
    scale = 1 + 0.35 * eased;
  }

  const numberOpacity = interpolate(frame, [0, 8], [0, 1], clampOpts);

  return (
    <>
      <Scene>
        <NumberText value={count} scale={scale} opacity={numberOpacity} color={COLORS.bone} y={-120} fontSize={150} />
      </Scene>
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
