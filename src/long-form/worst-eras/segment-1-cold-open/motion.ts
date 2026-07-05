/**
 * Continuous-motion primitives.
 *
 * Every layer in this segment must be doing *something* on every frame it is
 * on screen — a slow scale breathe, a position drift, an opacity shimmer, a
 * rotational sway, or some combination. These are pure functions of an
 * absolute frame number, so they never "restart" abruptly and never produce
 * a motionless frame.
 */

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

export interface BreatheOptions {
  amount?: number; // +/- fraction of scale, e.g. 0.02 = 2%
  speed?: number; // radians per frame
  base?: number;
}

export const breathe = (frame: number, opts: BreatheOptions = {}): number => {
  const { amount = 0.018, speed = 0.045, base = 1 } = opts;
  return base + Math.sin(frame * speed) * amount;
};

export interface DriftOptions {
  ampX?: number;
  ampY?: number;
  speedX?: number;
  speedY?: number;
}

export const drift = (
  frame: number,
  opts: DriftOptions = {},
): { x: number; y: number } => {
  const { ampX = 5, ampY = 3.5, speedX = 0.017, speedY = 0.023 } = opts;
  return {
    x: Math.sin(frame * speedX) * ampX,
    y: Math.cos(frame * speedY) * ampY,
  };
};

export interface ShimmerOptions {
  amount?: number;
  speed?: number;
  base?: number;
}

export const shimmer = (frame: number, opts: ShimmerOptions = {}): number => {
  const { amount = 0.035, speed = 0.05, base = 1 } = opts;
  return clamp(base + Math.sin(frame * speed) * amount, 0, 1);
};

export interface SwayOptions {
  amount?: number; // degrees
  speed?: number;
}

export const sway = (frame: number, opts: SwayOptions = {}): number => {
  const { amount = 0.9, speed = 0.02 } = opts;
  return Math.sin(frame * speed) * amount;
};

/** A per-layer phase offset so multiple images don't breathe in lockstep. */
export const seedFor = (name: string): number => {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) % 10000;
  }
  return h;
};
