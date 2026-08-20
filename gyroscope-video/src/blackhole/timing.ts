/**
 * Timing for "Scientists Are Terrified of This Black Hole."
 *
 * NO narration audio — the brief's own storyboard didn't specify exact
 * seconds either, only a numbered beat sequence with a rough per-beat
 * pace (~3-4s, faster for punchy lines). The seconds below ARE that
 * pacing estimate turned into a fixed timeline (there is nothing to
 * transcribe against), so unlike proton/timing.ts this file is the
 * primary creative decision, not a measurement — captions, choreography,
 * and camera are all driven directly off it.
 */
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const sec = (s: number): number => Math.round(s * FPS);

export const CUE_SECONDS = {
  // ---- Section 1 ----
  hook: 0, // "This black hole is so extreme..."
  bendStars: 3, // "...space, time, and information starts to break down."
  blackHoleReveal: 6, // "We don't fully understand what happens beyond its event horizon." — CRITICAL LENSING SHOT
  approachDisk: 10, // "A black hole isn't simply a giant object..."
  spacetimeGridIntro: 13, // "...where gravity has become so extreme..."
  dominateFrame: 16, // "But the black hole I'm talking about..."
  titleCard: 19, // "FORGET THE HOLLYWOOD VERSION"
  // ---- Section 2 ----
  spacecraftApproach: 20, // "Imagine you're approaching a supermassive black hole."
  scaleComparison: 24, // "From far away..."
  sunToBlackHole: 27, // "If the Sun were magically replaced..."
  earthContinuesOrbit: 31, // "We'd continue orbiting almost exactly as before."
  sideBySideGravity: 34, // "That's because... gravity depends primarily on its mass."
  accelerateToward: 38, // "The terrifying part begins when you get very close."
  gridWarpsDive: 41, // "Spacetime becomes increasingly curved."
  twinClocks: 45, // "Your clock and a distant observer's clock..."
  redshift: 49, // "Light becomes increasingly redshifted."
  eventHorizonFill: 53, // "Eventually you reach the event horizon."
  end: 58,
};

/** Same cue points, converted to frame numbers at FPS. */
export const CUE = Object.fromEntries(
  Object.entries(CUE_SECONDS).map(([k, v]) => [k, sec(v)]),
) as Record<keyof typeof CUE_SECONDS, number>;

export const DURATION_IN_FRAMES = CUE.end;
