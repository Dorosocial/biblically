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
import {Beat9} from './beats/Beat9';
import {Beat10} from './beats/Beat10';
import {Beat11} from './beats/Beat11';
import {Beat12} from './beats/Beat12';
import {Beat13} from './beats/Beat13';
import {Beat14} from './beats/Beat14';
import {Beat15} from './beats/Beat15';
import {Beat16} from './beats/Beat16';
import {Beat17} from './beats/Beat17';
import {Beat18} from './beats/Beat18';
import {Beat19} from './beats/Beat19';
import {Beat20} from './beats/Beat20';

// "Why Building More Roads Slows Everyone Down" — Braess's Paradox
// (Zombie Math). 20 beats, each its own Sequence at its exact frame
// range, alternating road-network camera shots with standalone graphic
// beats (text callouts, icons, the checkout-lane analogy, the title
// card) so no two consecutive hard cuts repeat the same framing scale.
export const TrafficParadox: React.FC = () => {
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
      <Sequence from={BEATS.beat9.from} durationInFrames={BEATS.beat9.duration}>
        <Beat9 />
      </Sequence>
      <Sequence from={BEATS.beat10.from} durationInFrames={BEATS.beat10.duration}>
        <Beat10 />
      </Sequence>
      <Sequence from={BEATS.beat11.from} durationInFrames={BEATS.beat11.duration}>
        <Beat11 />
      </Sequence>
      <Sequence from={BEATS.beat12.from} durationInFrames={BEATS.beat12.duration}>
        <Beat12 />
      </Sequence>
      <Sequence from={BEATS.beat13.from} durationInFrames={BEATS.beat13.duration}>
        <Beat13 />
      </Sequence>
      <Sequence from={BEATS.beat14.from} durationInFrames={BEATS.beat14.duration}>
        <Beat14 />
      </Sequence>
      <Sequence from={BEATS.beat15.from} durationInFrames={BEATS.beat15.duration}>
        <Beat15 />
      </Sequence>
      <Sequence from={BEATS.beat16.from} durationInFrames={BEATS.beat16.duration}>
        <Beat16 />
      </Sequence>
      <Sequence from={BEATS.beat17.from} durationInFrames={BEATS.beat17.duration}>
        <Beat17 />
      </Sequence>
      <Sequence from={BEATS.beat18.from} durationInFrames={BEATS.beat18.duration}>
        <Beat18 />
      </Sequence>
      <Sequence from={BEATS.beat19.from} durationInFrames={BEATS.beat19.duration}>
        <Beat19 />
      </Sequence>
      <Sequence from={BEATS.beat20.from} durationInFrames={BEATS.beat20.duration}>
        <Beat20 />
      </Sequence>
    </AbsoluteFill>
  );
};
