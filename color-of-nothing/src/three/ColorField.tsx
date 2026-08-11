import React, {useMemo} from 'react';
import * as THREE from 'three';
import {hashRandom} from './lib/utils';

interface ColorOrbsProps {
  seconds: number;
  count: number;
  palette: readonly string[];
  opacity: number;
  spread: number;
  seedOffset?: number;
  baseSize?: number;
  drift?: number;
}

/**
 * A scatter of small, distinctly-colored glowing spheres — used to make the
 * color-burst moments read as many simultaneous, clearly different hues
 * rather than one blended wash.
 */
export const ColorOrbs: React.FC<ColorOrbsProps> = ({
  seconds,
  count,
  palette,
  opacity,
  spread,
  seedOffset = 0,
  baseSize = 0.05,
  drift = 0.15,
}) => {
  if (opacity <= 0.002) return null;

  const orbs = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => {
      const s = i + seedOffset;
      const rx = hashRandom(s * 3.1) * 2 - 1;
      const ry = hashRandom(s * 7.7) * 2 - 1;
      const rz = hashRandom(s * 13.3) * 2 - 1;
      const color = palette[i % palette.length];
      const size = baseSize * (0.6 + hashRandom(s * 2.2));
      const phase = hashRandom(s * 5.5) * Math.PI * 2;
      return {rx, ry, rz, color, size, phase};
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, seedOffset, palette.length]);

  return (
    <group>
      {orbs.map((o, i) => {
        const dx = Math.sin(seconds * 0.3 + o.phase) * drift;
        const dy = Math.cos(seconds * 0.24 + o.phase) * drift;
        return (
          <mesh key={i} position={[o.rx * spread + dx, o.ry * spread + dy, o.rz * spread]}>
            <sphereGeometry args={[o.size, 10, 10]} />
            <meshBasicMaterial color={o.color} transparent opacity={opacity} />
          </mesh>
        );
      })}
    </group>
  );
};

interface RainbowGradientPlaneProps {
  position: [number, number, number];
  rotationY: number;
  opacity: number;
  stops: readonly string[];
  width?: number;
  height?: number;
}

/**
 * An actual full-spectrum gradient plane — red through violet, built with
 * per-vertex colors so the transition is a genuine smooth gradient rather
 * than a flat wash.
 */
export const RainbowGradientPlane: React.FC<RainbowGradientPlaneProps> = ({
  position,
  rotationY,
  opacity,
  stops,
  width = 3.2,
  height = 0.9,
}) => {
  const geometry = useMemo(() => {
    const segments = 128;
    const geo = new THREE.PlaneGeometry(width, height, segments, 1);
    const colors = new Float32Array((segments + 1) * 2 * 3);
    const tmp = new THREE.Color();
    const stopColors = stops.map((s) => new THREE.Color(s));

    for (let ix = 0; ix <= segments; ix++) {
      const t = ix / segments;
      const scaled = t * (stopColors.length - 1);
      const idx = Math.min(stopColors.length - 2, Math.floor(scaled));
      const localT = scaled - idx;
      tmp.copy(stopColors[idx]).lerp(stopColors[idx + 1], localT);
      for (let iy = 0; iy < 2; iy++) {
        const vertIndex = iy * (segments + 1) + ix;
        colors[vertIndex * 3] = tmp.r;
        colors[vertIndex * 3 + 1] = tmp.g;
        colors[vertIndex * 3 + 2] = tmp.b;
      }
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, stops.join(',')]);

  if (opacity <= 0.002) return null;

  return (
    <mesh position={position} rotation={[0, rotationY, 0]} geometry={geometry}>
      <meshBasicMaterial vertexColors transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
};
