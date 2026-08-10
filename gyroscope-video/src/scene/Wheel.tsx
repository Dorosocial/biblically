import React, {useMemo} from 'react';
import * as THREE from 'three';

const SPOKE_COUNT = 20;

/**
 * Builds the rig entirely from primitives — no imported model.
 *
 * Local space: the wheel disc lies in the local XY plane, and the axle
 * points along local +Z. The two nested groups below let us separate
 * "which way the axle points in the world" (outer group quaternion) from
 * "how far the wheel has spun about its own axle" (inner group rotation).
 */
export const Wheel: React.FC<{
  position?: THREE.Vector3 | [number, number, number];
  dir: THREE.Vector3; // world-space unit vector the axle points along
  spinAngle: number; // radians, rotation about the local axle
  radius?: number;
  chrome?: boolean;
  opacity?: number;
  color?: string;
  ghost?: boolean;
}> = ({
  position = [0, 0, 0],
  dir,
  spinAngle,
  radius = 1.6,
  chrome = true,
  opacity = 1,
  color = '#dfe6ec',
  ghost = false,
}) => {
  const orientationQuat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir.clone().normalize());
    return q;
  }, [dir.x, dir.y, dir.z]);

  const tube = radius * 0.058;
  const hubRadius = radius * 0.1;
  const hubLength = radius * 0.22;
  const spokeInner = hubRadius * 1.05;
  const spokeOuter = radius - tube * 1.3;
  const spokeLength = spokeOuter - spokeInner;

  const spokeAngles = useMemo(
    () => Array.from({length: SPOKE_COUNT}, (_, i) => (i / SPOKE_COUNT) * Math.PI * 2),
    [],
  );

  const metalMaterialProps = chrome
    ? {metalness: 0.7, roughness: 0.32}
    : {metalness: 0.5, roughness: 0.5};

  return (
    <group position={position as any} quaternion={orientationQuat}>
      <group rotation={[0, 0, spinAngle]}>
        {/* Rim + tire */}
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[radius, tube, 20, 64]} />
          {ghost ? (
            <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
          ) : (
            <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} {...metalMaterialProps} />
          )}
        </mesh>

        {/* Spokes: thin cylinders radiating from hub to inner rim edge */}
        {spokeAngles.map((angle, i) => {
          const midR = spokeInner + spokeLength / 2;
          const x = Math.cos(angle) * midR;
          const y = Math.sin(angle) * midR;
          return (
            <mesh key={i} position={[x, y, 0]} rotation={[0, 0, angle + Math.PI / 2]}>
              <cylinderGeometry args={[radius * 0.012, radius * 0.012, spokeLength, 8]} />
              {ghost ? (
                <meshBasicMaterial color={color} transparent opacity={opacity * 0.8} depthWrite={false} />
              ) : (
                <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} {...metalMaterialProps} />
              )}
            </mesh>
          );
        })}

        {/* Hub: small cylinder at center, axle passes through it */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[hubRadius, hubRadius, hubLength, 24]} />
          {ghost ? (
            <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
          ) : (
            <meshStandardMaterial color="#b9c2cb" metalness={0.85} roughness={0.3} />
          )}
        </mesh>
      </group>
    </group>
  );
};
