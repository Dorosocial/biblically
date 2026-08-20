import React from 'react';
import {useTexture} from '@react-three/drei';
import {staticFile} from 'remotion';
import {Obj3DState} from './types';

const BASE_RADIUS = 1;

/** Reusable Earth — textured sphere using public/earth_daymap.jpg. */
export const Earth: React.FC<{state: Obj3DState}> = ({state}) => {
  const map = useTexture(staticFile('earth_daymap.jpg'));
  if (!state.visible || state.opacity <= 0.001) return null;
  const r = BASE_RADIUS * state.scale;
  return (
    <mesh position={state.position} rotation={state.rotation} scale={r}>
      <sphereGeometry args={[1, 48, 36]} />
      <meshStandardMaterial map={map} roughness={0.9} metalness={0} transparent={state.opacity < 1} opacity={state.opacity} />
    </mesh>
  );
};
