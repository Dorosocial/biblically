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
import {Beat7} from './beats/Beat7';
import {Beat8} from './beats/Beat8';

// "Why Building More Roads Slows Everyone Down" — Braess's Paradox short.
// Resynced to the real 63s/8-beat voiceover: each beat is a Sequence at its
// exact frame range, and the narration is continuous throughout — there is
// no silent beat. Congestion ramps continuously across beats 4-6 under
// ongoing narration instead of during a music-only pause.
export const BraessParadox: React.FC = () => {
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
      <Sequence from={BEATS.beat7.from} durationInFrames={BEATS.beat7.duration}>
        <Beat7 />
      </Sequence>
      <Sequence from={BEATS.beat8.from} durationInFrames={BEATS.beat8.duration}>
        <Beat8 />
      </Sequence>
    </AbsoluteFill>
  );
};
