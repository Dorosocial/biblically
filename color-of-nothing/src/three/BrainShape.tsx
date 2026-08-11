import React from 'react';

interface BrainShapeProps {
  position: [number, number, number];
  scale?: number;
  opacity: number;
  color?: string;
  glowColor?: string;
}

/**
 * A simplified, abstract brain shape — a low-poly rounded form with a thin
 * rim glow, deliberately not anatomically detailed (kept in the same
 * restrained visual language as the eye marks).
 */
export const BrainShape: React.FC<BrainShapeProps> = ({
  position,
  scale = 1,
  opacity,
  color = '#0a0a0a',
  glowColor = '#9fb4ff',
}) => {
  if (opacity <= 0.002) return null;
  return (
    <group position={position} scale={scale}>
      <mesh>
        <icosahedronGeometry args={[0.34, 2]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.85} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.345, 2]} />
        <meshBasicMaterial color={glowColor} wireframe transparent opacity={opacity * 0.35} />
      </mesh>
    </group>
  );
};
