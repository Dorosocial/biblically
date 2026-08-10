import React from 'react';
import {ObjectState} from '../types';

const BASE_RADIUS = 1;

/** The hero object — a single small glowing sphere, reused at every scale throughout the video. */
export const Proton: React.FC<{state: ObjectState; color?: string}> = ({state, color = '#ff6a3d'}) => {
  if (!state.visible || state.opacity <= 0.001) return null;
  const r = BASE_RADIUS * state.scale;
  return (
    <group position={state.position}>
      <mesh scale={r}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.7}
          roughness={0.5}
          metalness={0.05}
          transparent={state.opacity < 1}
          opacity={state.opacity}
        />
      </mesh>
      <pointLight color={color} intensity={1.2 * r} distance={r * 30} decay={2} />
    </group>
  );
};
