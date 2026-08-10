/**
 * Single source of truth for timing.
 *
 * Every number in `WORDS` below was copied verbatim from the real Whisper
 * ("small" model, word_timestamps=True) transcription of
 * public/narration.mp3 (the exact file this composition plays back).
 * Nothing here is hand-tuned pacing from the original storyboard — the
 * storyboard's second-marks were only a guide for *what* happens on which
 * line; the actual cut points below are the real spoken timestamps.
 *
 * Raw ffprobe duration of narration.mp3: 54.5175s (this is the audio file's
 * true total length, including trailing room room after the last word, and
 * is what FPS/DURATION_IN_FRAMES is derived from below).
 */

export const FPS = 30;

// ffprobe -show_entries format=duration narration.mp3 -> 54.517500
export const AUDIO_DURATION_SECONDS = 54.5175;

// Round up so the audio is never truncated by a shorter video timeline.
export const DURATION_IN_FRAMES = Math.ceil(AUDIO_DURATION_SECONDS * FPS);

export const WIDTH = 1920;
export const HEIGHT = 1080;

/** seconds -> frame number at the project fps, rounded to the nearest frame. */
export const sec = (s: number): number => Math.round(s * FPS);

/**
 * Word-level timestamps exactly as produced by Whisper. Grouped into the
 * narration lines/segments Whisper itself detected (segment breaks are
 * Whisper's, not authored).
 */
