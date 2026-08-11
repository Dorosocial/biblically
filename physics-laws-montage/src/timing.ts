/**
 * Exact narration timing, transcribed with OpenAI Whisper (word-level timestamps)
 * from the source narration audio (public/narration.mp3).
 *
 * Raw word timestamps captured during transcription (seconds):
 *   0.00  These          1.86  magic,         2.14  but        5.16  real.
 *   5.58  Watch          6.12  this.          6.46  A          9.62  balls.
 *   9.92  And           10.46  somehow,      11.24  the        12.94 away.
 *  13.28  This          15.34  momentum.     15.82  Now        16.34 this.
 *  16.58  A             18.82  direction,    19.08  and        21.44 sideways.
 *  21.86  This          23.42  momentum.     23.74  Let        25.28 ones.
 *  25.42  A             26.86  height,/hits  27.72  ground,    28.04 and
 *  30.46  started.      30.78  Where         32.18  from?      32.42 The
 *  33.74  didn't.       33.94  The           35.04  there,     35.30 but
 *  37.28  energy/into   38.68  energy.       38.92  And        39.68  again,
 *  39.88  and           40.76  one,          40.88  a          42.62  still,
 *  42.76  until         44.62  it,           44.74  then       45.30  moves.
 *  45.66  That's        46.88  law.
 *
 * Full audio duration (ffprobe): 47.124875s
 */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const AUDIO_DURATION_SECONDS = 47.124875;
// Round UP to the nearest frame so the narration is never truncated.
export const DURATION_IN_FRAMES = Math.ceil(AUDIO_DURATION_SECONDS * FPS); // 1414

const s = (seconds: number) => Math.round(seconds * FPS);

/**
 * Five "acts", each a top-level <Sequence>. Every act's `duration` is padded to
 * butt up against the next act's `from` — silence between narration lines is
 * covered by holding the current beat (freeze/orbit/replay), never a gap of
 * dead air with nothing on screen. The five acts sum to exactly
 * DURATION_IN_FRAMES with zero overlap and zero gap.
 */
export const ACTS = {
  opening: {from: 0, duration: s(5.58)}, // 0 -> 167
  momentum: {from: s(5.58), duration: s(15.82) - s(5.58)}, // 167 -> 475 (308)
  angularMomentum: {from: s(15.82), duration: s(23.74) - s(15.82)}, // 475 -> 712 (237)
  energy: {from: s(23.74), duration: s(39.88) - s(23.74)}, // 712 -> 1196 (484)
  newtonFirstLaw: {from: s(39.88), duration: DURATION_IN_FRAMES - s(39.88)}, // 1196 -> 1414 (218)
} as const;

// ---- Opening act (frames local to the "opening" sequence, 0..167) ----
export const OPENING_BEATS = {
  chaosCradle: {from: 0, to: s(0.75)}, // 0 -> 22
  chaosWheel: {from: s(0.75), to: s(1.45)}, // 22 -> 44
  chaosBall: {from: s(1.45), to: s(2.13)}, // 44 -> 64
  freezeAndLabels: {from: s(2.13), to: s(5.58)}, // 64 -> 167
} as const;

// ---- Momentum act (local frames, 0..308) ----
export const MOMENTUM_BEATS = {
  reset: {from: 0, to: s(0.64)}, // "Watch this." -> 27
  incoming: {from: s(0.64), to: s(4.08)}, // heavy ball tracking -> 131
  impactLaunch: {from: s(4.08), to: s(7.75)}, // shoots away -> 231
  slowMoReplay: {from: s(7.75), to: s(10.24)}, // conservation of momentum -> 308
} as const;

// ---- Angular momentum act (local frames, 0..237) ----
export const ANGULAR_BEATS = {
  pushIn: {from: 0, to: s(0.75)}, // "Now watch this." -> 22
  axisChange: {from: s(0.75), to: s(3.25)}, // direction change -> 97
  sidewaysPull: {from: s(3.25), to: s(6.03)}, // person pulled sideways -> 181
  freezeVectorLabel: {from: s(6.03), to: s(7.9)}, // "angular momentum" + orbit -> 237
} as const;

// ---- Energy act (local frames, 0..484) ----
export const ENERGY_BEATS = {
  intro: {from: 0, to: s(1.7)}, // ball hangs high, pull back -> 51
  fall: {from: s(1.7), to: s(3.13)}, // drops -> 94
  impactFreeze: {from: s(3.13), to: s(4.3)}, // hits ground, freeze -> 129
  launchGhost: {from: s(4.3), to: s(7.03)}, // bounces back up -> 211
  peakFreezeText: {from: s(7.03), to: s(8.7)}, // "where did the energy come from?" -> 261
  reverse: {from: s(8.7), to: s(11.57)}, // "it didn't" reverse -> 347
  potentialHold: {from: s(11.57), to: s(13.53)}, // potential energy bar -> 406
  kineticFall: {from: s(13.53), to: s(15.2)}, // kinetic energy bar -> 456
  transferMacro: {from: s(15.2), to: s(16.13)}, // back again, macro bounce -> 484
} as const;

// ---- Newton's first law act (local frames, 0..218) ----
export const NEWTON_BEATS = {
  smashCutAtRest: {from: 0, to: s(2.77)}, // "and now the simplest one... at rest" -> 83
  forceStrike: {from: s(2.77), to: s(4.87)}, // "until another force acts on it" -> 146
  ballMoves: {from: s(4.87), to: s(5.8)}, // "then it moves." -> 174
  freezeDiagram: {from: s(5.8), to: s(7.27)}, // "That's Newton's first law." -> 218
} as const;
