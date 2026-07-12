import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {COLORS} from './colors';
import {BEATS} from './constants';
import {Beat1} from './beats/Beat1';
import {Beat2} from './beats/Beat2';
import {Beat3} from './beats/Beat3';
import {Beat4} from './beats/Beat4';

// "The Universal Trick for Checking If Your Math Answer Is Right" —
// estimation (Zombie Math). Colorful vector diagrams (a confidence
// gauge, rounding number blocks, number lines, subject cards) driven by
// genuine interpolate()-based per-frame animation, no screen-shake, one
// clean camera hold per beat, and word/phrase pop-in captions in the
// center-lower third rather than a bottom bar. Narration runs
// continuously across all four beats — every diagram plays underneath
// ongoing VO, never in a silent gap.
export const EstimationCheck: React.FC = () => {
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
