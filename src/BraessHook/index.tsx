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

// "Why Building More Roads Slows Everyone Down" — Braess's Paradox
// (Zombie Math), rebuilt against the re-recorded/re-paced 79s VO take.
// 12 beats, each its own Sequence. One clean, confident camera move per
// beat (no stacked whip-pans/snap-zooms); screen-shake/impact-flash is
// reserved for Beat 5 alone, at the moment the shortcut connects.
// Captions are word/phrase pop-ins in the center-lower third (see
// PhraseCaption), not a fixed bottom bar.
export const BraessHook: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Sequence from={BEATS.beat1.from} durationInFrames={BEATS.beat1.duration}><Beat1 /></Sequence>
      <Sequence from={BEATS.beat2.from} durationInFrames={BEATS.beat2.duration}><Beat2 /></Sequence>
      <Sequence from={BEATS.beat3.from} durationInFrames={BEATS.beat3.duration}><Beat3 /></Sequence>
      <Sequence from={BEATS.beat4.from} durationInFrames={BEATS.beat4.duration}><Beat4 /></Sequence>
      <Sequence from={BEATS.beat5.from} durationInFrames={BEATS.beat5.duration}><Beat5 /></Sequence>
      <Sequence from={BEATS.beat6.from} durationInFrames={BEATS.beat6.duration}><Beat6 /></Sequence>
      <Sequence from={BEATS.beat7.from} durationInFrames={BEATS.beat7.duration}><Beat7 /></Sequence>
      <Sequence from={BEATS.beat8.from} durationInFrames={BEATS.beat8.duration}><Beat8 /></Sequence>
      <Sequence from={BEATS.beat9.from} durationInFrames={BEATS.beat9.duration}><Beat9 /></Sequence>
      <Sequence from={BEATS.beat10.from} durationInFrames={BEATS.beat10.duration}><Beat10 /></Sequence>
      <Sequence from={BEATS.beat11.from} durationInFrames={BEATS.beat11.duration}><Beat11 /></Sequence>
      <Sequence from={BEATS.beat12.from} durationInFrames={BEATS.beat12.duration}><Beat12 /></Sequence>
    </AbsoluteFill>
  );
};
