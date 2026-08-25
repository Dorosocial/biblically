/**
 * Camera language — one literal camera direction per beat, taken verbatim
 * from the mandatory storyboard (see timing.ts). The camera rule: whatever
 * direction a beat specifies must be continuously executing for that
 * beat's FULL duration, never idle, except where the beat explicitly says
 * "locked"/"stationary." Comments below quote which beat + direction each
 * branch implements, so it's checkable against the storyboard directly.
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

  // ---- Beat 1: "Extremely slow push-in" ----------------------------------
  if (frame < CUE.iMeanLiterally) {
    const t = s(frame, CUE.hook, CUE.iMeanLiterally, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(2.6, 2.35, t));
    fov = 28;
  }

  // ---- Beat 2: "Rapid zoom-out" ------------------------------------------
  else if (frame < CUE.everythingWeCanSee) {
    const t = Math.pow(s(frame, CUE.iMeanLiterally, CUE.everythingWeCanSee, 0, 1, true), 0.5);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(2.35, 5, t));
    fov = 30;
  }

  // ---- Beat 3: "Extreme continuous pull-back" ----------------------------
  else if (frame < CUE.insideBlackHole) {
    const t = s(frame, CUE.everythingWeCanSee, CUE.insideBlackHole, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(5, 14, t));
    fov = 34;
  }

  // ---- Beat 4: "Orbit around universe" -----------------------------------
  else if (frame < CUE.largerUniverse) {
    const t = s(frame, CUE.insideBlackHole, CUE.largerUniverse, -14, 14, true);
    position = orbit(ORIGIN, 14, t, 8);
    fov = 34;
  }

  // ---- Beat 5: "Massive zoom-out" -----------------------------------------
  // Endpoint distance (~55) tuned against physics.ts's scale endpoint (1.3)
  // so the "tiny black-hole-like region" halo stays legibly readable
  // (>=40px on screen) through the end of the beat rather than shrinking
  // into an indistinguishable smudge — verified via direct still-frame
  // checks the first time this shot was built.
  else if (frame < CUE.howIsThatPossible) {
    const t = Math.pow(s(frame, CUE.largerUniverse, CUE.howIsThatPossible, 0, 1, true), 0.8);
    position = lerpV(orbit(ORIGIN, 14, 14, 8), new THREE.Vector3(3.5, 8, 54), t);
    fov = 40;
  }

  // ---- Beat 6: "Hard stop" ------------------------------------------------
  // Explicitly a stop, not a continuous move — the one exception the
  // camera rule itself carves out (screen is black regardless).
  else if (frame < CUE.classicBlackHole) {
    position = new THREE.Vector3(3.5, 8, 54);
    fov = 40;
  }

  // ---- Beat 7: "Slow orbit" -----------------------------------------------
  // BUG FOUND + FIXED (round 3): fitting the WHOLE disk (radius 4.6) with
  // real margin (round 2's fix) made the horizon+lensing shrink to a small
  // fraction of frame — the spec's signature "wraps over/under the sphere"
  // lensing effect became indistinguishable from the plain photon ring at
  // that scale (confirmed via a direct still-frame check). Real
  // black-hole imagery (EHT M87, Interstellar) frames the SPHERE as the
  // prominent subject and lets the disk extend past frame edges, rather
  // than fitting the entire disk with margin — reframed around that:
  // horizon radius ~18% of half-frame-height (clearly "massive," lensing
  // arcs legible), disk allowed to run off-frame.
  else if (frame < CUE.fallingMatter) {
    const t = s(frame, CUE.classicBlackHole, CUE.fallingMatter, 20, 50, true);
    position = orbit(ORIGIN, 12, t, 18);
    fov = 50;
  }

  // ---- Beat 8: "Follow falling particles" --------------------------------
  else if (frame < CUE.notReallyBlackHole) {
    const t = s(frame, CUE.fallingMatter, CUE.notReallyBlackHole, 50, 75, true);
    const radius = s(frame, CUE.fallingMatter, CUE.notReallyBlackHole, 12, 9, true);
    position = orbit(ORIGIN, radius, t, 14);
    fov = 48;
  }

  // ---- Beat 9: "Zoom through the black hole" -----------------------------
  // A genuine pass-through, not just a push: continues from beat 8's orbit,
  // plunges close to the horizon, then emerges above — setting up beat 10's
  // top-down descent onto the (by-then-crossfaded) spacetime grid. The disk
  // is crossfading out for this whole beat, so the close pass-through
  // doesn't re-trigger the beat-7 framing bug (nothing solid to clip into
  // by the time the camera is actually close).
  else if (frame < CUE.regionOfSpace) {
    const t = s(frame, CUE.notReallyBlackHole, CUE.regionOfSpace, 0, 1, true);
    const eased = Math.pow(t, 1.4);
    position = lerpV(orbit(ORIGIN, 9, 75, 14), new THREE.Vector3(0.4, 5, 1.1), eased);
    fov = THREE.MathUtils.lerp(48, 36, eased);
    // BUG FOUND + FIXED: lookAt was left at its ORIGIN default for every
    // beat in this file — harmless while the subject (black hole) actually
    // sits at the origin, but the grid it crossfades into is centered at
    // world y=-1.2 (see physics.ts's grid position), not y=0. Tracking
    // toward that here so beat 10 doesn't inherit a lookAt that's already
    // aimed above the grid entirely.
    lookAt = lerpV(ORIGIN, new THREE.Vector3(0, -1.2, 0), eased);
  }

  // ---- Beat 10: "Top-down descent" ----------------------------------------
  // BUG FOUND + FIXED: with lookAt fixed at world origin, the well's actual
  // deepest point drops further and further below the lookAt target as
  // wellDepth increases (up to ~6.5 units deep by the end of this beat) —
  // confirmed via a direct still-frame check showing the frame going
  // almost completely empty by the beat's final third, well before the
  // beat actually ends. Tracking lookAt down with the deepening well keeps
  // the actual "descent" content in frame for the whole beat.
  else if (frame < CUE.crossBoundary) {
    const t = s(frame, CUE.regionOfSpace, CUE.crossBoundary, 0, 1, true);
    position = lerpV(new THREE.Vector3(0.4, 5, 1.1), new THREE.Vector3(0.25, 1.7, 0.55), t);
    lookAt = lerpV(new THREE.Vector3(0, -1.2, 0), new THREE.Vector3(0, -3.2, 0.15), t);
    fov = 38;
  }

  // ---- Beat 11: "Straight push toward horizon" ----------------------------
  // BUG FOUND + FIXED: same class of error as beat 7's original framing
  // bug, just for the bare horizon instead of the disk — a horizon of
  // radius 1 at distance 2.1-3.8 with fov 32 (half-angle ~16deg, so
  // half-height at distance D is only D*tan(16deg) ≈ D*0.287) massively
  // overflows the frame (radius 1 needs half-height > ~1, i.e. D > ~3.5
  // just to fit at all, let alone with any margin) — confirmed via a
  // direct still-frame check showing the horizon filling almost the ENTIRE
  // frame with no visible photon ring as a clean circle, no starfield, no
  // light beam in view. Recomputed so the horizon occupies a sensible
  // ~30-45% of half-frame-height instead. Literally straight — a single
  // line from start to end, no arc/orbit.
  else if (frame < CUE.notEvenLight) {
    const t = s(frame, CUE.crossBoundary, CUE.notEvenLight, 0, 1, true);
    position = lerpV(new THREE.Vector3(0, 3, 12), new THREE.Vector3(0, 1.2, 8), t);
    fov = 32;
  }

  // ---- Beat 12: "Follow the light" ----------------------------------------
  // Tracks laterally to keep the bending light beam's path in view, at the
  // same corrected distance range as beat 11's end (see that beat's note).
  else if (frame < CUE.eventHorizonNamed) {
    const t = s(frame, CUE.notEvenLight, CUE.eventHorizonNamed, 0, 1, true);
    position = lerpV(new THREE.Vector3(0, 1.2, 8), new THREE.Vector3(-3, 2.3, 7), t);
    fov = 32;
  }

  // ---- Beat 13: "Locked symmetrical shot" ---------------------------------
  // Distance 7.5 at fov 30 (half-angle 15deg, half-height ≈ 2.0) puts the
  // horizon at ~50% of half-frame-height — a prominent, fully-contained
  // "clean glowing circle" per the beat's own description, not an
  // overflowing close-up (the bug this whole beat range had before).
  else {
    position = new THREE.Vector3(0, 0, 7.5);
    fov = 30;
  }

  return {position, lookAt, fov};
};
