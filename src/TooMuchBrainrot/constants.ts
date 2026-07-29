export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;

export const CENTER_X = WIDTH / 2;
export const CENTER_Y = HEIGHT / 2;

export const BG_COLOR = '#0A0E14';
export const DOT_COLOR = '#FF2A2A';
export const DOT_RADIUS = 26;

// No element/frame may hold with zero motion for longer than this.
export const MAX_STATIC_FRAMES = FPS * 2;

// Deterministic seeds so every render produces identical output. Never use
// Math.random() anywhere in this app — all motion is a pure function of frame.
export const SCHEDULE_SEED = 88172645;
