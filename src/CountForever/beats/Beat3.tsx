import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {Scene} from '../Scene';
import {InfinitySymbol} from '../InfinitySymbol';
import {BigText} from '../BigText';
import {PhraseCaption} from '../PhraseCaption';
import {COLORS} from '../colors';

const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const PHRASES = [
  {at: 0, words: [{text: 'IT'}, {text: 'GETS'}, {text: 'STRANGER'}]},
  {at: 35, words: [{text: 'MATHEMATICIANS'}, {text: "DON'T"}, {text: 'JUST'}, {text: 'STUDY'}]},
  {at: 75, words: [{text: 'NUMBERS'}, {text: 'THAT'}, {text: 'GO'}, {text: 'ON'}, {text: 'FOREVER'}]},
  {at: 120, words: [{text: "THEY'VE"}, {text: 'ACTUALLY'}, {text: 'FOUND'}]},
  {at: 155, words: [{text: 'DIFFERENT'}, {text: 'SIZES'}, {text: 'OF'}, {text: 'INFINITY'}]},
  {at: 200, words: [{text: 'SOME'}, {text: 'INFINITIES'}, {text: 'ARE'}, {text: 'BIGGER'}]},
  {at: 240, words: [{text: 'THAN'}, {text: 'OTHERS...'}]},
];

// Beat 3 (600-900, 0:20-0:30): two infinity symbols — one plain and
// smaller (a "countable" infinity), one larger with a dense scatter of
// dots (an "uncountable," denser infinity) — pop in side by side, then
// "SOME INFINITIES ARE BIGGER THAN OTHERS" builds in beneath them.
export const Beat3: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const leftScale = spring({frame: Math.max(0, frame - 20), fps, config: {damping: 13, mass: 0.5, stiffness: 200}});
  const rightScale = spring({frame: Math.max(0, frame - 45), fps, config: {damping: 13, mass: 0.5, stiffness: 200}});
  const leftOpacity = interpolate(frame, [20, 32], [0, 1], clampOpts);
  const rightOpacity = interpolate(frame, [45, 57], [0, 1], clampOpts);

  const textOpacity = interpolate(frame, [195, 215], [0, 1], clampOpts);
  const textScale = spring({frame: Math.max(0, frame - 195), fps, config: {damping: 14, mass: 0.5, stiffness: 180}});

  return (
    <>
      <Scene>
        <div style={{position: 'absolute', left: 0, right: 0, top: 700, display: 'flex', justifyContent: 'center', gap: 90}}>
          <InfinitySymbol fontSize={120} scale={leftScale} opacity={leftOpacity} color={COLORS.bone} />
          <InfinitySymbol fontSize={190} scale={rightScale} opacity={rightOpacity} color={COLORS.green} dense glow />
        </div>
      </Scene>
      <BigText
        lines={[
          {text: 'SOME INFINITIES', opacity: textOpacity, scale: textScale, color: COLORS.bone, fontSize: 52},
          {text: 'ARE BIGGER THAN OTHERS', opacity: textOpacity, scale: textScale, color: COLORS.bone, fontSize: 52},
        ]}
        top={1000}
      />
      <PhraseCaption frame={frame} phrases={PHRASES} />
    </>
  );
};
