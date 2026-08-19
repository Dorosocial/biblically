/**
 * Camera language, applied per-shot:
 *   slow push-in = emergence · slow orbit = "ordinary object" reveal
 *   POV + handheld shake = subjective grounding · hard cuts = rapid beats
 *   ultra-macro push = intimate detail · continuous accelerating dive =
 *   crossing into a scale that isn't fully revealed yet.
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

/** Deterministic small camera shake (never wall-clock-based) for handheld/POV moments. */
const shake = (frame: number, amount: number): THREE.Vector3 =>
  new THREE.Vector3(Math.sin(frame * 1.7) * amount, Math.cos(frame * 2.3) * amount * 0.8, Math.sin(frame * 3.1) * amount * 0.4);

export const getCameraState = (frame: number): CameraState => {
  let position = new THREE.Vector3(0, 0, 6);
  let lookAt = ORIGIN.clone();
  let fov = 30;

  // ---- Shot A (0-3s): emerge from darkness, slow push-in ----------------
  if (frame < CUE.ordinary) {
    const shotStart = CUE.emerge;
    const shotEnd = CUE.ordinary;
    position = lerpV(new THREE.Vector3(0, 0, 9), new THREE.Vector3(0, 0, 3.6), s(frame, shotStart, shotEnd, 0, 1));
    lookAt = ORIGIN.clone();
    fov = 26;
  }

  // ---- Shot B (3-6s): slow macro orbit around the "ordinary" phone ------
  else if (frame < CUE.pickup) {
    const shotStart = CUE.ordinary;
    const shotEnd = CUE.pickup;
    const az = s(frame, shotStart, shotEnd, -20, 120);
    position = orbit(ORIGIN, 3.2, az, 8);
    lookAt = ORIGIN.clone();
    fov = 28;
  }

  // ---- Shot C (6-10s): POV pickup, subtle handheld shake ----------------
  else if (frame < CUE.rapidCuts) {
    const shotStart = CUE.pickup;
    const shotEnd = CUE.rapidCuts;
    const base = lerpV(new THREE.Vector3(0.6, -0.4, 3.4), new THREE.Vector3(0.15, -0.05, 1.9), s(frame, shotStart, shotEnd, 0, 1));
    position = base.add(shake(frame, 0.02));
    lookAt = new THREE.Vector3(0, 0, 0).add(shake(frame + 50, 0.01));
    fov = 34;
  }

  // ---- Shot D (10-14s): three hard-cut rapid macro angles ---------------
  else if (frame < CUE.macroTouch) {
    if (frame < CUE.cutDrop) {
      // D1 — press: fixed close angle on the glass/fingertip contact
      position = new THREE.Vector3(0.3, -0.15, 1.1);
      lookAt = new THREE.Vector3(0.05, -0.05, 0.15);
      fov = 32;
    } else if (frame < CUE.cutCatch) {
      // D2 — drop: side tracking angle, whip-follows the fall
      const shotStart = CUE.cutDrop;
      const shotEnd = CUE.cutCatch;
      const t = s(frame, shotStart, shotEnd, 0, 1, true);
      const fallY = THREE.MathUtils.lerp(0.3, -2.2, t * t);
      position = new THREE.Vector3(2.4, fallY + 0.4, 1.6);
      lookAt = new THREE.Vector3(0, fallY, 0);
      fov = 36;
    } else {
      // D3 — catch: low angle looking up, settles to a hard stop
      const shotStart = CUE.cutCatch;
      position = lerpV(new THREE.Vector3(-0.6, -1.3, 2.4), new THREE.Vector3(-0.2, -0.6, 1.7), s(frame, shotStart, shotStart + 10, 0, 1, true));
      lookAt = new THREE.Vector3(0, -0.2, 0);
      fov = 30;
    }
  }

  // ---- Shot E (14-18s): extreme macro push on a fingertip on glass ------
  // Phone/hand settle at y≈-0.3 after the D3 catch (physics.ts) — offsets
  // here mirror D1's verified-working framing (same relative camera/lookAt
  // offset from the phone's center, just re-anchored to the new position),
  // rather than the earlier version's raw coordinates, which put the
  // camera close enough to fill the frame with nothing but a feature-less
  // patch of the glass — legitimately black with no highlight in it, not
  // a rendering bug, but unusable as a shot. Staying a little further back
  // keeps the bright metal edge/fingertip in frame as an anchor.
  else if (frame < CUE.microscope) {
    const shotStart = CUE.macroTouch;
    const shotEnd = CUE.microscope;
    position = lerpV(new THREE.Vector3(0.3, -0.55, 1.1), new THREE.Vector3(0.05, -0.4, 0.35), s(frame, shotStart, shotEnd, 0, 1));
    lookAt = lerpV(new THREE.Vector3(0.05, -0.45, 0.15), new THREE.Vector3(0.03, -0.35, 0.1), s(frame, shotStart, shotEnd, 0, 1));
    fov = s(frame, shotStart, shotEnd, 26, 18);
  }

  // ---- Shot F (18-22s, CRITICAL): microscope dive begins, unresolved ----
  else {
    const shotStart = CUE.microscope;
    const shotEnd = DURATION_IN_FRAMES;
    // Accelerating ease so the dive is still gathering speed at the very
    // last frame — deliberately NOT settling; this continues in a later part.
    const t = Math.pow(s(frame, shotStart, shotEnd, 0, 1, true), 1.6);
    position = lerpV(new THREE.Vector3(0.05, -0.4, 0.35), new THREE.Vector3(0.02, -0.35, 0.15), t);
    lookAt = lerpV(new THREE.Vector3(0.03, -0.35, 0.1), new THREE.Vector3(0.01, -0.32, 0.05), t);
    fov = THREE.MathUtils.lerp(18, 11, t);
  }

  return {position, lookAt, fov};
};
