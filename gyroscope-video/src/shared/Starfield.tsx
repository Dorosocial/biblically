import React, {useMemo} from 'react';
import * as THREE from 'three';
import {mulberry32} from './random';

/**
 * Sparse glowing point-star background, reusable across videos.
 *
 * GRAVITATIONAL LENSING — simplified approximation, not a ray-traced
 * shader: a true lensing effect (bending light via a screen-space
 * post-process distortion sampling a rendered background) needs an extra
 * render-to-texture pass per frame. This project's earlier work
 * (proton video) found exactly that kind of extra pass catastrophically
 * slow on this environment's software (non-GPU) WebGL — 30s+/frame,
 * timing out full renders. So instead: each star's position is displaced
 * in plain JS/CPU, per frame, based on its angular distance from the
 * camera->blackHoleCenter axis — stars near that axis (i.e. near the
 * black hole's silhouette, as seen from the camera) get pushed outward,
 * stars far from it are untouched. This is a legitimate stand-in for
 * "background starlight bending around the edge" without any shader
 * compilation or extra render passes — cheap enough to run every frame
 * for a few hundred stars. `cameraPosition` is passed in explicitly
 * (computed once by the caller from the same cameraTimeline used to
 * actually move the camera) rather than read via useThree, so this stays
 * a pure function of frame with no render-order coupling.
 *
 * BEND MAGNITUDE BUG (found + fixed): the first version capped the bend at
 * up to 1.1 (nearly a full unit vector's worth of transverse push) for any
 * star within 0.55 rad of the axis. Since the camera always looks directly
 * at the black hole (lookAt === blackHoleCenter) with a narrow ~30deg FOV,
 * the *entire visible frustum* sits well inside that 0.55 rad cone — so
 * every single frustum-visible star got bent, at nearly the maximum
 * magnitude, straight out of frame. Verified directly with a standalone
 * script projecting warped star positions through the real camera/FOV:
 * 0 of 1000 stars remained in frustum at any tested frame, vs. a healthy
 * count with the warp disabled. Retuned to a much smaller cap (0.09) and
 * narrower zone (0.35 rad) so stars near dead-center visibly deflect by a
 * few degrees — enough to read as bending — without every star in frame
 * getting shoved past the frustum edge.
 */
export const Starfield: React.FC<{
  count?: number;
  radius?: number;
  seed?: number;
  opacity?: number;
  size?: number;
  warpStrength?: number; // 0 = no lensing warp, 1 = full strength
  cameraPosition?: [number, number, number];
  blackHoleCenter?: [number, number, number];
  color?: string;
}> = ({
  count = 700,
  radius = 45,
  seed = 1337,
  opacity = 1,
  size = 0.16,
  warpStrength = 0,
  cameraPosition = [0, 0, 10],
  blackHoleCenter = [0, 0, 0],
  color = '#dfe9ff',
}) => {
  const basePositions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const rand = mulberry32(seed);
    for (let i = 0; i < count; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = radius * (0.55 + 0.45 * rand());
      arr[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, radius, seed]);

  const sizes = useMemo(() => {
    const arr = new Float32Array(count);
    const rand = mulberry32(seed + 1);
    for (let i = 0; i < count; i++) arr[i] = 0.06 + rand() * 0.14;
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, seed]);

  const displayPositions = useMemo(() => {
    if (warpStrength <= 0.001) return basePositions;
    const out = new Float32Array(basePositions.length);
    const camPos = new THREE.Vector3(...cameraPosition);
    const bhCenter = new THREE.Vector3(...blackHoleCenter);
    const axis = bhCenter.clone().sub(camPos);
    if (axis.lengthSq() < 1e-6) return basePositions;
    axis.normalize();

    for (let i = 0; i < basePositions.length; i += 3) {
      const p = new THREE.Vector3(basePositions[i], basePositions[i + 1], basePositions[i + 2]);
      const toStar = p.clone().sub(camPos);
      const dist = toStar.length();
      toStar.normalize();
      const cosAngle = THREE.MathUtils.clamp(toStar.dot(axis), -1, 1);
      const angle = Math.acos(cosAngle);

      if (angle < 0.35) {
        const parallel = axis.clone().multiplyScalar(cosAngle);
        const perp = toStar.clone().sub(parallel);
        const perpLen = perp.length();
        if (perpLen > 1e-5) {
          perp.normalize();
          const bend = Math.min((warpStrength * 0.012) / (angle * angle + 0.05), 0.09);
          const newDir = toStar.clone().addScaledVector(perp, bend).normalize();
          const newP = camPos.clone().addScaledVector(newDir, dist);
          out[i] = newP.x;
          out[i + 1] = newP.y;
          out[i + 2] = newP.z;
          continue;
        }
      }
      out[i] = basePositions[i];
      out[i + 1] = basePositions[i + 1];
      out[i + 2] = basePositions[i + 2];
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePositions, warpStrength, ...cameraPosition, ...blackHoleCenter]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[displayPositions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        sizeAttenuation={false}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
