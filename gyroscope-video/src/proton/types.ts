/** Shared per-object animation state — every scale object in this video is a pure function of `frame` producing one of these. */
export interface ObjectState {
  visible: boolean;
  position: [number, number, number];
  scale: number;
  opacity: number;
}

export const HIDDEN: ObjectState = {visible: false, position: [0, 0, 0], scale: 0, opacity: 0};
