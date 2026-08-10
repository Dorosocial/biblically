import React from 'react';
import * as THREE from 'three';
import {interpolate, Easing} from 'remotion';
import {Line} from '@react-three/drei';
import {CameraRig, CameraPose} from './three/CameraRig';
import {Lighting, FocusLight} from './three/Lighting';
import {Earth} from './three/Earth';
import {Spacecraft} from './three/Spacecraft';
import {ClockFace} from './three/ClockFace';
import {GearMechanism} from './three/GearMechanism';
import {SpacetimeGrid} from './three/SpacetimeGrid';
import {Humanoid} from './three/Humanoid';
import {BeatWithFrames, beatFrames, getBeatAtFrame} from './timing';
import {
  CLOCK_LEFT,
  CLOCK_RIGHT,
  EARTH_POS,
  SHIP_HOME,
  SHIP_TURNAROUND,
  journeyHeading,
  journeyPos,
  lerp3,
} from './world';

const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);
const easeIn = Easing.in(Easing.cubic);
// A very front-loaded curve for "snap" cuts: reaches ~90% of the way there
// almost immediately, then eases the last bit.
const snapEase = Easing.out(Easing.exp);

const posLerp = (a: [number, number, number], b: [number, number, number], t: number) =>
  lerp3(a, b, t);

const orbitPose = (
  center: [number, number, number],
  radius: number,
  height: number,
  angleFromDeg: number,
  angleToDeg: number,
  fov: number,
  t: number
): CameraPose => {
  const angle = THREE.MathUtils.degToRad(
    interpolate(t, [0, 1], [angleFromDeg, angleToDeg])
  );
  return {
    position: [
      center[0] + Math.cos(angle) * radius,
      center[1] + height,
      center[2] + Math.sin(angle) * radius,
    ],
    lookAt: center,
    fov,
  };
};

// The ticking hand angle accumulates independently per-clock so two clocks
// on screen together can visibly tick at different rates (per the brief).
const handAngle = (frame: number, speed: number) => frame * speed;

