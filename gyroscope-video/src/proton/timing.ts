/**
 * Single source of truth for timing — "How Small Is a Proton?"
 *
 * Every number in `WORDS` was copied verbatim from the real Whisper
 * ("small" model, word_timestamps=True) transcription of
 * public/proton-narration.mp3 (the exact file this composition plays
 * back). The original storyboard's second-marks (e.g. "the 36-39s freeze",
 * "continuous tunnel-zoom 23-27s") were pacing guesses written before the
 * real recording existed — the real freeze lands at ~51.4s and the tunnel
 * zoom at ~37-44s. Every cue below is a real spoken timestamp, not a
 * storyboard estimate.
 *
 * Raw ffprobe duration of proton-narration.mp3: 78.8375s.
 */

export const FPS = 30;

// ffprobe -show_entries format=duration proton-narration.mp3 -> 78.837500
export const AUDIO_DURATION_SECONDS = 78.8375;

// Round up so the audio is never truncated by a shorter video timeline.
export const DURATION_IN_FRAMES = Math.ceil(AUDIO_DURATION_SECONDS * FPS);

export const WIDTH = 1080;
export const HEIGHT = 1920;

/** seconds -> frame number at the project fps, rounded to the nearest frame. */
export const sec = (s: number): number => Math.round(s * FPS);

