import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Line} from '@react-three/drei';
import {mulberry32} from './random';

interface Branch {
  start: THREE.Vector3;
  end: THREE.Vector3;
  order: number; // generation order, for progressive reveal
}

/** The "cosmic family tree" — a branching structure of glowing lines with
 * small bright nodes at each branch tip, each node standing in for a
 * universe/black hole. Generated once (seeded, deterministic) as a full
 * tree; `growth` (0-1) reveals it progressively by branch generation order,
 * so the same structure can "grow" across a beat instead of popping in
 * whole. */
export const CosmicTree: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  opacity?: number;
  growth?: number; // 0 = just the root, 1 = fully grown
  seed?: number;
  depth?: number;
  color?: string;
}> = ({position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, opacity = 1, growth = 1, seed = 771, depth = 4, color = '#bfe0ff'}) => {
  const branches = useMemo(() => {
    const rand = mulberry32(seed);
    const out: Branch[] = [];
    const grow = (from: THREE.Vector3, dir: THREE.Vector3, length: number, gen: number) => {
      if (gen > depth) return;
      const to = from.clone().addScaledVector(dir, length);
      out.push({start: from, end: to, order: gen});
      const childCount = gen === 0 ? 3 : 2 + Math.floor(rand() * 2);
      for (let i = 0; i < childCount; i++) {
        const spread = 0.5 + rand() * 0.4;
        const axis = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize();
        const childDir = dir.clone().applyAxisAngle(axis, spread * (rand() > 0.5 ? 1 : -1)).normalize();
        grow(to, childDir, length * (0.68 + rand() * 0.12), gen + 1);
      }
    };
    grow(new THREE.Vector3(0, -2.2, 0), new THREE.Vector3(0, 1, 0), 1, 0);
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, depth]);

  const maxOrder = depth;
  const visibleGrowth = growth * maxOrder;

  if (opacity <= 0.001) return null;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {branches.map((b, i) => {
        const localReveal = THREE.MathUtils.clamp(visibleGrowth - b.order, 0, 1);
        if (localReveal <= 0.001) return null;
        const end = b.start.clone().lerp(b.end, localReveal);
        return (
          <React.Fragment key={i}>
            <Line points={[b.start, end]} color={color} transparent opacity={opacity * 0.8} lineWidth={2} toneMapped={false} />
            {localReveal > 0.95 && (
              <mesh position={end}>
                <sphereGeometry args={[0.05 + 0.03 * (maxOrder - b.order), 12, 8]} />
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={opacity}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            )}
          </React.Fragment>
        );
      })}
    </group>
  );
};
