import React from 'react';
import {useTexture} from '@react-three/drei';
import {staticFile} from 'remotion';
import {ObjectState} from '../types';

// Bright + slightly emissive so these read instantly against the dark
// backdrop — each stage is on screen under a second, no time to rely on
// scene lighting alone to reveal a dark silhouette.
const material = (opacity: number) => (
  <meshStandardMaterial
    color="#c3d3f2"
    emissive="#3d5488"
    emissiveIntensity={0.5}
    roughness={0.55}
    metalness={0.1}
    transparent={opacity < 1}
    opacity={opacity}
  />
);

/** Simple, deliberately un-detailed representative shapes for the explosive reverse-zoom's larger scales. */
export const Silhouette: React.FC<{
  state: ObjectState;
  kind: 'molecule' | 'hand' | 'person' | 'city' | 'world';
}> = ({state, kind}) => {
  const worldMap = useTexture(staticFile('earth_daymap.jpg'));
  if (!state.visible || state.opacity <= 0.001) return null;
  const s = state.scale;

  if (kind === 'hand') {
    return (
      <group position={state.position} scale={s}>
        <mesh position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.42, 0.55, 6, 12]} />
          {material(state.opacity)}
        </mesh>
        {[-0.32, -0.11, 0.11, 0.32].map((x, i) => (
          <mesh key={i} position={[x, 0.55 + (i === 1 || i === 2 ? 0.06 : 0), 0]} rotation={[0, 0, 0]}>
            <capsuleGeometry args={[0.075, 0.5, 4, 8]} />
            {material(state.opacity)}
          </mesh>
        ))}
        <mesh position={[-0.48, -0.05, 0.12]} rotation={[0, 0, 0.9]}>
          <capsuleGeometry args={[0.08, 0.32, 4, 8]} />
          {material(state.opacity)}
        </mesh>
      </group>
    );
  }

  if (kind === 'person') {
    return (
      <group position={state.position} scale={s}>
        <mesh position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.32, 0.9, 6, 12]} />
          {material(state.opacity)}
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <sphereGeometry args={[0.26, 20, 16]} />
          {material(state.opacity)}
        </mesh>
      </group>
    );
  }

  if (kind === 'city') {
    const buildings: [number, number, number, number][] = [
      [-1.2, 0.6, -0.4, 1.2],
      [-0.6, 1.1, 0.2, 0.9],
      [0, 1.6, -0.2, 0.7],
      [0.6, 0.9, 0.3, 1.0],
      [1.2, 1.3, -0.1, 0.6],
    ];
    return (
      <group position={state.position} scale={s}>
        {buildings.map(([x, h, z, w], i) => (
          <mesh key={i} position={[x, h / 2 - 0.8, z]}>
            <boxGeometry args={[w, h, w]} />
            {material(state.opacity)}
          </mesh>
        ))}
      </group>
    );
  }

  // 'world'
  return (
    <mesh position={state.position} scale={s}>
      <sphereGeometry args={[1, 48, 32]} />
      <meshStandardMaterial map={worldMap} roughness={0.9} transparent={state.opacity < 1} opacity={state.opacity} />
    </mesh>
  );
};