/** Word-level timestamps exactly as produced by Whisper. */
export const WORDS: {word: string; start: number; end: number}[] = [
  {word: 'How', start: 0.0, end: 0.2},
  {word: 'small', start: 0.2, end: 0.52},
  {word: 'is', start: 0.52, end: 0.72},
  {word: 'a', start: 0.72, end: 0.84},
  {word: 'proton?', start: 0.84, end: 1.04},
  {word: 'Seriously.', start: 1.64, end: 2.0},
  {word: 'How', start: 2.78, end: 3.0},
  {word: 'really', start: 3.0, end: 3.28},
  {word: 'small?', start: 3.28, end: 3.56},
  {word: 'You', start: 4.36, end: 4.52},
  {word: 'see,', start: 4.52, end: 4.68},
  {word: 'if', start: 4.8, end: 4.94},
  {word: 'you', start: 4.94, end: 5.14},
  {word: 'took', start: 5.14, end: 5.44},
  {word: 'a', start: 5.44, end: 5.68},
  {word: 'single', start: 5.68, end: 6.06},
  {word: 'proton', start: 6.06, end: 6.68},
  {word: 'and', start: 6.68, end: 7.5},
  {word: 'somehow', start: 7.5, end: 7.88},
  {word: 'made', start: 7.88, end: 8.2},
  {word: 'it', start: 8.2, end: 8.32},
  {word: 'as', start: 8.32, end: 8.54},
  {word: 'big', start: 8.54, end: 8.88},
  {word: 'as', start: 8.88, end: 9.22},
  {word: 'a', start: 9.22, end: 9.34},
  {word: 'basketball,', start: 9.34, end: 9.84},
  {word: 'an', start: 10.34, end: 10.46},
  {word: 'actual', start: 10.46, end: 10.84},
  {word: 'basketball', start: 10.84, end: 11.46},
  {word: 'would', start: 11.46, end: 11.84},
  {word: 'be', start: 11.84, end: 12.04},
  {word: 'about', start: 12.04, end: 12.26},
  {word: 'the', start: 12.26, end: 12.44},
  {word: 'size', start: 12.44, end: 12.76},
  {word: 'of', start: 12.76, end: 12.9},
  {word: 'a', start: 12.9, end: 13.02},
  {word: 'planet.', start: 13.02, end: 13.34},
  {word: 'Well,', start: 13.92, end: 14.24},
  {word: 'and', start: 14.48, end: 14.72},
  {word: "that's", start: 14.72, end: 15.02},
  {word: 'because', start: 15.02, end: 15.32},
  {word: 'a', start: 15.32, end: 15.66},
  {word: 'proton', start: 15.66, end: 16.02},
  {word: 'is', start: 16.02, end: 16.58},
  {word: 'ridiculously', start: 16.58, end: 17.22},
  {word: 'small.', start: 17.22, end: 17.82},
  {word: 'Its', start: 17.82, end: 18.32},
  {word: 'diameter', start: 18.32, end: 18.74},
  {word: 'is', start: 18.74, end: 19.04},
  {word: 'only', start: 19.04, end: 19.26},
  {word: 'about', start: 19.26, end: 19.58},
  {word: '1', start: 19.58, end: 20.08},
  {word: '.7', start: 20.08, end: 20.88},
  {word: 'femtometers,', start: 20.88, end: 21.8},
  {word: 'and', start: 21.98, end: 22.16},
  {word: "that's", start: 22.16, end: 22.54},
  {word: 'about', start: 22.54, end: 22.78},
  {word: '0', start: 22.78, end: 23.22},
  {word: '.00000000017', start: 23.22, end: 31.56},
  {word: 'meters.', start: 31.56, end: 31.98},
  {word: 'But', start: 32.24, end: 32.38},
  {word: 'even', start: 32.38, end: 32.54},
  {word: 'that', start: 32.54, end: 32.78},
  {word: 'number', start: 32.78, end: 33.08},
  {word: "doesn't", start: 33.08, end: 33.56},
  {word: 'really', start: 33.56, end: 33.8},
  {word: 'mean', start: 33.8, end: 34.1},
  {word: 'anything', start: 34.1, end: 34.56},
  {word: 'until', start: 34.56, end: 34.94},
  {word: 'you', start: 34.94, end: 35.14},
  {word: 'see', start: 35.14, end: 35.34},
  {word: 'it.', start: 35.34, end: 35.52},
  {word: 'This', start: 35.68, end: 35.86},
  {word: 'is', start: 35.86, end: 35.96},
  {word: 'where', start: 35.96, end: 36.14},
  {word: 'it', start: 36.14, end: 36.26},
  {word: 'gets', start: 36.26, end: 36.44},
  {word: 'real.', start: 36.44, end: 36.8},
  {word: 'Imagine', start: 37.06, end: 37.46},
  {word: 'zooming', start: 37.46, end: 37.92},
  {word: 'into', start: 37.92, end: 38.34},
  {word: 'the', start: 38.34, end: 38.62},
  {word: 'tip', start: 38.62, end: 38.9},
  {word: 'of', start: 38.9, end: 39.08},
  {word: 'a', start: 39.08, end: 39.18},
  {word: 'human', start: 39.18, end: 39.4},
  {word: 'hair.', start: 39.4, end: 39.72},
  {word: 'I', start: 39.94, end: 40.04},
  {word: 'mean,', start: 40.04, end: 40.2},
  {word: 'really', start: 40.36, end: 40.78},
  {word: 'zooming', start: 40.78, end: 41.2},
  {word: 'in,', start: 41.2, end: 41.56},
  {word: 'and', start: 41.76, end: 41.96},
  {word: 'again,', start: 41.96, end: 42.3},
  {word: 'and', start: 42.66, end: 42.84},
  {word: 'again,', start: 42.84, end: 43.18},
  {word: 'and', start: 43.52, end: 43.66},
  {word: 'again.', start: 43.66, end: 43.96},
  {word: 'You', start: 43.96, end: 44.4},
  {word: 'eventually', start: 44.4, end: 44.74},
  {word: 'reach', start: 44.74, end: 45.14},
  {word: 'atoms,', start: 45.14, end: 45.5},
  {word: 'and', start: 45.8, end: 45.86},
  {word: 'inside', start: 45.86, end: 46.18},
  {word: 'the', start: 46.18, end: 46.36},
  {word: 'atom,', start: 46.36, end: 46.72},
  {word: "there's", start: 46.94, end: 47.26},
  {word: 'the', start: 47.26, end: 47.38},
  {word: 'nucleus.', start: 47.38, end: 47.78},
  {word: 'And', start: 48.16, end: 48.22},
  {word: 'inside', start: 48.22, end: 48.62},
  {word: 'that', start: 48.62, end: 48.84},
  {word: 'tiny', start: 48.84, end: 49.2},
  {word: 'nucleus', start: 49.2, end: 49.7},
  {word: 'is', start: 49.7, end: 50.26},
  {word: 'the', start: 50.26, end: 50.66},
  {word: 'proton.', start: 50.66, end: 51.08},
  {word: 'But', start: 51.42, end: 51.64},
  {word: "there's", start: 51.64, end: 52.08},
  {word: 'more', start: 52.08, end: 52.28},
  {word: 'I', start: 52.28, end: 52.46},
  {word: "haven't", start: 52.46, end: 52.72},
  {word: 'told', start: 52.72, end: 52.92},
  {word: 'you', start: 52.92, end: 53.14},
  {word: 'yet.', start: 53.14, end: 53.38},
  {word: 'You', start: 53.58, end: 53.7},
  {word: 'see,', start: 53.7, end: 53.84},
  {word: 'most', start: 54.06, end: 54.3},
  {word: 'of', start: 54.3, end: 54.54},
  {word: 'an', start: 54.54, end: 54.66},
  {word: 'atom', start: 54.66, end: 54.96},
  {word: 'is', start: 54.96, end: 55.3},
  {word: 'actually', start: 55.3, end: 56.02},
  {word: 'empty', start: 56.02, end: 56.52},
  {word: 'space.', start: 56.52, end: 57.1},
  {word: 'This', start: 57.46, end: 57.66},
  {word: 'means', start: 57.66, end: 57.94},
  {word: 'when', start: 57.94, end: 58.24},
  {word: 'you', start: 58.24, end: 58.42},
  {word: 'look', start: 58.42, end: 58.6},
  {word: 'at', start: 58.6, end: 58.74},
  {word: 'something', start: 58.74, end: 58.98},
  {word: 'solid,', start: 58.98, end: 59.54},
  {word: "you're", start: 59.78, end: 59.92},
  {word: 'basically', start: 59.92, end: 60.36},
  {word: 'looking', start: 60.36, end: 60.9},
  {word: 'at', start: 60.9, end: 61.18},
  {word: 'matter', start: 61.18, end: 61.58},
  {word: 'that', start: 61.58, end: 61.96},
  {word: 'is,', start: 61.96, end: 62.26},
  {word: 'on', start: 62.38, end: 62.58},
  {word: 'this', start: 62.58, end: 62.78},
  {word: 'scale,', start: 62.78, end: 63.1},
  {word: 'almost', start: 63.34, end: 63.6},
  {word: 'entirely', start: 63.6, end: 64.12},
  {word: 'nothing.', start: 64.12, end: 64.8},
  {word: 'And', start: 65.16, end: 65.38},
  {word: 'that', start: 65.38, end: 65.62},
  {word: 'tiny', start: 65.62, end: 66.02},
  {word: 'proton,', start: 66.02, end: 66.54},
  {word: 'it', start: 66.78, end: 66.96},
  {word: 'contains', start: 66.96, end: 67.32},
  {word: 'almost', start: 67.32, end: 67.62},
  {word: 'all', start: 67.62, end: 68.1},
  {word: 'of', start: 68.1, end: 68.28},
  {word: 'the', start: 68.28, end: 68.42},
  {word: 'positive', start: 68.42, end: 68.84},
  {word: 'charge', start: 68.84, end: 69.3},
  {word: 'of', start: 69.3, end: 69.52},
  {word: 'the', start: 69.52, end: 69.68},
  {word: 'nucleus.', start: 69.68, end: 70.18},
  {word: 'Something', start: 70.18, end: 70.72},
  {word: "that's", start: 70.72, end: 71.42},
  {word: 'small', start: 71.42, end: 71.78},
  {word: 'is', start: 71.78, end: 72.26},
  {word: 'responsible', start: 72.26, end: 72.64},
  {word: 'for', start: 72.64, end: 73.14},
  {word: 'a', start: 73.14, end: 73.26},
  {word: 'huge', start: 73.26, end: 73.5},
  {word: 'part', start: 73.5, end: 73.78},
  {word: 'of', start: 73.78, end: 73.92},
  {word: 'the', start: 73.92, end: 74.02},
  {word: 'world', start: 74.02, end: 74.24},
  {word: 'around', start: 74.24, end: 74.58},
  {word: 'you,', start: 74.58, end: 74.86},
  {word: 'and', start: 74.94, end: 75.18},
  {word: 'you', start: 75.18, end: 75.32},
  {word: "haven't", start: 75.32, end: 75.72},
  {word: 'even', start: 75.72, end: 75.84},
  {word: 'reached', start: 75.84, end: 76.22},
  {word: 'the', start: 76.22, end: 76.46},
  {word: 'smallest', start: 76.46, end: 76.84},
  {word: 'things', start: 76.84, end: 77.2},
  {word: 'physics', start: 77.2, end: 77.66},
  {word: 'can', start: 77.66, end: 78.04},
  {word: 'describe.', start: 78.04, end: 78.32},
];

