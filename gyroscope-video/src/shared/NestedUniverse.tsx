import React, {useMemo} from 'react';
import * as THREE from 'three';
import {mulberry32} from './random';
import {useGradientTexture} from './useGradientTexture';

/**
 * The recurring "tiny glowing universe" motif, reusable across videos: a
 * bright core plus a scatter of small glowing "galaxy" points confined to a
 * sphere volume, plus a soft additive outer glow shell (same layered
 * pattern as Sun.tsx/BlackHole.tsx's halo — bright unlit core + BackSide
 * gradient shell, no shader needed).
 *
 * `revealLevel` (0-1) is what makes this "ambiguous at first, gradually
 * clarified, fully revealed later": at 0 it's just the bright core (reads
 * as a single point of light); as it rises toward 1 the galaxy scatter and
 * outer glow shell fade in, so the same component carries beat 1's "tiny
 * point in absolute darkness" through beat 4's "glowing sphere full of
 * galaxies" as one continuous, gradually-revealing object rather than a
 * hard swap between two different components (which would read as a cut,
 * not a reveal).
 */
export const NestedUniverse: React.FC<{
  position?: [number, number, number];
  scale?: number;
  opacity?: number;
  revealLevel?: number; // 0 = bare point of light, 1 = fully revealed galaxy sphere
  galaxyCount?: number;
  seed?: number;
  coreColor?: string;
  glowColor?: string;
}> = ({
  position = [0, 0, 0],
  scale = 1,
  opacity = 1,
  revealLevel = 0,
  galaxyCount = 220,
  seed = 4242,
  coreColor = '#eaf2ff',
  glowColor = '#9cc2ff',
}) => {
  const glowGradient = useGradientTexture([
    {offset: 0, color: '#ffffff'},
    {offset: 0.35, color: glowColor},
    {offset: 1, color: 'rgba(120,160,255,0)'},
  ]);

  const galaxyPositions = useMemo(() => {
    const arr = new Float32Array(galaxyCount * 3);
    const rand = mulberry32(seed);
    for (let i = 0; i < galaxyCount; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      // denser toward the center (cube-root bias) so it reads as a cluster,
      // not a hollow shell
      const r = Math.cbrt(rand()) * 1.0;
      arr[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galaxyCount, seed]);

  const galaxyColors = useMemo(() => {
    const arr = new Float32Array(galaxyCount * 3);
    const rand = mulberry32(seed + 1);
    const warm = new THREE.Color('#ffe3b0');
    const cool = new THREE.Color('#bcd8ff');
    for (let i = 0; i < galaxyCount; i++) {
      const c = warm.clone().lerp(cool, rand());
      arr[i * 3 + 0] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galaxyCount, seed]);

  if (opacity <= 0.001) return null;
  const reveal = THREE.MathUtils.clamp(revealLevel, 0, 1);

  return (
    <group position={position} scale={scale}>
      {/* bright core — always present, the "point of light" at revealLevel 0 */}
      <mesh renderOrder={1}>
        <sphereGeometry args={[0.12, 24, 18]} />
        <meshBasicMaterial color={coreColor} transparent opacity={opacity} />
      </mesh>
      <pointLight color={coreColor} intensity={2.2 * opacity} distance={8} />

      {/* small always-on point-glow halo — independent of revealLevel.
          Without this, a bare unlit sphere with no bloom postprocessing
          (this project builds all glow in code, no HDRI/postprocess) just
          reads as a flat grey disc, not "glowing" — confirmed by a direct
          still-frame check at revealLevel 0 (beat 1's "tiny point of light,
          not pure black-on-black"). This is deliberately small/tight (2.4x
          the core radius) so it reads as bloom around a point, not the big
          "glowing sphere" reveal — that's the separate, larger shell below. */}
      <mesh scale={2.4} renderOrder={0}>
        <sphereGeometry args={[0.12, 16, 12]} />
        <meshBasicMaterial
          map={glowGradient}
          color={coreColor}
          transparent
          opacity={opacity * 0.55}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* galaxy scatter — fades in with revealLevel */}
      {reveal > 0.01 && (
        <points renderOrder={2}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[galaxyPositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[galaxyColors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={4}
            sizeAttenuation={false}
            vertexColors
            transparent
            opacity={opacity * reveal}
            depthWrite={false}
            depthTest={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* soft outer glow shell — fades in with revealLevel, reads as
          "glowing sphere in darkness" once fully revealed */}
      {reveal > 0.01 && (
        <mesh scale={1.15} renderOrder={0}>
          <sphereGeometry args={[1, 24, 18]} />
          <meshBasicMaterial
            map={glowGradient}
            color={glowColor}
            transparent
            opacity={opacity * reveal * 0.5}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
};
