import React from 'react';

/** A simple procedural telescope — a tube on a tripod, angled skyward.
 * Reused across "looking into deep space" beats. */
export const Telescope: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  opacity?: number;
}> = ({position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, opacity = 1}) => {
  if (opacity <= 0.001) return null;
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* main tube, angled up */}
      <mesh position={[0, 0.6, 0]} rotation={[-0.55, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.12, 1.3, 16]} />
        <meshStandardMaterial color="#cfd6e0" metalness={0.7} roughness={0.3} transparent opacity={opacity} />
      </mesh>
      {/* lens rim glow — a small emissive ring at the aperture so the lens
          reads clearly in a dark scene */}
      <mesh position={[0, 1.15, 0.62]} rotation={[-0.55, 0, 0]}>
        <ringGeometry args={[0.09, 0.115, 24, 1]} />
        <meshBasicMaterial color="#9fd8ff" transparent opacity={opacity * 0.9} />
      </mesh>
      {/* mount + tripod */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.13, 16, 12]} />
        <meshStandardMaterial color="#4a4f58" metalness={0.6} roughness={0.4} transparent opacity={opacity} />
      </mesh>
      {[-0.35, 0.35, 0].map((x, i) => (
        <mesh
          key={i}
          position={[x * 0.8, -0.35, i === 2 ? 0.4 : -0.15]}
          rotation={[i === 2 ? 0.35 : 0.15, 0, i === 2 ? 0 : x > 0 ? -0.35 : 0.35]}
        >
          <cylinderGeometry args={[0.02, 0.025, 1, 8]} />
          <meshStandardMaterial color="#33373d" metalness={0.5} roughness={0.5} transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
};
