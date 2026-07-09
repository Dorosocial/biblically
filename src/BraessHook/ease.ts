export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
export const easeInCubic = (t: number): number => t * t * t;
export const easeInOutCubic = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export type CameraShot = {cx: number; cy: number; scale: number};

export const lerpShot = (a: CameraShot, b: CameraShot, t: number): CameraShot => ({
  cx: a.cx + (b.cx - a.cx) * t,
  cy: a.cy + (b.cy - a.cy) * t,
  scale: a.scale + (b.scale - a.scale) * t,
});
