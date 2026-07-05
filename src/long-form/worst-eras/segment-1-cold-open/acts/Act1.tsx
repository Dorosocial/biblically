import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { AnimatedImage } from "../components/AnimatedImage";
import { GlowPulse } from "../components/effects";
import { CROP } from "../content-bbox";
import { IMG } from "../constants";
import { FLOUR_JAR_COMPOSITE } from "../layout";

/**
 * Act 1 — frames 0-1080 (0:00-0:36), local frame 0 == absolute frame 0.
 *
 * Beats 1-4:   we1-widow-gate-scene.png   (0-210)
 * Beats 5-8:   we1-elijah-widow-meeting.png (210-540)
 * Beats 9-10:  we1-widow-response-scene.png (540-720)
 * Beats 11-14: flour-jar composite (720-1080)
 */

const GateSceneBeats: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-210

  // Camera choreography: tight crop on her (beat1) -> zoom out to reveal
  // the gate (beat2) -> tighten on hands/sticks (beat3) -> jolt (beat4).
  const camScale = interpolate(
    frame,
    [0, 60, 120, 180, 195, 210],
    [1.5, 1.5, 1.0, 1.32, 1.32, 1.32],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const camY = interpolate(
    frame,
    [0, 60, 120, 180, 210],
    [30, 30, 0, -55, -55],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Beat 4 jolt: a quick shake + flicker right at the tail end.
  const inJolt = frame >= 180 && frame <= 210;
  const joltX = inJolt ? Math.sin(frame * 1.4) * 4.5 : 0;
  const joltFlicker = inJolt
    ? 1 - Math.max(0, 1 - Math.abs(frame - 196) / 5) * 0.22
    : 1;

  return (
    <AbsoluteFill>
      <AnimatedImage
        src={IMG.widowGateScene}
        name="gate-scene"
        durationInFrames={210}
        baseTransform={`translate(${joltX}px, ${camY}px) scale(${camScale})`}
        motion={{ scale: { amount: 0.012, speed: 0.05 }, drift: { ampX: 3, ampY: 2 } }}
        extraOpacity={joltFlicker}
      />
      {/* Beat 3: glow highlight on the sticks in her hands. */}
      <GlowPulse
        frame={frame}
        cx="46%"
        cy="66%"
        color="255,238,190"
        baseRadius={230}
        intensity={frame >= 120 && frame <= 180 ? 1 : 0.15}
        bloomAt={140}
        bloomWidth={22}
      />
    </AbsoluteFill>
  );
};

const ElijahMeetingBeats: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-330 (absolute 210-540)

  // Beat 6: she rises — a slow subtle upward framing shift.
  const riseY = interpolate(frame, [90, 180], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Idle "leaning/calling" sway across beats 6-8, layered on the whole shot.
  const leanRotate = Math.sin(frame * 0.018) * 1.1;

  return (
    <AbsoluteFill>
      <AnimatedImage
        src={IMG.elijahWidowMeeting}
        name="elijah-meeting"
        durationInFrames={330}
        baseTransform={`translate(0px, ${riseY}px) rotate(${leanRotate}deg)`}
        motion={{ scale: { amount: 0.014 }, drift: { ampX: 4, ampY: 2.5 } }}
      />

      {/* Beat 6: water vessel icon fades in near her hand, stays through
          the rest of the scene. */}
      <Sequence from={90} durationInFrames={330 - 90} name="water-vessel-icon">
        <AnimatedImage
          src={IMG.waterVesselIcon}
          name="water-vessel-icon"
          durationInFrames={330 - 90}
          fadeInFrames={20}
          crop={CROP.waterVesselIcon}
          motion={{ scale: { amount: 0.03, speed: 0.06 }, drift: { ampX: 2, ampY: 4 } }}
          style={{ position: "absolute", left: "76%", top: "56%", width: "9%", height: "auto" }}
        />
      </Sequence>

      {/* Beat 8: bread icon fades in, near her hand. */}
      <Sequence from={270} durationInFrames={330 - 270} name="bread-icon">
        <AnimatedImage
          src={IMG.breadIcon}
          name="bread-icon"
          durationInFrames={330 - 270}
          fadeInFrames={18}
          crop={CROP.breadIcon}
          motion={{ scale: { amount: 0.035, speed: 0.07 }, drift: { ampX: 2.5, ampY: 3 } }}
          style={{ position: "absolute", left: "68%", top: "62%", width: "9%", height: "auto" }}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

const WidowResponseBeats: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-180 (absolute 540-720)

  return (
    <AbsoluteFill>
      <AnimatedImage
        src={IMG.widowResponseScene}
        name="widow-response"
        durationInFrames={180}
        motion={{ scale: { amount: 0.015 }, drift: { ampX: 3.5, ampY: 2.5 }, rotate: { amount: 0.5 } }}
      />

      {/* Beat 10: negation-hand icon fades in — "there is nothing baked". */}
      <Sequence from={90} durationInFrames={90} name="negation-hand-icon">
        <AnimatedImage
          src={IMG.negationHandIcon}
          name="negation-hand-response"
          durationInFrames={90}
          fadeInFrames={20}
          crop={CROP.negationHandIcon}
          motion={{ scale: { amount: 0.03, speed: 0.06 } }}
          style={{ position: "absolute", left: "74%", top: "58%", width: "10%", height: "auto" }}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

const FlourJarComposite: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-360 (absolute 720-1080)

  // Beat 11: a one-time elastic "scale distortion" as the jar settles into
  // frame, then continuous breathing takes over.
  const settleIn = interpolate(frame, [0, 34, 50], [0.82, 1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AnimatedImage
        src={IMG.flourJarHero}
        name="flour-jar-hero"
        durationInFrames={360}
        fadeInFrames={16}
        crop={CROP.flourJarHero}
        baseTransform={`scale(${settleIn})`}
        motion={{ scale: { amount: 0.016 }, drift: { ampX: 2.5, ampY: 2 } }}
        style={FLOUR_JAR_COMPOSITE.flourJar}
      />
      <AnimatedImage
        src={IMG.widowSmall}
        name="widow-small"
        durationInFrames={360}
        fadeInFrames={22}
        crop={CROP.widowSmall}
        motion={{ scale: { amount: 0.015 }, drift: { ampX: 2, ampY: 2.5 } }}
        style={FLOUR_JAR_COMPOSITE.widowSmall}
      />

      {/* Beat 12: oil drop icon appears beside the jar. */}
      <Sequence from={60} durationInFrames={300} name="oil-drop-icon">
        <AnimatedImage
          src={IMG.oilDropIcon}
          name="oil-drop-icon"
          durationInFrames={300}
          fadeInFrames={18}
          crop={CROP.oilDropIcon}
          motion={{ scale: { amount: 0.04, speed: 0.07 }, drift: { ampY: 3 } }}
          style={FLOUR_JAR_COMPOSITE.oilDrop}
        />
      </Sequence>

      {/* Beat 13: stick bundle + home icon (destination) fade in. */}
      <Sequence from={150} durationInFrames={210} name="stick-bundle-icon">
        <AnimatedImage
          src={IMG.stickBundleIcon}
          name="stick-bundle-icon"
          durationInFrames={210}
          fadeInFrames={20}
          crop={CROP.stickBundleIcon}
          motion={{ scale: { amount: 0.03 }, drift: { ampX: 2 } }}
          style={FLOUR_JAR_COMPOSITE.stickBundle}
        />
      </Sequence>
      <Sequence from={150} durationInFrames={210} name="home-icon">
        <AnimatedImage
          src={IMG.homeIcon}
          name="home-icon"
          durationInFrames={210}
          fadeInFrames={20}
          crop={CROP.homeIcon}
          motion={{ scale: { amount: 0.03, speed: 0.05 }, rotate: { amount: 1.2 } }}
          style={FLOUR_JAR_COMPOSITE.homeIcon}
        />
      </Sequence>

      {/* Beat 14: son figure fades into the composite. */}
      <Sequence from={270} durationInFrames={90} name="son-figure-composite">
        <AnimatedImage
          src={IMG.sonFigure}
          name="son-figure-composite"
          durationInFrames={90}
          fadeInFrames={26}
          crop={CROP.sonFigure}
          motion={{ scale: { amount: 0.016 }, drift: { ampX: 2, ampY: 2 } }}
          style={FLOUR_JAR_COMPOSITE.sonFigure}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export const Act1: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={210} name="Beats 1-4: Gate scene">
        <GateSceneBeats />
      </Sequence>
      <Sequence from={210} durationInFrames={330} name="Beats 5-8: Elijah meeting">
        <ElijahMeetingBeats />
      </Sequence>
      <Sequence from={540} durationInFrames={180} name="Beats 9-10: Widow response">
        <WidowResponseBeats />
      </Sequence>
      <Sequence from={720} durationInFrames={360} name="Beats 11-14: Flour jar composite">
        <FlourJarComposite />
      </Sequence>
    </AbsoluteFill>
  );
};
