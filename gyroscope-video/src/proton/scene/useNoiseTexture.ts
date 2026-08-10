import {useMemo} from 'react';
import * as THREE from 'three';

/**
 * A small procedural grayscale noise texture, generated once on a canvas —
 * used as a bump map for subtle surface detail (hair, lattice atoms) without
 * needing any external image file.
 */
export const useNoiseTexture = (size = 128, repeatX = 1, repeatY = 1): THREE.CanvasTexture => {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.createImageData(size, size);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = 90 + Math.floor(Math.random() * 120);
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    return tex;
  }, [size, repeatX, repeatY]);
};
