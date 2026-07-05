import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { clamp } from "../motion";

/** Soft inward vignette / window-frame effect. `progress` 0-1 controls
 * strength; a continuous pulse keeps it alive even once fully formed. */
export const Vignette: React.FC<{ frame: number; progress: number }> = ({
  frame,
  progress,
}) => {
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.035);
  const strength = 0.5 * progress + 0.05 * pulse * progress;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        boxShadow: `inset 0 0 ${210 + pulse * 20}px ${70 + pulse * 10}px rgba(15,15,15,${clamp(
          strength,
          0,
          0.6,
        )})`,
      }}
    />
  );
};

/** Radial glow with continuous pulsing plus an optional one-shot bloom
 * flash centered at `bloomAt` (local frame). */
export const GlowPulse: React.FC<{
  frame: number;
  cx: string;
  cy: string;
  color?: string;
  baseRadius?: number;
  intensity?: number;
  bloomAt?: number;
  bloomWidth?: number;
}> = ({
  frame,
  cx,
  cy,
  color = "255,224,140",
  baseRadius = 320,
  intensity = 1,
  bloomAt,
  bloomWidth = 26,
}) => {
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.055);
  const bloom =
    bloomAt !== undefined
      ? Math.max(0, 1 - Math.abs(frame - bloomAt) / bloomWidth)
      : 0;
  const radius = baseRadius * (1 + 0.14 * pulse) * (1 + bloom * 0.7);
  const opacity = clamp((0.3 + 0.35 * pulse) * intensity + bloom * 0.65, 0, 1);
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

/** A line that draws itself across `[from,to]` local frames. */
export const StrikeThrough: React.FC<{
  frame: number;
  from: number;
  to: number;
  top: string;
  left: string;
  width: number;
  angle?: number;
  color?: string;
}> = ({
  frame,
  from,
  to,
  top,
  left,
  width,
  angle = -7,
  color = "rgba(35,35,35,0.88)",
}) => {
  const progress = interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wobble = Math.sin(frame * 0.08) * 0.4;
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
        transform: `rotate(${angle + wobble}deg) scaleX(${progress})`,
      }}
    />
  );
};

/** A small hand-drawn X mark, e.g. to negate/cross out a figure. */
export const XMark: React.FC<{
  frame: number;
  from: number;
  to: number;
  top: string;
  left: string;
  size?: number;
  color?: string;
}> = ({ frame, from, to, top, left, size = 84, color = "rgba(130,24,24,0.88)" }) => {
  const progress = interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wiggle = Math.sin(frame * 0.07) * 2;
  const scale = interpolate(progress, [0, 1], [0.5, 1]);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        opacity: progress,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${wiggle}deg)`,
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <line
          x1="15"
          y1="15"
          x2="85"
          y2="85"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
        />
        <line
          x1="85"
          y1="15"
          x2="15"
          y2="85"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

/** Bottom-caption style text with a slow, continuous glow shimmer. */
export const CaptionText: React.FC<{
  text: string;
  frame: number;
  fadeInFrames: number;
  top?: string | number;
  fontSize?: number;
}> = ({ text, frame, fadeInFrames, top = "87%", fontSize = 46 }) => {
  const opacity = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glow = 0.82 + 0.18 * Math.sin(frame * 0.05);
  const drift = Math.sin(frame * 0.02) * 2;
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
        color: `rgba(25,25,25,${glow})`,
        opacity,
        textTransform: "uppercase",
        transform: `translateY(${drift}px)`,
      }}
    >
      {text}
    </div>
  );
};
