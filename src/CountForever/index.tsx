import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {COLORS} from './colors';
import {BEATS} from './constants';
import {Beat1} from './beats/Beat1';
import {Beat2} from './beats/Beat2';
import {Beat3} from './beats/Beat3';
import {Beat4} from './beats/Beat4';

// "Could You Count Forever?" — infinity and different sizes of infinity
// (Zombie Math). A calm, contemplative reveal: no screen-shake anywhere,
// large animated numbers with real interpolate()-driven counting (a
// decelerating "human" pace that breaks into exponential acceleration in
// beat 1, and an exact-milestone race through a million and a trillion
// in beat 2), plain vector infinity symbols, and word/phrase pop-in
// captions in the center-lower third rather than a bottom bar.
export const CountForever: React.FC = () => {
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
    </AbsoluteFill>
  );
};
