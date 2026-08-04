import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EntranceVariant, getEntranceStyle } from "./entrances";
import { useIdleMotion } from "./useIdleMotion";

export const WireframeImage: React.FC<{
  file: string;
  variant: EntranceVariant;
  seed: string;
  /** Shrinks + left-anchors the figure so Bucket B overlays have room on the right. */
  sideBySide?: boolean;
}> = ({ file, variant, seed, sideBySide = false }) => {
  // Already local to the wrapping <Sequence from={...}>, so this IS the
  // entrance-relative frame -- do not subtract the layer's global `from`
  // again here (that double-offset was a real bug: it drove local frame
  // negative, which clamps entrance progress to 0 and renders nothing).
  const localFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = getEntranceStyle(variant, localFrame, fps);
  const idle = useIdleMotion(localFrame, fps, seed, "breathing");

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: sideBySide ? "2%" : 0,
        paddingRight: sideBySide ? "42%" : 0,
      }}
    >
      <Img
        src={staticFile(`watch-and-pray/assets/images/wireframe/${file}`)}
        style={{
          width: sideBySide ? "88%" : "100%",
          height: sideBySide ? "88%" : "100%",
          objectFit: "contain",
          mixBlendMode: "screen",
          transform: `${entrance.transform} scale(${idle.scale})`,
          opacity: entrance.opacity * idle.opacityMul,
        }}
      />
    </AbsoluteFill>
  );
};