// ---------------------------------------------------------------------------
// Camera: one pose per frame, hand-authored per beat (see timing.ts BEATS
// for the shot-list language each case implements).
// ---------------------------------------------------------------------------
const getPose = (frame: number, beat: BeatWithFrames, t: number): CameraPose => {
  switch (beat.id) {
    case 0: {
      // Earth dominates frame, spacecraft launches. Fast pull-back reveal.
      const e = easeOut(t);
      return {
        position: posLerp([0, 1.5, 15], [0, 9, 40], e),
        lookAt: posLerp(EARTH_POS, lerp3(EARTH_POS, SHIP_HOME, 0.4), e),
        fov: interpolate(e, [0, 1], [48, 40]),
      };
    }
    case 1: {
      // "and come back" -- continue pulling back into a wide orbital shot.
      const e = easeOut(t);
      return {
        position: posLerp([0, 9, 40], [30, 26, 55], e),
        lookAt: posLerp(lerp3(EARTH_POS, SHIP_HOME, 0.4), [15, 6, 0], e),
        fov: interpolate(e, [0, 1], [40, 38]),
      };
    }
    case 2: {
      // Aggressive macro push-in on traveler's clock.
      const e = easeIn(t);
      return {
        position: posLerp([0, 0.2, 8], [0, 0.1, 3.2], e),
        lookAt: [0, 0, 0],
        fov: interpolate(e, [0, 1], [34, 24]),
      };
    }
    case 3: {
      // Hard cut: giant Earth clock fills screen, pull back to reveal planet.
      const e = easeOut(t);
      return {
        position: posLerp([0, 0, 10.6], [0, 3, 22], e),
        lookAt: posLerp([0, 0, 10], EARTH_POS, e),
        fov: interpolate(e, [0, 1], [30, 44]),
      };
    }
    case 4: {
      // KEY MOMENT 1 -- split-frame contradiction. Completely locked-off.
      return {position: [0, 0.3, 9], lookAt: [0, 0, 0], fov: 36};
    }
    case 5: {
      // Both clocks freeze, numbers float in darkness. Slow push.
      const e = easeInOut(t);
      return {
        position: posLerp([0, 0.3, 9], [0, 0.3, 6.5], e),
        lookAt: [0, 0, 0],
        fov: interpolate(e, [0, 1], [36, 30]),
      };
    }
    case 6: {
      // Camera slides between the two clocks -- parallax.
      const e = easeInOut(t);
      return {
        position: posLerp([-3, 0.3, 6.5], [3, 0.3, 6.5], e),
        lookAt: posLerp(CLOCK_LEFT, CLOCK_RIGHT, e),
        fov: 30,
      };
    }
    case 7: {
      // Dead still, dramatic pause.
      return {position: [0, 0.3, 7], lookAt: [0, 0, 0], fov: 32};
    }
    case 8: {
      // Clocks dissolve into the spacetime grid; camera dives through it.
      const e = easeIn(t);
      return {
        position: posLerp([0, 4, 10], [0, 1, -6], e),
        lookAt: posLerp([0, 0, 0], [0, 0, -30], e),
        fov: interpolate(e, [0, 1], [40, 60]),
      };
    }
    case 9: {
      // "Both clocks are right" -- slow 180 degree orbit.
      return orbitPose([0, 0.4, 0], 8, 1.5, 200, 20, 34, t);
    }
    case 10: {
      // Two clocks travel separate paths, diverging -- side tracking cam.
      const e = easeInOut(t);
      return {
        position: posLerp([-6, 2, 10], [10, 2, 14], e),
        lookAt: posLerp([-3, 0, 0], [8, 0, 0], e),
        fov: 36,
      };
    }
    case 11: {
      // Spacecraft accelerates -- chase camera behind it.
      const e = easeInOut(t);
      const shipT = interpolate(e, [0, 1], [0.15, 0.32]);
      const shipP = journeyPos(shipT);
      const heading = journeyHeading(shipT);
      const dir = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(...heading));
      const camPos = new THREE.Vector3(...shipP).addScaledVector(dir, -9).add(
        new THREE.Vector3(0, 2.5, 0)
      );
      return {position: [camPos.x, camPos.y, camPos.z], lookAt: shipP, fov: 42};
    }
    case 12: {
      // Alternating close-ups: traveler -> Earth -> traveler -> Earth.
      const seg = Math.min(3, Math.floor(t * 4));
      const target = seg % 2 === 0 ? CLOCK_LEFT : CLOCK_RIGHT;
      const camSide: [number, number, number] =
        seg % 2 === 0 ? [-2.4, 0.2, 3] : [2.4, 0.2, 3];
      return {position: camSide, lookAt: target, fov: 26};
    }
    case 13: {
      // Interior of spacecraft, traveler watches clock. Slow peaceful push.
      const e = easeInOut(t);
      return {
        position: posLerp([3, 1, 6], [1.2, 1, 3.2], e),
        lookAt: [0, 1, 0],
        fov: interpolate(e, [0, 1], [34, 28]),
      };
    }
    case 14: {
      // Locked macro shot -- clock counts naturally.
      return {position: [0, 0.2, 3.4], lookAt: [0, 0, 0], fov: 26};
    }
    case 15: {
      // Spacecraft reaches turnaround, rotates 180 -- camera rotates with it.
      const e = easeInOut(t);
      const shipT = interpolate(e, [0, 1], [0.48, 0.52]);
      const shipP = journeyPos(shipT);
      const angle = interpolate(e, [0, 1], [0, Math.PI]);
      const offset = new THREE.Vector3(Math.cos(angle), 0.3, Math.sin(angle)).multiplyScalar(7);
      const camPos = new THREE.Vector3(...shipP).add(offset);
      return {position: [camPos.x, camPos.y, camPos.z], lookAt: shipP, fov: 40};
    }
    case 16: {
      // Rapid pull toward Earth, then time-lapse orbit.
      if (t < 0.35) {
        const e = easeIn(t / 0.35);
        return {
          position: posLerp([0, 20, 60], [0, 6, 16], e),
          lookAt: EARTH_POS,
          fov: interpolate(e, [0, 1], [36, 44]),
        };
      }
      return orbitPose(EARTH_POS, 16, 6, 0, 170, 42, (t - 0.35) / 0.65);
    }
    case 17: {
      // KEY BEAT -- snap zoom into the 5/10 difference.
      const e = snapEase(t);
      return {
        position: posLerp([0, 0.3, 10], [0, 0.3, 4], e),
        lookAt: [0, 0, 0],
        fov: interpolate(e, [0, 1], [36, 22]),
      };
    }
    case 18: {
      // Traveler's POV -- Earth appears to move away.
      const shipT = interpolate(t, [0, 1], [0.3, 0.33]);
      const shipP = journeyPos(shipT);
      return {position: shipP, lookAt: EARTH_POS, fov: 46};
    }
    case 19: {
      // Slow camera drift backward with Earth, as if it's receding.
      const e = easeInOut(t);
      const shipT = interpolate(e, [0, 1], [0.33, 0.36]);
      const shipP = journeyPos(shipT);
      const camPos = lerp3(shipP, [shipP[0] + 10, shipP[1] + 3, shipP[2] + 6], e);
      return {position: camPos, lookAt: EARTH_POS, fov: interpolate(e, [0, 1], [46, 34])};
    }
    case 20: {
      // Both clocks side by side from traveler's frame -- orbit.
      return orbitPose([0, 0.3, 0], 6, 1, 300, 210, 32, t);
    }
    case 21: {
      // KEY BEAT -- "Yes." Everything freezes, giant YES. No movement.
      // SFX PLACEHOLDER: hard freeze hit / low sub-bass hit on "Yes."
      return {position: [0, 0.2, 6], lookAt: [0, 0, 0], fov: 30};
    }
    case 22: {
      // Spacecraft trajectory becomes a glowing line -- huge pull-back.
      const e = easeOut(t);
      return {
        position: posLerp([10, 6, 20], [60, 40, 90], e),
        lookAt: posLerp([10, 4, 0], [20, 8, -4], e),
        fov: interpolate(e, [0, 1], [40, 34]),
      };
    }
    case 23: {
      // Top-down 3D tracking shot of both paths.
      const e = easeInOut(t);
      return {
        position: posLerp([0, 50, 0], [20, 50, -5], e),
        lookAt: posLerp([0, 0, 0], [30, 0, -5], e),
        fov: 40,
      };
    }
    case 24: {
      // Camera rotates around spacecraft as it changes direction.
      const e = easeInOut(t);
      const angle = interpolate(e, [0, 1], [0, Math.PI * 0.9]);
      const offset = new THREE.Vector3(Math.cos(angle), 0.35, Math.sin(angle)).multiplyScalar(9);
      const camPos = new THREE.Vector3(...SHIP_TURNAROUND).add(offset);
      return {position: [camPos.x, camPos.y, camPos.z], lookAt: SHIP_TURNAROUND, fov: 40};
    }
    case 25: {
      // Front-facing spacecraft shot, then rapid push toward Earth.
      const e = easeIn(t);
      const shipT = interpolate(e, [0, 1], [0.55, 0.64]);
      const shipP = journeyPos(shipT);
      const camPos = lerp3(
        [shipP[0] + 8, shipP[1] + 1, shipP[2]],
        [shipP[0] - 2, shipP[1] - 1, shipP[2]],
        e
      );
      return {position: camPos, lookAt: EARTH_POS, fov: interpolate(e, [0, 1], [36, 46])};
    }
    case 26: {
      // Smooth dolly toward both -- traveler lands beside Earth.
      const e = easeInOut(t);
      return {
        position: posLerp([10, 8, 26], [6, 4, 14], e),
        lookAt: posLerp([2, 3, 0], [2, 2, 0], e),
        fov: interpolate(e, [0, 1], [40, 32]),
      };
    }
    case 27: {
      // Slow macro push-in on both clocks side by side.
      const e = easeInOut(t);
      return {
        position: posLerp([0, 0.3, 9], [0, 0.3, 5.5], e),
        lookAt: [0, 0, 0],
        fov: interpolate(e, [0, 1], [34, 28]),
      };
    }
    case 28: {
      // Macro orbit through the gear mechanism.
      return orbitPose([0, 0, 0], 3, 1, 0, 150, 30, t);
    }
    case 29: {
      // Pull back to reveal both clocks (mechanism -> clock pair).
      const e = easeOut(t);
      return {
        position: posLerp([0, 1, 3.4], [0, 0.5, 9], e),
        lookAt: [0, 0, 0],
        fov: interpolate(e, [0, 1], [34, 36]),
      };
    }
    case 30: {
      // KEY MOMENT 2 -- THE BIG REVEAL. Massive cinematic pull-back.
      const e = easeOut(t);
      return {
        position: posLerp([10, 8, 30], [70, 55, 140], e),
        lookAt: posLerp([6, 10, 0], [10, 18, 0], e),
        fov: interpolate(e, [0, 1], [42, 36]),
      };
    }
    case 31: {
      // Two silhouettes together on Earth, clocks at 0. Slow push.
      const e = easeInOut(t);
      return {
        position: posLerp([8, 7, 10], [5, 5, 6], e),
        lookAt: [4, 4.3, 1],
        fov: interpolate(e, [0, 1], [40, 32]),
      };
    }
    case 32: {
      // One stays, one launches -- camera rises vertically.
      const e = easeInOut(t);
      return {
        position: posLerp([5, 5, 6], [5, 20, 6], e),
        lookAt: posLerp([4, 4.3, 1], [10, 10, -2], e),
        fov: 36,
      };
    }
    case 33: {
      // Reunite -- circular orbit ending on the clocks.
      const pose = orbitPose([4, 4.3, 1], 7, 4, 0, 200, 34, t);
      pose.fov = interpolate(easeInOut(t), [0, 1], [34, 24]);
      return pose;
    }
    case 34: {
      // KEY MOMENT 3 -- LOOP. Match cut back to the opening frame's pose.
      const e = easeIn(t);
      return {
        position: posLerp([4, 5, 8], [0, 1.5, 15], e),
        lookAt: posLerp([4, 4.3, 1], EARTH_POS, e),
        fov: interpolate(e, [0, 1], [30, 48]),
      };
    }
    default:
      return {position: [0, 5, 20], lookAt: [0, 0, 0], fov: 40};
  }
};

