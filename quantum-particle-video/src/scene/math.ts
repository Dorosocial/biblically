// Small deterministic math helpers shared across the scene. Everything here
// is a pure function of its inputs — no state, no clocks — so the whole
// scene stays a pure function of `frame` (required for Remotion's frame-exact
// server-side rendering).

export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/** Linear progress of `frame` through [start,end], clamped to [0,1]. */
export const prog = (frame: number, start: number, end: number): number => {
  if (end <= start) return frame >= end ? 1 : 0;
  return clamp01((frame - start) / (end - start));
};

export const easeInOut = (t: number): number => t * t * (3 - 2 * t);
export const easeOut = (t: number): number => 1 - (1 - t) * (1 - t);
export const easeIn = (t: number): number => t * t;

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export type V3 = [number, number, number];

export const lerpV3 = (a: V3, b: V3, t: number): V3 => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

/** Smooth 0->1->0 pulse, period in frames. */
export const pulse = (frame: number, period: number): number => (Math.sin((frame / period) * Math.PI * 2) + 1) / 2;
