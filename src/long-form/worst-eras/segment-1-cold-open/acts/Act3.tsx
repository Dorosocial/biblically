import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { AnimatedImage } from "../components/AnimatedImage";
import { CaptionText, GlowPulse, XMark } from "../components/effects";
import { CROP } from "../content-bbox";
import { IMG } from "../constants";

/**
 * Act 3 — absolute frames 2040-3540 (1:08-1:58), local frame 0 == 2040.
 *
 * Beats 27-28: flour-jar inset + golden shimmer  (local 0-210)
 * Beats 29-31: we1-miracle-jar.png, bloom + glow  (local 210-630)
 * Beats 32-39: we1-ghost-widows.png, materialize, "3.5 YEARS",
 *              X mark, gate-scene echo, dissolve   (local 630-1500)
 */

const FlourJarInsetBeats: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-210

  return (
    <AbsoluteFill>
      <AnimatedImage
        src={IMG.flourJarHero}
        name="flour-jar-inset"
        durationInFrames={210}
        fadeInFrames={20}
        crop={CROP.flourJarHero}
        motion={{ scale: { amount: 0.02 }, drift: { ampX: 2.5, ampY: 2 } }}
        style={{ position: "absolute", left: "34%", top: "24%", width: "32%", height: "auto" }}
      />
      {/* Beat 28: golden shimmer/glow begins on the jar inset. */}
      <GlowPulse
        frame={frame}
        cx="50%"
        cy="45%"
        color="255,214,110"
        baseRadius={300}
        intensity={interpolate(frame, [90, 210], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
    </AbsoluteFill>
  );
};

const MiracleJarBeats: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-420 (beats 29-31)

  return (
    <AbsoluteFill>
      <AnimatedImage
        src={IMG.miracleJar}
        name="miracle-jar"
        durationInFrames={420}
        motion={{ scale: { amount: 0.02, speed: 0.05 }, drift: { ampX: 2.5, ampY: 3 } }}
      />
      {/* Beat 29: one-time light bloom. Beats 30-31: sustained pulse + hold. */}
      <GlowPulse
        frame={frame}
        cx="50%"
        cy="48%"
        color="255,226,140"
        baseRadius={420}
        intensity={0.75}
        bloomAt={30}
        bloomWidth={26}
      />
    </AbsoluteFill>
  );
};

const GhostWidowsBeats: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-870 (beats 32-39)

  // Beat 32-33: fade transition in -> fully materialized.
  const materialize = interpolate(frame, [0, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Beats 38-39: dissolve — blur + fade + slight upward drift.
  const dissolveProgress = interpolate(frame, [660, 870], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dissolveOpacity = 1 - dissolveProgress * 0.95;
  const dissolveBlur = dissolveProgress * 16;
  const dissolveLift = -dissolveProgress * 40;

  return (
    <AbsoluteFill>
      <AnimatedImage
        src={IMG.ghostWidows}
        name="ghost-widows"
        durationInFrames={870}
        baseTransform={`translateY(${dissolveLift}px)`}
        motion={{ scale: { amount: 0.02 }, drift: { ampX: 3, ampY: 2.5 }, opacity: { amount: 0.04 } }}
        extraOpacity={materialize * dissolveOpacity}
        style={{
          // The source art renders these figures very pale (near-white) to
          // read as ghostly, but that leaves them almost invisible against
          // the plain white background plate — darken just enough to stay
          // legible while still reading lighter than the solid-black cast.
          filter: `brightness(0.6) contrast(1.2) blur(${dissolveBlur}px)`,
        }}
      />

      {/* Beat 34: "3.5 YEARS" text. */}
      <Sequence from={240} durationInFrames={630} name="3.5-years-text">
        <CaptionText text="3.5 Years" frame={frame - 240} fadeInFrames={50} top="10%" fontSize={54} />
      </Sequence>

      {/* Beat 35: X mark near one ghost figure, signaling "never met Elijah". */}
      <XMark frame={frame} from={330} to={390} top="52%" left="68%" />

      {/* Beat 36-37: translucent echo of the gate scene behind the ghosts. */}
      <Sequence from={420} durationInFrames={240} name="gate-scene-echo">
        <GateSceneEcho />
      </Sequence>
    </AbsoluteFill>
  );
};

const GateSceneEcho: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-240
  const echo = interpolate(frame, [0, 60, 180, 240], [0, 0.32, 0.32, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AnimatedImage
      src={IMG.widowGateScene}
      name="gate-scene-echo"
      durationInFrames={240}
      extraOpacity={echo}
      motion={{ scale: { amount: 0.01 }, drift: { ampX: 2, ampY: 1.5 } }}
      style={{ filter: "blur(3px)" }}
    />
  );
};

export const Act3: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={210} name="Beats 27-28: Flour jar inset + shimmer">
        <FlourJarInsetBeats />
      </Sequence>
      <Sequence from={210} durationInFrames={420} name="Beats 29-31: Miracle jar bloom">
        <MiracleJarBeats />
      </Sequence>
      <Sequence from={630} durationInFrames={870} name="Beats 32-39: Ghost widows">
        <GhostWidowsBeats />
      </Sequence>
    </AbsoluteFill>
  );
};
