import React from 'react';
import * as THREE from 'three';

/** A glowing flat plane standing in for "a sheet of paper" (the 2D-universe
 * analogy) — thin, bright-edged so it reads clearly against dark space. */
export const Paper2D: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  size?: number;
  opacity?: number;
  color?: string;
}> = ({position = [0, 0, 0], rotation = [-Math.PI / 2, 0, 0], size = 4, opacity = 1, color = '#bcd8ff'}) => {
  if (opacity <= 0.001) return null;
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.12} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* bright edge outline so the plane's boundary reads clearly */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(size, size)]} />
        <lineBasicMaterial color={color} transparent opacity={opacity} />
      </lineSegments>
    </group>
  );
};

/** The tiny 2D "creature" living on the paper — a simple bright wedge/blob
 * that reads as a top-down creature silhouette, always facing its
 * direction of travel. */
export const Creature2D: React.FC<{
  position?: [number, number, number];
  heading?: number; // radians, direction it's facing on the plane
  opacity?: number;
  color?: string;
  scale?: number;
}> = ({position = [0, 0.02, 0], heading = 0, opacity = 1, color = '#ffd27a', scale = 1}) => {
  if (opacity <= 0.001) return null;
  return (
    <group position={position} rotation={[0, heading, 0]} scale={scale}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.12, 0.28, 3]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <pointLight color={color} intensity={0.8 * opacity} distance={2} />
    </group>
  );
};
