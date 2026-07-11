export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION_IN_FRAMES = 750; // 25s at 30fps

// Beat frame ranges (start, duration), matching the brief exactly.
export const BEATS = {
  beat1: {from: 0, duration: 300},
  beat2: {from: 300, duration: 90},
  beat3: {from: 390, duration: 90},
  beat4: {from: 480, duration: 120},
  beat5: {from: 600, duration: 150},
} as const;
