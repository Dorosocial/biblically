import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {IconCard} from '../IconCard';
import {BigText} from '../BigText';
import {PhraseCaption} from '../PhraseCaption';
import {COLORS} from '../colors';

const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const CARDS = [
  {color: COLORS.pink, glyph: 'x=', label: 'ALGEBRA', highlightStart: 50},
  {color: COLORS.cyan, glyph: '%', label: 'PERCENTAGES', highlightStart: 85},
  {color: COLORS.yellow, glyph: '', label: 'WORD PROBLEMS', highlightStart: 118},
];
const CARD_X = [270, 540, 810];
const CARD_Y = 780;
const HIGHLIGHT_LEN = 45;

const DocIcon: React.FC<{color: string}> = ({color}) => (
  <g transform="translate(-30 -10)">
    <path d="M 0,-50 L 40,-50 L 60,-30 L 60,50 L 0,50 Z" fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 40,-50 L 40,-30 L 60,-30" fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" />
    <line x1={14} y1={-8} x2={46} y2={-8} stroke={color} strokeWidth={5} strokeLinecap="round" />
    <line x1={14} y1={12} x2={46} y2={12} stroke={color} strokeWidth={5} strokeLinecap="round" />
    <line x1={14} y1={32} x2={36} y2={32} stroke={color} strokeWidth={5} strokeLinecap="round" />
  </g>
);

const PHRASES = [
  {at: 0, words: [{text: 'LINE'}, {text: 'BY'}, {text: 'LINE'}]},
  {at: 30, words: [{text: 'THIS'}, {text: 'ACTUALLY'}, {text: 'WORKS'}]},
  {at: 60, words: [{text: 'ON'}, {text: 'ALGEBRA'}]},
  {at: 90, words: [{text: 'PERCENTAGES'}]},
  {at: 115, words: [{text: 'WORD'}, {text: 'PROBLEMS'}]},
  {at: 150, words: [{text: 'I'}, {text: 'MEAN'}, {text: 'ALMOST'}, {text: 'ANYTHING'}]},
  {at: 185, words: [{text: 'WITH'}, {text: 'NUMBERS'}]},
  {at: 215, words: [{text: 'ONE'}, {text: 'HABIT'}]},
  {at: 245, words: [{text: 'UNLIMITED'}, {text: 'USE'}]},
  {at: 270, words: [{text: 'ALWAYS'}, {text: 'ESTIMATE'}, {text: 'FIRST'}]},
  {at: 290, words: [{text: 'SOLVE'}, {text: 'SECOND'}]},
];

// Beat 3 (600-900, 0:20-0:30): three subject cards (algebra, percentages,
// word problems) pop in together, then each highlights and gets a green
// checkmark stamp in turn as the narration names it, before "ONE HABIT"
// / "UNLIMITED USE" build in with a small infinity accent.
export const Beat3: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const cardsOpacity = interpolate(frame, [0, 25], [0, 1], clampOpts);
  const cardsPop = spring({frame, fps, config: {damping: 13, mass: 0.5, stiffness: 190}});

  const oneHabitOpacity = interpolate(frame, [210, 232], [0, 1], clampOpts);
  const oneHabitScale = spring({frame: Math.max(0, frame - 210), fps, config: {damping: 13, mass: 0.5, stiffness: 200}});
  const unlimitedOpacity = interpolate(frame, [245, 267], [0, 1], clampOpts);
  const unlimitedScale = spring({frame: Math.max(0, frame - 245), fps, config: {damping: 13, mass: 0.5, stiffness: 200}});
  const infinityOpacity = interpolate(frame, [255, 275], [0, 1], clampOpts);

  return (
    <>
      <Scene>
        <g opacity={cardsOpacity}>
          {CARDS.map((c, i) => {
            const hStart = c.highlightStart;
            const hEnd = hStart + HIGHLIGHT_LEN;
            const inHighlight = frame >= hStart && frame < hEnd;
            const bump = inHighlight
              ? 1 + 0.14 * Math.sin(Math.PI * interpolate(frame, [hStart, hEnd], [0, 1], clampOpts))
              : 1;
            const checkProgress = interpolate(frame, [hStart + 12, hStart + 32], [0, 1], clampOpts);
            return (
              <IconCard
                key={i}
                x={CARD_X[i]}
                y={CARD_Y}
                color={c.color}
                glyph={c.glyph || undefined}
                iconNode={c.label === 'WORD PROBLEMS' ? <DocIcon color={c.color} /> : undefined}
                label={c.label}
                scale={cardsPop * bump}
                glow={frame >= hStart}
                checkProgress={checkProgress}
              />
            );
          })}
        </g>
      </Scene>
      <BigText
        lines={[
          {text: 'ONE HABIT', opacity: oneHabitOpacity, scale: oneHabitScale, color: COLORS.green, fontSize: 66, glow: true},
          {text: 'UNLIMITED USE', opacity: unlimitedOpacity, scale: unlimitedScale, color: COLORS.pink, fontSize: 66, glow: true},
        ]}
        top={1130}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1290,
          textAlign: 'center',
          opacity: infinityOpacity,
        }}
      >
        <span style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 800, fontSize: 54, color: COLORS.pink}}>
          &#8734;
        </span>
      </div>
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