/**
 * Named cue points, in seconds, taken directly from WORDS above (first-word
 * start time of each narration beat in the shot list). A few storyboard
 * lines landed inside the SAME spoken sentence in the real recording (e.g.
 * "...made it as big as a basketball, an actual basketball would be about
 * the size of a planet" is one breath) — those are split at the matching
 * word instead of at a sentence boundary, so every storyboard beat still
 * gets its own real cut point.
 */
export const CUE_SECONDS = {
  hook: 0.0, // "How small is a proton?... Seriously... How really small?"
  protonToBasketball: 4.36, // "You see, if you took a single proton...as big as a basketball,"
  basketballToEarth: 10.34, // "an actual basketball would be about the size of a planet."
  reverseToProton: 13.92, // "Well, and that's because a proton is ridiculously small."
  protonScaleLabel: 17.82, // "Its diameter is only about 1.7 femtometers,"
  numberTyping: 21.98, // "and that's about 0.00000000017 meters."
  hairCut: 32.24, // "But even that number doesn't really mean anything until you see it."
  hairTracking: 35.68, // "This is where it gets real."
  tunnelZoom: 37.06, // "Imagine zooming into the tip of a human hair...again, and again."
  atomsReveal: 43.96, // "You eventually reach atoms,"
  singleAtomNucleus: 45.8, // "and inside the atom, there's the nucleus."
  nucleusToProton: 48.16, // "And inside that tiny nucleus is the proton."
  freezeReset: 51.42, // "But there's more I haven't told you yet." — RETENTION RESET SHOT
  reverseToEmptySpace: 53.58, // "You see, most of an atom is actually empty space."
  atomToLattice: 57.46, // "This means when you look at something solid,"
  latticeTransparent: 59.78, // "you're basically looking at matter...almost entirely nothing."
  protonAlone: 65.16, // "And that tiny proton,"
  protonCharge: 66.78, // "it contains almost all of the positive charge of the nucleus."
  explosiveReverseZoom: 70.18, // "Something that's small is responsible for a huge part of the world around you,"
  finalPullToDarkness: 74.94, // "and you haven't even reached the smallest things physics can describe."
  end: AUDIO_DURATION_SECONDS,
};

/** Same cue points, converted to frame numbers at FPS. */
export const CUE = Object.fromEntries(
  Object.entries(CUE_SECONDS).map(([k, v]) => [k, sec(v)]),
) as Record<keyof typeof CUE_SECONDS, number>;
