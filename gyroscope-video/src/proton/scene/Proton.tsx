import React from 'react';
import {ObjectState} from '../types';
import {useNoiseTexture} from './useNoiseTexture';

const BASE_RADIUS = 1;

// Fixed local (unit-sphere) positions for the small surface flecks that ride
// along with the spin — a bump map alone reads as static "sandpaper" texture
// on a smooth, near-uniformly-lit ball; a couple of small brighter flecks
// visibly orbiting into and out of view is what actually sells "it's
// spinning" to the eye, especially during the otherwise-static number-typing
// beat this was added to fix.
const FLECKS: Array<[number, number, number]> = [
  [0.85, 0.3, 0.4],
  [-0.5, -0.55, 0.65],
  [0.1, 0.75, -0.6],
];

/**
 * The hero object — a single small glowing sphere, reused at every scale
 * throughout the video. Given a continuous slow spin driven by `frame` (a
 * proton genuinely has quantum spin, so this is thematically honest, not
 * just decoration), a bump map for surface micro-detail, and a few small
 * flecks fixed to the rotating group so the spin is unmistakable on camera.
 */
export const Proton: React.FC<{state: ObjectState; color?: string; frame?: number}> = ({
  state,
  color = '#ff6a3d',
  frame = 0,
}) => {
  const bump = useNoiseTexture(128, 3, 3);
  if (!state.visible || state.opacity <= 0.001) return null;
  const r = BASE_RADIUS * state.scale;
  return (
    <group position={state.position} rotation={[frame * 0.014, frame * 0.026, 0]}>
      <mesh scale={r}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.7}
          roughness={0.5}
          metalness={0.05}
          bumpMap={bump}
          bumpScale={0.1}
          transparent={state.opacity < 1}
          opacity={state.opacity}
        />
      </mesh>
      {FLECKS.map((p, i) => (
        <mesh key={i} position={[p[0] * r * 1.001, p[1] * r * 1.001, p[2] * r * 1.001]} scale={r * 0.16}>
          <sphereGeometry args={[1, 12, 10]} />
          <meshStandardMaterial
            color="#ffe0c2"
            emissive="#ffb388"
            emissiveIntensity={0.9}
            roughness={0.4}
            transparent={state.opacity < 1}
            opacity={state.opacity}
          />
        </mesh>
      ))}
      <pointLight color={color} intensity={1.2 * r} distance={r * 30} decay={2} />
    </group>
  );
};
