/**
 * Timing for "What Is Reality Actually Made Of?" — opening sequence.
 *
 * This video has NO narration audio. The shot list gives fixed real-world
 * timestamps directly — they ARE the timeline, not something transcribed
 * from a recording. Unlike proton/timing.ts, there is deliberately no
 * Whisper step here: captions, choreography, and camera are all driven
 * straight off the seconds below.
 */
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** seconds -> frame number at the project fps, rounded to the nearest frame. */
export const sec = (s: number): number => Math.round(s * FPS);

export const CUE_SECONDS = {
  emerge: 0, // "What is reality actually made of?"
  ordinary: 3, // "Not philosophically. Physically."
  pickup: 6, // "Take the phone you're watching this on."
  rapidCuts: 10, // "You can hold it, touch it, drop it." — 3 hard cuts start here
  cutPress: 10, // beat 1 — fingers press the glass
  cutDrop: 11 + 1 / 3, // beat 2 — phone drops
  cutCatch: 12 + 2 / 3, // beat 3 — phone catches in midair
  macroTouch: 14, // "It feels like a solid object."
  microscope: 18, // "But imagine you had a microscope powerful enough..."
  end: 22,
};

/** Same cue points, converted to frame numbers at FPS. */
export const CUE = Object.fromEntries(
  Object.entries(CUE_SECONDS).map(([k, v]) => [k, sec(v)]),
) as Record<keyof typeof CUE_SECONDS, number>;

export const DURATION_IN_FRAMES = CUE.end;
