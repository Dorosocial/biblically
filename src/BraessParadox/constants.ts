export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const DURATION_IN_FRAMES = 1890; // 63s at 30fps, resynced to real VO

// Beat frame ranges (start, duration) matching the real voiceover timing.
// The narration is continuous throughout — there is no silent beat.
export const BEATS = {
  beat1: {from: 0, duration: 270},
  beat2: {from: 270, duration: 210},
  beat3: {from: 480, duration: 210},
  beat4: {from: 690, duration: 210},
  beat5: {from: 900, duration: 240},
  beat6: {from: 1140, duration: 270},
  beat7: {from: 1410, duration: 240},
  beat8: {from: 1650, duration: 240},
} as const;
