import React from 'react';
import {useTexture} from '@react-three/drei';
import {staticFile} from 'remotion';
import {ObjectState} from '../types';

const BASE_RADIUS = 1;

export const Earth: React.FC<{state: ObjectState}> = ({state}) => {
  const map = useTexture(staticFile('earth_daymap.jpg'));
  if (!state.visible || state.opacity <= 0.001) return null;
  const r = BASE_RADIUS * state.scale;
  return (
    <mesh position={state.position} scale={r}>
      <sphereGeometry args={[1, 64, 48]} />
      <meshStandardMaterial map={map} roughness={0.9} metalness={0} transparent={state.opacity < 1} opacity={state.opacity} />
    </mesh>
  );
};