export const WORDS: {word: string; start: number; end: number}[] = [
  {word: 'But', start: 0.0, end: 0.2},
  {word: 'why', start: 0.2, end: 0.48},
  {word: 'does', start: 0.48, end: 0.68},
  {word: 'a', start: 0.68, end: 0.84},
  {word: 'spinning', start: 0.84, end: 1.0},
  {word: 'bicycle', start: 1.0, end: 1.36},
  {word: 'wheel', start: 1.36, end: 1.76},
  {word: 'refuse', start: 1.76, end: 2.14},
  {word: 'to', start: 2.14, end: 2.44},
  {word: 'move', start: 2.44, end: 2.68},
  {word: 'the', start: 2.68, end: 2.88},
  {word: 'way', start: 2.88, end: 3.08},
  {word: 'you', start: 3.08, end: 3.22},
  {word: 'expect?', start: 3.22, end: 3.64},
  {word: 'I', start: 3.96, end: 4.1},
  {word: 'want', start: 4.1, end: 4.26},
  {word: 'you', start: 4.26, end: 4.4},
  {word: 'to', start: 4.4, end: 4.52},
  {word: 'watch', start: 4.52, end: 4.8},
  {word: 'what', start: 4.8, end: 5.14},
  {word: 'happens', start: 5.14, end: 5.7},
  {word: 'when', start: 5.7, end: 6.02},
  {word: 'the', start: 6.02, end: 6.2},
  {word: 'wheel', start: 6.2, end: 6.42},
  {word: 'is', start: 6.42, end: 6.8},
  {word: 'spinning', start: 6.8, end: 7.24},
  {word: 'and', start: 7.24, end: 7.74},
  {word: 'you', start: 7.74, end: 7.84},
  {word: 'try', start: 7.84, end: 7.98},
  {word: 'to', start: 7.98, end: 8.12},
  {word: 'tilt', start: 8.12, end: 8.34},
  {word: 'it', start: 8.34, end: 8.6},
  {word: 'instead', start: 8.6, end: 9.08},
  {word: 'of', start: 9.08, end: 9.52},
  {word: 'it', start: 9.52, end: 9.68},
  {word: 'simply', start: 9.68, end: 10.06},
  {word: 'falling', start: 10.06, end: 10.52},
  {word: 'in', start: 10.52, end: 10.72},
  {word: 'the', start: 10.72, end: 10.8},
  {word: 'direction', start: 10.8, end: 11.08},
  {word: 'you', start: 11.08, end: 11.34},
  {word: 'push.', start: 11.34, end: 11.7},
  {word: 'It', start: 12.24, end: 12.38},
  {word: 'turns', start: 12.38, end: 12.56},
  {word: 'sideways.', start: 12.56, end: 12.88},
  {word: 'Okay,', start: 13.46, end: 13.64},
  {word: 'so', start: 13.82, end: 14.04},
  {word: 'what', start: 14.04, end: 14.52},
  {word: 'if', start: 14.52, end: 14.62},
  {word: 'the', start: 14.62, end: 14.76},
  {word: 'wheel', start: 14.76, end: 14.92},
  {word: 'spins', start: 14.92, end: 15.2},
  {word: 'faster?', start: 15.2, end: 15.68},
  {word: 'Immediately', start: 15.92, end: 16.2},
  {word: 'that', start: 16.2, end: 16.58},
  {word: 'happens.', start: 16.58, end: 17.02},
  {word: 'The', start: 17.18, end: 17.24},
  {word: 'sideways', start: 17.24, end: 17.52},
  {word: 'motion', start: 17.52, end: 17.96},
  {word: 'becomes', start: 17.96, end: 18.42},
  {word: 'stronger.', start: 18.42, end: 18.98},
  {word: 'Now', start: 19.32, end: 19.42},
  {word: 'when', start: 19.42, end: 19.74},
  {word: 'you', start: 19.74, end: 19.92},
  {word: 'stop', start: 19.92, end: 20.2},
  {word: 'the', start: 20.2, end: 20.44},
  {word: 'wheel,', start: 20.44, end: 20.7},
  {word: 'suddenly', start: 20.82, end: 21.32},
  {word: 'that', start: 21.32, end: 21.74},
  {word: 'strange', start: 21.74, end: 22.26},
  {word: 'behavior', start: 22.26, end: 22.96},
  {word: 'disappears.', start: 22.96, end: 23.72},
  {word: 'But', start: 24.04, end: 24.18},
  {word: "there's", start: 24.18, end: 24.36},
  {word: 'another', start: 24.36, end: 24.62},
  {word: 'case', start: 24.62, end: 25.0},
  {word: "that's", start: 25.0, end: 25.38},
  {word: 'even', start: 25.38, end: 25.56},
  {word: 'stranger.', start: 25.56, end: 25.96},
  {word: 'Hold', start: 26.26, end: 26.36},
  {word: 'the', start: 26.36, end: 26.54},
  {word: 'spinning', start: 26.54, end: 26.76},
  {word: 'wheel', start: 26.76, end: 27.08},
  {word: 'and', start: 27.08, end: 27.48},
  {word: 'flip', start: 27.48, end: 27.66},
  {word: 'its', start: 27.66, end: 27.86},
  {word: 'axis', start: 27.86, end: 28.18},
  {word: 'around.', start: 28.18, end: 28.58},
  {word: 'Once', start: 28.58, end: 28.88},
  {word: 'you', start: 28.88, end: 29.06},
  {word: 'do', start: 29.06, end: 29.32},
  {word: 'that,', start: 29.32, end: 29.56},
  {word: 'the', start: 29.78, end: 29.82},
  {word: 'wheel', start: 29.82, end: 30.0},
  {word: 'pushes', start: 30.0, end: 30.44},
  {word: 'back', start: 30.44, end: 30.8},
  {word: 'in', start: 30.8, end: 31.18},
  {word: 'a', start: 31.18, end: 31.32},
  {word: 'completely', start: 31.32, end: 31.86},
  {word: 'different', start: 31.86, end: 32.5},
  {word: 'direction.', start: 32.5, end: 33.08},
  {word: "So", start: 33.4, end: 33.48},
  {word: "what's", start: 33.48, end: 33.7},
  {word: 'really', start: 33.7, end: 34.02},
  {word: 'going', start: 34.02, end: 34.28},
  {word: 'on?', start: 34.28, end: 34.58},
  {word: 'The', start: 34.8, end: 34.9},
  {word: 'secret', start: 34.9, end: 35.28},
  {word: 'is', start: 35.28, end: 35.68},
  {word: 'angular', start: 35.68, end: 36.18},
  {word: 'momentum.', start: 36.18, end: 36.68},
  {word: 'You', start: 37.12, end: 37.12},
  {word: 'see,', start: 37.12, end: 37.34},
  {word: 'a', start: 37.54, end: 37.62},
  {word: 'spinning', start: 37.62, end: 37.86},
  {word: 'wheel', start: 37.86, end: 38.16},
  {word: 'has', start: 38.16, end: 38.34},
  {word: 'angular', start: 38.34, end: 38.7},
  {word: 'momentum', start: 38.7, end: 39.18},
  {word: 'pointing', start: 39.18, end: 39.6},
  {word: 'along', start: 39.6, end: 40.02},
  {word: 'its', start: 40.02, end: 40.28},
  {word: 'axle.', start: 40.28, end: 40.62},
  {word: 'So', start: 40.88, end: 40.96},
  {word: 'when', start: 40.96, end: 41.08},
  {word: 'you', start: 41.08, end: 41.18},
  {word: 'try', start: 41.18, end: 41.42},
  {word: 'to', start: 41.42, end: 41.58},
  {word: 'change', start: 41.58, end: 41.9},
  {word: 'the', start: 41.9, end: 42.16},
  {word: 'direction', start: 42.16, end: 42.58},
  {word: 'of', start: 42.58, end: 42.84},
  {word: 'that', start: 42.84, end: 43.0},
  {word: 'axle,', start: 43.0, end: 43.4},
  {word: "you're", start: 43.6, end: 43.84},
  {word: 'basically', start: 43.84, end: 44.32},
  {word: 'changing', start: 44.32, end: 44.96},
  {word: 'the', start: 44.96, end: 45.34},
  {word: 'direction', start: 45.34, end: 45.8},
  {word: 'of', start: 45.8, end: 46.16},
  {word: 'its', start: 46.16, end: 46.26},
  {word: 'angular', start: 46.26, end: 46.62},
  {word: 'momentum.', start: 46.62, end: 47.1},
  {word: 'And', start: 47.32, end: 47.46},
  {word: 'that', start: 47.46, end: 47.74},
  {word: 'creates', start: 47.74, end: 48.2},
  {word: 'a', start: 48.2, end: 48.52},
  {word: 'torque', start: 48.52, end: 48.86},
  {word: 'and', start: 48.86, end: 49.3},
  {word: 'the', start: 49.3, end: 49.4},
  {word: 'wheel', start: 49.4, end: 49.6},
  {word: 'responds', start: 49.6, end: 50.06},
  {word: 'by', start: 50.06, end: 50.46},
  {word: 'turning', start: 50.46, end: 50.82},
  {word: 'sideways.', start: 50.82, end: 51.18},
  {word: 'This', start: 51.54, end: 51.66},
  {word: 'is', start: 51.66, end: 51.78},
  {word: 'also', start: 51.78, end: 51.98},
  {word: 'called', start: 51.98, end: 52.42},
  {word: 'gyroscopic', start: 52.42, end: 53.62},
  {word: 'precession.', start: 53.62, end: 54.2},
];

