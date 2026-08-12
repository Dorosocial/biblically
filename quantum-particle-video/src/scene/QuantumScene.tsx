// The R3F scene root. Purely presentational: reads the current frame once,
// asks sceneState.ts what the world should look like, and renders it. No
// lighting comes from an HDRI — ambient fill + one directional key light,
// plus the emissive/glow materials on the particle, wave, and screen
// themselves, which are the primary light sources in these darker shots.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {getSceneState} from './sceneState';
import {CameraRig} from './CameraRig';
import {AmbientField} from './AmbientField';
import {Particle} from './Particle';
import {ClassicalBall, XMark} from './ClassicalBall';
import {WaveLobe, WaveSheet, PossibilityCloud} from './Wavefunction';
import {Barrier} from './Barrier';
import {DetectionScreen} from './DetectionScreen';
import {Detector} from './Detector';

export const BACKDROP_COLOR = '#070912';

export const QuantumScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = getSceneState(frame);

  return (
    <>
      <color attach="background" args={[BACKDROP_COLOR]} />
      <fog attach="fog" args={[BACKDROP_COLOR, 6, 16]} />
      <ambientLight intensity={0.6} color="#5a6ee0" />
      <directionalLight position={[3, 5, 4]} intensity={2.0} color="#dfe8ff" />
      <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#8fd6ff" />
      <directionalLight position={[-2, 4, 5]} intensity={0.8} color="#fff2df" />

      <CameraRig position={s.camera.position} lookAt={s.camera.lookAt} fov={s.camera.fov} />
      <AmbientField time={s.time} />

      {s.particle && (
        <Particle position={s.particle.position} scale={s.particle.scale} opacity={s.particle.opacity} />
      )}
      {s.secondaryParticle && (
        <Particle
          position={s.secondaryParticle.position}
          scale={s.secondaryParticle.scale}
          opacity={s.secondaryParticle.opacity}
        />
      )}
      {s.classicalBall && (
        <ClassicalBall
          position={s.classicalBall.position}
          scale={s.classicalBall.scale}
          opacity={s.classicalBall.opacity}
          ghost={s.classicalBall.ghost}
        />
      )}
      {s.ghostBall && (
        <ClassicalBall position={s.ghostBall.position} scale={s.ghostBall.scale} opacity={s.ghostBall.opacity} ghost />
      )}
      {s.xMark && <XMark position={s.xMark.position} scale={s.xMark.scale} opacity={s.xMark.opacity} />}
      {s.humanScaleObject && (
        <ClassicalBall
          position={s.humanScaleObject.position}
          scale={s.humanScaleObject.scale}
          opacity={s.humanScaleObject.opacity}
          color="#9aa3b5"
        />
      )}

      {s.waveLobes.map((w, i) => (
        <WaveLobe key={i} position={w.position} scale={w.scale} opacity={w.opacity} time={s.time} />
      ))}
      {s.waveSheets.map((w, i) => (
        <WaveSheet key={i} from={w.from} to={w.to} opacity={w.opacity} time={s.time} />
      ))}
      {s.possibilityCloud && (
        <PossibilityCloud
          center={s.possibilityCloud.center}
          spreadX={s.possibilityCloud.spreadX}
          count={s.possibilityCloud.count}
          opacity={s.possibilityCloud.opacity}
          time={s.time}
        />
      )}

      {s.barrier && <Barrier position={s.barrier.position} opacity={s.barrier.opacity} slitGap={s.barrier.slitGap} />}
      {s.screen && (
        <DetectionScreen
          position={s.screen.position}
          interferenceAmt={s.screen.interferenceAmt}
          twoBandAmt={s.screen.twoBandAmt}
          multiAmt={s.screen.multiAmt}
          panelGlow={s.screen.panelGlow}
          time={s.time}
        />
      )}
      {s.detectors.map((d, i) => (
        <Detector key={i} position={d.position} active={d.active} opacity={d.opacity} />
      ))}

      {s.splitDividerOpacity > 0.01 && (
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[6, 4]} />
          <meshBasicMaterial color="#3a4a6b" transparent opacity={s.splitDividerOpacity * 0.4} />
        </mesh>
      )}
    </>
  );
};
