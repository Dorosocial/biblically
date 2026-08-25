import React from 'react';
import * as THREE from 'three';

/**
 * A simple human silhouette — an "observer" standing in a scene (parent
 * universe, civilization looking up, etc.). Deliberately matte-dark
 * (silhouettes read as dark shapes against a bright sky/backdrop by
 * design), but per the clarity rule a thin additive rim-glow shell keeps
 * the shape's edge legible against a near-black backdrop too, rather than
 * risking an indistinct black-on-black blob.
 */
export const Silhouette: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  opacity?: number;
  rimColor?: string;
  lookUp?: number; // 0-1, tilts the head back to look upward
}> = ({position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, opacity = 1, rimColor = '#8fb4ff', lookUp = 0}) => {
  if (opacity <= 0.001) return null;
  const headTilt = -lookUp * 0.6;
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* legs */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.7, 12]} />
        <meshBasicMaterial color="#050506" transparent opacity={opacity} />
      </mesh>
      {/* torso */}
      <mesh position={[0, 0.95, 0]}>
        <capsuleGeometry args={[0.14, 0.5, 6, 12]} />
        <meshBasicMaterial color="#050506" transparent opacity={opacity} />
      </mesh>
      {/* head */}
      <mesh position={[0, 1.42, 0]} rotation={[headTilt, 0, 0]}>
        <sphereGeometry args={[0.13, 16, 12]} />
        <meshBasicMaterial color="#050506" transparent opacity={opacity} />
      </mesh>
      {/* rim glow — a slightly larger, very faint additive backlight so the
          silhouette's outline stays legible against a dark backdrop */}
      <mesh position={[0, 0.9, 0]} scale={1.12}>
        <capsuleGeometry args={[0.18, 1.1, 6, 12]} />
        <meshBasicMaterial
          color={rimColor}
          transparent
          opacity={opacity * 0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
