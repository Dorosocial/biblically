import React, {useMemo} from 'react';
import * as THREE from 'three';
import {BEATS, VIEWER_EYES_WINDOWS} from '../timing';
import {CameraRig} from './CameraRig';
import {EyeMark} from './EyeMark';
import {ParticleField} from './ParticleField';
import {NeuralPathway} from './NeuralPathway';
import {BrainShape} from './BrainShape';
import {RoomEnvironment} from './RoomEnvironment';
import {ColorOrbs, RainbowGradientPlane} from './ColorField';
import {KeyTransitionSequence} from './KeyTransitionSequence';
import {CYCLE_PALETTE, FLOOD_PALETTE, RAINBOW_STOPS} from './lib/palette';
import {beatProgress, linearProgress, clamp01, stepPalette, hashRandom, lerpColor} from './lib/utils';

interface SceneProps {
  seconds: number;
}

/** Triangular rise/fall envelope: 0 -> 1 across [start,rise], holds, 1 -> 0 across [fall,end]. */
const riseFall = (seconds: number, start: number, rise: number, fall: number, end: number): number => {
  if (seconds <= start || seconds >= end) return 0;
  if (seconds < rise) return linearProgress(seconds, start, rise);
  if (seconds < fall) return 1;
  return 1 - linearProgress(seconds, fall, end);
};

const viewerEyesOpacity = (seconds: number): number => {
  for (const w of VIEWER_EYES_WINDOWS) {
    if (seconds < w.start || seconds > w.end + w.fadeOut) continue;
    const riseEnd = w.start + w.fadeIn;
    if (seconds < riseEnd) return clamp01((seconds - w.start) / Math.max(w.fadeIn, 0.001));
    if (seconds > w.end) {
      return w.fadeOut > 0 ? clamp01(1 - (seconds - w.end) / w.fadeOut) : 0;
    }
    return 1;
  }
  return 0;
};

const computeBackground = (seconds: number): string => {
  const {blackMoment, colorCycle1, colorBurst2, drain, flythrough} = BEATS;

  if (seconds >= blackMoment.start && seconds <= blackMoment.end) {
    return '#161616';
  }

  if (seconds >= colorCycle1.start && seconds <= colorCycle1.end) {
    const t = linearProgress(seconds, colorCycle1.start, colorCycle1.end);
    return stepPalette(CYCLE_PALETTE, t);
  }

  if (seconds >= colorBurst2.start && seconds <= colorBurst2.end) {
    // A quick near-white flash kicks the explosion off, then the backdrop
    // settles to a dark neutral — a single flat hue here would wash out the
    // many distinct orb colors that are supposed to carry the "explosion".
    const flash = 1 - linearProgress(seconds, colorBurst2.start, colorBurst2.start + 0.12);
    return lerpColor('#0a0a10', '#ffffff', flash * 0.7).getStyle();
  }

  if (seconds > colorBurst2.end && seconds <= drain.end) {
    const t = linearProgress(seconds, colorBurst2.end, drain.start + (drain.end - drain.start) * 0.35);
    return lerpColor('#0a0a10', '#000000', t).getStyle();
  }

  if (seconds >= flythrough.start && seconds <= flythrough.end) {
    const t = linearProgress(seconds, flythrough.start, flythrough.end);
    const hue = stepPalette(FLOOD_PALETTE, (t * 3) % 1);
    return lerpColor('#000000', hue, 0.3).getStyle();
  }

  return '#000000';
};

