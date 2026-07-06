import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { StaticFrame } from "../components/StaticFrame";
import { DrawX, GlowOverlay, ParticleBurst, RevealText, WhipFlashOut } from "../components/effects";
import { CROP } from "../content-bbox";
import { IMG } from "../constants";

/**
 * Act 3 — frames 2040-3540 (1:08-1:58).
 */

// Beat 27 — SCALE-JUMP CUT: full scene -> close inset of the jar.
const Beat27_JarInset: React.FC = () => (
  <StaticFrame
    src={IMG.flourJarHero}
    crop={CROP.flourJarHero}
    style={{ position: "absolute", left: "30%", top: "20%", width: "40%", height: "auto" }}
  />
);

// Beat 28 — cut to a tighter crop + GLOW OVERLAY (marked: "golden shimmer").
const Beat28_PunchInShimmer: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StaticFrame
        src={IMG.flourJarHero}
        crop={CROP.flourJarHero}
        style={{ position: "absolute", left: "38%", top: "26%", width: "24%", height: "auto" }}
      />
      <GlowOverlay frame={frame} cx="50%" cy="45%" color="255,214,110" baseRadius={320} intensity={0.8} />
    </AbsoluteFill>
  );
};

// Beat 29 — SCALE-JUMP / MATCH-CUT to we1-miracle-jar.png + ONE-SHOT
// particle/light burst ("light bloom fires once").
const Beat29_MiracleJarBloom: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StaticFrame src={IMG.miracleJar} transform="none" />
      <ParticleBurst frame={frame} cx="50%" cy="48%" color="255,226,140" peakRadius={620} burstFrames={20} />
    </AbsoluteFill>
  );
};

// Beat 30 — cut to a punched-in crop + GLOW OVERLAY (marked: "continuous
// glow pulse").
const Beat30_PunchInGlowPulse: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StaticFrame src={IMG.miracleJar} transform="scale(1.35) translate(0%, 4%)" />
      <GlowOverlay frame={frame} cx="50%" cy="48%" color="255,226,140" baseRadius={380} intensity={0.85} />
    </AbsoluteFill>
  );
};

// Beat 31 — cut to a different crop; "holds" — plain static, no effect
// (only beats explicitly marked GLOW OVERLAY get one).
const Beat31_WideHold: React.FC = () => (
  <StaticFrame src={IMG.miracleJar} transform="none" />
);

// Beat 32 — SCALE-JUMP CUT to we1-ghost-widows.png (single jar -> a row
// of figures), masked by a Whip-Flash (reinterpreting "fade transition
// begins" as the allowed transition-masking technique).
const GHOST_FILTER = "brightness(0.6) contrast(1.2)"; // source art renders too pale to read otherwise

const Beat32_GhostsWideWhip: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StaticFrame src={IMG.ghostWidows} transform="none" style={{ filter: GHOST_FILTER }} />
      <WhipFlashOut frame={frame} totalFrames={90} frames={6} />
    </AbsoluteFill>
  );
};

// Beat 33 — cut to a punch-in on the row + ONE-SHOT particle burst
// ("ghost figures fully materialize").
const Beat33_GhostsPunchInMaterialize: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StaticFrame src={IMG.ghostWidows} transform="scale(1.3) translate(0%, 4%)" style={{ filter: GHOST_FILTER }} />
      <ParticleBurst frame={frame} cx="50%" cy="50%" color="230,230,230" peakRadius={700} burstFrames={22} />
    </AbsoluteFill>
  );
};

// Beat 34 — HARD PULL-BACK to wide; "3.5 YEARS" text, PROGRESSIVE REVEAL.
const Beat34_WideYearsText: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StaticFrame src={IMG.ghostWidows} transform="none" style={{ filter: GHOST_FILTER }} />
      <RevealText text="3.5 Years" frame={frame} revealFrames={18} top="10%" fontSize={54} />
    </AbsoluteFill>
  );
};

