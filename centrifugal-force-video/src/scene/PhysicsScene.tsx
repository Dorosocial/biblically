// The R3F scene root. Purely presentational: reads the current frame once,
// asks sceneState.ts what the world should look like, and renders it. No
// lighting comes from an HDRI — ambient fill + directional key light, plus
// point lights for emphasis, per the brief.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame} from 'remotion';
import {getSceneState} from './sceneState';
import {CameraRig} from './CameraRig';
import {AmbientField} from './AmbientField';
import {RodBallRig} from './RodBallRig';
import {Arrow3D} from './Arrow3D';
import {OrbitRing} from './OrbitRing';
import {RotatingGrid} from './RotatingGrid';

export const BACKDROP_COLOR = '#0d1424';

const GhostLine: React.FC<{from: [number, number, number]; to: [number, number, number]; opacity: number}> = ({
  from,
  to,
  opacity,
}) => {
  const {mid, len, quaternion} = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const m = a.clone().add(b).multiplyScalar(0.5);
    const dir = b.clone().sub(a);
    const l = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), l > 0.0001 ? dir.normalize() : new THREE.Vector3(0, 1, 0));
    return {mid: m, len: l, quaternion: q};
  }, [from[0], from[1], from[2], to[0], to[1], to[2]]);

  if (opacity <= 0.01 || len <= 0.01) return null;

  return (
    <mesh position={mid} quaternion={quaternion}>
      <cylinderGeometry args={[0.02, 0.02, len, 8]} />
      <meshBasicMaterial color="#c7ccd8" transparent opacity={opacity} />
    </mesh>
  );
};

export const PhysicsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = getSceneState(frame);

  return (
    <>
      <color attach="background" args={[BACKDROP_COLOR]} />
      <fog attach="fog" args={[BACKDROP_COLOR, 10, 24]} />
      <ambientLight intensity={1.0} color="#6c7ee8" />
      <directionalLight position={[3, 5, 4]} intensity={2.6} color="#eef2ff" />
      <directionalLight position={[-4, -2, -3]} intensity={0.8} color="#8fd6ff" />
      <pointLight position={[0, 2.5, 2]} intensity={12} color="#ffd166" distance={8} decay={2} />
      <pointLight position={[0, -2.5, -2]} intensity={8} color="#7a8fd6" distance={8} decay={2} />

      <CameraRig position={s.camera.position} lookAt={s.camera.lookAt} fov={s.camera.fov} />
      <AmbientField time={s.time} />

      {s.rigs.map((r, i) => (
        <RodBallRig
          key={i}
          pivot={r.pivot}
          ballPosition={r.ballPosition}
          rodVisible={r.rodVisible}
          ballOpacity={r.ballOpacity}
          ballScale={r.ballScale}
          rodOpacity={r.rodOpacity}
        />
      ))}

      {s.rings.map((r, i) => (
        <OrbitRing
          key={i}
          pivot={r.pivot}
          radius={r.radius}
          opacity={r.opacity}
          progress={r.progress}
          rotationOffset={r.rotationOffset}
          color={r.color}
        />
      ))}

      {s.grids.map((g, i) => (
        <RotatingGrid key={i} pivot={g.pivot} angle={g.angle} radius={g.radius} opacity={g.opacity} />
      ))}

      {s.vectors.map((v, i) => (
        <Arrow3D key={i} origin={v.origin} direction={v.direction} length={v.length} color={v.color} opacity={v.opacity} />
      ))}

      {s.ghostLine && <GhostLine from={s.ghostLine.from} to={s.ghostLine.to} opacity={s.ghostLine.opacity} />}
    </>
  );
};
