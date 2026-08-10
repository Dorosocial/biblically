/**
 * Camera language, applied per-shot:
 *   extreme push-in = discovery · extreme pull-back = scale reveal
 *   continuous zoom = crossing scientific scales · snap cut = surprise
 *   slow orbit = important object · freeze = major reveal incoming
 *   match cut = between scales · wide negative space = "how tiny" emphasis.
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
const DOT = new THREE.Vector3(1.55, 0.55, 0);

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

/** Deterministic small camera shake (never wall-clock-based) for "aggressive dolly" moments. */
const shake = (frame: number, amount: number): THREE.Vector3 =>
  new THREE.Vector3(Math.sin(frame * 1.7) * amount, Math.cos(frame * 2.3) * amount * 0.8, Math.sin(frame * 3.1) * amount * 0.4);

export const getCameraState = (frame: number): CameraState => {
  let position = new THREE.Vector3(0, 1, 8);
  let lookAt = ORIGIN.clone();
  let fov = 40;

  // ---- Shot 1: hook — extreme wide, rapid push, then snap to the dot -----
  if (frame < CUE.protonToBasketball) {
    const shotStart = CUE.hook;
    const shotEnd = CUE.protonToBasketball;
    const snapAt = shotStart + Math.round((shotEnd - shotStart) * 0.55);
    if (frame < snapAt) {
      position = lerpV(new THREE.Vector3(0, 2.5, 16), new THREE.Vector3(0, 0.6, 4), s(frame, shotStart, snapAt, 0, 1));
      lookAt = ORIGIN.clone();
      fov = s(frame, shotStart, snapAt, 30, 40);
    } else {
      position = lerpV(new THREE.Vector3(0.4, 0.65, 1.6), new THREE.Vector3(0.15, 0.58, 1.05), s(frame, snapAt, shotEnd, 0, 1));
      lookAt = DOT.clone();
      fov = 34;
    }
  }

  // ---- Shot 2: aggressive dolly-in with shake as proton scale-changes ----
  else if (frame < CUE.basketballToEarth) {
    const shotStart = CUE.protonToBasketball;
    const shotEnd = CUE.basketballToEarth;
    const base = lerpV(new THREE.Vector3(0.15, 0.58, 1.05), new THREE.Vector3(0, 0.4, 4.6), s(frame, shotStart, shotEnd, 0, 1));
    const shakeAmt = frame < shotStart + 20 ? (1 - (frame - shotStart) / 20) * 0.05 : 0;
    position = base.add(shake(frame, shakeAmt));
    lookAt = ORIGIN.clone();
    fov = s(frame, shotStart, shotEnd, 34, 42);
  }

  // ---- Shot 3: rapid reverse zoom revealing the enormous Earth -----------
  else if (frame < CUE.reverseToProton) {
    const shotStart = CUE.basketballToEarth;
    const shotEnd = CUE.reverseToProton;
    position = lerpV(new THREE.Vector3(0, 0.4, 4.6), new THREE.Vector3(2, 2.5, 22), s(frame, shotStart, shotEnd, 0, 1));
    lookAt = lerpV(ORIGIN, new THREE.Vector3(-0.6, 0.3, -1), s(frame, shotStart, shotEnd, 0, 1));
    fov = s(frame, shotStart, shotEnd, 42, 52);
  }

  // ---- Shot 4: orbit the basketball, then rack focus to the proton -------
  else if (frame < CUE.protonScaleLabel) {
    const shotStart = CUE.reverseToProton;
    const shotEnd = CUE.protonScaleLabel;
    const rackAt = shotStart + Math.round((shotEnd - shotStart) * 0.6);
    if (frame < rackAt) {
      const az = s(frame, shotStart, rackAt, 20, 100, true);
      position = orbit(ORIGIN, 5.2, az, 14);
      lookAt = ORIGIN.clone();
      fov = 40;
    } else {
      position = lerpV(orbit(ORIGIN, 5.2, 100, 14), new THREE.Vector3(0.5, 0.55, 2), s(frame, rackAt, shotEnd, 0, 1));
      lookAt = lerpV(ORIGIN, DOT, s(frame, rackAt, shotEnd, 0, 1));
      fov = s(frame, rackAt, shotEnd, 40, 30);
    }
  }

  // ---- Shot 5: slow macro push-in on the proton --------------------------
  else if (frame < CUE.numberTyping) {
    const shotStart = CUE.protonScaleLabel;
    const shotEnd = CUE.numberTyping;
    position = lerpV(new THREE.Vector3(1.9, 1.0, 1.3), new THREE.Vector3(1.68, 0.62, 0.55), s(frame, shotStart, shotEnd, 0, 1));
    lookAt = DOT.clone();
    fov = s(frame, shotStart, shotEnd, 28, 20);
  }

  // ---- Shot 6: locked camera — typography does all the work -------------
  else if (frame < CUE.hairCut) {
    position = new THREE.Vector3(1.68, 0.62, 0.55);
    lookAt = DOT.clone();
    fov = 20;
  }

  // ---- Shot 7: hard cut — microscopically close on the hair --------------
  else if (frame < CUE.hairTracking) {
    position = new THREE.Vector3(0.3, 0.15, 1.7);
    lookAt = ORIGIN.clone();
    fov = 36;
  }

  // ---- Shot 8: macro tracking shot along the hair ------------------------
  else if (frame < CUE.tunnelZoom) {
    const shotStart = CUE.hairTracking;
    const shotEnd = CUE.tunnelZoom;
    position = lerpV(new THREE.Vector3(-2.2, 0.1, 1.5), new THREE.Vector3(2.2, 0.05, 1.35), s(frame, shotStart, shotEnd, 0, 1, true));
    lookAt = new THREE.Vector3(0, 0, 0.3);
    fov = 32;
  }

  // ---- Shot 9 (CRITICAL): continuous accelerating tunnel dive ------------
  else if (frame < CUE.atomsReveal) {
    const shotStart = CUE.tunnelZoom;
    const shotEnd = CUE.atomsReveal;
    const t = (frame - shotStart) / (shotEnd - shotStart);
    // Ease-in acceleration: barely moving at first, screaming forward by the end.
    const eased = Math.pow(t, 2.6);
    const z = THREE.MathUtils.lerp(1.4, -46, eased);
    position = new THREE.Vector3(0, 0, z);
    lookAt = new THREE.Vector3(0, 0, z - 4);
    fov = THREE.MathUtils.lerp(34, 62, eased);
  }

  // ---- Shot 10: dramatic slow-down onto the atom lattice -----------------
  else if (frame < CUE.singleAtomNucleus) {
    const shotStart = CUE.atomsReveal;
    const shotEnd = CUE.singleAtomNucleus;
    position = lerpV(new THREE.Vector3(0, 0, -3.5), new THREE.Vector3(0, 0.3, 4.6), s(frame, shotStart, shotEnd, 0, 1));
    lookAt = ORIGIN.clone();
    fov = s(frame, shotStart, shotEnd, 60, 42);
  }

  // ---- Shot 11: push directly toward the nucleus -------------------------
  else if (frame < CUE.nucleusToProton) {
    const shotStart = CUE.singleAtomNucleus;
    const shotEnd = CUE.nucleusToProton;
    position = lerpV(new THREE.Vector3(0, 0.3, 4.6), new THREE.Vector3(0, 0.05, 1.1), s(frame, shotStart, shotEnd, 0, 1));
    lookAt = ORIGIN.clone();
    fov = s(frame, shotStart, shotEnd, 42, 30);
  }

  // ---- Shot 12: fast punch-in, sudden stop on the highlighted proton -----
  else if (frame < CUE.freezeReset) {
    const shotStart = CUE.nucleusToProton;
    const shotEnd = CUE.freezeReset;
    const stopAt = shotStart + Math.round((shotEnd - shotStart) * 0.55);
    if (frame < stopAt) {
      position = lerpV(new THREE.Vector3(0, 0.05, 1.1), new THREE.Vector3(0.12, 0.05, 0.32), s(frame, shotStart, stopAt, 0, 1, true));
      fov = s(frame, shotStart, stopAt, 30, 24, true);
    } else {
      position = new THREE.Vector3(0.12, 0.05, 0.32);
      fov = 24;
    }
    lookAt = ORIGIN.clone();
  }

  // ---- Shot 13 (CRITICAL): frozen — no camera movement at all ------------
  // Pulled back deliberately wide: a tiny glowing dot lost in a huge dark
  // frame is the whole visual argument of this beat.
  else if (frame < CUE.reverseToEmptySpace) {
    position = new THREE.Vector3(0, 0, 6.5);
    lookAt = ORIGIN.clone();
    fov = 36;
  }

  // ---- Shot 14: massive reverse zoom revealing the full atom -------------
  else if (frame < CUE.atomToLattice) {
    const shotStart = CUE.reverseToEmptySpace;
    const shotEnd = CUE.atomToLattice;
    position = lerpV(new THREE.Vector3(0, 0, 6.5), new THREE.Vector3(0, 0.5, 9), s(frame, shotStart, shotEnd, 0, 1));
    lookAt = ORIGIN.clone();
    fov = s(frame, shotStart, shotEnd, 36, 46);
  }

  // ---- Shot 15: pull through the material into the solid lattice --------
  else if (frame < CUE.latticeTransparent) {
    const shotStart = CUE.atomToLattice;
    const shotEnd = CUE.latticeTransparent;
    position = lerpV(new THREE.Vector3(0, 0.5, 9), new THREE.Vector3(0, 0.2, 2.2), s(frame, shotStart, shotEnd, 0, 1));
    lookAt = new THREE.Vector3(0, 0, -1);
    fov = s(frame, shotStart, shotEnd, 46, 50);
  }

  // ---- Shot 16: slow drift through the transparent lattice ---------------
  else if (frame < CUE.protonAlone) {
    const shotStart = CUE.latticeTransparent;
    const shotEnd = CUE.protonAlone;
    position = lerpV(new THREE.Vector3(0, 0.2, 2.2), new THREE.Vector3(0.6, -0.2, -1.6), s(frame, shotStart, shotEnd, 0, 1));
    lookAt = new THREE.Vector3(0, 0, -1);
    fov = 48;
  }

  // ---- Shot 17: extreme close-up, centered -------------------------------
  else if (frame < CUE.protonCharge) {
    const shotStart = CUE.protonAlone;
    const shotEnd = CUE.protonCharge;
    position = lerpV(new THREE.Vector3(0, 0, 2.4), new THREE.Vector3(0, 0, 1.7), s(frame, shotStart, shotEnd, 0, 1));
    lookAt = ORIGIN.clone();
    fov = 26;
  }

  // ---- Shot 18: controlled orbit around the proton, then pull back -------
  else if (frame < CUE.explosiveReverseZoom) {
    const shotStart = CUE.protonCharge;
    const shotEnd = CUE.explosiveReverseZoom;
    const pullAt = shotStart + Math.round((shotEnd - shotStart) * 0.65);
    if (frame < pullAt) {
      const az = s(frame, shotStart, pullAt, 0, 130, true);
      position = orbit(ORIGIN, 1.9, az, 10);
      fov = 26;
    } else {
      const az = 130;
      position = lerpV(orbit(ORIGIN, 1.9, az, 10), orbit(ORIGIN, 4.6, az + 20, 14), s(frame, pullAt, shotEnd, 0, 1));
      fov = s(frame, pullAt, shotEnd, 26, 38);
    }
    lookAt = ORIGIN.clone();
  }

  // ---- Shot 19: explosive reverse zoom, pulling back through six stages --
  else if (frame < CUE.finalPullToDarkness) {
    const shotStart = CUE.explosiveReverseZoom;
    const shotEnd = CUE.finalPullToDarkness;
    const stageCount = 6;
    const stageLen = (shotEnd - shotStart) / stageCount;
    const stageIndex = Math.min(stageCount - 1, Math.floor((frame - shotStart) / stageLen));
    const distances = [4.6, 3.2, 5.5, 3.8, 6.5, 9.5];
    const dStart = distances[stageIndex];
    const dEnd = distances[Math.min(stageCount - 1, stageIndex + 1)];
    const stageStart = shotStart + stageIndex * stageLen;
    const dist = s(frame, stageStart, stageStart + stageLen, dStart, dEnd, true);
    position = new THREE.Vector3(0, dist * 0.12, dist);
    lookAt = ORIGIN.clone();
    fov = 42;
  }

  // ---- Shot 20: pull back into darkness, ending the loop -----------------
  else {
    const shotStart = CUE.finalPullToDarkness;
    const shotEnd = DURATION_IN_FRAMES;
    position = lerpV(new THREE.Vector3(0, 1.1, 9.5), new THREE.Vector3(0, 3, 30), s(frame, shotStart, shotEnd, 0, 1));
    lookAt = ORIGIN.clone();
    fov = s(frame, shotStart, shotEnd, 42, 26);
  }

  return {position, lookAt, fov};
};
