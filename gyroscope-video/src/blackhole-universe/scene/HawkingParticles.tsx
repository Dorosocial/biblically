import React, {useMemo} from 'react';
import * as THREE from 'three';
import {mulberry32} from '../../shared/random';

/** Hawking radiation — bright particles streaming OUTWARD from just
 * outside the horizon, the mirror image of InfallParticles.tsx's inward
 * spiral. Same lightweight per-particle-sphere technique (see that file
 * for why: cheap, no shader, reads fine at this scale). */
export const HawkingParticles: React.FC<{
  progress: number; // 0 = particles just at the horizon, 1 = fully streamed outward
  opacity?: number;
  count?: number;
  seed?: number;
  color?: string;
}> = ({progress, opacity = 1, count = 14, seed = 314, color = '#cfe8ff'}) => {
  const seeds = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({length: count}, () => ({
      dir: new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize(),
      speed: 4 + rand() * 3,
      phase: rand() * 0.5,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, seed]);

  if (opacity <= 0.001) return null;

  return (
    <group>
      {seeds.map((p, i) => {
        const localT = THREE.MathUtils.clamp(progress - p.phase, 0, 1);
        const r = 1.05 + localT * p.speed;
        const pos = p.dir.clone().multiplyScalar(r);
        const fade = localT < 0.15 ? localT / 0.15 : 1 - Math.max(0, (localT - 0.7) / 0.3);
        return (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.045, 8, 6]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={opacity * THREE.MathUtils.clamp(fade, 0, 1)}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
};
