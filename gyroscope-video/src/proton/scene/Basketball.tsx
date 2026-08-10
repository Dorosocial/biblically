import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useTexture, Line} from '@react-three/drei';
import {staticFile} from 'remotion';
import {ObjectState} from '../types';

const BASE_RADIUS = 1;
const BASKETBALL_TINT = new THREE.Color(3.4, 1.55, 0.55);

/** A great-circle ring, tilted, for the basketball's seam-line pattern. */
const SeamRing: React.FC<{axis: [number, number, number]; radius: number}> = ({axis, radius}) => {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const up = new THREE.Vector3(0, 1, 0);
    const dir = new THREE.Vector3(...axis).normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      const p = new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
      p.applyQuaternion(quat);
      pts.push(p);
    }
    return pts;
  }, [axis, radius]);
  return <Line points={points} color="#241209" lineWidth={2.5} toneMapped={false} />;
};

/**
 * A leather-textured sphere (Color/Normal/Roughness maps from
 * public/leather_texture/) plus a handful of tilted seam-line rings for the
 * basketball's characteristic panel pattern.
 */
export const Basketball: React.FC<{state: ObjectState}> = ({state}) => {
  const [colorMap, normalMap, roughnessMap] = useTexture([
    staticFile('leather_texture/Leather007_2K-JPG_Color.jpg'),
    staticFile('leather_texture/Leather007_2K-JPG_NormalGL.jpg'),
    staticFile('leather_texture/Leather007_2K-JPG_Roughness.jpg'),
  ]);

  useMemo(() => {
    [colorMap, normalMap, roughnessMap].forEach((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(3, 3);
    });
  }, [colorMap, normalMap, roughnessMap]);

  if (!state.visible || state.opacity <= 0.001) return null;

  const r = BASE_RADIUS * state.scale;

  return (
    <group position={state.position}>
      <mesh scale={r}>
        <sphereGeometry args={[1, 48, 32]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          normalScale={new THREE.Vector2(0.6, 0.6)}
          // The leather albedo photo is a dark, low-contrast brown — overdrive
          // it with a bright saturated-orange multiplier (>1 channel values
          // are intentional) so it actually reads as a basketball rather than
          // a dim leather swatch, while the tone mapper keeps highlights sane.
          color={BASKETBALL_TINT}
          roughness={0.55}
          metalness={0.05}
          transparent={state.opacity < 1}
          opacity={state.opacity}
        />
      </mesh>
      <group scale={r * 1.004}>
        <SeamRing axis={[0, 1, 0]} radius={1} />
        <SeamRing axis={[1, 0, 0]} radius={1} />
        <SeamRing axis={[0.4, 0, 1]} radius={1} />
        <SeamRing axis={[-0.4, 0, 1]} radius={1} />
      </group>
    </group>
  );
};
