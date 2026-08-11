import * as THREE from 'three';

export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export const easeInCubic = (t: number): number => t * t * t;

export const easeOutExpo = (t: number): number => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export const easeInExpo = (t: number): number => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10));

/** Progress (0..1, eased) of `seconds` within a [start, end] window. */
export const beatProgress = (
  seconds: number,
  start: number,
  end: number,
  ease: (t: number) => number = easeInOutCubic,
): number => {
  if (end <= start) return seconds >= end ? 1 : 0;
  return ease(clamp01((seconds - start) / (end - start)));
};

/** Raw (linear, unclamped-domain but clamped-output) progress. */
export const linearProgress = (seconds: number, start: number, end: number): number => {
  if (end <= start) return seconds >= end ? 1 : 0;
  return clamp01((seconds - start) / (end - start));
};

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const lerpVec3 = (
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number,
): [number, number, number] => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/** A slow, gentle sine oscillation — used for rim pulses / idle drift. */
export const gentleSine = (
  seconds: number,
  periodSec: number,
  amplitude = 1,
  phase = 0,
): number => Math.sin((seconds / periodSec) * Math.PI * 2 + phase) * amplitude;

/** Deterministic pseudo-random in [0,1) from an integer seed (no Math.random — must be frame-stable for rendering). */
export const hashRandom = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const tmpColorA = new THREE.Color();
export const tmpColorB = new THREE.Color();

/** Lerp between two hex colors, returned as a new THREE.Color. */
export const lerpColor = (hexA: string, hexB: string, t: number): THREE.Color => {
  tmpColorA.set(hexA);
  tmpColorB.set(hexB);
  return tmpColorA.clone().lerp(tmpColorB, clamp01(t));
};

/** Step through a palette array at a given progress (0..1), no blending — for a "cycling through distinct colors" feel. */
export const stepPalette = (palette: readonly string[], t: number): string => {
  const idx = Math.min(palette.length - 1, Math.floor(clamp01(t) * palette.length));
  return palette[idx];
};
