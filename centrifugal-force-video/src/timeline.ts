// =============================================================================
// timeline.ts — single source of truth for timing.
//
// All numbers below come from a Whisper (small model) transcription of the
// real narration file (public/narration.mp3, ffprobe duration 57.286500s).
// Composition length is locked to that duration, rounded to the nearest
// frame at 30fps: 57.2865s * 30 = 1719 frames (57.3s).
//
// IMPORTANT CONTENT NOTE: the brief's shot list was written for a longer,
// more elaborate script (it references lines like "Every moment, the arm
// bends...", a rotating-coordinate-grid beat, a second split-screen near
// 78-82s, and a "the mystery disappears" outro) that simply are not present
// in this recording — the real narration is 57s and considerably more
// condensed. Beat boundaries below are anchored to the real spoken words;
// where the brief's shot-list ideas don't have a corresponding line, their
// VISUAL intent has been folded into the beat whose narration is thematically
// closest (see comments per-beat in sceneState.ts) rather than inventing
// unsynced narration-free beats. The two must-verify sequences the brief
// calls out (triple-replay release, split-screen frame comparison) both have
// a natural home in the real narration and are placed there.
// =============================================================================

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION_IN_FRAMES = 1719; // 57.3s @ 30fps (real audio: 57.2865s)

export type BeatId =
  | 'intro'
  | 'approachRelease'
  | 'releaseOutside'
  | 'freezeOutOfPlace'
  | 'rotatingFrameAttached'
  | 'bendingPathBuildup'
  | 'releaseReplayOverlay'
  | 'whyOutward'
  | 'centrifugalIntro'
  | 'rotatingPushAway'
  | 'splitScreenContrast'
  | 'onlyInwardForce'
  | 'outroLoop';

export interface Beat {
  id: BeatId;
  start: number;
  end: number;
  line: string;
}

export const BEATS: Beat[] = [
  { id: 'intro', start: 0, end: 162, line: 'A ball is attached to a rotating rod, and as the rod spins, the ball is forced to move in a circle.' },
  { id: 'approachRelease', start: 162, end: 261, line: 'But something strange happens when that ball is suddenly released.' },
  { id: 'releaseOutside', start: 261, end: 346, line: 'Rather than fly outward, it shoots straight off.' },
  { id: 'freezeOutOfPlace', start: 346, end: 425, line: "And that's the part that seems completely out of place." },
  { id: 'rotatingFrameAttached', start: 425, end: 553, line: 'Because while the ball is attached, the rod is constantly pulling it toward the center,' },
  { id: 'bendingPathBuildup', start: 553, end: 749, line: "and that inward force keeps bending the ball's path again and again until the ball is released." },
  { id: 'releaseReplayOverlay', start: 749, end: 1016, line: "But the instant that inward pull disappears, the path stops bending, and the ball keeps moving in the direction it was already traveling, and that's straight." },
  { id: 'whyOutward', start: 1016, end: 1140, line: 'So why does it look like the ball wants to fly outward?' },
  { id: 'centrifugalIntro', start: 1140, end: 1229, line: 'This is where centrifugal force comes in.' },
  { id: 'rotatingPushAway', start: 1229, end: 1372, line: 'You see, from the rotating frame, it appears as if the ball is being pushed away from the center,' },
  { id: 'splitScreenContrast', start: 1372, end: 1470, line: "but from the outside, there's no outward force." },
  { id: 'onlyInwardForce', start: 1470, end: 1600, line: "There's only the rod pulling inward, while the ball keeps trying to move straight." },
  { id: 'outroLoop', start: 1600, end: 1719, line: "And that's exactly why a ball is attached to a rotating rod." },
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
  small?: boolean;
}

export const LABELS: Label[] = [
  // Attached phase: inward force introduced.
  { text: 'INWARD FORCE', start: 460, end: 553, x: 50, y: 30 },
  // Rotating-frame replay of the release, inside bendingPathBuildup.
  { text: 'ROTATING FRAME', start: 605, end: 700, x: 50, y: 12 },
  // Triple-replay overlay: both perspectives labeled simultaneously.
  { text: 'OUTSIDE VIEW', start: 749, end: 900, x: 50, y: 28 },
  { text: 'ROTATING FRAME', start: 749, end: 900, x: 50, y: 72 },
  { text: 'STRAIGHT LINE', start: 860, end: 1000, x: 50, y: 50 },
  // Centrifugal.
  { text: 'CENTRIFUGAL', start: 1150, end: 1229, x: 50, y: 20 },
  { text: 'CENTRIFUGAL (APPARENT)', start: 1245, end: 1372, x: 50, y: 16 },
  // Split-screen contrast.
  { text: 'ROTATING FRAME → OUTWARD EFFECT', start: 1372, end: 1470, x: 50, y: 22, small: true },
  { text: 'OUTSIDE FRAME → NO OUTWARD FORCE', start: 1372, end: 1470, x: 50, y: 78, small: true },
  // Resolution.
  { text: 'INWARD FORCE', start: 1480, end: 1560, x: 50, y: 26 },
  { text: 'TANGENTIAL MOTION', start: 1520, end: 1600, x: 50, y: 74 },
];

// Sound-design placeholder markers (documented; not rendered visually).
// See Composition.tsx for the actual <!-- SOUND DESIGN --> comments at these frames.
export const SOUND_CUES: { frame: number; note: string }[] = [
  { frame: 261, note: 'the release moment — arm disconnects' },
  { frame: 1016, note: 'perspective switch — rotating frame POV takes over' },
  { frame: 1470, note: 'final merge back to a single resolved view' },
];
