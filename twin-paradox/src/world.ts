// Shared world-space layout constants + small math helpers used by both the
// 3D Scene (camera + objects) and the HTML Overlay (so numerals/labels agree
// with what the camera is currently looking at).
import * as THREE from 'three';

export const EARTH_POS: [number, number, number] = [0, 0, 0];
export const EARTH_R = 6;

// Spacecraft journey, expressed as a function of t in [0,1]:
//  t in [0, 0.5]  -> outbound leg, Earth to turnaround
//  t in [0.5, 1]  -> return leg, turnaround back to Earth
export const SHIP_HOME: [number, number, number] = [4.6, 4.4, 1.2];
export const SHIP_TURNAROUND: [number, number, number] = [46, 16, -10];

export const journeyPos = (t: number): [number, number, number] => {
  const clamped = Math.max(0, Math.min(1, t));
  const bulge = Math.sin(clamped * Math.PI) * 6;
  if (clamped <= 0.5) {
    const lt = clamped / 0.5;
    const p = new THREE.Vector3(...SHIP_HOME).lerp(new THREE.Vector3(...SHIP_TURNAROUND), lt);
    p.y += bulge * 0.5;
    return [p.x, p.y, p.z];
  }
  const lt = (clamped - 0.5) / 0.5;
  const p = new THREE.Vector3(...SHIP_TURNAROUND).lerp(new THREE.Vector3(...SHIP_HOME), lt);
  p.y += bulge * 0.5;
  return [p.x, p.y, p.z];
};

export const journeyHeading = (t: number): [number, number, number] => {
  const eps = 0.005;
  const a = journeyPos(Math.max(0, t - eps));
  const b = journeyPos(Math.min(1, t + eps));
  const dir = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize();
  // Spacecraft model's nose points along local +X by default; align +X to dir.
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);
  const euler = new THREE.Euler().setFromQuaternion(quat);
  return [euler.x, euler.y, euler.z];
};

// "Studio" presentation slots — used whenever the shot calls for both
// clocks shown face-on, isolated in darkness. Stacked vertically (not
// side-by-side) because the composition is 9:16: a PerspectiveCamera's
// `fov` is always the VERTICAL field of view, so vertical spread is the
// dimension that survives portrait framing untouched, while horizontal
// spread would clip against the much narrower horizontal FOV.
export const CLOCK_TOP: [number, number, number] = [0, 1.6, 0];
export const CLOCK_BOTTOM: [number, number, number] = [0, -1.6, 0];
// Pair shots also render each ClockFace at this scale (see Scene.tsx) so
// the full stacked pair -- not just its vertical centers -- clears both
// the vertical AND the (much narrower, portrait) horizontal FOV.
export const STUDIO_CLOCK_SCALE = 0.72;

export const lerp3 = (
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
