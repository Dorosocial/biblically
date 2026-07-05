import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Act1 } from "./acts/Act1";
import { Act2 } from "./acts/Act2";
import { Act3 } from "./acts/Act3";
import { Act4 } from "./acts/Act4";
import { AnimatedImage } from "./components/AnimatedImage";
import { DURATION_IN_FRAMES, IMG } from "./constants";

/**
 * Segment 1 — Cold Open: The Widow at Zarephath (1 Kings 17)
 * 0:00-2:35, 4650 frames @ 30fps, 1920x1080.
 *
 * we1-background.jpeg is a plain-white plate that fills the frame for the
 * entire segment. All 18 other images are transparent silhouettes that
 * composite on top of it and on top of each other, organized into four
 * "acts" (see acts/Act1-4.tsx) that map directly onto the 48 scripted
 * beats. Every layer carries continuous micro-motion (see motion.ts) so
 * nothing is ever fully static, even during held beats.
 */
export const Segment1ColdOpen: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      {/* we1-statistics-fade.png ships with a genuinely low alpha channel
          (by design — it's meant to look "faded"), which leaves it nearly
          invisible against the white plate. brightness/contrast filters
          don't touch alpha, so this SVG filter remaps the alpha channel
          directly; referenced via `filter: url(#boost-low-alpha)`. */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <filter id="boost-low-alpha">
            <feComponentTransfer>
              <feFuncA type="linear" slope={6} intercept={0} />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
      <AnimatedImage
        src={IMG.background}
        name="background-plate"
        durationInFrames={DURATION_IN_FRAMES}
        motion={{
          scale: { amount: 0.006, speed: 0.012 },
          drift: { ampX: 2, ampY: 1.5, speedX: 0.008, speedY: 0.01 },
        }}
        style={{ objectFit: "cover" }}
      />

      <Sequence from={0} durationInFrames={1080} name="Act 1 — Gate scene through flour jar (beats 1-14)">
        <Act1 />
      </Sequence>
      <Sequence from={1080} durationInFrames={960} name="Act 2 — Widow alone through 1 Kings 17 (beats 15-26)">
        <Act2 />
      </Sequence>
      <Sequence from={2040} durationInFrames={1500} name="Act 3 — Miracle jar through ghost dissolve (beats 27-39)">
        <Act3 />
      </Sequence>
      <Sequence from={3540} durationInFrames={1110} name="Act 4 — Vignette through fade to black (beats 40-48)">
        <Act4 />
      </Sequence>
    </AbsoluteFill>
  );
};
