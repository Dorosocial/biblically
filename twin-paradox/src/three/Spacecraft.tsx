import React, {useMemo} from 'react';
import * as THREE from 'three';

export interface SpacecraftProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  visible?: boolean;
  engineGlow?: number; // 0..1, brighter when accelerating
}

// Procedural sleek metallic capsule + cone nosecone + small fins.
// Brushed-metal look achieved with a light-grey metallic/roughness material
// (no textures needed) plus a cool rim light hitting it from Lighting.tsx.
export const Spacecraft: React.FC<SpacecraftProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  visible = true,
  engineGlow = 0,
}) => {
  const hullMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#cfd6df',
        metalness: 0.9,
        roughness: 0.35,
      }),
    []
  );
  const darkMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#3a4048',
        metalness: 0.8,
        roughness: 0.5,
      }),
    []
  );
  const finMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e2543f',
        metalness: 0.5,
        roughness: 0.4,
      }),
    []
  );

  if (!visible) return null;

  // Nose points along +X.
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group rotation={[0, 0, -Math.PI / 2]}>
        {/* body - capsule oriented along its local Y, so rotate group -90deg about Z to point +X */}
        <mesh material={hullMat} position={[0, 0, 0]}>
          <capsuleGeometry args={[0.55, 1.6, 6, 12]} />
        </mesh>
        {/* nosecone */}
        <mesh material={hullMat} position={[0, 1.35, 0]}>
          <coneGeometry args={[0.55, 0.9, 12]} />
        </mesh>
        {/* engine housing */}
        <mesh material={darkMat} position={[0, -1.15, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 0.4, 12]} />
        </mesh>
        {/* engine glow */}
        {engineGlow > 0.01 && (
          <mesh position={[0, -1.5, 0]}>
            <coneGeometry args={[0.35, 0.9 * (0.4 + engineGlow), 10]} />
            <meshBasicMaterial
              color="#7fd3ff"
              transparent
              opacity={0.55 * engineGlow}
            />
          </mesh>
        )}
        {/* fins x3 */}
        {[0, 120, 240].map((deg) => (
          <group key={deg} rotation={[0, (deg * Math.PI) / 180, 0]}>
            <mesh material={finMat} position={[0.62, -0.85, 0]} rotation={[0, 0, 0.15]}>
              <boxGeometry args={[0.06, 0.7, 0.55]} />
            </mesh>
          </group>
        ))}
        {/* cockpit window band */}
        <mesh position={[0, 0.55, 0.5]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#8fe0ff" emissive="#8fe0ff" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  );
};
