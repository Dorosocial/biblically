import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {NumberText, formatNumber} from '../NumberText';
import {PhraseCaption} from '../PhraseCaption';
import {COLORS} from '../colors';

const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

// Explicit milestone keyframes so the count genuinely, visibly passes
// through 1,000,000 -> 1,000,001 (held for readability), then races
// through the huge middle stretch and precisely lands on
// 1,000,000,000,000 -> 1,000,000,000,001 near the end.
const BREAK_FRAMES = [0, 55, 65, 90, 250, 270, 280, 290, 300];
const BREAK_VALUES = [
  999900, 1000001, 1000001, 1000002, 999000000000, 999999999998, 1000000000000, 1000000000001, 1000000000001,
];

const PHRASES = [
  {at: 0, words: [{text: 'YOU'}, {text: 'CAN'}, {text: 'ALWAYS'}]},
  {at: 30, words: [{text: 'ADD'}, {text: 'ONE'}, {text: 'MORE'}]},
  {at: 60, words: [{text: 'AFTER'}, {text: 'A'}, {text: 'MILLION'}]},
  {at: 90, words: [{text: 'COMES'}, {text: 'A'}, {text: 'MILLION'}, {text: 'AND'}, {text: 'ONE'}]},
  {at: 140, words: [{text: 'AFTER'}, {text: 'A'}, {text: 'TRILLION'}]},
  {at: 175, words: [{text: 'COMES'}, {text: 'A'}, {text: 'TRILLION'}, {text: 'AND'}, {text: 'ONE'}]},
  {at: 220, words: [{text: 'NO'}, {text: 'MATTER'}, {text: 'HOW'}, {text: 'HIGH'}, {text: 'YOU'}, {text: 'COUNT'}]},
  {at: 260, words: [{text: "THERE'S"}, {text: 'ALWAYS'}]},
  {at: 280, words: [{text: 'ANOTHER'}, {text: 'NUMBER'}, {text: 'WAITING'}]},
];

// Beat 2 (300-600, 0:10-0:20): the count visibly crosses 1,000,000 ->
// 1,000,001, then races through an exponential middle stretch and lands
// precisely on 1,000,000,000,000 -> 1,000,000,000,001. As the digit
// count grows the camera pulls back (a shrinking scale) to keep the
// whole numeral in frame, then it dissolves into "...".
export const Beat2: React.FC = () => {
  const frame = useCurrentFrame();

  const count = interpolate(frame, BREAK_FRAMES, BREAK_VALUES, clampOpts);
  const digits = formatNumber(count).replace(/[^0-9]/g, '').length;
  const pullback = interpolate(digits, [7, 13], [1, 0.52], clampOpts);

  const numberOpacity = interpolate(frame, [0, 8, 292, 300], [0, 1, 1, 0], clampOpts);
  const ellipsisOpacity = interpolate(frame, [292, 300], [0, 1], clampOpts);

  return (
    <>
      <Scene>
        <NumberText value={count} scale={pullback} opacity={numberOpacity} color={COLORS.bone} fontSize={150} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            justifyContent: 'center',
            opacity: ellipsisOpacity,
          }}
        >
          <span
            style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 800,
              fontSize: 150,
              color: COLORS.green,
              letterSpacing: 8,
            }}
          >
            &hellip;
          </span>
        </div>
      </Scene>
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