// Beat 35 — HARD PUNCH-IN on one ghost figure; X mark, PROGRESSIVE REVEAL.
const Beat35_PunchInXMark: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StaticFrame src={IMG.ghostWidows} transform="scale(1.5) translate(18%, 6%)" style={{ filter: GHOST_FILTER }} />
      <DrawX frame={frame} from={10} to={40} top="52%" left="68%" />
    </AbsoluteFill>
  );
};

// Beat 36 — HARD PULL-BACK to wide; translucent echo of the gate scene
// appears behind the ghosts as a fixed static overlay (no fade-in).
const Beat36_WideWithEcho: React.FC = () => (
  <AbsoluteFill>
    <StaticFrame src={IMG.widowGateScene} transform="none" style={{ opacity: 0.3, filter: "blur(3px)" }} />
    <StaticFrame src={IMG.ghostWidows} transform="none" style={{ filter: GHOST_FILTER }} />
  </AbsoluteFill>
);

// Beat 37 — HARD PUNCH-IN; echo overlay cut away (hard cut to a
// different static state, not an animated fade).
const Beat37_PunchInEchoGone: React.FC = () => (
  <StaticFrame src={IMG.ghostWidows} transform="scale(1.3) translate(0%, 4%)" style={{ filter: GHOST_FILTER }} />
);

// Beat 38 — cut + ONE-SHOT particle burst ("edges begin dissolving"),
// then holds a fixed partially-dissolved static state.
const Beat38_DissolveBurst: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <StaticFrame
        src={IMG.ghostWidows}
        transform="none"
        style={{ filter: `${GHOST_FILTER} blur(5px)`, opacity: 0.5 }}
      />
      <ParticleBurst frame={frame} cx="50%" cy="50%" color="230,230,230" peakRadius={600} burstFrames={20} />
    </AbsoluteFill>
  );
};

// Beat 39 — cut to a further-dissolved fixed static state (dissolve
// continues), final beat before Act 4.
const Beat39_DissolveFurther: React.FC = () => (
  <StaticFrame
    src={IMG.ghostWidows}
    transform="scale(1.08) translate(0%, -3%)"
    style={{ filter: `${GHOST_FILTER} blur(11px)`, opacity: 0.18 }}
  />
);

export const Act3: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90} name="Beat 27 — Scale-jump, jar inset"><Beat27_JarInset /></Sequence>
      <Sequence from={90} durationInFrames={120} name="Beat 28 — Punch-in, GLOW OVERLAY (shimmer)"><Beat28_PunchInShimmer /></Sequence>
      <Sequence from={210} durationInFrames={120} name="Beat 29 — Match-cut, miracle jar + burst"><Beat29_MiracleJarBloom /></Sequence>
      <Sequence from={330} durationInFrames={150} name="Beat 30 — Punch-in, GLOW OVERLAY (pulse)"><Beat30_PunchInGlowPulse /></Sequence>
      <Sequence from={480} durationInFrames={150} name="Beat 31 — Wide, holds"><Beat31_WideHold /></Sequence>
      <Sequence from={630} durationInFrames={90} name="Beat 32 — Scale-jump, ghosts + whip"><Beat32_GhostsWideWhip /></Sequence>
      <Sequence from={720} durationInFrames={150} name="Beat 33 — Punch-in + materialize burst"><Beat33_GhostsPunchInMaterialize /></Sequence>
      <Sequence from={870} durationInFrames={90} name="Beat 34 — Pull-back, 3.5 YEARS text"><Beat34_WideYearsText /></Sequence>
      <Sequence from={960} durationInFrames={90} name="Beat 35 — Punch-in, X mark"><Beat35_PunchInXMark /></Sequence>
      <Sequence from={1050} durationInFrames={120} name="Beat 36 — Pull-back, gate echo appears"><Beat36_WideWithEcho /></Sequence>
      <Sequence from={1170} durationInFrames={120} name="Beat 37 — Punch-in, echo gone"><Beat37_PunchInEchoGone /></Sequence>
      <Sequence from={1290} durationInFrames={120} name="Beat 38 — Dissolve burst"><Beat38_DissolveBurst /></Sequence>
      <Sequence from={1410} durationInFrames={90} name="Beat 39 — Dissolve further"><Beat39_DissolveFurther /></Sequence>
    </AbsoluteFill>
  );
};
