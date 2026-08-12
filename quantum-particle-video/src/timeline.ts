// =============================================================================
// timeline.ts — single source of truth for timing.
//
// All numbers below are derived from a Whisper (small model) transcription of
// the real narration file (public/narration.mp3, ffprobe duration
// 72.803250s). Composition length is locked to that duration, rounded to the
// nearest frame at 30fps: 72.8s * 30 = 2184 frames exactly.
//
// Beat boundaries below are anchored to the actual spoken word timestamps
// (see /tmp scratch transcript for the raw Whisper output) — the shot-list
// timestamps in the brief were pacing references only, not the real audio.
// Every beat's `end` equals the next beat's `start`, so the 28 beats below
// tile [0, DURATION_IN_FRAMES) with zero gaps — there is never a span of the
// video not owned by some beat's motion.
// =============================================================================

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION_IN_FRAMES = 2184; // 72.8s @ 30fps

export type BeatId =
  | 'intro'
  | 'impossiblePause'
  | 'ballAppears'
  | 'ghostDuplicate'
  | 'ballDissolves'
  | 'explainReveal'
  | 'superposition'
  | 'reallyStrange'
  | 'oneParticle'
  | 'chooseLeftRight'
  | 'dontMeasure'
  | 'interferenceForms'
  | 'almostBothPaths'
  | 'splitQuestion'
  | 'no'
  | 'stillOneParticle'
  | 'waveFunction'
  | 'spreadPossibilities'
  | 'findOutWhichPath'
  | 'measureDetector'
  | 'interferenceDisappears'
  | 'oneResult'
  | 'meaningBallAnalogy'
  | 'muchStranger'
  | 'beforeMeasurement'
  | 'quantumWorldSplit'
  | 'diveIntoAtom'
  | 'realityWeird';

export interface Beat {
  id: BeatId;
  start: number;
  end: number;
  /** narration line covered, for reference only */
  line: string;
}

export const BEATS: Beat[] = [
  { id: 'intro', start: 0, end: 91, line: 'How can one particle be in two places at the same time?' },
  { id: 'impossiblePause', start: 91, end: 138, line: 'It already sounds impossible,' },
  { id: 'ballAppears', start: 138, end: 195, line: 'because if you put a ball here,' },
  { id: 'ghostDuplicate', start: 195, end: 241, line: "it can't also be over there." },
  { id: 'ballDissolves', start: 241, end: 325, line: "But tiny particles don't always behave like that." },
  { id: 'explainReveal', start: 325, end: 349, line: 'Let me explain.' },
  { id: 'superposition', start: 349, end: 505, line: 'In quantum physics, a particle can exist in a superposition of different possible states.' },
  { id: 'reallyStrange', start: 505, end: 545, line: 'And that gets really strange.' },
  { id: 'oneParticle', start: 545, end: 644, line: 'Imagine sending a single particle toward two openings.' },
  { id: 'chooseLeftRight', start: 644, end: 731, line: 'You might expect it to choose one, left or right,' },
  { id: 'dontMeasure', start: 731, end: 802, line: "but when you don't measure which path it takes," },
  { id: 'interferenceForms', start: 802, end: 860, line: 'the results can form an interference pattern.' },
  { id: 'almostBothPaths', start: 860, end: 966, line: "That's almost like the particle somehow went through both paths." },
  { id: 'splitQuestion', start: 966, end: 1043, line: 'So did it actually split into two particles?' },
  { id: 'no', start: 1043, end: 1064, line: 'No.' },
  { id: 'stillOneParticle', start: 1064, end: 1125, line: "There's still only one particle." },
  { id: 'waveFunction', start: 1125, end: 1274, line: 'quantum mechanics describes it using a wave function,' },
  { id: 'spreadPossibilities', start: 1274, end: 1351, line: 'which can spread across multiple possibilities.' },
  { id: 'findOutWhichPath', start: 1351, end: 1454, line: 'But now, try to find out exactly which path it took.' },
  { id: 'measureDetector', start: 1454, end: 1475, line: 'Measure it,' },
  { id: 'interferenceDisappears', start: 1475, end: 1549, line: 'and that interference completely disappears.' },
  { id: 'oneResult', start: 1549, end: 1620, line: 'The particle gives you one definite result,' },
  { id: 'meaningBallAnalogy', start: 1620, end: 1788, line: "meaning the particle isn't literally a tiny ball sitting in two places like a normal object." },
  { id: 'muchStranger', start: 1788, end: 1837, line: "It's something much stranger." },
  { id: 'beforeMeasurement', start: 1837, end: 1979, line: 'Before measurement, quantum mechanics can describe multiple possible outcomes at once.' },
  { id: 'quantumWorldSplit', start: 1979, end: 2091, line: "And that's why the quantum world doesn't behave the way our everyday world does." },
  { id: 'diveIntoAtom', start: 2091, end: 2141, line: 'Because at that scale,' },
  { id: 'realityWeird', start: 2141, end: 2184, line: 'reality gets weird.' },
];

export const beatRange = (id: BeatId): [number, number] => {
  const b = BEATS.find((x) => x.id === id);
  if (!b) throw new Error(`Unknown beat ${id}`);
  return [b.start, b.end];
};

// Sanity: beats must tile the whole timeline with no gaps/overlaps.
BEATS.reduce((prevEnd, b) => {
  if (b.start !== prevEnd) {
    throw new Error(`Beat ${b.id} starts at ${b.start}, expected ${prevEnd} (gap or overlap)`);
  }
  return b.end;
}, 0);
if (BEATS[BEATS.length - 1].end !== DURATION_IN_FRAMES) {
  throw new Error('Beats do not cover the full duration');
}

// Short text labels — HTML/CSS overlays, animated drift/fade entrances.
export interface Label {
  text: string;
  start: number;
  end: number;
  x: number; // percent
  y: number; // percent
}

export const LABELS: Label[] = [
  { text: 'IMPOSSIBLE?', start: 100, end: 136, x: 50, y: 68 },
  { text: 'ONE PARTICLE', start: 560, end: 630, x: 50, y: 20 },
  { text: 'LEFT', start: 652, end: 726, x: 26, y: 42 },
  { text: 'RIGHT', start: 662, end: 726, x: 74, y: 42 },
  { text: 'NO', start: 1031, end: 1064, x: 50, y: 45 },
  { text: 'WHICH PATH?', start: 1368, end: 1450, x: 50, y: 22 },
  { text: 'ONE RESULT', start: 1560, end: 1616, x: 50, y: 74 },
];

// Sound-design placeholder markers (documented; not rendered visually).
// See Composition.tsx for the actual <!-- SOUND DESIGN --> comments at these frames.
export const SOUND_CUES: { frame: number; note: string }[] = [
  { frame: 241, note: 'ball-to-particle dissolve begins' },
  { frame: 802, note: 'interference pattern begins forming on screen' },
  { frame: 1454, note: 'measurement / collapse moment — detector fires' },
  { frame: 2141, note: 'final rapid montage into freeze-frame' },
];
