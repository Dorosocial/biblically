import {useMemo} from 'react';
import * as THREE from 'three';

/**
 * A small procedural linear-gradient texture generated once on a canvas —
 * used for the accretion disk's radial hot->cool color ramp (mapped along
 * a ring/torus's V coordinate) without needing any external image file.
 * Orientation (which end reads as "inner"/hot) was verified by eye against
 * an actual render, not assumed from RingGeometry's UV convention.
 */
export const useGradientTexture = (stops: Array<{offset: number; color: string}>, size = 256): THREE.CanvasTexture => {
  const key = stops.map((s) => `${s.offset}:${s.color}`).join('|');
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 8;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, size);
    stops.forEach(({offset, color}) => grad.addColorStop(offset, color));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 8, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, size]);
};
