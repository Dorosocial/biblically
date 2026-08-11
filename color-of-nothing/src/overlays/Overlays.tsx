import React from 'react';
import {useCurrentFrame} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {FPS, BEATS} from '../timing';
import {TextOverlay} from './TextOverlay';

const secondsNow = (frame: number): number => frame / FPS;

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/** Cross-fade opacity for a word occupying [start,end] inside a longer window, with soft edges. */
const wordOpacity = (seconds: number, start: number, end: number, fade = 0.18): number => {
  if (seconds < start - fade || seconds > end + fade) return 0;
  if (seconds < start) return clamp01((seconds - (start - fade)) / fade);
  if (seconds > end) return clamp01(1 - (seconds - end) / fade);
  return 1;
};

/** "BLACK?" "WHITE?" "NOTHING?" — faint possibilities, appearing and disappearing one by one. */
export const PossibilityWords: React.FC = () => {
  const frame = useCurrentFrame();
  const seconds = secondsNow(frame);
  const {start, end} = BEATS.possibilities;
  const span = end - start;
  const third = span / 3;

  const words: Array<{text: string; s: number; e: number; dy: number}> = [
    {text: 'BLACK?', s: start, e: start + third, dy: -70},
    {text: 'WHITE?', s: start + third, e: start + third * 2, dy: 0},
    {text: 'NOTHING?', s: start + third * 2, e: end, dy: 70},
  ];

  return (
    <AbsoluteFill>
      {words.map((w) => (
        <TextOverlay
          key={w.text}
          text={w.text}
          opacity={wordOpacity(seconds, w.s, w.e) * 0.55}
          fontSize={38}
          fontWeight={200}
          color="#c7cdd6"
          top="50%"
          left="50%"
          transform={`translate(-50%, calc(-50% + ${w.dy}px))`}
        />
      ))}
    </AbsoluteFill>
  );
};

/** Giant "BLACK?" text, then glitches apart and disappears. */
export const BlackQuestionText: React.FC = () => {
  const frame = useCurrentFrame();
  const seconds = secondsNow(frame);
  const {blackText, blackTextGlitch} = BEATS;

  const appearOpacity = wordOpacity(seconds, blackText.start, blackText.end, 0.25);
  const inGlitch = seconds >= blackTextGlitch.start && seconds <= blackTextGlitch.end;

  if (appearOpacity <= 0.002 && !inGlitch) return null;

  let opacity = appearOpacity;
  let jitterX = 0;
  let jitterY = 0;
  let scale = 1;

  if (inGlitch) {
    const t = clamp01((seconds - blackTextGlitch.start) / (blackTextGlitch.end - blackTextGlitch.start));
    // a few sharp jitters as it "cracks apart", then a fast fade.
    const jitterSeed = Math.floor(t * 14);
    jitterX = (Math.sin(jitterSeed * 12.9) * 43758.5453) % 1 * 10 * (1 - t);
    jitterY = (Math.cos(jitterSeed * 7.233) * 12543.13) % 1 * 8 * (1 - t);
    scale = 1 + t * 0.15;
    opacity = 1 - t;
  }

  return (
    <TextOverlay
      text="BLACK?"
      opacity={opacity}
      fontSize={72}
      fontWeight={200}
      color="#f2f4f7"
      letterSpacing="0.06em"
      transform={`translate(calc(-50% + ${jitterX}px), calc(-50% + ${jitterY}px)) scale(${scale})`}
    />
  );
};

const STAGE_LABELS = ['NO LIGHT', 'EYE', 'BRAIN', 'BLACK EXPERIENCE'] as const;

/** The four-stage diagram labels, revealed in sequence under the panning camera. */
export const FourStageLabels: React.FC = () => {
  const frame = useCurrentFrame();
  const seconds = secondsNow(frame);
  const {noLight, eye, brain, blackExperience} = BEATS.fourStage;
  const stages = [noLight, eye, brain, blackExperience];
  const xPositions = ['14%', '38%', '62%', '86%'];

  return (
    <AbsoluteFill>
      {stages.map((stage, i) => (
        <TextOverlay
          key={STAGE_LABELS[i]}
          text={STAGE_LABELS[i]}
          opacity={wordOpacity(seconds, stage.start, BEATS.fourStage.end, 0.3) * 0.75}
          fontSize={22}
          fontWeight={400}
          color="#aeb6c2"
          letterSpacing="0.12em"
          top="62%"
          left={xPositions[i]}
          transform="translate(-50%, -50%)"
        />
      ))}
    </AbsoluteFill>
  );
};

const KEY_LABELS = ['WORLD', 'LIGHT', 'EYE', 'OBSERVER'] as const;

/** THE KEY TRANSITION: minimal labels marking each element as it visibly vanishes. */
export const KeyTransitionLabels: React.FC = () => {
  const frame = useCurrentFrame();
  const seconds = secondsNow(frame);
  const {world, light, eye, observer} = BEATS.keyTransition;
  const stages = [world, light, eye, observer];

  return (
    <AbsoluteFill>
      {stages.map((stage, i) => (
        <TextOverlay
          key={KEY_LABELS[i]}
          text={KEY_LABELS[i]}
          opacity={wordOpacity(seconds, stage.start, stage.end, 0.12) * 0.6}
          fontSize={20}
          fontWeight={400}
          color="#8a95a3"
          letterSpacing="0.3em"
          top="80%"
        />
      ))}
    </AbsoluteFill>
  );
};
