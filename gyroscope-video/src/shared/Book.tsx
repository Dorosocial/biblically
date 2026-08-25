import React, {useMemo} from 'react';
import * as THREE from 'three';
import {mulberry32} from './random';

/** A simple procedural book — a thin box with a warm cover color and
 * lighter "pages" edge — that can dissolve into a scatter of small glowing
 * fragments (standing in for "pages -> letters -> molecules -> quantum
 * states") as `dissolveProgress` goes from 0 to 1. */
export const Book: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  opacity?: number;
  dissolveProgress?: number; // 0 = solid book, 1 = fully dissolved into particles
  seed?: number;
}> = ({position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, opacity = 1, dissolveProgress = 0, seed = 606}) => {
  const fragments = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({length: 40}, () => ({
      offset: new THREE.Vector3((rand() - 0.5) * 0.5, (rand() - 0.5) * 0.7, (rand() - 0.5) * 0.12),
      dir: new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize(),
      speed: 0.6 + rand() * 1.4,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  if (opacity <= 0.001) return null;
  const solidOpacity = opacity * THREE.MathUtils.clamp(1 - dissolveProgress * 1.3, 0, 1);
  const fragOpacity = opacity * Math.sin(Math.min(dissolveProgress, 1) * Math.PI); // fades in then out

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {solidOpacity > 0.001 && (
        <>
          <mesh>
            <boxGeometry args={[0.45, 0.6, 0.08]} />
            <meshStandardMaterial color="#7a2e1c" transparent opacity={solidOpacity} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.041]}>
            <boxGeometry args={[0.4, 0.55, 0.02]} />
            <meshBasicMaterial color="#f0e6cf" transparent opacity={solidOpacity} />
          </mesh>
        </>
      )}
      {fragOpacity > 0.001 &&
        fragments.map((f, i) => {
          const travel = dissolveProgress * f.speed;
          const pos = f.offset.clone().addScaledVector(f.dir, travel);
          return (
            <mesh key={i} position={pos}>
              <boxGeometry args={[0.025, 0.025, 0.005]} />
              <meshBasicMaterial
                color="#bfe0ff"
                transparent
                opacity={fragOpacity}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          );
        })}
    </group>
  );
};
