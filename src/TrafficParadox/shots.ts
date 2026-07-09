import {CameraShot} from './Camera';

// Discrete named camera shots. Consecutive hard cuts always pick shots
// with different scales — see the per-beat comments for the reasoning.
export const SHOTS: Record<string, CameraShot> = {
  wide: {cx: 540, cy: 910, scale: 1},
  rippleMedium: {cx: 540, cy: 910, scale: 1.25},
  earlyAdoptPunch: {cx: 540, cy: 910, scale: 1.6}, // beat 6
  pileupPunch: {cx: 540, cy: 910, scale: 1.4}, // beat 12
  chokepointsTight: {cx: 540, cy: 910, scale: 1.75}, // beat 13
};
