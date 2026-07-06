import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { StaticFrame } from "../components/StaticFrame";
import { DrawLine, GlowOverlay, RevealText, StaticDim } from "../components/effects";
import { CROP } from "../content-bbox";
import { IMG } from "../constants";

/**
 * Act 2 — frames 1080-2040 (0:36-1:08).
 *
 * Beats 15-24 dim toward near-black via discrete hard cuts to darker
 * static overlay values (not a continuous fade) — each beat is its own
 * fixed darkness level. Beats 25-26 cut back to full brightness.
 */

const DIM_STEPS = [0, 0.12, 0.18, 0.22, 0.26, 0.3, 0.36, 0.5, 0.75, 0.92];

// Beat 15 — SCALE-JUMP CUT: tight composite -> wide, alone with the jar.
const Beat15_WideAlone: React.FC = () => (
  <AbsoluteFill>
    <StaticFrame src={IMG.widowAloneJar} transform="none" />
    <StaticDim opacity={DIM_STEPS[0]} />
  </AbsoluteFill>
);

// Beat 16 — HARD PUNCH-IN + negation icon reappears, PROGRESSIVE REVEAL
// (strike-through draws once).
const Beat16_PunchInNegationStrike: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-90
  return (
    <AbsoluteFill>
      <StaticFrame src={IMG.widowAloneJar} transform="scale(1.7) translate(-16%, 8%)" />
      <StaticFrame
        src={IMG.negationHandIcon}
        crop={CROP.negationHandIcon}
        style={{ position: "absolute", left: "62%", top: "54%", width: "11%", height: "auto" }}
      />
      <DrawLine frame={frame} from={20} to={55} top="60%" left="60%" width={190} />
      <StaticDim opacity={DIM_STEPS[1]} />
    </AbsoluteFill>
  );
};

// Beat 17 — HARD PULL-BACK to wide; "holds still" = a real static hold.
const Beat17_WideHold: React.FC = () => (
  <AbsoluteFill>
    <StaticFrame src={IMG.widowAloneJar} transform="none" />
    <StaticDim opacity={DIM_STEPS[2]} />
  </AbsoluteFill>
);

// Beat 18 — cut to a medium crop (alternating scale from beat 17).
const Beat18_MediumHold: React.FC = () => (
  <AbsoluteFill>
    <StaticFrame src={IMG.widowAloneJar} transform="scale(1.85) translate(-2%, 6%)" />
    <StaticDim opacity={DIM_STEPS[3]} />
  </AbsoluteFill>
);

// Beat 19 — HARD PUNCH-IN + GLOW OVERLAY (marked: "first glow pulse").
const Beat19_PunchInGlow: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StaticFrame src={IMG.widowAloneJar} transform="scale(1.3) translate(-8%, 4%)" />
      <GlowOverlay frame={frame} cx="42%" cy="55%" color="255,244,210" baseRadius={340} intensity={0.8} />
      <StaticDim opacity={DIM_STEPS[4]} />
    </AbsoluteFill>
  );
};

// Beat 20 — cut to a slightly different crop, GLOW OVERLAY continues
// (marked: "second matching glow pulse").
const Beat20_AltCropGlow: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StaticFrame src={IMG.widowAloneJar} transform="scale(2.1) translate(-12%, 2%)" />
      <GlowOverlay frame={frame} cx="42%" cy="55%" color="255,244,210" baseRadius={340} intensity={0.8} />
      <StaticDim opacity={DIM_STEPS[5]} />
    </AbsoluteFill>
  );
};

// Beat 21 — cut to wide; "holds".
const Beat21_WideHold2: React.FC = () => (
  <AbsoluteFill>
    <StaticFrame src={IMG.widowAloneJar} transform="none" />
    <StaticDim opacity={DIM_STEPS[6]} />
  </AbsoluteFill>
);

// Beat 22 — SCALE-JUMP insert: son figure appears beside her; cut wider
// to fit both in frame.
const Beat22_WiderPlusSon: React.FC = () => (
  <AbsoluteFill>
    <StaticFrame src={IMG.widowAloneJar} transform="scale(0.95) translate(-8%, 0%)" />
    <StaticFrame
      src={IMG.sonFigure}
      crop={CROP.sonFigure}
      style={{ position: "absolute", left: "64%", top: "30%", width: "18%", height: "auto" }}
    />
    <StaticDim opacity={DIM_STEPS[7]} />
  </AbsoluteFill>
);

