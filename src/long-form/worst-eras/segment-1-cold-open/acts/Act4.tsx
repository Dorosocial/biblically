import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { AnimatedImage } from "../components/AnimatedImage";
import { GlowPulse, StrikeThrough, Vignette } from "../components/effects";
import { CROP } from "../content-bbox";
import { IMG } from "../constants";
import { SPLIT_SCREEN } from "../layout";

/**
 * Act 4 — absolute frames 3540-4650 (1:58-2:35), local frame 0 == 3540.
 *
 * Beats 40-41: we1-widow-gate-scene.png + vignette   (local 0-210)
 * Beats 42-43: we1-statistics-fade.png, strike + dissolve (local 210-420)
 * Beats 44-48: split-screen comparison + ladder reveal + fade to black
 *              (local 420-1110)
 */

const GateVignetteBeats: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-210
  const vignetteProgress = interpolate(frame, [0, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimatedImage
        src={IMG.widowGateScene}
        name="gate-scene-vignette"
        durationInFrames={210}
        motion={{ scale: { amount: 0.013 }, drift: { ampX: 3, ampY: 2 } }}
      />
      <Vignette frame={frame} progress={vignetteProgress} />
    </AbsoluteFill>
  );
};

const StatisticsBeats: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-210 (beats 42-43)

  // Beat 43: dissolve after the strike-through completes.
  const dissolveProgress = interpolate(frame, [150, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimatedImage
        src={IMG.statisticsFade}
        name="statistics-fade"
        durationInFrames={210}
        fadeInFrames={20}
        extraOpacity={1 - dissolveProgress * 0.95}
        motion={{ scale: { amount: 0.015 }, opacity: { amount: 0.03 } }}
        style={{ filter: `brightness(0.15) url(#boost-low-alpha) blur(${dissolveProgress * 10}px)` }}
      />
      <StrikeThrough frame={frame} from={90} to={150} top="48%" left="20%" width={620} />
    </AbsoluteFill>
  );
};

const SplitScreenLeft: React.FC = () => {
  return (
    <AbsoluteFill style={SPLIT_SCREEN.leftHalf}>
      <AnimatedImage
        src={IMG.widowGateScene}
        name="split-left-gate-scene"
        durationInFrames={90}
        fadeInFrames={30}
        motion={{ scale: { amount: 0.015 }, drift: { ampX: 2, ampY: 2 } }}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

const SplitScreenRight: React.FC = () => {
  return (
    <AbsoluteFill style={SPLIT_SCREEN.rightHalf}>
      <AnimatedImage
        src={IMG.sonFigure}
        name="split-right-son-figure"
        durationInFrames={120}
        fadeInFrames={40}
        motion={{ scale: { amount: 0.016 }, drift: { ampX: 2, ampY: 2 } }}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

const LadderReveal: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-480 (beats 46-48a, rel to this sequence)

  const progress = interpolate(frame, [0, 90, 210, 330], [0, 0.35, 0.75, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const revealTop = (1 - progress) * 100;

  // A handful of discrete "rung" highlight flashes as the reveal climbs.
  const rungFlashFrames = [15, 60, 120, 180, 250, 320];
  const flash = rungFlashFrames.reduce((acc, t) => {
    const f = Math.max(0, 1 - Math.abs(frame - t) / 14);
    return Math.max(acc, f);
  }, 0);

  const ladderCrop = CROP.ladderIcon;

  return (
    <AbsoluteFill>
      {/* Reveal box sized to the ladder's own cropped bounds, so the
          bottom-up clip climbs the ladder itself rather than the full frame. */}
      <div
        style={{
          position: "absolute",
          left: "44%",
          top: "8%",
          width: "14%",
          aspectRatio: `${ladderCrop.width * 600} / ${ladderCrop.height * 334}`,
          overflow: "hidden",
          clipPath: `inset(${revealTop}% 0% 0% 0%)`,
        }}
      >
        <AnimatedImage
          src={IMG.ladderIcon}
          name="ladder-icon"
          durationInFrames={480}
          crop={ladderCrop}
          motion={{ scale: { amount: 0.014 }, drift: { ampX: 1.5, ampY: 1.5 } }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      </div>
      <GlowPulse
        frame={frame}
        cx="50%"
        cy={`${10 + (1 - progress) * 80}%`}
        color="255,232,160"
        baseRadius={160}
        intensity={0.4 + flash * 0.8}
      />
    </AbsoluteFill>
  );
};

const SplitAndLadderBeats: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-690 (beats 44-48b)

  const fadeToBlack = interpolate(frame, [540, 690], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={690} name="split-left">
        <SplitScreenLeft />
      </Sequence>
      <Sequence from={90} durationInFrames={600} name="split-right">
        <SplitScreenRight />
      </Sequence>

      {/* Dividing line, kept subtly alive with a slow shimmer. */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: 2,
          background: `rgba(20,20,20,${0.25 + 0.1 * Math.sin(frame * 0.04)})`,
          transform: "translateX(-1px)",
        }}
      />

      <Sequence from={210} durationInFrames={480} name="ladder-reveal">
        <LadderReveal />
      </Sequence>

      {/* Beat 48b: fade to black — transition point for Segment 2. */}
      <AbsoluteFill style={{ backgroundColor: "#000000", opacity: fadeToBlack, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const Act4: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={210} name="Beats 40-41: Gate scene + vignette">
        <GateVignetteBeats />
      </Sequence>
      <Sequence from={210} durationInFrames={210} name="Beats 42-43: Statistics strike + dissolve">
        <StatisticsBeats />
      </Sequence>
      <Sequence from={420} durationInFrames={690} name="Beats 44-48: Split-screen, ladder, fade out">
        <SplitAndLadderBeats />
      </Sequence>
    </AbsoluteFill>
  );
};
