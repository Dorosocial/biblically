import React, {useMemo} from 'react';
import * as THREE from 'three';
import {mulberry32} from './random';

/** A sphere textured with a procedural mottled blue/orange/red pattern,
 * standing in for a cosmic-microwave-background temperature map — the
 * classic WMAP/Planck "baby picture of the universe" look. Built the same
 * way as BlackHole.tsx's turbulent disk texture: a base gradient plus
 * random seeded blotches, no external image needed. */
export const CMBMap: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  opacity?: number;
  seed?: number;
}> = ({position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, opacity = 1, seed = 4114}) => {
  const texture = useMemo(() => {
    const W = 512;
    const H = 256;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#1a3a6b';
    ctx.fillRect(0, 0, W, H);

    const rand = mulberry32(seed);
    const colors = ['#ff8a4a', '#ffd27a', '#3a6bcf', '#7ea8ff', '#ff5a4a'];
    for (let i = 0; i < 260; i++) {
      const x = rand() * W;
      const y = rand() * H;
      const r = 6 + rand() * 22;
      const color = colors[Math.floor(rand() * colors.length)];
      ctx.globalAlpha = 0.35 + rand() * 0.35;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * (0.6 + rand() * 0.4), rand() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
      // wrap horizontally for seamless equirectangular tiling
      ctx.beginPath();
      ctx.ellipse(x - W, y, r, r * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + W, y, r, r * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  if (opacity <= 0.001) return null;

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <sphereGeometry args={[1, 48, 32]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} />
    </mesh>
  );
};
