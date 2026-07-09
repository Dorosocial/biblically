export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION_IN_FRAMES = 2550; // 85s at 30fps

// Beat frame ranges (start, duration), matching the brief exactly.
export const BEATS = {
  beat1: {from: 0, duration: 270},
  beat2: {from: 270, duration: 150},
  beat3: {from: 420, duration: 30},
  beat4: {from: 450, duration: 120},
  beat5: {from: 570, duration: 90},
  beat6: {from: 660, duration: 150},
  beat7: {from: 810, duration: 90},
  beat8: {from: 900, duration: 120},
  beat9: {from: 1020, duration: 90},
  beat10: {from: 1110, duration: 90},
  beat11: {from: 1200, duration: 120},
  beat12: {from: 1320, duration: 180},
  beat13: {from: 1500, duration: 90},
  beat14: {from: 1590, duration: 150},
  beat15: {from: 1740, duration: 120},
  beat16: {from: 1860, duration: 150},
  beat17: {from: 2010, duration: 90},
  beat18: {from: 2100, duration: 180},
  beat19: {from: 2280, duration: 90},
  beat20: {from: 2370, duration: 180},
} as const;
