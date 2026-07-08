import {BEATS} from './constants';

// The rolling angle t is driven by the absolute (global) frame, so beat 3's
// anticipation nudge and beat 4's full roll are one continuous, monotonic
// schedule — no jump at the Sequence boundary.

const WIGGLE_ANGLE = 0.32; // radians, beat 3's "about to happen" nudge
const REVOLUTIONS = 3;
const TOTAL_SWEEP = REVOLUTIONS * Math.PI * 2;

export const FINAL_ANGLE = WIGGLE_ANGLE + TOTAL_SWEEP;

const clamp01 = (u: number) => Math.max(0, Math.min(1, u));
const easeInCubic = (u: number) => u * u * u;
const easeInOutCubic = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

// globalFrame = the beat's local frame + that beat's `from` offset.
export const rollAngleAt = (globalFrame: number): number => {
  const b3 = BEATS.beat3;
  const b4 = BEATS.beat4;

  if (globalFrame < b3.from) return 0;

  if (globalFrame < b3.from + b3.duration) {
    const u = clamp01((globalFrame - b3.from) / b3.duration);
    return WIGGLE_ANGLE * easeInCubic(u);
  }

  if (globalFrame < b4.from + b4.duration) {
    const u = clamp01((globalFrame - b4.from) / b4.duration);
    return WIGGLE_ANGLE + TOTAL_SWEEP * easeInOutCubic(u);
  }

  return FINAL_ANGLE;
};
