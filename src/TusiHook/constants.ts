export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION_IN_FRAMES = 840; // 28s at 30fps

// Beat frame ranges (start, duration), matching the brief exactly.
export const BEATS = {
  beat1: {from: 0, duration: 180},
  beat2: {from: 180, duration: 150},
  beat3: {from: 330, duration: 120},
  beat4: {from: 450, duration: 150},
  beat5: {from: 600, duration: 30},
  beat6: {from: 630, duration: 210},
} as const;
