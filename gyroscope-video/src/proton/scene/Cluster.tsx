import React, {useMemo} from 'react';
import * as THREE from 'three';
import {ObjectState} from '../types';

export interface ClusterMember {
  position: THREE.Vector3;
  color: string;
  isHighlighted?: boolean;
}

/** Deterministic small-sphere packing (roughly spherical jitter), reused for both the nucleus (protons+neutrons) and generic "molecule" stand-ins. */
export const clusterLayout = (count: number, spread: number, seed = 1): THREE.Vector3[] => {
  // Simple deterministic pseudo-random (mulberry32) so layout never jitters frame-to-frame.
  let s = seed;
  const rand = () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    // Fibonacci sphere for even coverage, jittered slightly for an organic packed look.
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
    const jitter = 0.82 + rand() * 0.3;
    const rad = spread * jitter * (count <= 1 ? 0 : 0.55);
    pts.push(
      new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * rad,
        Math.sin(phi) * Math.sin(theta) * rad,
        Math.cos(phi) * rad,
      ),
    );
  }
  return pts;
};

export const Cluster: React.FC<{
  state: ObjectState;
  count: number;
  memberRadius?: number;
  spread?: number;
  protonColor?: string;
  neutronColor?: string;
  highlightIndex?: number | null;
  highlightColor?: string;
  seed?: number;
}> = ({
  state,
  count,
  memberRadius = 0.34,
  spread = 1,
  protonColor = '#ff8a3d',
  neutronColor = '#9fb2c8',
  highlightIndex = null,
  highlightColor = '#ffe27a',
  seed = 7,
}) => {
  const layout = useMemo(() => clusterLayout(count, spread, seed), [count, spread, seed]);

  if (!state.visible || state.opacity <= 0.001) return null;
  const s = state.scale;

  return (
    <group position={state.position} scale={s}>
      {layout.map((p, i) => {
        const highlighted = i === highlightIndex;
        const color = highlighted ? highlightColor : i % 2 === 0 ? protonColor : neutronColor;
        return (
          <mesh key={i} position={p}>
            <sphereGeometry args={[memberRadius, 20, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={highlighted ? highlightColor : color}
              emissiveIntensity={highlighted ? 1.0 : 0.15}
              roughness={0.4}
              metalness={0.1}
              transparent={state.opacity < 1}
              opacity={state.opacity}
            />
          </mesh>
        );
      })}
    </group>
  );
};
