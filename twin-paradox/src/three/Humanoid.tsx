import React, {useMemo} from 'react';
import * as THREE from 'three';

export interface HumanoidProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  visible?: boolean;
  color?: string;
  rimColor?: string;
}

// Minimalist iconographic figure: capsule body + sphere head, solid dark
// color, no facial detail. Rim light (from Lighting.tsx) does the modeling.
export const Humanoid: React.FC<HumanoidProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  visible = true,
  color = '#0c0e14',
  rimColor = '#5fa8ff',
}) => {
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.9,
        metalness: 0.0,
        emissive: new THREE.Color(rimColor),
        emissiveIntensity: 0.06,
      }),
    [color, rimColor]
  );

  if (!visible) return null;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh material={mat} position={[0, 1.05, 0]}>
        <capsuleGeometry args={[0.32, 1.0, 6, 12]} />
      </mesh>
      <mesh material={mat} position={[0, 1.95, 0]}>
        <sphereGeometry args={[0.26, 16, 16]} />
      </mesh>
    </group>
  );
};
