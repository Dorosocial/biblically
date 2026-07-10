export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION_IN_FRAMES = 2370; // 79s at 30fps, re-recorded/re-paced VO take

// Beat frame ranges (start, duration), pulled directly from the
// re-recorded VO transcript timing.
export const BEATS = {
  beat1: {from: 0, duration: 180},
  beat2: {from: 180, duration: 120},
  beat3: {from: 300, duration: 150},
  beat4: {from: 450, duration: 150},
  beat5: {from: 600, duration: 180},
  beat6: {from: 780, duration: 120},
  beat7: {from: 900, duration: 240},
  beat8: {from: 1140, duration: 60},
  beat9: {from: 1200, duration: 300},
  beat10: {from: 1500, duration: 300},
  beat11: {from: 1800, duration: 330},
  beat12: {from: 2130, duration: 240},
} as const;
