import React, { CSSProperties } from "react";
import { AbsoluteFill, Img } from "remotion";
import { Crop, SOURCE_CANVAS } from "../content-bbox";

/**
 * A deliberately "dumb" image renderer: no useCurrentFrame, no
 * interpolation, no per-frame computation of any kind. Whatever
 * `transform` and `style` you pass is what renders for every frame of the
 * enclosing Sequence — a true static hold.
 *
 * Camera language (wide vs. punch-in framing, etc.) comes from mounting
 * *different* StaticFrame instances in back-to-back Sequences with
 * different fixed `transform` values — the cut between them is a real
 * discontinuity, not a tween.
 */
interface StaticFrameProps {
  src: string;
  /** Fixed CSS transform for this shot's framing (e.g. "scale(1.6)
   * translate(0px, -80px)"). Never animated — pick one value per shot. */
  transform?: string;
  /** Content-bbox crop for small subjects (icons, small figures) that
   * would otherwise render tiny inside their transparent padding. */
  crop?: Crop;
  style?: CSSProperties;
  wrapperStyle?: CSSProperties;
}

export const StaticFrame: React.FC<StaticFrameProps> = ({
  src,
  transform = "none",
  crop,
  style,
  wrapperStyle,
}) => {
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
            transform,
            transformOrigin: "center center",
            ...style,
          }}
        >
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
          transform,
          transformOrigin: "center center",
          ...style,
        }}
      />
    </AbsoluteFill>
  );
};
