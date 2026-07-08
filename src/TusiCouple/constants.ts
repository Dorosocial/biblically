export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION_IN_FRAMES = 1020; // 34s at 30fps

// Beat frame ranges (start, duration), matching the brief exactly.
export const BEATS = {
  beat1: {from: 0, duration: 240},
  beat2: {from: 240, duration: 180},
  beat3: {from: 420, duration: 120},
  beat4: {from: 540, duration: 270},
  beat5: {from: 810, duration: 210},
} as const;
