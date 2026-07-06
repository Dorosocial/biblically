import React from "react";
import { AbsoluteFill, Img, Sequence } from "remotion";
import { Act1 } from "./acts/Act1";
import { Act2 } from "./acts/Act2";
import { Act3 } from "./acts/Act3";
import { Act4 } from "./acts/Act4";
import { IMG } from "./constants";

/**
 * Segment 1 — Cold Open: The Widow at Zarephath (1 Kings 17)
 * 0:00-2:35, 4650 frames @ 30fps, 1920x1080.
 *
 * CAMERA-LANGUAGE BUILD. Static holds are the default. Every cut between
 * beats carries deliberate camera language (hard punch-in, hard
 * pull-back, scale-jump cut, whip-flash, or match cut), and consecutive
 * beats never repeat the same framing scale. Motion is earned, not
 * automatic — glow overlays, one-shot particle bursts, and progressive
 * reveals appear only on the beats that call for them (see acts/Act1-4).
 */
export const Segment1ColdOpen: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      {/* we1-statistics-fade.png ships with a genuinely low alpha channel
          on top of pale strokes — this SVG filter remaps alpha directly
          so beat 42/43 is legible; referenced via `url(#boost-low-alpha)`. */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="boost-low-alpha">
            <feComponentTransfer>
              <feFuncA type="linear" slope={6} intercept={0} />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <Img
        src={IMG.background}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <Sequence from={0} durationInFrames={1080} name="Act 1 — Beats 1-14">
        <Act1 />
      </Sequence>
      <Sequence from={1080} durationInFrames={960} name="Act 2 — Beats 15-26">
        <Act2 />
      </Sequence>
      <Sequence from={2040} durationInFrames={1500} name="Act 3 — Beats 27-39">
        <Act3 />
      </Sequence>
      <Sequence from={3540} durationInFrames={1110} name="Act 4 — Beats 40-48">
        <Act4 />
      </Sequence>
    </AbsoluteFill>
  );
};
