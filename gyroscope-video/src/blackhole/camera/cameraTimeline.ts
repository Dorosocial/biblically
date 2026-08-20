/**
 * Camera language, applied per-shot:
 *   extremely slow push = quiet opening dread · accelerating zoom = falling in
 *   wide cinematic orbit = first full reveal · forward flight = approach
 *   tilt+dive = crossing into the grid's frame of reference
 *   snap push-in = sudden dominance · locked shot = "nothing has changed yet"
 *   sideways slide = comparison · dead-center push = the point of no return.
 *
 * Pure function of the absolute frame number, exactly like physics.ts.
 */
import * as THREE from 'three';
import {CUE, DURATION_IN_FRAMES} from '../timing';
import {kf} from '../physics';

export interface CameraState {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov: number;
}

const ORIGIN = new THREE.Vector3(0, 0, 0);
const lerpV = (a: THREE.Vector3, b: THREE.Vector3, t: number) => a.clone().lerp(b, t);
const s = (frame: number, f0: number, f1: number, v0: number, v1: number, linear = false) => kf(frame, f0, f1, v0, v1, linear);

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
  let position = new THREE.Vector3(0, 0, 20);
  let lookAt = ORIGIN.clone();
  let fov = 30;

  // ---- Shot 1 (0-3s): extremely slow push forward -----------------------
  if (frame < CUE.bendStars) {
    const shotStart = CUE.hook;
    const shotEnd = CUE.bendStars;
    position = lerpV(new THREE.Vector3(0, 0, 30), new THREE.Vector3(0, 0, 24), s(frame, shotStart, shotEnd, 0, 1, true));
    lookAt = ORIGIN.clone();
    fov = 32;
  }

  // ---- Shot 2 (3-6s): accelerating zoom toward the (invisible) center ---
  else if (frame < CUE.blackHoleReveal) {
    const shotStart = CUE.bendStars;
    const shotEnd = CUE.blackHoleReveal;
    const t = Math.pow(s(frame, shotStart, shotEnd, 0, 1, true), 1.8);
    position = lerpV(new THREE.Vector3(0, 0, 24), new THREE.Vector3(0, 0, 10), t);
    lookAt = ORIGIN.clone();
    fov = 32;
  }

  // ---- Shot 3 (6-10s, CRITICAL): wide cinematic orbit around the hole ----
  else if (frame < CUE.approachDisk) {
    const shotStart = CUE.blackHoleReveal;
    const shotEnd = CUE.approachDisk;
    const az = s(frame, shotStart, shotEnd, -35, 30, true);
    position = orbit(ORIGIN, 9, az, 14);
    lookAt = ORIGIN.clone();
    fov = 30;
  }

  // ---- Shot 4 (10-13s): slow forward flight, disk bends around the hole -
  else if (frame < CUE.spacetimeGridIntro) {
    const shotStart = CUE.approachDisk;
    const shotEnd = CUE.spacetimeGridIntro;
    const az = s(frame, shotStart, shotEnd, 30, 55, true);
    const radius = s(frame, shotStart, shotEnd, 9, 5.6);
    position = orbit(ORIGIN, radius, az, s(frame, shotStart, shotEnd, 14, 9));
    lookAt = ORIGIN.clone();
    fov = 30;
  }

  // ---- Shot 5 (13-16s): tilt down toward the grid, zoom in --------------
  else if (frame < CUE.dominateFrame) {
    const shotStart = CUE.spacetimeGridIntro;
    const shotEnd = CUE.dominateFrame;
    position = lerpV(new THREE.Vector3(0, 3.4, 5.4), new THREE.Vector3(0, 1.1, 3), s(frame, shotStart, shotEnd, 0, 1));
    lookAt = lerpV(new THREE.Vector3(0, 1.8, 0), new THREE.Vector3(0, -0.4, 0), s(frame, shotStart, shotEnd, 0, 1));
    fov = 32;
  }

  // ---- Shot 6 (16-19s): rapid snap push-in, hole dominates the frame ----
  else if (frame < CUE.titleCard) {
    const shotStart = CUE.dominateFrame;
    const shotEnd = CUE.titleCard;
    const t = Math.pow(s(frame, shotStart, shotEnd, 0, 1, true), 0.6); // fast-out ease — most motion happens immediately
    position = lerpV(new THREE.Vector3(0, 0, 6), new THREE.Vector3(0, 0, 2.6), t);
    lookAt = ORIGIN.clone();
    fov = 36;
  }

  // ---- Title card (19-20s): hold — black hole keeps slowly turning ------
  else if (frame < CUE.spacecraftApproach) {
    position = new THREE.Vector3(0, 0, 2.6);
    lookAt = ORIGIN.clone();
    fov = 36;
  }

  // ---- Shot 8 (20-24s): behind-spacecraft tracking shot -----------------
  else if (frame < CUE.scaleComparison) {
    const shotStart = CUE.spacecraftApproach;
    const shotEnd = CUE.scaleComparison;
    const shipZ = -1.2;
    position = lerpV(new THREE.Vector3(0, 0.35, shipZ + 2.2), new THREE.Vector3(0, 0.3, shipZ + 1.5), s(frame, shotStart, shotEnd, 0, 1, true));
    lookAt = new THREE.Vector3(0, 0.1, -14);
    fov = 28;
  }

  // ---- Shot 9 (24-27s): very wide, scale comparison ----------------------
  else if (frame < CUE.sunToBlackHole) {
    position = new THREE.Vector3(2, 3, 24);
    lookAt = new THREE.Vector3(0, 0, -6);
    fov = 34;
  }

  // ---- Shot 10 (27-31s): locked solar-system view ------------------------
  else if (frame < CUE.earthContinuesOrbit) {
    position = new THREE.Vector3(3, 3.4, 11);
    lookAt = ORIGIN.clone();
    fov = 34;
  }

  // ---- Shot 11 (31-34s): slow orbital camera -----------------------------
  else if (frame < CUE.sideBySideGravity) {
    const shotStart = CUE.earthContinuesOrbit;
    const shotEnd = CUE.sideBySideGravity;
    const az = s(frame, shotStart, shotEnd, -20, 20, true);
    position = orbit(ORIGIN, 11.6, az, 17);
    lookAt = ORIGIN.clone();
    fov = 34;
  }

  // ---- Shot 12 (34-38s): sideways slide, Sun vs black hole side by side -
  else if (frame < CUE.accelerateToward) {
    const shotStart = CUE.sideBySideGravity;
    const shotEnd = CUE.accelerateToward;
    position = lerpV(new THREE.Vector3(-5, 1, 7), new THREE.Vector3(5, 1, 7), s(frame, shotStart, shotEnd, 0, 1, true));
    lookAt = new THREE.Vector3(0, -0.3, 0);
    fov = 36;
  }

  // ---- Shot 13 (38-41s): sudden fast forward zoom ------------------------
  else if (frame < CUE.gridWarpsDive) {
    const shotStart = CUE.accelerateToward;
    const shotEnd = CUE.gridWarpsDive;
    const t = Math.pow(s(frame, shotStart, shotEnd, 0, 1, true), 2.1);
    position = lerpV(new THREE.Vector3(0, 1.2, 9), new THREE.Vector3(0, 0.4, 2.4), t);
    lookAt = ORIGIN.clone();
    fov = 30;
  }

  // ---- Shot 14 (41-45s): dive low along the warping grid surface --------
  else if (frame < CUE.twinClocks) {
    const shotStart = CUE.gridWarpsDive;
    const shotEnd = CUE.twinClocks;
    position = lerpV(new THREE.Vector3(0, 0.15, 3.4), new THREE.Vector3(0, -0.05, 0.6), s(frame, shotStart, shotEnd, 0, 1, true));
    lookAt = new THREE.Vector3(0, 0.6, -2);
    fov = 40;
  }

  // ---- Shot 15 (45-49s): subtle push, clocks dominate via overlay -------
  else if (frame < CUE.redshift) {
    const shotStart = CUE.twinClocks;
    const shotEnd = CUE.redshift;
    position = lerpV(new THREE.Vector3(0, 0, 6.4), new THREE.Vector3(0, 0, 5.2), s(frame, shotStart, shotEnd, 0, 1, true));
    lookAt = new THREE.Vector3(0, 0, -3);
    fov = 32;
  }

  // ---- Shot 16 (49-53s): near-static, slow-motion expansion feel --------
  else if (frame < CUE.eventHorizonFill) {
    const shotStart = CUE.redshift;
    const shotEnd = CUE.eventHorizonFill;
    position = lerpV(new THREE.Vector3(0, 0, 5.2), new THREE.Vector3(0, 0, 4.6), s(frame, shotStart, shotEnd, 0, 1, true));
    lookAt = new THREE.Vector3(0, 0, -3);
    fov = 32;
  }

  // ---- Shot 17 (53-58s, CRITICAL, unresolved): dead-center push-in ------
  // Accelerating ease so the push is still gathering speed at the very
  // last frame — deliberately NOT settling, "sequence incomplete."
  else {
    const shotStart = CUE.eventHorizonFill;
    const shotEnd = DURATION_IN_FRAMES;
    const t = Math.pow(s(frame, shotStart, shotEnd, 0, 1, true), 1.5);
    position = lerpV(new THREE.Vector3(0, 0, 5.5), new THREE.Vector3(0, 0, 1.9), t);
    lookAt = ORIGIN.clone();
    fov = THREE.MathUtils.lerp(32, 40, t);
  }

  return {position, lookAt, fov};
};
