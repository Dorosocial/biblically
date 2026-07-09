// Deterministic screen-shake: a decaying, frame-seeded jitter (no
// Math.random(), so every frame renders identically no matter which one
// Remotion requests). Used to give impact moments (a road connecting,
// text slamming in) physical weight.
export const shakeOffset = (
  frame: number,
  impactFrame: number,
  magnitude = 16,
  decayFrames = 12
): {x: number; y: number} => {
  const t = frame - impactFrame;
  if (t < 0 || t > decayFrames) return {x: 0, y: 0};
  const decay = 1 - t / decayFrames;
  const x = Math.sin(t * 3.1) * magnitude * decay;
  const y = Math.cos(t * 2.7) * magnitude * decay;
  return {x, y};
};

// A one-frame-ish flash overlay opacity curve, for impact moments.
export const flashOpacityAt = (
  frame: number,
  impactFrame: number,
  peak = 0.55,
  fadeFrames = 7
): number => {
  const t = frame - impactFrame;
  if (t < 0 || t > fadeFrames) return 0;
  if (t <= 1) return peak * t;
  return peak * (1 - (t - 1) / (fadeFrames - 1));
};
