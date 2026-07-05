import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { AnimatedImage } from "../components/AnimatedImage";
import { CaptionText, GlowPulse, StrikeThrough } from "../components/effects";
import { CROP } from "../content-bbox";
import { IMG } from "../constants";

/**
 * Act 2 — absolute frames 1080-2040 (0:36-1:08), local frame 0 == 1080.
 *
 * Beats 15-24: we1-widow-alone-jar.png, dimming to near-black,
 *   with we1-son-figure.png joining her partway through (local 0-810).
 * Beats 25-26: we1-elijah-widow-meeting.png returns with "1 KINGS 17"
 *   citation text (local 810-960).
 */

const WidowAloneBeats: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-810

  const dim = interpolate(
    frame,
    [0, 120, 270, 360, 450, 510, 570, 660, 750, 810],
    [0, 0.16, 0.2, 0.24, 0.28, 0.33, 0.37, 0.55, 0.86, 0.93],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Beats 17-18: mostly-idle window — pose holds, only the continuous
  // motion keeps the frame alive (breathing handled by AnimatedImage).
  return (
    <AbsoluteFill>
      <AnimatedImage
        src={IMG.widowAloneJar}
        name="widow-alone-jar"
        durationInFrames={810}
        motion={{ scale: { amount: 0.013 }, drift: { ampX: 3, ampY: 2 } }}
      />

      {/* Beat 16: negation-hand icon reappears, gets struck through. */}
      <Sequence from={120} durationInFrames={240} name="negation-hand-icon-strike">
        <AnimatedImage
          src={IMG.negationHandIcon}
          name="negation-hand-alone"
          durationInFrames={240}
          fadeInFrames={16}
          fadeOutFrames={30}
          crop={CROP.negationHandIcon}
          motion={{ scale: { amount: 0.028, speed: 0.06 } }}
          style={{ position: "absolute", left: "60%", top: "58%", width: "10%", height: "auto" }}
        />
        <StrikeThroughOverlay />
      </Sequence>

      {/* Beats 19-20: two matching glow pulses ("the sad thing is..."),
          rendered above the dim overlay so they read as light breaking
          through the darkening frame. */}
      <GlowPulse
        frame={frame}
        cx="42%"
        cy="55%"
        color="255,244,210"
        baseRadius={360}
        intensity={0.25}
        bloomAt={400}
        bloomWidth={45}
      />
      <GlowPulse
        frame={frame}
        cx="42%"
        cy="55%"
        color="255,244,210"
        baseRadius={360}
        intensity={0.25}
        bloomAt={480}
        bloomWidth={40}
      />

      {/* Beat 22: son figure appears beside her. */}
      <Sequence from={570} durationInFrames={240} name="son-figure-alone-scene">
        <AnimatedImage
          src={IMG.sonFigure}
          name="son-figure-alone-scene"
          durationInFrames={240}
          fadeInFrames={30}
          crop={CROP.sonFigure}
          motion={{ scale: { amount: 0.016 }, drift: { ampX: 2.5, ampY: 2 } }}
          style={{ position: "absolute", left: "62%", top: "30%", width: "17%", height: "auto" }}
        />
      </Sequence>

      {/* Dim overlay — beats 15, 23-24 (slow dim -> near-black hold). */}
      <AbsoluteFill style={{ backgroundColor: "#000000", opacity: dim, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

const StrikeThroughOverlay: React.FC = () => {
  const frame = useCurrentFrame(); // local to the negation-hand Sequence, 0-240
  return (
    <StrikeThrough
      frame={frame}
      from={30}
      to={90}
      top="63%"
      left="58%"
      width={220}
    />
  );
};

const ElijahReturnBeats: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-150 (absolute 1890-2040)

  // Coming out of the near-black hold, resolve up from black rather than
  // smash-cutting to full brightness.
  const risingFromBlack = interpolate(frame, [0, 24], [0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimatedImage
        src={IMG.elijahWidowMeeting}
        name="elijah-return"
        durationInFrames={150}
        motion={{ scale: { amount: 0.012 }, drift: { ampX: 3, ampY: 2 } }}
      />
      <AbsoluteFill style={{ backgroundColor: "#000000", opacity: risingFromBlack, pointerEvents: "none" }} />
      <CaptionText text="1 Kings 17" frame={frame} fadeInFrames={70} />
      {/* Beat 26: citation "completes" — a thin underline draws in. */}
      <StrikeThrough
        frame={frame}
        from={90}
        to={150}
        top="92%"
        left="44%"
        width={260}
        angle={0}
        color="rgba(25,25,25,0.55)"
      />
    </AbsoluteFill>
  );
};

export const Act2: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={810} name="Beats 15-24: Widow alone, dimming">
        <WidowAloneBeats />
      </Sequence>
      <Sequence from={810} durationInFrames={150} name="Beats 25-26: Elijah returns, 1 Kings 17">
        <ElijahReturnBeats />
      </Sequence>
    </AbsoluteFill>
  );
};