// Beat 23 — HARD PUNCH-IN on both figures, dim continues toward near-black.
const Beat23_PunchInBoth: React.FC = () => (
  <AbsoluteFill>
    <StaticFrame src={IMG.widowAloneJar} transform="scale(1.3) translate(-8%, 4%)" />
    <StaticFrame
      src={IMG.sonFigure}
      crop={CROP.sonFigure}
      style={{ position: "absolute", left: "70%", top: "26%", width: "20%", height: "auto" }}
    />
    <StaticDim opacity={DIM_STEPS[8]} />
  </AbsoluteFill>
);

// Beat 24 — near-black hold.
const Beat24_NearBlackHold: React.FC = () => (
  <AbsoluteFill>
    <StaticFrame src={IMG.widowAloneJar} transform="scale(1.55) translate(-11%, 5%)" />
    <StaticFrame
      src={IMG.sonFigure}
      crop={CROP.sonFigure}
      style={{ position: "absolute", left: "70%", top: "26%", width: "20%", height: "auto" }}
    />
    <StaticDim opacity={DIM_STEPS[9]} />
  </AbsoluteFill>
);

// Beat 25 — SCALE-JUMP CUT: near-black -> full scene, Elijah returns.
// "1 KINGS 17" text: PROGRESSIVE REVEAL (marked).
const Beat25_ElijahReturnsCitation: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StaticFrame src={IMG.elijahWidowMeeting} transform="none" />
      <RevealText text="1 Kings 17" frame={frame} revealFrames={18} />
    </AbsoluteFill>
  );
};

// Beat 26 — HARD PUNCH-IN; citation "completes" (underline draws once,
// PROGRESSIVE REVEAL).
const Beat26_PunchInCitationComplete: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StaticFrame src={IMG.elijahWidowMeeting} transform="scale(1.3) translate(0%, 6%)" />
      <RevealText text="1 Kings 17" frame={frame + 18} revealFrames={18} />
      <DrawLine frame={frame} from={10} to={45} top="92%" left="44%" width={260} angle={0} color="rgba(25,25,25,0.55)" />
    </AbsoluteFill>
  );
};

export const Act2: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={120} name="Beat 15 — Scale-jump to wide, alone"><Beat15_WideAlone /></Sequence>
      <Sequence from={120} durationInFrames={90} name="Beat 16 — Punch-in, negation + strike"><Beat16_PunchInNegationStrike /></Sequence>
      <Sequence from={210} durationInFrames={60} name="Beat 17 — Pull-back wide, holds"><Beat17_WideHold /></Sequence>
      <Sequence from={270} durationInFrames={90} name="Beat 18 — Medium crop"><Beat18_MediumHold /></Sequence>
      <Sequence from={360} durationInFrames={90} name="Beat 19 — Punch-in, GLOW OVERLAY 1"><Beat19_PunchInGlow /></Sequence>
      <Sequence from={450} durationInFrames={60} name="Beat 20 — Alt crop, GLOW OVERLAY 2"><Beat20_AltCropGlow /></Sequence>
      <Sequence from={510} durationInFrames={60} name="Beat 21 — Wide, holds"><Beat21_WideHold2 /></Sequence>
      <Sequence from={570} durationInFrames={90} name="Beat 22 — Wider + son figure"><Beat22_WiderPlusSon /></Sequence>
      <Sequence from={660} durationInFrames={90} name="Beat 23 — Punch-in both, darker"><Beat23_PunchInBoth /></Sequence>
      <Sequence from={750} durationInFrames={60} name="Beat 24 — Near-black hold"><Beat24_NearBlackHold /></Sequence>
      <Sequence from={810} durationInFrames={90} name="Beat 25 — Scale-jump, Elijah returns"><Beat25_ElijahReturnsCitation /></Sequence>
      <Sequence from={900} durationInFrames={60} name="Beat 26 — Punch-in, citation completes"><Beat26_PunchInCitationComplete /></Sequence>
    </AbsoluteFill>
  );
};
