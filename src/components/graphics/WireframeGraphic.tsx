import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BucketBItem } from "../../data/bucketBSpecs";
import { EntranceVariant, getEntranceStyle } from "../entrances";
import { useIdleMotion } from "../useIdleMotion";
import { STROKE, WireframeIconGlyph } from "./icons";

const CUTAWAY_SCALE = 1;
const OVERLAY_SCALE = 0.5;

export const WireframeGraphic: React.FC<{
  item: BucketBItem;
  entranceFrom: number;
  variant: EntranceVariant;
  seed: string;
  mode: "overlay" | "cutaway";
}> = ({ item, entranceFrom, variant, seed, mode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - entranceFrom;
  const groupEntrance = getEntranceStyle(variant, localFrame, fps);
  const idle = useIdleMotion(frame, fps, seed, "shimmer");
  const scale = mode === "cutaway" ? CUTAWAY_SCALE : OVERLAY_SCALE;

  const containerStyle: React.CSSProperties =
    mode === "cutaway"
      ? { justifyContent: "center", alignItems: "center" }
      : {
          justifyContent: "center",
          alignItems: "center",
          left: "58%",
          width: "42%",
        };

  return (
    <AbsoluteFill style={containerStyle}>
      <div
        style={{
          position: "relative",
          width: `${100 * scale}%`,
          maxWidth: mode === "cutaway" ? 900 : 620,
          aspectRatio: "1 / 1",
          transform: `${groupEntrance.transform} scale(${idle.scale})`,
          opacity: groupEntrance.opacity * idle.opacityMul,
        }}
      >
        {item.elements.map((el, i) => {
          const delay = "delayFrames" in el && el.delayFrames ? el.delayFrames : 0;
          const elLocal = localFrame - delay;
          const elEntrance = getEntranceStyle("drawOn", elLocal, fps);

          if (el.kind === "icon") {
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${el.x}%`,
                  top: `${el.y}%`,
                  transform: `translate(-50%, -50%) ${elEntrance.transform}`,
                  opacity: elEntrance.opacity,
                }}
              >
                <WireframeIconGlyph
                  kind={el.icon}
                  size={(el.size / 800) * (mode === "cutaway" ? 900 : 620)}
                />
              </div>
            );
          }

          if (el.kind === "text") {
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${el.x}%`,
                  top: `${el.y}%`,
                  transform: `translate(-50%, -50%) ${elEntrance.transform}`,
                  opacity: elEntrance.opacity,
                  color: STROKE,
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  fontSize: (el.fontSize / 800) * (mode === "cutaway" ? 900 : 620),
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {el.text}
              </div>
            );
          }

          // underline
          const fullWidth = (el.width / 100) * (mode === "cutaway" ? 900 : 620);
          const drawnWidth = fullWidth * elEntrance.drawProgress;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${el.x}%`,
                top: `${el.y}%`,
                transform: "translate(-50%, -50%)",
                width: drawnWidth,
                height: 3,
                background: STROKE,
                opacity: elEntrance.opacity,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
