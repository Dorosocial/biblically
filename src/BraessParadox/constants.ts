export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION_IN_FRAMES = 1200;

// Beat frame ranges (start, duration), matching the brief exactly.
export const BEATS = {
  beat1: {from: 0, duration: 90},
  beat2: {from: 90, duration: 90},
  beat3: {from: 180, duration: 90},
  beat4: {from: 270, duration: 120},
  beat5: {from: 390, duration: 150},
  beat6: {from: 540, duration: 150},
  beat7: {from: 690, duration: 120},
  beat8: {from: 810, duration: 150},
  beat9: {from: 960, duration: 120},
  beat10: {from: 1080, duration: 120},
} as const;
