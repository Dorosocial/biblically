import React, { CSSProperties } from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import {
  BreatheOptions,
  DriftOptions,
  ShimmerOptions,
  SwayOptions,
  breathe,
  drift,
  seedFor,
  shimmer,
  sway,
} from "../motion";
import { Crop, SOURCE_CANVAS } from "../content-bbox";

export interface MotionSpec {
  scale?: BreatheOptions | false;
  drift?: DriftOptions | false;
  opacity?: ShimmerOptions | false;
  rotate?: SwayOptions | false;
}

/** Gentle default so every layer satisfies the "always animating" rule
 * even when a beat doesn't call for anything fancier. */
export const DEFAULT_MOTION: MotionSpec = { scale: {}, drift: {} };

interface AnimatedImageProps {
  src: string;
  /** Stable name used to derive a per-layer phase offset, so images don't
   * breathe/drift in lockstep with each other. */
  name: string;
  motion?: MotionSpec;
  /** Frames (local to the enclosing Sequence) to fade in / out over. */
  fadeInFrames?: number;
  fadeOutFrames?: number;
  durationInFrames: number;
  /** Beat-specific camera move (pan/zoom) composed *before* the continuous
   * micro-motion transform, e.g. "scale(1.6) translate(4%, 0)". */
  baseTransform?: string;
  style?: CSSProperties;
  wrapperStyle?: CSSProperties;
  /** Extra multiplicative opacity for beat-driven effects (glow pulses,
   * strike-through fades, etc.) layered on top of the continuous shimmer. */
  extraOpacity?: number;
  /** Several source images draw their subject in only a small fraction of
   * a much larger transparent canvas (icons, small figures). Passing the
   * measured content bbox here crops+scales so the subject fills `style`'s
   * box, instead of rendering tiny inside a mostly-empty frame. */
  crop?: Crop;
}

export const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  name,
  motion = DEFAULT_MOTION,
  fadeInFrames = 0,
  fadeOutFrames = 0,
  durationInFrames,
  baseTransform = "",
  style,
  wrapperStyle,
  extraOpacity = 1,
  crop,
}) => {
  const frame = useCurrentFrame();
  const seed = seedFor(name);
  const f = frame + seed;

  const scale = motion.scale === false ? 1 : breathe(f, motion.scale);
  const rotate =
    motion.rotate === false ? 0 : motion.rotate ? sway(f, motion.rotate) : 0;
  const oscOpacity =
    motion.opacity === false ? 1 : motion.opacity ? shimmer(f, motion.opacity) : 1;
  const { x, y } =
    motion.drift === false ? { x: 0, y: 0 } : drift(f, motion.drift);

  let fade = 1;
  if (fadeInFrames > 0) {
    fade = Math.min(
      fade,
      interpolate(frame, [0, fadeInFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    );
  }
  if (fadeOutFrames > 0) {
    fade = Math.min(
      fade,
      interpolate(
        frame,
        [durationInFrames - fadeOutFrames, durationInFrames],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      ),
    );
  }

  const motionTransform = `${baseTransform} translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`;
  const opacity = oscOpacity * fade * extraOpacity;

  if (crop) {
    const cropWidthPx = crop.width * SOURCE_CANVAS.width;
    const cropHeightPx = crop.height * SOURCE_CANVAS.height;
    return (
      <AbsoluteFill style={wrapperStyle}>
        <div
          style={{
            position: "absolute",
            overflow: "hidden",
            aspectRatio: `${cropWidthPx} / ${cropHeightPx}`,
            ...style,
            transform: motionTransform,
            opacity,
          }}
        >
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Img
            src={src}
            style={{
              position: "absolute",
              left: `${(-100 * crop.left) / crop.width}%`,
              top: `${(-100 * crop.top) / crop.height}%`,
              width: `${100 / crop.width}%`,
              height: "auto",
              display: "block",
              maxWidth: "none",
            }}
          />
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={wrapperStyle}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          ...style,
          transform: motionTransform,
          opacity,
        }}
      />
    </AbsoluteFill>
  );
};
