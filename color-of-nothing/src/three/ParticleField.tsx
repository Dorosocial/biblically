import React, {useMemo} from 'react';
import * as THREE from 'three';
import {getDotTexture} from './lib/dotTexture';

export interface ParticleFieldProps {
  count: number;
  seconds: number;
  size: number;
  opacity: number;
  /** Returns world-space position for particle i at the given seconds. */
  getPosition: (i: number, seconds: number) => [number, number, number];
  /** Returns an RGB hex color for particle i (called once, colors don't animate per-frame). */
  getColor?: (i: number) => string;
  color?: string;
  additive?: boolean;
}

/**
 * Generic point-cloud, recomputed per frame from a deterministic position
 * function — used for photon particles, dissolve debris, and color-burst
 * sparks. Positions are derived purely from `seconds` (no internal state),
 * so it renders identically for any given Remotion frame.
 */
export const ParticleField: React.FC<ParticleFieldProps> = ({
  count,
  seconds,
  size,
  opacity,
  getPosition,
  getColor,
  color = '#ffffff',
  additive = true,
}) => {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const [x, y, z] = getPosition(i, seconds);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      tmp.set(getColor ? getColor(i) : color);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, seconds]);

  if (opacity <= 0.002) return null;

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={size}
        map={getDotTexture()}
        alphaMap={getDotTexture()}
        vertexColors
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
};