/**
 * Named cue points, in seconds, taken directly from the WORDS array above
 * (first-word start time of each narration line in the shot list). These
 * are the *real* cut points that drive every shot in the composition —
 * the original storyboard's second-marks were pacing references only.
 */
export const CUE_SECONDS = {
  hook: 0.0, // "But why does a spinning bicycle wheel refuse..."
  watchSpinning: 3.96, // "I want you to watch what happens when the wheel is spinning"
  tryTilt: 7.24, // "and you try to tilt it."
  insteadFalling: 8.6, // "Instead of it simply falling in the direction you push."
  turnsSideways: 12.24, // "It turns sideways."
  whatIfFaster: 13.46, // "Okay, so what if the wheel spins faster?"
  immediatelyStronger: 15.92, // "Immediately that happens. The sideways motion becomes stronger."
  nowStop: 19.32, // "Now when you stop the wheel,"
  suddenlyDisappears: 20.82, // "suddenly that strange behavior disappears."
  anotherCase: 24.04, // "But there's another case that's even stranger."
  holdWheel: 26.26, // "Hold the spinning wheel"
  flipAxis: 27.08, // "and flip its axis around."
  pushesBack: 28.58, // "Once you do that, the wheel pushes back in a completely different direction."
  whatsGoingOn: 33.4, // "So what's really going on?"
  secretAngular: 34.8, // "The secret is angular momentum."
  pointingAlongAxle: 37.12, // "You see, a spinning wheel has angular momentum pointing along its axle."
  changeDirection: 40.88, // "So when you try to change the direction of that axle,"
  changingMomentum: 43.6, // "you're basically changing the direction of its angular momentum."
  createsTorque: 47.32, // "And that creates a torque"
  turningSidewaysAgain: 48.86, // "and the wheel responds by turning sideways."
  gyroscopicPrecession: 51.54, // "This is also called gyroscopic precession."
  end: AUDIO_DURATION_SECONDS,
};

/** Same cue points, converted to frame numbers at FPS. */
export const CUE = Object.fromEntries(
  Object.entries(CUE_SECONDS).map(([k, v]) => [k, sec(v)]),
) as Record<keyof typeof CUE_SECONDS, number>;
