import React from 'react';
import {ObjectState} from '../types';
import {useNoiseTexture} from './useNoiseTexture';

const BASE_RADIUS = 1;
const BASE_LENGTH = 14;

/** A very thin, long cylinder with subtle procedural surface noise — the human hair. */
export const Hair: React.FC<{state: ObjectState}> = ({state}) => {
  const bump = useNoiseTexture(128, 2, 12);
  if (!state.visible || state.opacity <= 0.001) return null;
  const r = BASE_RADIUS * state.scale;
  return (
    <mesh position={state.position} scale={r} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.16, 0.2, BASE_LENGTH, 32, 24]} />
      {/* Dark brown at full physical accuracy read as near-black on screen
          (same problem the basketball's leather texture had) — lifted to a
          warmer, brighter brown plus a low emissive floor so the strand
          stays clearly visible regardless of light angle. */}
      <meshStandardMaterial
        color="#8a5a3c"
        emissive="#3a2213"
        emissiveIntensity={0.45}
        roughness={0.45}
        metalness={0.08}
        bumpMap={bump}
        bumpScale={0.015}
        transparent={state.opacity < 1}
        opacity={state.opacity}
      />
    </mesh>
  );
};
