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
      <meshStandardMaterial
        color="#3b2a20"
        roughness={0.6}
        metalness={0.05}
        bumpMap={bump}
        bumpScale={0.01}
        transparent={state.opacity < 1}
        opacity={state.opacity}
      />
    </mesh>
  );
};
