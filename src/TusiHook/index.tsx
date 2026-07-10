import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {COLORS} from './colors';
import {BEATS} from './constants';
import {Beat1} from './beats/Beat1';
import {Beat2} from './beats/Beat2';
import {Beat3} from './beats/Beat3';
import {Beat4} from './beats/Beat4';
import {Beat5} from './beats/Beat5';
import {Beat6} from './beats/Beat6';

// "Why Does a Circle Rolling in a Circle Draw a Straight Line?" — the Tusi
// Couple (Zombie Math). A calm, elegant reveal: no screen-shake anywhere,
// one confident camera move per beat (often none at all), and word/phrase
// pop-in captions in the center-lower third rather than a bottom bar. The
// rolling angle is driven by the absolute frame (see motion.ts) so it
// stays mathematically continuous across the beat 3 -> beat 4 boundary.
export const TusiHook: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={BEATS.beat1.from} durationInFrames={BEATS.beat1.duration}>
        <Beat1 />
      </Sequence>
      <Sequence from={BEATS.beat2.from} durationInFrames={BEATS.beat2.duration}>
        <Beat2 />
      </Sequence>
      <Sequence from={BEATS.beat3.from} durationInFrames={BEATS.beat3.duration}>
        <Beat3 />
      </Sequence>
      <Sequence from={BEATS.beat4.from} durationInFrames={BEATS.beat4.duration}>
        <Beat4 />
      </Sequence>
      <Sequence from={BEATS.beat5.from} durationInFrames={BEATS.beat5.duration}>
        <Beat5 />
      </Sequence>
      <Sequence from={BEATS.beat6.from} durationInFrames={BEATS.beat6.duration}>
        <Beat6 />
      </Sequence>
    </AbsoluteFill>
  );
};
