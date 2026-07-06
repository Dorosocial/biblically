import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { StaticFrame } from "../components/StaticFrame";
import {
  DrawLine,
  ParticleBurst,
  StaticVignette,
  VignetteReveal,
} from "../components/effects";
import { IMG } from "../constants";
import { SPLIT_SCREEN } from "../layout";

/**
 * Act 4 — frames 3540-4650 (1:58-2:35).
 */

// Beat 40 — SCALE-JUMP CUT: ghosts -> gate scene. Vignette is a
// PROGRESSIVE REVEAL (marked: "vignette effect appears"), one-shot ramp.
const Beat40_GateVignetteAppears: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StaticFrame src={IMG.widowGateScene} transform="none" />
      <VignetteReveal frame={frame} revealFrames={24} strength={0.5} />
    </AbsoluteFill>
  );
};

// Beat 41 — HARD PUNCH-IN; vignette "completes" — now a fixed static
// value, no animation.
const Beat41_PunchInVignetteHeld: React.FC = () => (
  <AbsoluteFill>
    <StaticFrame src={IMG.widowGateScene} transform="scale(1.6) translate(-4%, 6%)" />
    <StaticVignette strength={0.5} />
  </AbsoluteFill>
);

// Beat 42 — SCALE-JUMP CUT: scene -> abstract statistics graphic, macro.
const Beat42_StatisticsAppear: React.FC = () => (
  <StaticFrame
    src={IMG.statisticsFade}
    style={{ filter: "brightness(0.15) url(#boost-low-alpha)" }}
  />
);

// Beat 43 — cut to a different crop. Strike-through: PROGRESSIVE REVEAL
// (draws once, local 0-40). Then a ONE-SHOT particle burst marks the
// "dissolve" moment (local ~70), after which a fixed faded static state
// holds to the end of the beat — two internal changes inside one beat,
// each a hard state change rather than a continuous tween.
const Beat43_StrikeThenDissolve: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-120
  const dissolved = frame >= 70;
  return (
    <AbsoluteFill>
      <StaticFrame
        src={IMG.statisticsFade}
        transform="scale(1.45) translate(-4%, -4%)"
        style={{
          filter: `brightness(0.15) url(#boost-low-alpha)${dissolved ? " blur(9px)" : ""}`,
          opacity: dissolved ? 0.15 : 1,
        }}
      />
      <DrawLine frame={frame} from={10} to={45} top="48%" left="20%" width={620} />
      {frame >= 68 && frame < 68 + 20 && (
        <ParticleBurst frame={frame - 68} cx="45%" cy="50%" color="80,80,80" peakRadius={420} burstFrames={20} />
      )}
    </AbsoluteFill>
  );
};

// Beat 44 — SCALE-JUMP CUT: split composite, left panel (gate scene).
const Beat44_SplitLeft: React.FC = () => (
  <AbsoluteFill style={SPLIT_SCREEN.leftHalf}>
    <StaticFrame
      src={IMG.widowGateScene}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </AbsoluteFill>
);

// Beat 45 — right panel appears instantly (hard cut, not animated),
// completing the split-screen comparison.
const Beat45_SplitBothPanels: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={SPLIT_SCREEN.leftHalf}>
      <StaticFrame
        src={IMG.widowGateScene}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
    <AbsoluteFill style={SPLIT_SCREEN.rightHalf}>
      <StaticFrame
        src={IMG.sonFigure}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        bottom: 0,
        width: 2,
        background: "rgba(20,20,20,0.3)",
        transform: "translateX(-1px)",
      }}
    />
  </AbsoluteFill>
);

const SplitScreenPersistent: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>
    <AbsoluteFill style={SPLIT_SCREEN.leftHalf}>
      <StaticFrame src={IMG.widowGateScene} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
    <AbsoluteFill style={SPLIT_SCREEN.rightHalf}>
      <StaticFrame src={IMG.sonFigure} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        bottom: 0,
        width: 2,
        background: "rgba(20,20,20,0.3)",
        transform: "translateX(-1px)",
      }}
    />
    {children}
  </AbsoluteFill>
);

