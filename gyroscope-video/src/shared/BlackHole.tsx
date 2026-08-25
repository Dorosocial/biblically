import React, {useMemo} from 'react';
import * as THREE from 'three';
import {mulberry32} from './random';

/**
 * The detailed black hole design — see docs/black_hole_visual_reference.md
 * for the full spec this implements. Distinct from (and supersedes, for
 * new work) the simpler `blackhole/scene/BlackHole.tsx` built for the
 * earlier "Scientists Are Terrified of This Black Hole" short — that file
 * is left alone so the earlier video isn't affected by this one changing.
 *
 * Four layered pieces, all ordinary additively-blended MeshBasicMaterial
 * (no shader compile, no extra render pass — see the earlier component's
 * notes on why this environment's software WebGL can't afford that):
 *   1. event horizon — pure black sphere, razor-sharp edge, no gradient.
 *   2. photon ring — a thin, extremely bright ring hugging the horizon
 *      directly. The single brightest/sharpest thing in the scene.
 *   3. accretion disk — a wide (3-5x horizon radius) turbulent ring, with
 *      a white/blue-white -> yellow -> orange -> deep-red gradient from
 *      inner to outer edge, tilted ~25° by default.
 *   4. lensing arcs — two thin rings using the disk's own hot inner-edge
 *      colors, tucked close to the horizon on two different tilts, so the
 *      disk's far-side light appears to wrap over/under the sphere (the
 *      Interstellar-Gargantua signature) rather than just framing it left
 *      and right like Saturn's rings.
 */
export const BlackHole: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  opacity?: number;
  diskOpacity?: number;
  lensingOpacity?: number;
  seed?: number;
}> = ({
  position = [0, 0, 0],
  // ~25 deg default tilt, per spec. Deliberately a COMPOUND tilt (not a
  // single-axis rotation): tilting purely around X leaves the X-axis
  // itself invariant, so any camera orbiting near azimuth 0 (i.e.
  // positioned along that same axis) ends up viewing the disk exactly
  // edge-on regardless of the tilt angle — confirmed via a direct
  // still-frame check (a "slow orbit" shot at azimuth~0 rendered the disk
  // as a giant diagonal beam filling the frame, not a legible ellipse).
  // Mixing in Y and Z components means no simple axis-aligned orbit
  // position accidentally lines up with an invariant axis.
  rotation = [-0.4, 0.32, 0.08],
  scale = 1,
  opacity = 1,
  diskOpacity = 1,
  lensingOpacity = 1,
  seed = 909,
}) => {
  // Turbulent disk texture: a radial (white/blue-white -> yellow -> orange
  // -> deep red) gradient with random streaky brightness variation layered
  // on top, so the disk reads as swirling gas, not a flat clean torus.
  // Canvas is (angle x radius) — verified against a render (not assumed
  // from RingGeometry's UV convention) which axis maps to which; V=0 is
  // the inner/hot edge here.
  const diskTexture = useMemo(() => {
    const W = 512;
    const H = 128;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#eaf3ff'); // inner edge — white/blue-white (hottest)
    grad.addColorStop(0.18, '#fff6d8');
    grad.addColorStop(0.4, '#ffd35c'); // yellow
    grad.addColorStop(0.68, '#ff8a2a'); // orange
    grad.addColorStop(1, '#7a1c0a'); // deep red, outer edge
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Turbulence: streaky brightness variation, deterministic via seed.
    const rand = mulberry32(seed);
    for (let i = 0; i < 90; i++) {
      const y = rand() * H;
      const x = rand() * W;
      const streakW = 30 + rand() * 140;
      const streakH = 3 + rand() * 10;
      const brighten = rand() > 0.4;
      ctx.globalAlpha = 0.08 + rand() * 0.22;
      ctx.fillStyle = brighten ? '#ffffff' : '#000000';
      ctx.beginPath();
      ctx.ellipse(x, y, streakW, streakH, 0, 0, Math.PI * 2);
      ctx.fill();
      // wrap horizontally so streaks crossing the seam still read
      ctx.beginPath();
      ctx.ellipse(x - W, y, streakW, streakH, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + W, y, streakW, streakH, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Fade the outer edge to transparent so the disk doesn't end in a hard ring.
    const alphaFade = ctx.createLinearGradient(0, 0, 0, H);
    alphaFade.addColorStop(0, 'rgba(0,0,0,0)');
    alphaFade.addColorStop(0.85, 'rgba(0,0,0,0)');
    alphaFade.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = alphaFade;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  // Hot inner-edge gradient reused for the photon ring + lensing arcs —
  // these represent the same hot material, just compressed into a thin
  // band right at the horizon, so they should share the disk's hottest
  // colors rather than introducing a separate palette.
  const hotEdgeTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 8;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.4, '#eaf3ff');
    grad.addColorStop(1, 'rgba(255,210,120,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 8, 128);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    return tex;
  }, []);

  if (opacity <= 0.001) return null;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* event horizon — pure black, razor-sharp edge, no gradient/fuzz */}
      <mesh renderOrder={1}>
        <sphereGeometry args={[1, 64, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={opacity} depthWrite={opacity >= 0.999} />
      </mesh>

      {/* photon ring — thin, extremely bright, hugs the horizon directly.
          The brightest/sharpest element in the scene, distinctly brighter
          than the disk. */}
      <mesh renderOrder={4}>
        <ringGeometry args={[1.0, 1.035, 128, 1]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* accretion disk — 3-5x the horizon's radius, turbulent, tilted.
          Inner edge at 1.32 — slightly overlapping the lensing arcs' outer
          edge (1.28) rather than starting flush at the horizon (1.18, the
          first pass) or leaving a hard dark gap (1.55, the second pass).
          Flush-at-horizon made the lensing arcs indistinguishable from
          ordinary disk texture; a hard gap read as an odd "donut hole."
          The slight overlap blends the two into one continuous band while
          the lensing arcs' different (hot-white) texture still reads as
          its own feature near the horizon. */}
      {diskOpacity > 0.001 && (
        <mesh renderOrder={2}>
          <ringGeometry args={[1.32, 4.6, 160, 1]} />
          <meshBasicMaterial
            map={diskTexture}
            transparent
            opacity={opacity * diskOpacity}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* lensing arcs — the disk's far-side light wrapping over/under the
          sphere. Two thin rings on genuinely perpendicular rotation axes
          (rotating a ring around its OWN normal is a visual no-op — this
          was a real bug found and fixed while building the earlier
          component; X-axis and Y-axis tilts here give real, different
          plane orientations). Sized 1.02-1.28 — bigger than the earlier
          1.0-1.16, both to leave a clean gap before the disk (above) and
          to stay legible as its own band rather than fusing with the
          razor-thin photon ring right at the horizon. */}
      {lensingOpacity > 0.001 && (
        <>
          <mesh rotation={[1.35, 0, 0]} renderOrder={3}>
            <ringGeometry args={[1.02, 1.28, 128, 1]} />
            <meshBasicMaterial
              map={hotEdgeTexture}
              transparent
              opacity={opacity * lensingOpacity}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh rotation={[0, 1.35, 0.44]} renderOrder={3}>
            <ringGeometry args={[1.02, 1.24, 128, 1]} />
            <meshBasicMaterial
              map={hotEdgeTexture}
              transparent
              opacity={opacity * lensingOpacity * 0.8}
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
