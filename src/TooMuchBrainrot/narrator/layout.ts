// Shared scale/anchor math so every figure-based scene actually fills the
// frame instead of floating small in empty space. NarratorFigure's local
// coordinate space: head top ≈ y=-6 (center y=34, r=40), torso bottom
// y=236, feet y=388 (hip 228 + leg length 160).

// Bust framing (chest/shoulders/head, legs cropped out): content spans
// local y=[-6, 236] (242 units) — scaled to ~85% of frame height.
export const BUST_SCALE = 3.8;
export const BUST_ANCHOR_Y = 104;

// Full-body framing: content spans local y=[-6, 388] (394 units) — scaled
// to ~88% of frame height, vertically centered.
export const FULL_SCALE = 2.41;
export const FULL_ANCHOR_Y = 80;