const focusForBeat = (beat: BeatWithFrames): FocusLight | null => {
  switch (beat.id) {
    case 2:
    case 5:
    case 14:
    case 17:
    case 21:
    case 27:
      return {position: [1.5, 2, 3], kind: 'spot', color: '#bfe9ff', intensity: 6, angle: 0.5, penumbra: 0.7};
    case 4:
    case 6:
    case 7:
    case 9:
    case 20:
      return {position: [0, 4, 4], kind: 'point', color: '#8fd6ff', intensity: 4, distance: 20};
    case 0:
    case 1:
    case 16:
    case 22:
    case 30:
      return {position: [30, 30, 20], kind: 'point', color: '#ffe8bf', intensity: 8, distance: 140};
    case 28:
      return {position: [1, 2, 2], kind: 'spot', color: '#ffdca0', intensity: 5, angle: 0.6, penumbra: 0.5};
    default:
      return {position: [0, 6, 6], kind: 'point', color: '#bcd4ff', intensity: 3, distance: 30};
  }
};

// ---------------------------------------------------------------------------
// Scene content -- objects present per beat.
// ---------------------------------------------------------------------------
const SceneContent: React.FC<{frame: number; beat: BeatWithFrames; t: number}> = ({frame, beat, t}) => {
  const travelerHand = handAngle(frame, 0.2);
  const earthHand = handAngle(frame, 0.05);

  switch (beat.id) {
    case 0: {
      const shipT = interpolate(t, [0, 1], [0, 0.05]);
      const clocksVisible = t > 0.35 && t < 0.8;
      return (
        <>
          <Earth position={EARTH_POS} scale={1} />
          <Spacecraft position={journeyPos(shipT)} rotation={journeyHeading(shipT)} scale={0.5} engineGlow={0.6} />
          <ClockFace position={lerp3(SHIP_HOME, [SHIP_HOME[0] - 1.2, SHIP_HOME[1], SHIP_HOME[2]], 0)} scale={0.28} visible={clocksVisible} handAngle={travelerHand} glowColor="#7fe0ff" />
          <ClockFace position={[SHIP_HOME[0] + 1.2, SHIP_HOME[1], SHIP_HOME[2]]} scale={0.28} visible={clocksVisible} handAngle={earthHand} glowColor="#ffb27f" />
        </>
      );
    }
    case 1: {
      const shipT = interpolate(t, [0, 1], [0.05, 0.12]);
      return (
        <>
          <Earth position={EARTH_POS} />
          <Spacecraft position={journeyPos(shipT)} rotation={journeyHeading(shipT)} scale={0.6} engineGlow={0.7} />
        </>
      );
    }
    case 2: {
      const years = Math.round(interpolate(t, [0.15, 0.9], [0, 5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
      return <ClockFace position={[0, 0, 0]} handAngle={travelerHand * 6} glowColor="#7fe0ff" ringPulse={years >= 5 ? 1 : 0} />;
    }
    case 3: {
      return (
        <>
          <ClockFace position={[0, 0, 10]} scale={1.4} handAngle={earthHand * 4} glowColor="#ffb27f" />
          <Earth position={EARTH_POS} />
        </>
      );
    }
    case 4: {
      // SFX PLACEHOLDER: hard-freeze thud as the split frame locks in.
      return (
        <>
          <ClockFace position={CLOCK_LEFT} handAngle={0} glowColor="#7fe0ff" ringPulse={1} />
          <ClockFace position={CLOCK_RIGHT} handAngle={0} glowColor="#ffb27f" ringPulse={1} />
        </>
      );
    }
    case 5: {
      // SFX PLACEHOLDER: suspended-time drone swell under "So what's the problem?"
      return (
        <>
          <ClockFace position={CLOCK_LEFT} handAngle={0} glowColor="#7fe0ff" />
          <ClockFace position={CLOCK_RIGHT} handAngle={0} glowColor="#ffb27f" />
        </>
      );
    }
    case 6: {
      return (
        <>
          <ClockFace position={CLOCK_LEFT} handAngle={travelerHand * 0.3} glowColor="#7fe0ff" />
          <ClockFace position={CLOCK_RIGHT} handAngle={earthHand * 3} glowColor="#ffb27f" />
        </>
      );
    }
    case 7: {
      // SFX PLACEHOLDER: silence / tiny tape-stop on the freeze before the "?"
      return (
        <>
          <ClockFace position={CLOCK_LEFT} handAngle={0} glowColor="#7fe0ff" />
          <ClockFace position={CLOCK_RIGHT} handAngle={0} glowColor="#ffb27f" />
        </>
      );
    }
    case 8: {
      const gridOpacity = interpolate(t, [0, 1], [0, 0.7]);
      return (
        <>
          <SpacetimeGrid position={[0, -2, -20]} opacity={gridOpacity} warpA={[0, -12]} warpB={[8, -25]} />
          <Earth position={[0, -1, -32]} scale={0.25} />
          <Spacecraft position={[3, -1, -14]} scale={0.15} />
        </>
      );
    }
    case 9: {
      // SFX PLACEHOLDER: warm resolving chord on "both clocks are right".
      return (
        <>
          <ClockFace position={CLOCK_LEFT} handAngle={travelerHand} glowColor="#7fe0ff" ringPulse={1} />
          <ClockFace position={CLOCK_RIGHT} handAngle={earthHand} glowColor="#ffb27f" ringPulse={1} />
        </>
      );
    }
    case 10: {
      const travelerPos = lerp3([2, 0, 0], [14, 2, -4], t);
      return (
        <>
          <Earth position={[-6, -3, 0]} scale={0.35} />
          <ClockFace position={[-6, 0, 0]} handAngle={earthHand * 0.6} glowColor="#ffb27f" scale={0.7} />
          <ClockFace position={travelerPos} handAngle={travelerHand * 4} glowColor="#7fe0ff" scale={0.7} />
        </>
      );
    }
    case 11: {
      const shipT = interpolate(t, [0, 1], [0.15, 0.32]);
      return (
        <>
          <Spacecraft position={journeyPos(shipT)} rotation={journeyHeading(shipT)} scale={0.7} engineGlow={interpolate(t, [0, 1], [0.3, 1])} />
        </>
      );
    }
    case 12: {
      return (
        <>
          <ClockFace position={CLOCK_LEFT} handAngle={travelerHand * 0.4} glowColor="#7fe0ff" />
          <ClockFace position={CLOCK_RIGHT} handAngle={earthHand * 5} glowColor="#ffb27f" />
        </>
      );
    }
    case 13: {
      return (
        <>
          <Humanoid position={[-0.8, 0, 0]} color="#0c0e14" />
          <ClockFace position={[0.6, 1, -0.6]} scale={0.4} handAngle={travelerHand} glowColor="#7fe0ff" />
        </>
      );
    }
    case 14: {
      const years = Math.min(5, Math.floor(interpolate(t, [0, 1], [1, 5.99])));
      return <ClockFace position={[0, 0, 0]} handAngle={travelerHand * 2} glowColor="#7fe0ff" ringPulse={years >= 5 ? 0.6 : 0} />;
    }
    case 15: {
      const shipT = interpolate(t, [0, 1], [0.48, 0.52]);
      return <Spacecraft position={journeyPos(shipT)} rotation={journeyHeading(shipT)} scale={0.7} engineGlow={0.8} />;
    }
    case 16: {
      // Simple "time-lapse" visual cue: emissive city-light boost pulses to
      // suggest day/night cycling rapidly while the traveler stays unchanged.
      const cityBoost = (Math.sin(frame * 0.9) + 1) / 2;
      return <Earth position={EARTH_POS} cityLightsBoost={cityBoost} rotationY={frame * 0.05} />;
    }
    case 17: {
      return (
        <>
          <ClockFace position={CLOCK_LEFT} handAngle={0} glowColor="#7fe0ff" ringPulse={1} />
          <ClockFace position={CLOCK_RIGHT} handAngle={0} glowColor="#ffb27f" ringPulse={1} />
        </>
      );
    }
    case 18: {
      return <Earth position={EARTH_POS} scale={1} />;
    }
    case 19: {
      return <Earth position={EARTH_POS} scale={1} />;
    }
    case 20: {
      return (
        <>
          <ClockFace position={CLOCK_LEFT} handAngle={travelerHand * 0.3} glowColor="#7fe0ff" />
          <ClockFace position={CLOCK_RIGHT} handAngle={earthHand * 2} glowColor="#ffb27f" />
        </>
      );
    }
    case 21: {
      return (
        <>
          <ClockFace position={CLOCK_LEFT} handAngle={0} glowColor="#7fe0ff" />
          <ClockFace position={CLOCK_RIGHT} handAngle={0} glowColor="#ffb27f" />
        </>
      );
    }
    case 22: {
      const points = [];
      const n = 40;
      for (let i = 0; i <= n; i++) {
        points.push(journeyPos((i / n) * 0.5));
      }
      return (
        <>
          <SpacetimeGrid position={[20, -3, 0]} size={140} segments={40} opacity={0.35} warpA={[-20, 0]} warpB={[10, -10]} />
          <Earth position={EARTH_POS} />
          <Line points={points} color="#7fe0ff" lineWidth={3} transparent opacity={interpolate(t, [0, 1], [0, 0.9])} />
        </>
      );
    }
    case 23: {
      return (
        <>
          <SpacetimeGrid position={[15, -3, -5]} size={120} segments={36} opacity={0.3} warpA={[-15, -5]} warpB={[20, -5]} />
          <Earth position={EARTH_POS} scale={0.5} />
          <Spacecraft position={lerp3([10, 4, -6], [40, 12, -10], t)} scale={0.5} />
          {/* translucent divider plane showing the two are not co-located */}
          <mesh position={[20, 8, -5]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[30, 30]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={THREE.DoubleSide} />
          </mesh>
        </>
      );
    }
    case 24: {
      return <Spacecraft position={SHIP_TURNAROUND} rotation={[0, interpolate(t, [0, 1], [0, Math.PI]), 0]} scale={0.8} engineGlow={0.9} />;
    }
    case 25: {
      const shipT = interpolate(t, [0, 1], [0.55, 0.64]);
      return (
        <>
          <Earth position={EARTH_POS} />
          <Spacecraft position={journeyPos(shipT)} rotation={journeyHeading(shipT)} scale={0.6} engineGlow={1} />
        </>
      );
    }
    case 26: {
      const shipT = interpolate(t, [0, 1], [0.75, 0.98]);
      return (
        <>
          <Earth position={EARTH_POS} />
          <Spacecraft position={journeyPos(shipT)} rotation={journeyHeading(shipT)} scale={0.6} engineGlow={0.4} />
          <ClockFace position={[SHIP_HOME[0] - 1.2, SHIP_HOME[1], SHIP_HOME[2]]} scale={0.3} handAngle={travelerHand} glowColor="#7fe0ff" />
          <ClockFace position={[0, 6.6, 3]} scale={0.3} handAngle={earthHand} glowColor="#ffb27f" />
        </>
      );
    }
    case 27: {
      return (
        <>
          <ClockFace position={CLOCK_LEFT} handAngle={travelerHand} glowColor="#7fe0ff" ringPulse={1} />
          <ClockFace position={CLOCK_RIGHT} handAngle={earthHand} glowColor="#ffb27f" ringPulse={1} />
        </>
      );
    }
    case 28: {
      return <GearMechanism position={[0, 0, 0]} time={frame * 0.06} />;
    }
    case 29: {
      return (
        <>
          <GearMechanism position={[-1.6, -0.6, -1]} scale={0.35} time={frame * 0.06} />
          <GearMechanism position={[1.6, -0.6, -1]} scale={0.35} time={frame * 0.06} />
          <ClockFace position={CLOCK_LEFT} handAngle={travelerHand} glowColor="#7fe0ff" />
          <ClockFace position={CLOCK_RIGHT} handAngle={earthHand} glowColor="#ffb27f" />
        </>
      );
    }
    case 30: {
      // SFX PLACEHOLDER: the big cinematic swell/riser lands here, timed to
      // the pull-back finishing (~beat end, ~77s) -- this is THE reveal.
      const timeHeight = 26;
      const outX = 30;
      const turnFrac = 0.5;
      const earthLine: [number, number, number][] = [
        [0, 0, 0],
        [0, timeHeight, 0],
      ];
      const travelerLine: [number, number, number][] = [
        [0, 0, 0],
        [outX, timeHeight * turnFrac, -8],
        [0, timeHeight, 0],
      ];
      const reveal = interpolate(t, [0, 1], [0, 1]);
      return (
        <>
          <SpacetimeGrid position={[10, -0.5, -2]} size={160} segments={44} opacity={0.3} warpA={[-10, 2]} warpB={[20, -10]} />
          <Earth position={EARTH_POS} scale={0.8} />
          <Line points={earthLine} color="#ffb27f" lineWidth={4} transparent opacity={0.25 + reveal * 0.65} />
          <Line points={travelerLine} color="#7fe0ff" lineWidth={4} transparent opacity={0.25 + reveal * 0.65} />
          <ClockFace position={[0, timeHeight, 0]} scale={0.5} handAngle={0} glowColor="#ffffff" ringPulse={reveal} />
        </>
      );
    }
    case 31: {
      return (
        <>
          <Earth position={EARTH_POS} />
          <Humanoid position={[SHIP_HOME[0] - 0.5, SHIP_HOME[1], SHIP_HOME[2]]} color="#0c0e14" rimColor="#7fe0ff" />
          <Humanoid position={[SHIP_HOME[0] + 0.5, SHIP_HOME[1], SHIP_HOME[2]]} color="#141018" rimColor="#ffb27f" />
        </>
      );
    }
    case 32: {
      const travelerPos = lerp3(
        [SHIP_HOME[0] + 0.5, SHIP_HOME[1], SHIP_HOME[2]],
        [SHIP_HOME[0] + 8, SHIP_HOME[1] + 10, SHIP_HOME[2] - 4],
        t
      );
      return (
        <>
          <Earth position={EARTH_POS} />
          <Humanoid position={[SHIP_HOME[0] - 0.5, SHIP_HOME[1], SHIP_HOME[2]]} color="#0c0e14" rimColor="#7fe0ff" />
          <Spacecraft position={travelerPos} rotation={[0, 0, interpolate(t, [0, 1], [0, 0.6])]} scale={0.4} engineGlow={0.8} />
        </>
      );
    }
    case 33: {
      return (
        <>
          <Earth position={EARTH_POS} />
          <Humanoid position={[SHIP_HOME[0] - 0.5, SHIP_HOME[1], SHIP_HOME[2]]} color="#0c0e14" rimColor="#7fe0ff" />
          <Humanoid position={[SHIP_HOME[0] + 0.5, SHIP_HOME[1], SHIP_HOME[2]]} color="#141018" rimColor="#ffb27f" />
          <ClockFace position={[SHIP_HOME[0] - 1.6, SHIP_HOME[1] + 2, SHIP_HOME[2]]} scale={0.35} handAngle={travelerHand} glowColor="#7fe0ff" />
          <ClockFace position={[SHIP_HOME[0] + 1.6, SHIP_HOME[1] + 2, SHIP_HOME[2]]} scale={0.35} handAngle={earthHand} glowColor="#ffb27f" />
        </>
      );
    }
    case 34: {
      // LOOP -- snapping back to the frame-1 composition (Earth + launch
      // pose + both clocks at 0 YEARS) so playback restarts invisibly.
      const shipT = interpolate(t, [0, 1], [0.9, 0]);
      return (
        <>
          <Earth position={EARTH_POS} />
          <Spacecraft position={journeyPos(Math.max(0, shipT))} rotation={journeyHeading(Math.max(0, shipT))} scale={0.5} engineGlow={0.6} />
          <ClockFace position={[SHIP_HOME[0] - 1.2, SHIP_HOME[1], SHIP_HOME[2]]} scale={0.28} handAngle={0} glowColor="#7fe0ff" />
          <ClockFace position={[SHIP_HOME[0] + 1.2, SHIP_HOME[1], SHIP_HOME[2]]} scale={0.28} handAngle={0} glowColor="#ffb27f" />
        </>
      );
    }
    default:
      return null;
  }
};

export const Scene: React.FC<{frame: number}> = ({frame}) => {
  const beat = getBeatAtFrame(frame);
  const t = interpolate(frame, [beat.startFrame, beat.endFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pose = getPose(frame, beat, t);
  const focus = focusForBeat(beat);

  return (
    <>
      <CameraRig pose={pose} />
      <Lighting focus={focus} />
      <fog attach="fog" args={['#0a1020', 30, 260]} />
      <SceneContent frame={frame} beat={beat} t={t} />
    </>
  );
};

export {beatFrames};
