import * as THREE from 'three';

let cached: THREE.Texture | null = null;

/**
 * A small soft-edged circular sprite, generated once and reused everywhere.
 * Without this, Three.js's default PointsMaterial renders each particle as
 * a hard-edged square, which reads as debris/pixels rather than soft
 * glowing points (photons, sparks, dissolve motes).
 */
export const getDotTexture = (): THREE.Texture => {
  if (cached) return cached;
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.6)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  cached = texture;
  return texture;
};
