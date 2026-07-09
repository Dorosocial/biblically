export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION_IN_FRAMES = 2520; // 84s at 30fps, matched to the real VO transcript

// Beat frame ranges (start, duration), pulled directly from the corrected
// VO transcript timing — not estimated.
export const BEATS = {
  beat1: {from: 0, duration: 120},
  beat2: {from: 120, duration: 90},
  beat3: {from: 210, duration: 90},
  beat4: {from: 300, duration: 150},
  beat5: {from: 450, duration: 90},
  beat6: {from: 540, duration: 60},
  beat7: {from: 600, duration: 60},
  beat8: {from: 660, duration: 150},
  beat9: {from: 810, duration: 90},
  beat10: {from: 900, duration: 90},
  beat11: {from: 990, duration: 60},
  beat12: {from: 1050, duration: 150},
  beat13: {from: 1200, duration: 90},
  beat14: {from: 1290, duration: 210},
  beat15: {from: 1500, duration: 60},
  beat16: {from: 1560, duration: 270},
  beat17: {from: 1830, duration: 30},
  beat18: {from: 1860, duration: 120},
  beat19: {from: 1980, duration: 150},
  beat20: {from: 2130, duration: 120},
  beat21: {from: 2250, duration: 90},
  beat22: {from: 2340, duration: 90},
  beat23: {from: 2430, duration: 90},
} as const;
