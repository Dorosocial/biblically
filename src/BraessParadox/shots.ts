import {CameraShot} from './Camera';
import {NODE_M2} from './geometry';

// Discrete named camera shots. Beats select one of these per hard cut —
// scales deliberately never repeat back-to-back across a cut.
export const SHOTS: Record<string, CameraShot> = {
  wide: {cx: 540, cy: 910, scale: 1},
  shortcutPunch: {cx: 540, cy: 910, scale: 1.7},
  chokepointTight: {cx: NODE_M2.x, cy: NODE_M2.y, scale: 4.5},
  bothChokepoints: {cx: 540, cy: 910, scale: 1.85},
};
