import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {hashRandom, gentleSine} from './lib/utils';
import {EMBER_PALETTE} from './lib/palette';
import {getDotTexture} from './lib/dotTexture';

interface AmbientEmbersProps {
  seconds: number;
  count?: number;
  /** Extra opacity multiplier — dial down (not off) during moments with a lot else going on. */
  intensity?: number;
}

/**
 * A sparse field of faint, slowly drifting glowing embers, mounted
 * unconditionally for the entire runtime. This is the baseline "something is
 * always moving" layer: no matter what beat is active, there is always a
 * handful of soft glowing points gently drifting and pulsing on screen.
 *
 * Positioned RELATIVE TO THE CAMERA (in its local right/up/forward basis,
 * recomputed every frame from the camera's current transform) rather than
 * fixed in world space — CameraRig moves the camera through a huge range of
 * distances (close macro pushes all the way out to a z=16 pull-back), and a
 * world-fixed ember field would either fill the frame or shrink to
 * invisible depending on where the camera happens to be. Camera-relative
 * placement keeps them at a consistent, always-visible apparent size and
 * distribution no matter what the rest of the scene is doing.
 */
export const AmbientEmbers: React.FC<AmbientEmbersProps> = ({seconds, count = 22, intensity = 1}) => {
  const {camera} = useThree();

  const seeds = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        offX: (hashRandom(i * 11.3) - 0.5) * 2.6,
        offY: (hashRandom(i * 17.9) - 0.5) * 2.2,
        depth: 1.4 + hashRandom(i * 23.7) * 3.2,
        speed: 0.05 + hashRandom(i * 5.1) * 0.08,
        phase: hashRandom(i * 9.7) * Math.PI * 2,
        driftR: 0.3 + hashRandom(i * 13.3) * 0.55,
        size: 0.07 + hashRandom(i * 7.1) * 0.09,
        color: EMBER_PALETTE[i % EMBER_PALETTE.length],
      })),
    [count],
  );

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const tmp = new THREE.Color();

    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    const up = new THREE.Vector3();
    camera.getWorldDirection(forward);
    right.crossVectors(forward, camera.up).normalize();
    up.crossVectors(right, forward).normalize();

    const p = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      const t = seconds * s.speed + s.phase;
      const dx = s.offX + Math.sin(t) * s.driftR;
      const dy = s.offY + Math.cos(t * 0.8) * s.driftR * 0.8;
      const dz = s.depth + Math.sin(t * 0.5 + 2.1) * 0.4;

      p.copy(camera.position)
        .addScaledVector(forward, dz)
        .addScaledVector(right, dx)
        .addScaledVector(up, dy);

      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
      tmp.set(s.color);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seeds, seconds, camera.position.x, camera.position.y, camera.position.z, camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w]);

  // A slow overall breathing pulse on top of the per-particle drift.
  const pulse = 0.6 + gentleSine(seconds, 6.2, 0.32, 0.4);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.09}
        map={getDotTexture()}
        alphaMap={getDotTexture()}
        vertexColors
        transparent
        opacity={Math.max(0, Math.min(1, pulse * intensity))}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
