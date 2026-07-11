import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {COLORS} from './colors';
import {BEATS} from './constants';
import {Beat1} from './beats/Beat1';
import {Beat2} from './beats/Beat2';
import {Beat3} from './beats/Beat3';
import {Beat4} from './beats/Beat4';
import {Beat5} from './beats/Beat5';

// "Nobody Can Solve This Math Problem" — the Moving Sofa Problem
// (Zombie Math). A calm, elegant reveal: no screen-shake anywhere, one
// confident camera move per beat. Sofa shapes are tested against the
// real hallway-corner constraint by rigidly rotating them about the
// outer corner pivot (see geometry.ts) — the rectangle in beat 1
// genuinely jams at its numerically verified stuck angle, and the
// escalating shapes in beat 3 are genuinely collision-free across the
// full rotation, not just decorative.
export const MovingSofa: React.FC = () => {
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
    </AbsoluteFill>
  );
};
