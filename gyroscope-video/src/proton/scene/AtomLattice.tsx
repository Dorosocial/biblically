import React, {useMemo} from 'react';
import * as THREE from 'three';
import {ObjectState} from '../types';
import {useNoiseTexture} from './useNoiseTexture';

/**
 * A grid of atoms. `solidity` (0..1) morphs the read from "solid metal
 * block" (large touching spheres + a faint bounding shell) down to
 * "mostly empty space" (tiny points with huge gaps between them) — the
 * same object used for both the "solid matter" reveal and its later
 * "almost entirely nothing" transparency reveal.
 */
export const AtomLattice: React.FC<{
  state: ObjectState;
  gridSize?: number;
  spacing?: number;
  solidity: number; // 0..1
}> = ({state, gridSize = 6, spacing = 1, solidity}) => {
  const bump = useNoiseTexture(64);
  const positions = useMemo(() => {
    const pts: [number, number, number][] = [];
    const half = (gridSize - 1) / 2;
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          pts.push([(x - half) * spacing, (y - half) * spacing, (z - half) * spacing]);
        }
      }
    }
    return pts;
  }, [gridSize, spacing]);

  if (!state.visible || state.opacity <= 0.001) return null;

  const sphereRadius = THREE.MathUtils.lerp(0.03, 0.46, solidity) * spacing;
  const sphereOpacity = THREE.MathUtils.lerp(0.55, 1, solidity) * state.opacity;
  const shellOpacity = THREE.MathUtils.lerp(0, 0.06, solidity) * state.opacity;
  const color = new THREE.Color('#8fb2ff').lerp(new THREE.Color('#c9d6e8'), solidity);

  return (
    <group position={state.position} scale={state.scale}>
      {positions.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[sphereRadius, 12, 10]} />
          <meshStandardMaterial
            color={color}
            roughness={0.5}
            metalness={0.4}
            bumpMap={bump}
            bumpScale={0.01}
            transparent
            opacity={sphereOpacity}
            depthWrite={sphereOpacity > 0.7}
          />
        </mesh>
      ))}
      {shellOpacity > 0.005 && (
        <mesh>
          <boxGeometry args={[gridSize * spacing, gridSize * spacing, gridSize * spacing]} />
          <meshStandardMaterial color="#dfe8ff" transparent opacity={shellOpacity} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
};
