import React from 'react';
import {Obj3DState} from './types';

/**
 * A small procedural spacecraft — no model sourcing. A conical hull, a
 * cylindrical engine housing, and two angled fin/wing panels, all in a
 * matte-metal material. Deliberately simple/silhouette-readable rather
 * than detailed, since it's mostly seen tiny and distant.
 */
export const Spacecraft: React.FC<{state: Obj3DState; color?: string}> = ({state, color = '#c9ced8'}) => {
  if (!state.visible || state.opacity <= 0.001) return null;
  const op = state.opacity;
  const mat = (
    <meshStandardMaterial color={color} metalness={0.75} roughness={0.35} transparent={op < 1} opacity={op} />
  );
  const darkMat = (
    <meshStandardMaterial color="#2a2d33" metalness={0.6} roughness={0.5} transparent={op < 1} opacity={op} />
  );

  return (
    <group position={state.position} rotation={state.rotation} scale={state.scale}>
      {/* hull */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.16, 0.7, 12]} />
        {mat}
      </mesh>
      {/* engine housing, trailing edge */}
      <mesh position={[0, 0, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.13, 0.28, 12]} />
        {darkMat}
      </mesh>
      {/* fins */}
      <mesh position={[0.22, 0, 0.32]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.32, 0.02, 0.22]} />
        {darkMat}
      </mesh>
      <mesh position={[-0.22, 0, 0.32]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.32, 0.02, 0.22]} />
        {darkMat}
      </mesh>
      {/* engine glow */}
      <pointLight position={[0, 0, 0.58]} color="#7fb6ff" intensity={1.2} distance={3} decay={2} />
    </group>
  );
};
