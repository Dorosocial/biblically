import React from "react";
import { AbsoluteFill, Img, Sequence } from "remotion";
import { StaticFrame } from "./components/StaticFrame";
import { IMG } from "./constants";

/**
 * Segment 1 — Cold Open: The Widow at Zarephath (1 Kings 17)
 *
 * REBUILD IN PROGRESS. Per the corrected camera-language approach, static
 * holds are the default; motion is earned, not automatic. Only beat 1 is
 * implemented so far, as a test of the cut mechanism itself — the
 * remaining 47 beats are intentionally not yet built, pending sign-off
 * that this hard-cut approach actually renders as a real discontinuity.
 *
 * Beat 1 — we1-widow-gate-scene.png, frames 0-180:
 *   0-89:   WIDE — full establishing shot, static hold.
 *   90-179: HARD PUNCH-IN — a real cut (new Sequence, new fixed
 *           transform) to a tighter crop on her figure. Nothing tweens
 *           between the two: frame 89 and frame 90 are rendered by two
 *           entirely separate StaticFrame instances.
 */
export const Segment1ColdOpen: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      <Img
        src={IMG.background}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <Sequence from={0} durationInFrames={90} name="Beat 1a — WIDE (establishing)">
        <StaticFrame src={IMG.widowGateScene} transform="none" />
      </Sequence>

      <Sequence from={90} durationInFrames={90} name="Beat 1b — HARD PUNCH-IN">
        <StaticFrame
          src={IMG.widowGateScene}
          transform="scale(1.8) translateY(-10%)"
        />
      </Sequence>

      {/* Beats 2-48 intentionally not yet built. */}
    </AbsoluteFill>
  );
};
