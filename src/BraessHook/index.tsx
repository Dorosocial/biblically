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
import {Beat21} from './beats/Beat21';
import {Beat22} from './beats/Beat22';
import {Beat23} from './beats/Beat23';
import {Beat24} from './beats/Beat24';
import {Beat25} from './beats/Beat25';

// "Why Building More Roads Slows Everyone Down" — Braess's Paradox
// (Zombie Math), retention-cut rebuild. 25 beats, each its own Sequence.
// Unlike the calmer TrafficParadox composition, almost every beat here
// computes its camera shot per-frame (dot-tracking, path-following,
// whip-pans) rather than picking a static named shot, per the critical
// retention rule: no static wide hold longer than ~2 seconds.
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
      <Sequence from={BEATS.beat13.from} durationInFrames={BEATS.beat13.duration}><Beat13 /></Sequence>
      <Sequence from={BEATS.beat14.from} durationInFrames={BEATS.beat14.duration}><Beat14 /></Sequence>
      <Sequence from={BEATS.beat15.from} durationInFrames={BEATS.beat15.duration}><Beat15 /></Sequence>
      <Sequence from={BEATS.beat16.from} durationInFrames={BEATS.beat16.duration}><Beat16 /></Sequence>
      <Sequence from={BEATS.beat17.from} durationInFrames={BEATS.beat17.duration}><Beat17 /></Sequence>
      <Sequence from={BEATS.beat18.from} durationInFrames={BEATS.beat18.duration}><Beat18 /></Sequence>
      <Sequence from={BEATS.beat19.from} durationInFrames={BEATS.beat19.duration}><Beat19 /></Sequence>
      <Sequence from={BEATS.beat20.from} durationInFrames={BEATS.beat20.duration}><Beat20 /></Sequence>
      <Sequence from={BEATS.beat21.from} durationInFrames={BEATS.beat21.duration}><Beat21 /></Sequence>
      <Sequence from={BEATS.beat22.from} durationInFrames={BEATS.beat22.duration}><Beat22 /></Sequence>
      <Sequence from={BEATS.beat23.from} durationInFrames={BEATS.beat23.duration}><Beat23 /></Sequence>
      <Sequence from={BEATS.beat24.from} durationInFrames={BEATS.beat24.duration}><Beat24 /></Sequence>
      <Sequence from={BEATS.beat25.from} durationInFrames={BEATS.beat25.duration}><Beat25 /></Sequence>
    </AbsoluteFill>
  );
};
