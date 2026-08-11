/**
 * COLOR CONTRAST RULE: the color-burst moments must feel like a real, rich,
 * varied spectrum — not a vague "colorful" wash — set against the black that
 * dominates the rest of the video.
 */

/** Color-cycle burst 1: black -> gray -> a full range of distinct saturated hues -> darkness. */
export const CYCLE_PALETTE: readonly string[] = [
  '#000000',
  '#3a3a3a',
  '#8a8a8a',
  '#e0263f', // red
  '#ff7a1a', // orange
  '#ffd21a', // yellow
  '#3ddc5a', // green
  '#17c9c9', // cyan
  '#2a6bff', // blue
  '#8b3dff', // violet
  '#ff2fb0', // magenta
  '#050505',
];

/** Color-flood burst 2: "the world suddenly floods with many distinct, vivid colors simultaneously." */
export const FLOOD_PALETTE: readonly string[] = [
  '#ff2d55',
  '#ff9500',
  '#ffe600',
  '#34ff6b',
  '#00e5c7',
  '#1aa3ff',
  '#5b4dff',
  '#c14dff',
  '#ff4dd2',
  '#ffffff',
];

/** True red -> violet rainbow spectrum stops, in order, for the gradient beat. */
export const RAINBOW_STOPS: readonly string[] = [
  '#ff2b2b', // red
  '#ff8f2b', // orange
  '#ffe22b', // yellow
  '#4dff2b', // green
  '#2bd8ff', // blue
  '#3a5bff', // indigo
  '#9a2bff', // violet
];

export const NEAR_BLACK = '#050505';
export const EYE_RIM_DIM = '#8a95a3';
export const EYE_RIM_BRIGHT = '#dfe6ee';
