/**
 * Camera language, Section 1: extremely slow push = quiet cold-open dread ·
 * rapid zoom-out = the enumerated scale-up ("galaxy, star, planet, you") ·
 * continuous pull-back = uninterrupted flight past Earth/Solar System/Milky
 * Way · wide orbit = first full reveal of the observable-universe sphere ·
 * massive zoom-out = the dramatic-irony "looks like a black hole" reveal ·
 * locked/static = the held black pause.
 *
 * Pure function of the absolute frame number, exactly like physics.ts.
 */
import * as THREE from 'three';
import {CUE} from '../timing';
import {kf} from '../physics';

export interface CameraState {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov: number;
}

const ORIGIN = new THREE.Vector3(0, 0, 0);
const lerpV = (a: THREE.Vector3, b: THREE.Vector3, t: number) => a.clone().lerp(b, t);
const s = (frame: number, f0: number, f1: number, v0: number, v1: number, linear = false) =>
  kf(frame, f0, f1, v0, v1, linear);

const orbit = (center: THREE.Vector3, radius: number, azimuthDeg: number, elevationDeg: number): THREE.Vector3 => {
  const az = THREE.MathUtils.degToRad(azimuthDeg);
  const el = THREE.MathUtils.degToRad(elevationDeg);
  return new THREE.Vector3(
    center.x + radius * Math.cos(el) * Math.cos(az),
    center.y + radius * Math.sin(el),
    center.z + radius * Math.cos(el) * Math.sin(az),
  );
};

export const getCameraState = (frame: number): CameraState => {
  let position = new THREE.Vector3(0, 0, 2.6);
  let lookAt = ORIGIN.clone();
  let fov = 30;

  // ---- Beat 1 (0-5.5s): extremely slow push-in ---------------------------
  if (frame < CUE.pointExpands) {
    const t = s(frame, CUE.hook, CUE.pointExpands, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(2.6, 2.2, t));
    fov = 28;
  }

  // ---- Beat 2 (5.5-13.1s): rapid zoom-out ---------------------------------
  else if (frame < CUE.flyPastCosmicWeb) {
    const t = Math.pow(s(frame, CUE.pointExpands, CUE.flyPastCosmicWeb, 0, 1, true), 0.6);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(2.2, 10, t));
    fov = 32;
  }

  // ---- Beat 3 (13.1-19.5s): continuous pull-back --------------------------
  else if (frame < CUE.observableUniverseSphere) {
    const t = s(frame, CUE.flyPastCosmicWeb, CUE.observableUniverseSphere, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(10, 19, t));
    fov = 34;
  }

  // ---- Beat 4 (19.5-22.9s): wide orbit around the reveal ------------------
  else if (frame < CUE.universeAsBlackHoleRegion) {
    const t = s(frame, CUE.observableUniverseSphere, CUE.universeAsBlackHoleRegion, -12, 12, true);
    position = orbit(ORIGIN, 19, t, 6);
    fov = 34;
  }

  // ---- Beat 5 (22.9-32.4s): massive zoom-out ------------------------------
  // Endpoint distance tuned against physics.ts's scale endpoint (1.3), not
  // picked independently — a first pass went out to distance ~96 (paired
  // with scale 0.9), which shrank the "universe as black-hole-like region"
  // below legibility well before the beat ended (confirmed via a direct
  // still-frame check, not just arithmetic). ~55 keeps the halo's on-screen
  // radius comfortably readable (~40px+) through the whole beat while still
  // reading as a genuine "massive zoom-out" from the beat 4 orbit radius.
  else if (frame < CUE.hardCutToBlack) {
    const t = Math.pow(s(frame, CUE.universeAsBlackHoleRegion, CUE.hardCutToBlack, 0, 1, true), 0.8);
    position = lerpV(orbit(ORIGIN, 19, 12, 6), new THREE.Vector3(3.5, 8, 54), t);
    fov = 40;
  }

  // ---- Beat 6 (32.4-39.0s): locked, held black ----------------------------
  else {
    position = new THREE.Vector3(3.5, 8, 54);
    fov = 40;
  }

  return {position, lookAt, fov};
};
