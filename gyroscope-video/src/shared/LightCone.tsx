import React from 'react';
import * as THREE from 'three';

/** The classic relativity "light cone" diagram — two open wireframe cones
 * meeting tip-to-tip at an event, one opening into the future (+Y) and one
 * into the past (-Y). Bright wireframe so it reads clearly as a diagram,
 * not a solid shape. */
export const LightCone: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  opacity?: number;
  color?: string;
}> = ({position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, opacity = 1, color = '#7fd9ff'}) => {
  if (opacity <= 0.001) return null;
  const coneGeo = new THREE.ConeGeometry(1.2, 1.8, 32, 8, true);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* future cone, opening upward */}
      <mesh position={[0, 0.9, 0]}>
        <primitive object={coneGeo} attach="geometry" />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.12} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <lineSegments position={[0, 0.9, 0]}>
        <edgesGeometry args={[coneGeo]} />
        <lineBasicMaterial color={color} transparent opacity={opacity} />
      </lineSegments>
      {/* past cone, opening downward */}
      <mesh position={[0, -0.9, 0]} rotation={[Math.PI, 0, 0]}>
        <primitive object={coneGeo} attach="geometry" />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.12} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <lineSegments position={[0, -0.9, 0]} rotation={[Math.PI, 0, 0]}>
        <edgesGeometry args={[coneGeo]} />
        <lineBasicMaterial color={color} transparent opacity={opacity} />
      </lineSegments>
      {/* the event itself — a bright point at the shared apex */}
      <mesh>
        <sphereGeometry args={[0.05, 12, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={opacity} />
      </mesh>
    </group>
  );
};
