import React, {useMemo} from 'react';
import * as THREE from 'three';

/**
 * A real 3D vector arrow (cylinder shaft + cone head) built fresh from
 * `origin`/`dir`/`length` every render — never a fixed/static prop. Callers
 * recompute these vectors from the wheel's live rotation state each frame,
 * so the arrow always rotates/orbits correctly with the rest of the scene
 * and with the camera.
 */
export const Arrow: React.FC<{
  origin: THREE.Vector3;
  dir: THREE.Vector3;
  length: number;
  radius?: number;
  color: string;
  opacity?: number;
  emissive?: string;
  emissiveIntensity?: number;
}> = ({origin, dir, length, radius = 0.05, color, opacity = 1, emissive, emissiveIntensity = 0}) => {
  const unit = useMemo(() => dir.clone().normalize(), [dir.x, dir.y, dir.z]);
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), unit), [unit.x, unit.y, unit.z]);

  const headLength = Math.min(length * 0.32, radius * 7);
  const shaftLength = Math.max(length - headLength, 0.001);
  const shaftMid = origin.clone().add(unit.clone().multiplyScalar(shaftLength / 2));
  const headBase = origin.clone().add(unit.clone().multiplyScalar(shaftLength + headLength / 2));

  if (opacity <= 0.001) return null;

  return (
    <group>
      <mesh position={shaftMid} quaternion={quat}>
        <cylinderGeometry args={[radius, radius, shaftLength, 12]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          emissive={emissive ?? color}
          emissiveIntensity={emissiveIntensity}
          depthWrite={opacity > 0.95}
        />
      </mesh>
      <mesh position={headBase} quaternion={quat}>
        <coneGeometry args={[radius * 2.4, headLength, 16]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          emissive={emissive ?? color}
          emissiveIntensity={emissiveIntensity}
          depthWrite={opacity > 0.95}
        />
      </mesh>
    </group>
  );
};
