import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Line} from '@react-three/drei';

/**
 * The "glowing angular-velocity arrow around rim": a curved arc hugging the
 * rim in the wheel's own spin plane (perpendicular to the axle), with a
 * small cone at its leading edge. Recomputed every frame from the wheel's
 * live axle direction + spin angle — it is a real 3D object, not a flat
 * overlay, so it rotates correctly with the wheel and the camera.
 */
export const SpinArc: React.FC<{
  axleDir: THREE.Vector3;
  spinAngle: number;
  radius: number;
  color?: string;
  opacity?: number;
  sweep?: number; // radians
}> = ({axleDir, spinAngle, radius, color = '#ffc86b', opacity = 0.85, sweep = Math.PI * 0.55}) => {
  const {points, tipPos, tipQuat} = useMemo(() => {
    const dir = axleDir.clone().normalize();
    let ref = new THREE.Vector3(0, 1, 0);
    if (Math.abs(dir.dot(ref)) > 0.98) ref = new THREE.Vector3(1, 0, 0);
    const u = new THREE.Vector3().crossVectors(dir, ref).normalize();
    const v = new THREE.Vector3().crossVectors(dir, u).normalize();

    const arcRadius = radius * 1.18;
    const startAngle = spinAngle;
    const steps = 24;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= steps; i++) {
      const a = startAngle + (i / steps) * sweep;
      pts.push(u.clone().multiplyScalar(Math.cos(a) * arcRadius).add(v.clone().multiplyScalar(Math.sin(a) * arcRadius)));
    }
    const tip = pts[pts.length - 1];
    const prev = pts[pts.length - 2];
    const tangent = tip.clone().sub(prev).normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
    return {points: pts, tipPos: tip, tipQuat: quat};
  }, [axleDir.x, axleDir.y, axleDir.z, spinAngle, radius, sweep]);

  return (
    <group>
      <Line points={points} color={color} transparent opacity={opacity} lineWidth={3} toneMapped={false} depthWrite={false} />
      <mesh position={tipPos} quaternion={tipQuat}>
        <coneGeometry args={[radius * 0.05, radius * 0.14, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} transparent opacity={opacity} depthWrite={false} />
      </mesh>
    </group>
  );
};
