/**
 * Shared per-object animation state, used across every video in this
 * project. Every object is a pure function of `frame` producing one of
 * these — see each video's physics.ts for why (Remotion can render frames
 * out of order or standalone, so nothing may accumulate over time).
 */
export interface Obj3DState {
  visible: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  opacity: number;
}

export const HIDDEN3D: Obj3DState = {visible: false, position: [0, 0, 0], rotation: [0, 0, 0], scale: 0, opacity: 0};
