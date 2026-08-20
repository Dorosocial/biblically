import React from 'react';
import * as THREE from 'three';
import {useGradientTexture} from '../../shared/useGradientTexture';

/**
 * A procedural glowing Sun — a bright unlit core sphere plus a larger,
 * soft additive-blended glow shell. No model/texture sourcing.
 */
export const Sun: React.FC<{
  position?: [number, number, number];
  scale?: number;
  opacity?: number;
}> = ({position = [0, 0, 0], scale = 1, opacity = 1}) => {
  const glow = useGradientTexture([
    {offset: 0, color: '#fff6df'},
    {offset: 0.4, color: '#ffcf7a'},
    {offset: 1, color: 'rgba(255,140,40,0)'},
  ]);
  if (opacity <= 0.001) return null;

  return (
    <group position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[1, 32, 24]} />
        <meshBasicMaterial color="#fff4d6" transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* soft outer glow shell — radial-ish falloff via a sprite-style billboard would be
          nicer, but a slightly larger additive sphere with a gradient map reads well
          enough and is much cheaper than a custom billboard/shader pass. */}
      <mesh scale={1.8}>
        <sphereGeometry args={[1, 24, 18]} />
        <meshBasicMaterial
          map={glow}
          color="#ffcf7a"
          transparent
          opacity={opacity * 0.35}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
