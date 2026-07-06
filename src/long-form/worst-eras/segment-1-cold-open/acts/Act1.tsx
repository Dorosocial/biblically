import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { StaticFrame } from "../components/StaticFrame";
import { GlowOverlay, WhipFlashOut } from "../components/effects";
import { CROP } from "../content-bbox";
import { IMG } from "../constants";
import { FLOUR_JAR_COMPOSITE } from "../layout";

/**
 * Act 1 — frames 0-1080 (0:00-0:36).
 *
 * Every beat below is a static hold (StaticFrame, fixed transform, zero
 * per-frame animation). Cuts between beats are real Sequence boundaries —
 * no interpolation bridges them. Cut-type is noted per beat.
 */

// ---- Beats 1-4: we1-widow-gate-scene.png (0-210) -------------------------

const Beat1_TightAlone: React.FC = () => (
  // Opening shot: TIGHT on her, alone. (No prior beat to cut from.)
  <StaticFrame src={IMG.widowGateScene} transform="scale(2.0) translate(2%, -4%)" />
);

const Beat2_WidePullBack: React.FC = () => (
  // HARD PULL-BACK from beat 1's tight crop to the full establishing shot.
  <StaticFrame src={IMG.widowGateScene} transform="none" />
);

const Beat3And4_MacroHandsGlowThenJolt: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-90 (absolute 120-210)
  return (
    <AbsoluteFill>
      {/* HARD PUNCH-IN from beat 2's wide shot to a macro crop on her
          hands/the sticks. */}
      <StaticFrame src={IMG.widowGateScene} transform="scale(2.7) translate(4%, 20%)" />
      {/* Beat 3 (local 0-60): GLOW OVERLAY — explicitly marked, glow
          highlight on the sticks. */}
      <GlowOverlay frame={frame} cx="50%" cy="62%" color="255,238,190" baseRadius={230} intensity={1} />
      {/* Beat 4 (local 60-90): the "jolt" is reinterpreted as the
          Whip-Flash transition masking the hard cut to beat 5. */}
      <WhipFlashOut frame={frame} totalFrames={90} frames={6} />
    </AbsoluteFill>
  );
};

// ---- Beats 5-8: we1-elijah-widow-meeting.png (210-540) --------------------

const Beat5_WideTwoShot: React.FC = () => (
  // SCALE-JUMP CUT: macro hands -> wide two-shot establishing both figures.
  <StaticFrame src={IMG.elijahWidowMeeting} transform="none" />
);

const Beat6_PunchInWidowPlusIcon: React.FC = () => (
  <AbsoluteFill>
    {/* HARD PUNCH-IN on her (her "rising" is conveyed by the reframe
        itself, not by animating the pose). */}
    <StaticFrame src={IMG.elijahWidowMeeting} transform="scale(1.7) translate(-14%, 4%)" />
    {/* Water-vessel icon: instant scale-jump insert, no fade. */}
    <StaticFrame
      src={IMG.waterVesselIcon}
      crop={CROP.waterVesselIcon}
      style={{ position: "absolute", left: "74%", top: "54%", width: "10%", height: "auto" }}
    />
  </AbsoluteFill>
);

const Beat7_PunchInElijah: React.FC = () => (
  // HARD PUNCH-IN / MATCH-CUT onto Elijah's leaning/calling gesture —
  // reframed onto him rather than animated.
  <StaticFrame src={IMG.elijahWidowMeeting} transform="scale(1.9) translate(24%, 6%)" />
);

const Beat8_WideTwoShotPlusIcon: React.FC = () => (
  <AbsoluteFill>
    {/* HARD PULL-BACK back to the wide two-shot. */}
    <StaticFrame src={IMG.elijahWidowMeeting} transform="none" />
    {/* Bread icon: instant scale-jump insert. */}
    <StaticFrame
      src={IMG.breadIcon}
      crop={CROP.breadIcon}
      style={{ position: "absolute", left: "66%", top: "60%", width: "10%", height: "auto" }}
    />
  </AbsoluteFill>
);

// ---- Beats 9-10: we1-widow-response-scene.png (540-720) -------------------

const Beat9_TightResponse: React.FC = () => (
  // SCALE-JUMP CUT: new scene, punched in tight on her response.
  <StaticFrame src={IMG.widowResponseScene} transform="scale(1.6) translate(-16%, 6%)" />
);

const Beat10_WiderPlusNegation: React.FC = () => (
  <AbsoluteFill>
    {/* HARD PULL-BACK, alternating scale from beat 9. */}
    <StaticFrame src={IMG.widowResponseScene} transform="scale(1.1) translate(-6%, 0%)" />
    {/* Negation-hand icon: instant scale-jump insert. */}
    <StaticFrame
      src={IMG.negationHandIcon}
      crop={CROP.negationHandIcon}
      style={{ position: "absolute", left: "72%", top: "56%", width: "11%", height: "auto" }}
    />
  </AbsoluteFill>
);

// ---- Beats 11-14: flour-jar composite (720-1080) ---------------------------
// A single scene assembled via progressive HARD PUNCH-INs: each beat is a
// real cut to a tighter crop that reveals the next prop/icon. Every pair
// of consecutive beats differs in scale, satisfying the alternation rule
// even though the direction (tightening) is consistent.

