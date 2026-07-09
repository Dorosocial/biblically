export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION_IN_FRAMES = 2310; // 77s at 30fps

// Beat frame ranges (start, duration), matching the brief exactly.
export const BEATS = {
  beat1: {from: 0, duration: 45},
  beat2: {from: 45, duration: 45},
  beat3: {from: 90, duration: 60},
  beat4: {from: 150, duration: 60},
  beat5: {from: 210, duration: 90},
  beat6: {from: 300, duration: 60},
  beat7: {from: 360, duration: 60},
  beat8: {from: 420, duration: 60},
  beat9: {from: 480, duration: 90},
  beat10: {from: 570, duration: 90},
  beat11: {from: 660, duration: 120},
  beat12: {from: 780, duration: 60},
  beat13: {from: 840, duration: 60},
  beat14: {from: 900, duration: 60},
  beat15: {from: 960, duration: 60},
  beat16: {from: 1020, duration: 90},
  beat17: {from: 1110, duration: 120},
  beat18: {from: 1230, duration: 120},
  beat19: {from: 1350, duration: 150},
  beat20: {from: 1500, duration: 150},
  beat21: {from: 1650, duration: 120},
  beat22: {from: 1770, duration: 90},
  beat23: {from: 1860, duration: 180},
  beat24: {from: 2040, duration: 90},
  beat25: {from: 2130, duration: 180},
} as const;
