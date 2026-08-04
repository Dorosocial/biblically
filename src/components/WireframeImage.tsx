import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { EntranceVariant, getEntranceStyle } from "./entrances";
import { useIdleMotion } from "./useIdleMotion";

export const WireframeImage: React.FC<{
  file: string;
  entranceFrom: number;
  variant: EntranceVariant;
  seed: string;
  /** Shrinks + left-anchors the figure so Bucket B overlays have room on the right. */
  sideBySide?: boolean;
}> = ({ file, entranceFrom, variant, seed, sideBySide = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - entranceFrom;
  const entrance = getEntranceStyle(variant, localFrame, fps);
  const idle = useIdleMotion(frame, fps, seed, "breathing");

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
