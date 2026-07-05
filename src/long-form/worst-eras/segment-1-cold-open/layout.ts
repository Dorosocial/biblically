import { CSSProperties } from "react";

/** Percentage-based placement presets, reused across beats so icon
 * composites stay visually consistent. All values are illustrative
 * (we don't have hand-authored pixel maps of the source art), chosen for
 * balanced composition on a 1920x1080 canvas. */
export const box = (
  left: number,
  top: number,
  width: number,
): CSSProperties => ({
  position: "absolute",
  left: `${left}%`,
  top: `${top}%`,
  width: `${width}%`,
  height: "auto",
});

export const FLOUR_JAR_COMPOSITE = {
  flourJar: box(10, 32, 34),
  widowSmall: box(50, 28, 20),
  oilDrop: box(32, 14, 9),
  stickBundle: box(6, 68, 13),
  homeIcon: box(84, 6, 9),
  sonFigure: box(66, 30, 17),
};

export const SPLIT_SCREEN = {
  leftHalf: { position: "absolute", left: 0, top: 0, width: "50%", height: "100%", overflow: "hidden" } as CSSProperties,
  rightHalf: { position: "absolute", left: "50%", top: 0, width: "50%", height: "100%", overflow: "hidden" } as CSSProperties,
};
