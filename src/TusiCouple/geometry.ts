import {WIDTH} from './constants';

// The Tusi couple, R = 2r case. A small circle of radius r rolls without
// slipping inside a fixed circle of radius R = 2r. The hypocycloid
// parametric equations for this specific ratio collapse to:
//   x(t) = (R - r) cos(t) + r cos(((R - r) / r) * t) = R cos(t)
//   y(t) = (R - r) sin(t) - r sin(((R - r) / r) * t) = 0
// i.e. the traced point moves along a straight horizontal diameter.

export type Pt = {x: number; y: number};

export const CX = WIDTH / 2;
export const CY = 760;
export const R = 380;
export const SMALL_R = R / 2;

// World-space center of the small circle, offset from (CX, CY), as the
// small circle's rolling angle t advances.
export const smallCenterWorld = (t: number): Pt => ({
  x: SMALL_R * Math.cos(t),
  y: SMALL_R * Math.sin(t),
});

// World-space position of the marked point on the small circle's rim —
// this is the closed-form hypocycloid solution for R = 2r.
export const tracedPointWorld = (t: number): Pt => ({
  x: R * Math.cos(t),
  y: 0,
});

export const toScreen = (p: Pt): Pt => ({x: CX + p.x, y: CY - p.y});

// Since t only ever increases from 0, the set of x-values the traced
// point has visited over [0, t] is a closed interval. It always starts at
// cos(0) = 1 (world x = R, the screen-right extreme), so the max is
// trivially 1; the min is the current value while still descending
// (t < PI) and locks to -1 once the point has reached the far extreme.
export const minCosSoFar = (t: number): number => (t < Math.PI ? Math.cos(t) : -1);
export const maxCosSoFar = (): number => 1;

// A small decorative cardioid, purely illustrative — the "you'd expect a
// loop" preview shown briefly in beat 3 before the reveal subverts it.
export const buildCardioidGhostPath = (): string => {
  const a = R * 0.26;
  const steps = 120;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    const rho = a * (1 + Math.cos(theta));
    const x = CX + rho * Math.cos(theta);
    const y = CY - rho * Math.sin(theta);
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)} `;
  }
  return `${d}Z`;
};
