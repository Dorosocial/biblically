import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

/**
 * Motion is NOT the default in this build. These are the only categories
 * of movement permitted, and only on beats explicitly marked for them:
 *   - GlowOverlay      -> "GLOW OVERLAY" beats (continuous pulsing allowed)
 *   - ParticleBurst     -> one-shot only, fires at the cut, then freezes
 *   - RevealText / DrawLine / DrawX -> "PROGRESSIVE REVEAL" beats
 *   - WhipFlash         -> a 3-5 frame directional-blur wipe masking a cut
 * Everything else is a StaticFrame hard cut with zero animation.
 */

/** Continuous pulsing glow — only for beats explicitly marked GLOW OVERLAY. */
export const GlowOverlay: React.FC<{
  cx: string;
  cy: string;
  color?: string;
  baseRadius?: number;
  intensity?: number;
  /** Local frame this component has been mounted for — pass useCurrentFrame()
   * from the parent Sequence so the pulse phase is stable per-shot. */
  frame: number;
}> = ({ cx, cy, color = "255,224,140", baseRadius = 320, intensity = 1, frame }) => {
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.06);
  const radius = baseRadius * (1 + 0.12 * pulse);
  const opacity = Math.min(1, (0.3 + 0.35 * pulse) * intensity);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          width: radius,
          height: radius,
          transform: "translate(-50%, -50%)",
          borderRadius: "9999px",
          background: `radial-gradient(circle, rgba(${color},${opacity}) 0%, rgba(${color},0) 70%)`,
          filter: "blur(2px)",
        }}
      />
    </AbsoluteFill>
  );
};

/** One-shot light/particle burst: fires once starting at local frame 0,
 * fully decayed and inert well before the beat ends. Never loops. */
export const ParticleBurst: React.FC<{
  cx: string;
  cy: string;
  color?: string;
  frame: number;
  peakRadius?: number;
  burstFrames?: number;
}> = ({ cx, cy, color = "255,230,160", frame, peakRadius = 500, burstFrames = 18 }) => {
  const progress = Math.min(1, frame / burstFrames);
  const decay = Math.max(0, 1 - progress);
  const radius = peakRadius * (0.3 + 0.7 * progress);
  const opacity = decay * decay;
  if (opacity <= 0.001) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          width: radius,
          height: radius,
          transform: "translate(-50%, -50%)",
          borderRadius: "9999px",
          background: `radial-gradient(circle, rgba(${color},${opacity}) 0%, rgba(${color},0) 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** A brief hard flash used to mask a cut (stand-in for a whip-pan/directional
 * blur wipe) — fires for a handful of frames at the start of the beat it's
 * placed in, then is fully gone. Not a loop. */
export const WhipFlash: React.FC<{ frame: number; frames?: number }> = ({
  frame,
  frames = 4,
}) => {
  const opacity = interpolate(frame, [0, frames], [0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (opacity <= 0.001) return null;
  return (
    <AbsoluteFill
      style={{ backgroundColor: "#ffffff", opacity, pointerEvents: "none" }}
    />
  );
};

/** Fires only in the last `frames` frames of a beat of known
 * `totalFrames` — masks the outgoing cut rather than the incoming one. */
export const WhipFlashOut: React.FC<{
  frame: number;
  totalFrames: number;
  frames?: number;
}> = ({ frame, totalFrames, frames = 5 }) => {
  const framesFromEnd = totalFrames - frame;
  if (framesFromEnd > frames || framesFromEnd < 0) return null;
  const opacity = interpolate(framesFromEnd, [frames, 0], [0, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff", opacity, pointerEvents: "none" }} />
  );
};

/** A caption that reveals once (scale + opacity settle) then holds
 * perfectly static — for beats explicitly marked PROGRESSIVE REVEAL. */
export const RevealText: React.FC<{
  text: string;
  frame: number;
  revealFrames?: number;
  top?: string | number;
  fontSize?: number;
}> = ({ text, frame, revealFrames = 16, top = "87%", fontSize = 46 }) => {
  const progress = interpolate(frame, [0, revealFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontWeight: 700,
        letterSpacing: 6,
        fontSize,
        color: "rgba(20,20,20,1)",
        opacity: progress,
        transform: `scale(${0.92 + 0.08 * progress})`,
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
};

/** A line that draws itself once (progress 0->1) then holds. */
export const DrawLine: React.FC<{
  frame: number;
  from: number;
  to: number;
  top: string;
  left: string;
  width: number;
  angle?: number;
  color?: string;
}> = ({ frame, from, to, top, left, width, angle = -7, color = "rgba(35,35,35,0.9)" }) => {
  const progress = interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width,
        height: 7,
        background: color,
        borderRadius: 4,
        transformOrigin: "left center",
        transform: `rotate(${angle}deg) scaleX(${progress})`,
      }}
    />
  );
};

/** An X mark that draws itself once then holds. */
export const DrawX: React.FC<{
  frame: number;
  from: number;
  to: number;
  top: string;
  left: string;
  size?: number;
  color?: string;
}> = ({ frame, from, to, top, left, size = 84, color = "rgba(130,24,24,0.9)" }) => {
  const progress = interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        opacity: progress,
        transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * progress})`,
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <line x1="15" y1="15" x2="85" y2="85" stroke={color} strokeWidth={10} strokeLinecap="round" />
        <line x1="85" y1="15" x2="15" y2="85" stroke={color} strokeWidth={10} strokeLinecap="round" />
      </svg>
    </div>
  );
};

/** A perfectly static dim overlay — no animation, just a fixed value.
 * Darkening across beats happens by cutting to a DIFFERENT fixed value
 * in the next Sequence, not by tweening. */
export const StaticDim: React.FC<{ opacity: number }> = ({ opacity }) => (
  <AbsoluteFill style={{ backgroundColor: "#000000", opacity, pointerEvents: "none" }} />
);

/** Static vignette at a fixed strength (no pulsing). */
export const StaticVignette: React.FC<{ strength: number }> = ({ strength }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      boxShadow: `inset 0 0 220px 75px rgba(15,15,15,${strength})`,
    }}
  />
);

/** One-shot vignette reveal — ramps in once over `revealFrames`, then the
 * calling beat should hand off to StaticVignette for subsequent beats. */
export const VignetteReveal: React.FC<{ frame: number; revealFrames?: number; strength?: number }> = ({
  frame,
  revealFrames = 24,
  strength = 0.5,
}) => {
  const progress = interpolate(frame, [0, revealFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <StaticVignette strength={strength * progress} />;
};

export const useFrame = useCurrentFrame;
