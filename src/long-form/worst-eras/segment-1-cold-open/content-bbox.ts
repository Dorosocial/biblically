/**
 * Every source PNG shares a 600x334 canvas, but several of them (icons,
 * small figures) draw their subject in only a fraction of it — huge
 * transparent padding on all sides. Sized naively by frame percentage,
 * those subjects render far smaller than intended.
 *
 * These are the measured alpha-channel bounding boxes (as fractions of the
 * 600x334 canvas), expanded by a small margin so continuous micro-motion
 * never reveals a hard crop edge. Pass the matching entry as the `crop`
 * prop on AnimatedImage for any layer that needs to read as "large" in a
 * composite rather than at native full-canvas scale.
 */

export const SOURCE_CANVAS = { width: 600, height: 334 };

interface RawBBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const RAW: Record<string, RawBBox> = {
  breadIcon: { left: 161, top: 96, right: 440, bottom: 240 },
  flourJarHero: { left: 193, top: 49, right: 408, bottom: 280 },
  homeIcon: { left: 184, top: 72, right: 416, bottom: 264 },
  ladderIcon: { left: 248, top: 16, right: 352, bottom: 320 },
  negationHandIcon: { left: 201, top: 51, right: 392, bottom: 288 },
  oilDropIcon: { left: 232, top: 65, right: 368, bottom: 264 },
  sonFigure: { left: 225, top: 112, right: 368, bottom: 293 },
  stickBundleIcon: { left: 40, top: 64, right: 560, bottom: 272 },
  waterVesselIcon: { left: 215, top: 48, right: 415, bottom: 304 },
  widowSmall: { left: 331, top: 90, right: 494, bottom: 328 },
};

const MARGIN = 0.12; // expand bbox 12% on each side, clamped to canvas

export interface Crop {
  left: number;
  top: number;
  width: number;
  height: number;
}

const withMargin = (raw: RawBBox): Crop => {
  const { width: W, height: H } = SOURCE_CANVAS;
  const bw = raw.right - raw.left;
  const bh = raw.bottom - raw.top;
  const left = Math.max(0, raw.left - bw * MARGIN);
  const top = Math.max(0, raw.top - bh * MARGIN);
  const right = Math.min(W, raw.right + bw * MARGIN);
  const bottom = Math.min(H, raw.bottom + bh * MARGIN);
  return {
    left: left / W,
    top: top / H,
    width: (right - left) / W,
    height: (bottom - top) / H,
  };
};

export const CROP: Record<keyof typeof RAW, Crop> = Object.fromEntries(
  Object.entries(RAW).map(([key, raw]) => [key, withMargin(raw)]),
) as Record<keyof typeof RAW, Crop>;