// Ladder reveal via discrete hard-cut steps (PROGRESSIVE REVEAL, marked) —
// each beat cuts to a MORE-revealed fixed clip state. No animation.
const LADDER_BOX: React.CSSProperties = {
  position: "absolute",
  left: "44%",
  top: "8%",
  width: "14%",
  height: "auto",
};

// Beat 46 — first rungs visible (step 1 of 3).
const Beat46_LadderStep1: React.FC = () => (
  <SplitScreenPersistent>
    <div style={{ position: "absolute", inset: 0, clipPath: "inset(68% 0% 0% 0%)" }}>
      <StaticFrame src={IMG.ladderIcon} style={LADDER_BOX} />
    </div>
  </SplitScreenPersistent>
);

// Beat 47 — more rungs revealed (step 2 of 3).
const Beat47_LadderStep2: React.FC = () => (
  <SplitScreenPersistent>
    <div style={{ position: "absolute", inset: 0, clipPath: "inset(34% 0% 0% 0%)" }}>
      <StaticFrame src={IMG.ladderIcon} style={LADDER_BOX} />
    </div>
  </SplitScreenPersistent>
);

// Beat 48a — final rungs locked in (step 3 of 3, fully revealed).
const Beat48a_LadderStep3: React.FC = () => (
  <SplitScreenPersistent>
    <div style={{ position: "absolute", inset: 0, clipPath: "inset(0% 0% 0% 0%)" }}>
      <StaticFrame src={IMG.ladderIcon} style={LADDER_BOX} />
    </div>
  </SplitScreenPersistent>
);

// Beat 48b — fade to black: the segment's outro transition. One-shot,
// non-looping — the one deliberately-named exception to the static-hold
// default, exactly like a whip-pan masks a cut.
const Beat48b_FadeToBlack: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-150
  const opacity = Math.min(1, frame / 150);
  return (
    <SplitScreenPersistent>
      <div style={{ position: "absolute", inset: 0, clipPath: "inset(0% 0% 0% 0%)" }}>
        <StaticFrame src={IMG.ladderIcon} style={LADDER_BOX} />
      </div>
      <AbsoluteFill style={{ backgroundColor: "#000000", opacity, pointerEvents: "none" }} />
    </SplitScreenPersistent>
  );
};

export const Act4: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90} name="Beat 40 — Scale-jump, gate + vignette reveal"><Beat40_GateVignetteAppears /></Sequence>
      <Sequence from={90} durationInFrames={120} name="Beat 41 — Punch-in, vignette held"><Beat41_PunchInVignetteHeld /></Sequence>
      <Sequence from={210} durationInFrames={90} name="Beat 42 — Scale-jump, statistics appear"><Beat42_StatisticsAppear /></Sequence>
      <Sequence from={300} durationInFrames={120} name="Beat 43 — Strike-through reveal, then dissolve burst"><Beat43_StrikeThenDissolve /></Sequence>
      <Sequence from={420} durationInFrames={90} name="Beat 44 — Scale-jump, split left"><Beat44_SplitLeft /></Sequence>
      <Sequence from={510} durationInFrames={120} name="Beat 45 — Right panel completes"><Beat45_SplitBothPanels /></Sequence>
      <Sequence from={630} durationInFrames={90} name="Beat 46 — Ladder reveal step 1"><Beat46_LadderStep1 /></Sequence>
      <Sequence from={720} durationInFrames={120} name="Beat 47 — Ladder reveal step 2"><Beat47_LadderStep2 /></Sequence>
      <Sequence from={840} durationInFrames={120} name="Beat 48a — Ladder reveal step 3"><Beat48a_LadderStep3 /></Sequence>
      <Sequence from={960} durationInFrames={150} name="Beat 48b — Fade to black"><Beat48b_FadeToBlack /></Sequence>
    </AbsoluteFill>
  );
};
