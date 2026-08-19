/** Shared per-object animation state — phone and hand are both a pure function of `frame` producing one of these. */
export interface Obj3DState {
  visible: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  opacity: number;
}

export const HIDDEN3D: Obj3DState = {visible: false, position: [0, 0, 0], rotation: [0, 0, 0], scale: 0, opacity: 0};
