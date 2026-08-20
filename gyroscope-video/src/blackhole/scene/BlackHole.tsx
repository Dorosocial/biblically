import React from 'react';
import * as THREE from 'three';
import {useGradientTexture} from '../../shared/useGradientTexture';

/**
 * The black hole — event horizon + accretion disk + a simplified
 * gravitational-lensing approximation.
 *
 * LENSING APPROACH USED — geometric approximation, not a ray-traced
 * shader: a physically-accurate lensing render bends light via a
 * screen-space post-process step (rendering the scene to a texture, then
 * distorting it around the horizon in a second pass). This project
 * already hit a wall with an analogous extra-pass technique
 * (meshPhysicalMaterial's `transmission`, in the proton video) that
 * caused 30s+/frame render times on this environment's software
 * (non-GPU) WebGL — a full lensing shader would very likely repeat that,
 * times a much longer video. So instead, two cheap, pure-geometry pieces
 * stand in for it: (1) a narrow accretion disk, tilted for the classic
 * dramatic angle; (2) a single thin "photon ring" halo hugging close to
 * the horizon's own radius, standing in for the light that would
 * actually be lensed around from behind the hole into a visible ring.
 * (In Starfield.tsx, a third piece — a CPU-computed position warp bends
 * background stars away from the horizon's silhouette.) None of this
 * needs a shader compile or a second render target — everything here is
 * ordinary additively-blended, unlit (MeshBasicMaterial) geometry.
 *
 * v2 note: the first pass made the disk too wide relative to the horizon
 * (read as Saturn's rings) and used two overlapping halo rings at
 * different tilts, whose silhouettes crossed into a distracting
 * heart-shaped outline instead of a clean glow — narrowed the disk and
 * dropped to one thinner, warmer-colored halo ring.
 */
export const BlackHole: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  opacity?: number;
  diskOpacity?: number;
  haloOpacity?: number;
}> = ({position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, opacity = 1, diskOpacity = 1, haloOpacity = 1}) => {
  const diskGradient = useGradientTexture([
    {offset: 0, color: '#ffedc2'},
    {offset: 0.25, color: '#ffb154'},
    {offset: 0.55, color: '#f0662a'},
    {offset: 0.82, color: '#8a2a12'},
    {offset: 1, color: 'rgba(60,10,5,0)'},
  ]);
  const haloGradient = useGradientTexture([
    {offset: 0, color: '#ffdda0'},
    {offset: 0.55, color: '#ffb663'},
    {offset: 1, color: 'rgba(255,150,70,0)'},
  ]);

  if (opacity <= 0.001) return null;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* event horizon — pure matte black, unlit so nothing can make it "glow" */}
      <mesh renderOrder={0}>
        <sphereGeometry args={[1, 48, 36]} />
        <meshBasicMaterial color="#000000" transparent={opacity < 1} opacity={opacity} />
      </mesh>

      {/* accretion disk — narrow ring hugging close to the horizon, dramatic
          near-edge-on tilt (not a wide flat Saturn-style ring) */}
      {diskOpacity > 0.001 && (
        <mesh rotation={[-1.35, 0, 0]} renderOrder={2}>
          <ringGeometry args={[1.28, 1.95, 96, 1]} />
          <meshBasicMaterial
            map={diskGradient}
            transparent
            opacity={opacity * diskOpacity}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* photon-ring halo — thin, warm, hugging the horizon's own radius.
          A single tilted flat ring only ever reads as "planetary rings"
          (material to the left/right, never above/below) — real lensing's
          signature is a bright arc appearing OVER THE TOP of the horizon
          too, from the far side of the disk bending around. Two halo
          rings on genuinely perpendicular axes (not the near-parallel
          tilts a first pass used, which crossed into a heart-shaped
          artifact) gives that all-the-way-around coverage instead. */}
      {haloOpacity > 0.001 && (
        <>
          <mesh rotation={[-1.35, 0, 0]} renderOrder={3}>
            <ringGeometry args={[1.01, 1.09, 96, 1]} />
            <meshBasicMaterial
              map={haloGradient}
              transparent
              opacity={opacity * haloOpacity}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          {/* Rotating a ring around its OWN normal axis (Z, since a flat
              ring's normal is +Z before any rotation) is a visual no-op —
              that was the first attempt's bug, and why this ring kept
              going edge-on/near-invisible through the orbit regardless of
              camera angle. Rotating around Y instead actually tilts the
              plane, giving a normal roughly perpendicular to the first
              ring's (mostly +Y) normal — this one's is mostly +X, so its
              plane contains the vertical axis and reads as an ellipse
              arcing over the top/bottom through most of the orbit. */}
          <mesh rotation={[0, 1.35, 0]} renderOrder={3}>
            <ringGeometry args={[1.01, 1.08, 96, 1]} />
            <meshBasicMaterial
              map={haloGradient}
              transparent
              opacity={opacity * haloOpacity * 0.75}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </>
      )}
    </group>
  );
};