// All composite elements live inside ONE transformed wrapper so a scale
// step moves and enlarges every element together, consistently. The
// transform-origin walks toward whichever prop is newest each beat (not
// a single fixed point), so each punch-in keeps that beat's new element
// in frame instead of flinging it out past the edge.
const CompositeBase: React.FC<{ scale: number; focus: string; children?: React.ReactNode }> = ({
  scale,
  focus,
  children,
}) => (
  <AbsoluteFill>
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `scale(${scale})`,
        transformOrigin: focus,
      }}
    >
      <StaticFrame
        src={IMG.flourJarHero}
        crop={CROP.flourJarHero}
        style={FLOUR_JAR_COMPOSITE.flourJar}
      />
      <StaticFrame
        src={IMG.widowSmall}
        crop={CROP.widowSmall}
        style={FLOUR_JAR_COMPOSITE.widowSmall}
      />
      {children}
    </div>
  </AbsoluteFill>
);

const Beat11_ScaleJumpToHeroJar: React.FC = () => (
  // SCALE-JUMP CUT: person-scale scene -> a large hero prop filling most
  // of the frame, with the widow rendered small beside it for contrast.
  <CompositeBase scale={1} focus="30% 45%" />
);

const Beat12_PunchInOilDrop: React.FC = () => (
  <CompositeBase scale={1.25} focus="32% 30%">
    <StaticFrame
      src={IMG.oilDropIcon}
      crop={CROP.oilDropIcon}
      style={FLOUR_JAR_COMPOSITE.oilDrop}
    />
  </CompositeBase>
);

const Beat13_PunchInSticksHome: React.FC = () => (
  <CompositeBase scale={1.08} focus="45% 35%">
    <StaticFrame
      src={IMG.oilDropIcon}
      crop={CROP.oilDropIcon}
      style={FLOUR_JAR_COMPOSITE.oilDrop}
    />
    <StaticFrame
      src={IMG.stickBundleIcon}
      crop={CROP.stickBundleIcon}
      style={FLOUR_JAR_COMPOSITE.stickBundle}
    />
    <StaticFrame
      src={IMG.homeIcon}
      crop={CROP.homeIcon}
      style={FLOUR_JAR_COMPOSITE.homeIcon}
    />
  </CompositeBase>
);

const Beat14_PunchInSonFigure: React.FC = () => (
  <CompositeBase scale={1.6} focus="58% 38%">
    <StaticFrame
      src={IMG.oilDropIcon}
      crop={CROP.oilDropIcon}
      style={FLOUR_JAR_COMPOSITE.oilDrop}
    />
    <StaticFrame
      src={IMG.stickBundleIcon}
      crop={CROP.stickBundleIcon}
      style={FLOUR_JAR_COMPOSITE.stickBundle}
    />
    <StaticFrame
      src={IMG.homeIcon}
      crop={CROP.homeIcon}
      style={FLOUR_JAR_COMPOSITE.homeIcon}
    />
    <StaticFrame
      src={IMG.sonFigure}
      crop={CROP.sonFigure}
      style={FLOUR_JAR_COMPOSITE.sonFigure}
    />
  </CompositeBase>
);

export const Act1: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={60} name="Beat 1 — Tight alone"><Beat1_TightAlone /></Sequence>
      <Sequence from={60} durationInFrames={60} name="Beat 2 — Hard pull-back, wide"><Beat2_WidePullBack /></Sequence>
      <Sequence from={120} durationInFrames={90} name="Beats 3-4 — Macro hands + GLOW OVERLAY, then whip-flash"><Beat3And4_MacroHandsGlowThenJolt /></Sequence>

      <Sequence from={210} durationInFrames={90} name="Beat 5 — Scale-jump to wide two-shot"><Beat5_WideTwoShot /></Sequence>
      <Sequence from={300} durationInFrames={90} name="Beat 6 — Punch-in on widow + water-vessel icon"><Beat6_PunchInWidowPlusIcon /></Sequence>
      <Sequence from={390} durationInFrames={90} name="Beat 7 — Punch-in on Elijah"><Beat7_PunchInElijah /></Sequence>
      <Sequence from={480} durationInFrames={60} name="Beat 8 — Pull-back wide + bread icon"><Beat8_WideTwoShotPlusIcon /></Sequence>

      <Sequence from={540} durationInFrames={90} name="Beat 9 — Scale-jump to tight response"><Beat9_TightResponse /></Sequence>
      <Sequence from={630} durationInFrames={90} name="Beat 10 — Pull-back + negation icon"><Beat10_WiderPlusNegation /></Sequence>

      <Sequence from={720} durationInFrames={60} name="Beat 11 — Scale-jump to hero jar"><Beat11_ScaleJumpToHeroJar /></Sequence>
      <Sequence from={780} durationInFrames={90} name="Beat 12 — Punch-in, oil drop"><Beat12_PunchInOilDrop /></Sequence>
      <Sequence from={870} durationInFrames={120} name="Beat 13 — Punch-in, sticks + home"><Beat13_PunchInSticksHome /></Sequence>
      <Sequence from={990} durationInFrames={90} name="Beat 14 — Punch-in, son figure"><Beat14_PunchInSonFigure /></Sequence>
    </AbsoluteFill>
  );
};
