import React from 'react';
import {BEATS} from '../timing';
import {EyeMark} from './EyeMark';
import {ParticleField} from './ParticleField';
import {linearProgress, clamp01, hashRandom} from './lib/utils';

interface KeyTransitionSequenceProps {
  seconds: number;
}

/**
 * THE KEY TRANSITION (most important sequence in the video): an explicit,
 * SEQUENTIAL disappearance — WORLD dissolves, then LIGHT, then EYE, then
 * OBSERVER, then EVERYTHING is gone. Each element visibly vanishes on its
 * own, one after another, rather than a single cut to black.
 */
export const KeyTransitionSequence: React.FC<KeyTransitionSequenceProps> = ({seconds}) => {
  const {world, light, eye, observer} = BEATS.keyTransition;

  // Each stage: full presence at its start, fades to nothing by its end.
  const worldOpacity = 1 - linearProgress(seconds, world.start, world.end);
  const lightOpacity = 1 - linearProgress(seconds, light.start, light.end);
  const eyeOpacity = 1 - linearProgress(seconds, eye.start, eye.end);
  const observerOpacity = 1 - linearProgress(seconds, observer.start, observer.end);

  const inWorld = seconds >= world.start && seconds < light.end;
  const inLight = seconds >= light.start && seconds < eye.end;
  const inEye = seconds >= eye.start && seconds < observer.end;
  const inObserver = seconds >= observer.start && seconds < BEATS.keyTransition.everythingGone.end;

  return (
    <group>
      {/* WORLD: the faint ambient environment remnant, dissolving outward. */}
      {inWorld && worldOpacity > 0.002 && (
        <mesh rotation={[0.3, seconds * 0.05, 0]}>
          <icosahedronGeometry args={[2.6, 1]} />
          <meshBasicMaterial
            color="#1a1a1a"
            wireframe
            transparent
            opacity={clamp01(worldOpacity) * 0.35}
          />
        </mesh>
      )}

      {/* LIGHT: the last faint light source, extinguishing. */}
      {inLight && lightOpacity > 0.002 && (
        <mesh>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#dfe6ee" transparent opacity={clamp01(lightOpacity)} />
        </mesh>
      )}
      {inLight && lightOpacity > 0.002 && (
        <pointLight color="#dfe6ee" intensity={clamp01(lightOpacity) * 0.6} distance={5} />
      )}

      {/* EYE: the recurring lens motif, shrinking and fading to nothing. */}
      {inEye && eyeOpacity > 0.002 && (
        <group scale={0.55 + 0.45 * clamp01(eyeOpacity)}>
          <EyeMark opacity={clamp01(eyeOpacity)} radius={0.3} rimStrength={0.3} seconds={seconds} />
        </group>
      )}

      {/* OBSERVER: a soft dissipating ring — the last trace of a perceiving presence. */}
      {inObserver && observerOpacity > 0.002 && (
        <mesh scale={1 + (1 - clamp01(observerOpacity)) * 1.4}>
          <ringGeometry args={[0.5, 0.505, 64]} />
          <meshBasicMaterial color="#5a6472" transparent opacity={clamp01(observerOpacity) * 0.4} />
        </mesh>
      )}

      {/* EVERYTHING GONE: not a dead cut to black — a handful of the last
          embers still drifting outward and dying out, so even "nothing left"
          keeps a trace of motion on screen. */}
      {seconds >= BEATS.keyTransition.everythingGone.start && seconds <= BEATS.keyTransition.everythingGone.end && (
        <ParticleField
          count={14}
          seconds={seconds}
          size={0.028}
          opacity={
            0.55 *
            (1 -
              linearProgress(
                seconds,
                BEATS.keyTransition.everythingGone.start,
                BEATS.keyTransition.everythingGone.end,
              ))
          }
          color="#5f6fd0"
          getPosition={(i) => {
            const t = linearProgress(
              seconds,
              BEATS.keyTransition.everythingGone.start,
              BEATS.keyTransition.everythingGone.end,
            );
            const angle = hashRandom(i * 4.1) * Math.PI * 2;
            const r = 0.3 + t * (0.6 + hashRandom(i * 6.3) * 0.8);
            return [Math.cos(angle) * r, Math.sin(angle) * r * 0.7, (hashRandom(i * 8.7) - 0.5) * 0.5];
          }}
        />
      )}
    </group>
  );
};