export const Scene: React.FC<SceneProps> = ({seconds}) => {
  const bg = computeBackground(seconds);
  const inColorBurst =
    (seconds >= BEATS.colorCycle1.start && seconds <= BEATS.colorCycle1.end) ||
    (seconds >= BEATS.colorBurst2.start && seconds <= BEATS.colorBurst2.end + 0.4) ||
    (seconds >= BEATS.rainbow.start && seconds <= BEATS.flythrough.end);

  // -- ROOM lights (lamp/screen/window each rise then fall within their own sub-window) --
  const lampGlow = riseFall(
    seconds,
    BEATS.lights.lamp.start,
    BEATS.lights.lamp.start + 0.35,
    BEATS.lights.lamp.end - 0.35,
    BEATS.lights.lamp.end,
  );
  const screenGlow = riseFall(
    seconds,
    BEATS.lights.screen.start,
    BEATS.lights.screen.start + 0.3,
    BEATS.lights.screen.end - 0.3,
    BEATS.lights.screen.end,
  );
  const windowGlow =
    seconds >= BEATS.lights.window.start && seconds <= BEATS.lights.window.end
      ? 1 - linearProgress(seconds, BEATS.lights.window.start, BEATS.lights.window.end)
      : 0;
  const roomOpacity = clamp01(
    beatProgress(seconds, BEATS.hardCutToRoom.end, BEATS.roomReveal.end) -
      linearProgress(seconds, BEATS.wallsDissolve.start, BEATS.wallsDissolve.end),
  );
  const showRoom =
    seconds >= BEATS.hardCutToRoom.end && seconds <= BEATS.wallsDissolve.end;

  // -- Photon approach (abstract eyes + particles) --
  const photonApproachT = beatProgress(seconds, BEATS.photonApproach.start, BEATS.photonApproach.end);
  const showPhotonApproach = seconds >= BEATS.photonApproach.start && seconds <= BEATS.photonApproach.end;

  // -- Neural pathway (darkness beat) --
  const neuralT = beatProgress(seconds, BEATS.neuralPathway.start, BEATS.neuralPathway.end);
  const showNeuralPathway1 = seconds >= BEATS.neuralPathway.start && seconds <= BEATS.neuralPathway.end;

  // -- Walls dissolve --
  const wallsDissolveT = linearProgress(seconds, BEATS.wallsDissolve.walls.start, BEATS.wallsDissolve.end);
  const showDissolve = seconds >= BEATS.wallsDissolve.walls.start && seconds <= BEATS.wallsDissolve.end + 0.6;

  // -- Beam zoom --
  const showBeam = seconds >= BEATS.beamZoom.start && seconds <= BEATS.beamZoom.end;
  const beamT = beatProgress(seconds, BEATS.beamZoom.start, BEATS.beamZoom.end);

  // -- Waves (photon wavelengths) --
  const showWaves = seconds >= BEATS.waves.start && seconds <= BEATS.waves.end;
  const wavesT = beatProgress(seconds, BEATS.waves.start, BEATS.waves.end);

  // -- Photon -> retina -> brain signal -> color burst 2 --
  const showPupilPhoton = seconds >= BEATS.photonToRetina.start && seconds <= BEATS.photonToRetina.end;
  const pupilT = beatProgress(seconds, BEATS.photonToRetina.start, BEATS.photonToRetina.end);
  // Neural pathway / brain hand off to the color orbs right as the burst begins,
  // so the flood of color reads clearly instead of fighting a close-up silhouette.
  const showBrainSignal = seconds >= BEATS.brainSignal.start && seconds <= BEATS.colorBurst2.start;
  const brainSignalReveal = beatProgress(seconds, BEATS.brainSignal.start, BEATS.brainSignal.end);
  const showColorBurst2 = seconds >= BEATS.colorBurst2.start && seconds <= BEATS.colorBurst2.end + 0.3;
  const colorBurst2T = beatProgress(seconds, BEATS.colorBurst2.start, BEATS.colorBurst2.end);

  // -- Drain / no-signal eye --
  const showDrain = seconds >= BEATS.drain.start && seconds <= BEATS.drain.end;
  const drainT = beatProgress(seconds, BEATS.drain.start, BEATS.drain.end);
  const showEyeAlone = seconds >= BEATS.eyeOrbitNoSignal.start && seconds <= BEATS.eyeOrbitNoSignal.end;

  // -- Four-stage diagram marks --
  const showFourStage = seconds >= BEATS.fourStage.start && seconds <= BEATS.fourStage.end;
  const fourStageReveal = linearProgress(seconds, BEATS.fourStage.start, BEATS.fourStage.end);

  // -- Key transition --
  const showKeyTransition = seconds >= BEATS.keyTransition.start && seconds <= BEATS.keyTransition.end;

  // -- Rainbow spectrum --
  const showRainbow = seconds >= BEATS.rainbow.start && seconds <= BEATS.rainbow.end;
  const rainbowOpacity =
    beatProgress(seconds, BEATS.rainbow.start, BEATS.rainbow.start + 0.4) *
    (1 - beatProgress(seconds, BEATS.rainbow.end - 0.4, BEATS.rainbow.end));

  // -- Flythrough --
  const showFlythrough = seconds >= BEATS.flythrough.start && seconds <= BEATS.flythrough.end;
  const flythroughT = beatProgress(seconds, BEATS.flythrough.start, BEATS.flythrough.end);

  // -- Photon alone / photon gone --
  const showPhotonAlone = seconds >= BEATS.photonAlone.start && seconds <= BEATS.photonAlone.end;
  const photonAloneT = beatProgress(seconds, BEATS.photonAlone.start, BEATS.photonAlone.end);

  const eyesOpacity = viewerEyesOpacity(seconds);

  return (
    <>
      <color attach="background" args={[bg]} />
      {/* Minimal restrained lighting: a hair of ambient so glow elements read, brighter only during color bursts. */}
      <ambientLight intensity={inColorBurst ? 0.35 : 0.03} />

      <CameraRig seconds={seconds} />

      {/* THE RECURRING EYES — appear at exactly four moments, plus the final loop hint.
          Deliberately near-invisible: the viewer may not consciously register them. */}
      <EyeMark opacity={eyesOpacity} seconds={seconds} radius={0.32} rimStrength={0.09} />

      {/* ROOM: dark POV room with lamp / screen / window. */}
      {showRoom && (
        <RoomEnvironment
          roomOpacity={roomOpacity}
          lampGlow={lampGlow}
          screenGlow={screenGlow}
          windowGlow={windowGlow}
        />
      )}

      {/* Dissolve particles: walls/objects breaking apart into drifting points. */}
      {showDissolve && (
        <ParticleField
          count={260}
          seconds={seconds}
          size={0.02}
          opacity={clamp01(wallsDissolveT) * (1 - clamp01(linearProgress(seconds, BEATS.wallsDissolve.end, BEATS.wallsDissolve.end + 0.6)))}
          color="#4a4a4a"
          additive={false}
          getPosition={(i) => {
            const edgeT = hashRandom(i * 1.7);
            const baseX = (hashRandom(i * 2.3) - 0.5) * 6;
            const baseY = (hashRandom(i * 3.1) - 0.5) * 4;
            const baseZ = -edgeT * 10;
            const disperse = wallsDissolveT * (2 + hashRandom(i * 4.9) * 3);
            const dx = (hashRandom(i * 5.7) - 0.5) * disperse;
            const dy = (hashRandom(i * 6.3) - 0.5) * disperse;
            const dz = (hashRandom(i * 7.9) - 0.5) * disperse;
            return [baseX + dx, baseY + dy, baseZ + dz];
          }}
        />
      )}

      {/* Photon particles approaching the eyes, then stopping. */}
      {showPhotonApproach && (
        <>
          <EyeMark opacity={1} seconds={seconds} radius={0.36} rimStrength={0.4} />
          <ParticleField
            count={70}
            seconds={seconds}
            size={0.03}
            opacity={0.8 * (1 - clamp01((photonApproachT - 0.85) / 0.15))}
            color="#c9d6ff"
            getPosition={(i) => {
              const approach = Math.min(photonApproachT * 1.15, 1);
              const startZ = 6 + hashRandom(i * 3.3) * 4;
              const targetZ = 0.9;
              const z = startZ + (targetZ - startZ) * approach;
              const spreadFall = 1 - approach * 0.9;
              const x = (hashRandom(i * 1.9) - 0.5) * 1.4 * spreadFall;
              const y = (hashRandom(i * 2.7) - 0.5) * 1.0 * spreadFall;
              return [x, y, z];
            }}
          />
        </>
      )}

      {/* Neural pathway lighting up from eye to brain, in the darkness beat. */}
      {showNeuralPathway1 && (
        <>
          <EyeMark opacity={1} seconds={seconds} radius={0.36} rimStrength={0.4} />
          <NeuralPathway from={[0, 0, 0]} to={[0, 1.1, -1.8]} reveal={neuralT} pulseT={neuralT} opacity={1} />
          <BrainShape position={[0, 1.1, -1.8]} opacity={clamp01((neuralT - 0.6) / 0.4)} scale={0.7} />
        </>
      )}

      {/* COLOR MOMENT 1: empty space cycling through black/gray/full saturated spectrum. */}
      {seconds >= BEATS.colorCycle1.start && seconds <= BEATS.colorCycle1.end && (
        <ColorOrbs
          seconds={seconds}
          count={26}
          palette={CYCLE_PALETTE.filter((c) => c !== '#000000' && c !== '#050505')}
          opacity={0.85}
          spread={2.6}
          seedOffset={11}
        />
      )}

      {/* "Here's the catch" — scene collapses into a single beam of light entering the eye.
          (A flash/glow reads better than a coaxial cylinder, which foreshortens to
          nothing when the camera zooms straight down its length.) */}
      {showBeam && (
        <>
          <EyeMark opacity={1} seconds={seconds} radius={0.3} rimStrength={0.5} />
          <mesh position={[0, 0, 0.05]}>
            <circleGeometry args={[0.05 + beamT * 0.5, 24]} />
            <meshBasicMaterial color="#eef3ff" transparent opacity={0.5 * (1 - beamT * 0.4)} />
          </mesh>
          <pointLight color="#eef3ff" intensity={beamT * 1.4} distance={3} />
        </>
      )}

      {/* Photon wavelengths as light waves moving toward the eye. */}
      {showWaves && (
        <>
          <EyeMark opacity={1} seconds={seconds} radius={0.3} rimStrength={0.45} center={[-1.2, 0, 0]} />
          <WaveLine progress={wavesT} seconds={seconds} />
        </>
      )}

      {/* Photon enters eye, follows through the pupil. */}
      {showPupilPhoton && (
        <>
          <EyeMark opacity={1} seconds={seconds} radius={0.28} rimStrength={0.5} />
          <mesh
            position={[
              (1 - pupilT) * 1.1,
              0,
              0.5 - pupilT * 0.5,
            ]}
          >
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshBasicMaterial color="#eef3ff" transparent opacity={0.95} />
          </mesh>
        </>
      )}

      {/* Retina activates -> neural signal -> COLOR MOMENT 2: the world floods with color. */}
      {showBrainSignal && (
        <>
          <NeuralPathway
            from={[0, 0, 0]}
            to={[0, 1.4, -3.2]}
            reveal={brainSignalReveal}
            pulseT={brainSignalReveal}
            opacity={1}
            color="#ffd9a0"
          />
          <BrainShape position={[0, 1.4, -3.2]} opacity={clamp01(brainSignalReveal)} />
        </>
      )}
      {showColorBurst2 && (
        <ColorOrbs
          seconds={seconds}
          count={90}
          palette={FLOOD_PALETTE}
          opacity={clamp01(colorBurst2T) * 0.95}
          spread={3.2}
          seedOffset={41}
          baseSize={0.09}
          drift={0.35}
        />
      )}

      {/* Photons vanish, color drains back to black. */}
      {showDrain && (
        <ParticleField
          count={50}
          seconds={seconds}
          size={0.03}
          opacity={0.7 * (1 - clamp01(drainT))}
          color="#c9d6ff"
          getPosition={(i) => {
            const spread = 0.4 + drainT * 5;
            const x = (hashRandom(i * 1.3) - 0.5) * spread;
            const y = (hashRandom(i * 2.1) - 0.5) * spread;
            const z = (hashRandom(i * 3.7) - 0.5) * spread;
            return [x, y, z];
          }}
        />
      )}
      {showEyeAlone && <EyeMark opacity={1} seconds={seconds} radius={0.3} rimStrength={0.4} />}

      {/* four-stage diagram: NO LIGHT -> EYE -> BRAIN -> BLACK EXPERIENCE, small marks the camera pans across. */}
      {showFourStage && (
        <group>
          <mesh position={[-2.4, 0, 0]} visible={fourStageReveal > 0}>
            <ringGeometry args={[0.14, 0.15, 32]} />
            <meshBasicMaterial color="#5a6472" transparent opacity={0.5} />
          </mesh>
          {/* single node icon (not the dual-lens motif, which reads as two
              separate shapes at this small diagram scale) */}
          <mesh position={[-0.8, 0, 0]} visible={fourStageReveal > 0.22}>
            <ringGeometry args={[0.14, 0.15, 32]} />
            <meshBasicMaterial
              color="#dfe6ee"
              transparent
              opacity={clamp01((fourStageReveal - 0.22) / 0.15) * 0.6}
            />
          </mesh>
          <mesh position={[-0.8, 0, 0.01]} visible={fourStageReveal > 0.22}>
            <circleGeometry args={[0.05, 20]} />
            <meshBasicMaterial
              color="#020202"
              transparent
              opacity={clamp01((fourStageReveal - 0.22) / 0.15)}
            />
          </mesh>
          <BrainShape
            position={[0.8, 0, 0]}
            scale={0.55}
            opacity={clamp01((fourStageReveal - 0.55) / 0.15)}
          />
          <mesh position={[2.4, 0, 0]} visible={fourStageReveal > 0.78}>
            <circleGeometry args={[0.16, 32]} />
            <meshBasicMaterial
              color="#050505"
              transparent
              opacity={clamp01((fourStageReveal - 0.78) / 0.2)}
            />
            <mesh>
              <ringGeometry args={[0.16, 0.163, 32]} />
              <meshBasicMaterial color="#8a95a3" transparent opacity={0.35} />
            </mesh>
          </mesh>
        </group>
      )}

      {/* THE KEY TRANSITION — sequential disappearance: world, light, eye, observer, everything. */}
      {showKeyTransition && <KeyTransitionSequence seconds={seconds} />}

      {/* COLOR MOMENT 3: an actual full-spectrum rainbow gradient, alone in empty space. */}
      {showRainbow && (
        <RainbowGradientPlane
          position={[0, 0, 0]}
          rotationY={(seconds - BEATS.rainbow.start) * 0.15}
          opacity={rainbowOpacity}
          stops={RAINBOW_STOPS}
        />
      )}

      {/* Continuous flythrough: photon -> eye -> neural signal -> brain -> colored world. */}
      {showFlythrough && (
        <>
          <EyeMark opacity={1 - flythroughT} seconds={seconds} radius={0.28} rimStrength={0.4} />
          <NeuralPathway from={[0, 0, 0]} to={[0, 1.4, -4.5]} reveal={1} pulseT={flythroughT} opacity={0.9} />
          <BrainShape position={[0, 1.4, -4.5]} opacity={clamp01(flythroughT * 1.3)} />
          <ColorOrbs
            seconds={seconds}
            count={45}
            palette={FLOOD_PALETTE}
            opacity={0.6}
            spread={3.6}
            seedOffset={77}
            baseSize={0.05}
            drift={0.5}
          />
        </>
      )}

      {/* A single photon, alone in the dark, tracked in slow motion, then gone. */}
      {showPhotonAlone && (
        <group>
          <mesh position={[0.4 * photonAloneT - 0.2, 0.1 * photonAloneT, 5.4 - photonAloneT * 1.4]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial
              color="#dbe6ff"
              transparent
              opacity={1 - clamp01((photonAloneT - 0.85) / 0.15)}
            />
          </mesh>
          <pointLight
            color="#dbe6ff"
            position={[0.4 * photonAloneT - 0.2, 0.1 * photonAloneT, 5.4 - photonAloneT * 1.4]}
            intensity={0.5}
            distance={2}
          />
        </group>
      )}
    </>
  );
};

/** A simple sine-wave "light wave" line drifting toward the eye. */
const WaveLine: React.FC<{progress: number; seconds: number}> = ({progress, seconds}) => {
  // NB: R3F's `<line>` JSX intrinsic collides with the DOM/SVG `line` type,
  // so the line object is built directly and mounted via `<primitive>`.
  const lineObj = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 80;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = t * 2.2;
      const y = Math.sin(t * Math.PI * 6 + seconds * 2) * 0.18;
      points.push(new THREE.Vector3(x, y, 0));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({color: '#bcd0ff', transparent: true, opacity: 0.65});
    return new THREE.Line(geometry, material);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  return (
    <group position={[-1.4 + progress * 0.3, 0, 0]}>
      <primitive object={lineObj} />
    </group>
  );
};
