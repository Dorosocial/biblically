export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION_IN_FRAMES = 1440; // 48s at 30fps

// Beat frame ranges (start, duration), matching the brief exactly.
export const BEATS = {
  beat1: {from: 0, duration: 270},
  beat2: {from: 270, duration: 60},
  beat3: {from: 330, duration: 150},
  beat4: {from: 480, duration: 30},
  beat5: {from: 510, duration: 120},
  beat6: {from: 630, duration: 60},
  beat7: {from: 690, duration: 150},
  beat8: {from: 840, duration: 30},
  beat9: {from: 870, duration: 180},
  beat10: {from: 1050, duration: 90},
  beat11: {from: 1140, duration: 30},
  beat12: {from: 1170, duration: 120},
  beat13: {from: 1290, duration: 150},
} as const;
