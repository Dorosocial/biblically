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
  else if (frame < CUE.horizonNotWall) {
    position = new THREE.Vector3(0, 0, 7.5);
    fov = 30;
  }

  // =========================================================================
  // CROSSING THE HORIZON (beats 14-20)
  // =========================================================================

  // ---- Beat 14 (horizonNotWall→dontHitIt): "Smooth forward movement" -----
  // "Camera approaches an apparently empty region." Nothing dramatic on
  // purpose — a plain, unbroken forward drift through open space.
  else if (frame < CUE.dontHitIt) {
    const t = s(frame, CUE.horizonNotWall, CUE.dontHitIt, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(6, 2, t));
    fov = 34;
  }

  // ---- Beat 15 (dontHitIt→fallingIntoMassive): "Continuous shot" ---------
  // No visible cut from beat 14 — the camera keeps moving forward exactly
  // as it was, selling "no impact" through unbroken continuity.
  else if (frame < CUE.fallingIntoMassive) {
    const t = s(frame, CUE.dontHitIt, CUE.fallingIntoMassive, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(2, -2, t));
    fov = 34;
  }

  // ---- Beat 16 (fallingIntoMassive→crossWithoutNoticing): "Rear -----------
  // tracking" — tracks in behind the spacecraft (physics.ts's s.spacecraft,
  // z=2→0.5) toward the enormous horizon at z=-6.
  else if (frame < CUE.crossWithoutNoticing) {
    const t = s(frame, CUE.fallingIntoMassive, CUE.crossWithoutNoticing, 0, 1, true);
    position = lerpV(new THREE.Vector3(0, 0.4, 4), new THREE.Vector3(0, 0.3, 1.5), t);
    fov = 40;
  }

  // ---- Beat 17 (crossWithoutNoticing→problemAfter): "First-person POV" ---
  // The horizon (scaling from 5 to 22 in physics.ts) grows to swallow the
  // frame as the camera pushes straight at it, unbroken.
  else if (frame < CUE.problemAfter) {
    const t = s(frame, CUE.crossWithoutNoticing, CUE.problemAfter, 0, 1, true);
    position = lerpV(new THREE.Vector3(0, 0.3, 1.5), new THREE.Vector3(0, 0, -2), t);
    fov = 44;
  }

  // ---- Beat 18 (problemAfter→pathsForward): "Slow rotation" --------------
  // Camera turns to look back at the now-distant, behind horizon —
  // physics.ts puts it at z=+8 for this beat, "exterior now behind."
  else if (frame < CUE.pathsForward) {
    const t = s(frame, CUE.problemAfter, CUE.pathsForward, 0, 1, true);
    position = new THREE.Vector3(0, 0, -2);
    lookAt = lerpV(new THREE.Vector3(0, 0, -6), new THREE.Vector3(0, 0.3, 8), t);
    fov = 40;
  }

  // ---- Beat 19 (pathsForward→leadDeeper): "Orbiting camera" ---------------
  else if (frame < CUE.leadDeeper) {
    const t = s(frame, CUE.pathsForward, CUE.leadDeeper, 0, 90, true);
    position = orbit(ORIGIN, 5.5, t, 12);
    fov = 42;
  }

  // ---- Beat 20 (leadDeeper→takeToSingularity): "Accelerating dive" -------
  // Radius shrinks with an accelerating (squared) ease so the final
  // approach genuinely speeds up rather than gliding in linearly.
  else if (frame < CUE.takeToSingularity) {
    const t = Math.pow(s(frame, CUE.leadDeeper, CUE.takeToSingularity, 0, 1, true), 1.8);
    const radius = THREE.MathUtils.lerp(5.5, 0.6, t);
    position = orbit(ORIGIN, radius, 90 + t * 40, THREE.MathUtils.lerp(12, 2, t));
    fov = 42;
  }

  // =========================================================================
  // THE SINGULARITY (beats 21-27)
  // =========================================================================

  // ---- Beat 21 (takeToSingularity→stopMakingSense): "Extreme macro zoom" -
  else if (frame < CUE.stopMakingSense) {
    const t = s(frame, CUE.takeToSingularity, CUE.stopMakingSense, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(0.6, 0.16, t));
    fov = 26;
  }

  // ---- Beat 22 (stopMakingSense→producingInfinities): "Camera pushes -----
  // through equations"
  else if (frame < CUE.producingInfinities) {
    const t = s(frame, CUE.stopMakingSense, CUE.producingInfinities, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(0.55, 0.2, t));
    fov = 30;
  }

  // ---- Beat 23 (producingInfinities→somethingMissing): "Rapid expansion" -
  else if (frame < CUE.somethingMissing) {
    const t = s(frame, CUE.producingInfinities, CUE.somethingMissing, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(0.6, 6, t));
    fov = 40;
  }

  // ---- Beat 24 (somethingMissing→generalRelativity): "Hard cut to black" -
  else if (frame < CUE.generalRelativity) {
    position = new THREE.Vector3(0, 0, 4);
    fov = 40;
  }

  // ---- Beat 25 (generalRelativity→quantumMechanics): "Slow orbit" --------
  else if (frame < CUE.quantumMechanics) {
    const t = s(frame, CUE.generalRelativity, CUE.quantumMechanics, 0, 60, true);
    position = orbit(new THREE.Vector3(0, -0.6, 0), 6, t, 22);
    lookAt = new THREE.Vector3(0, -0.6, 0);
    fov = 38;
  }

  // ---- Beat 26 (quantumMechanics→noCompleteTheory): "Macro tracking" -----
  else if (frame < CUE.noCompleteTheory) {
    const t = s(frame, CUE.quantumMechanics, CUE.noCompleteTheory, -1.5, 1.5, true);
    position = new THREE.Vector3(t, 0.4, 3.2);
    fov = 38;
  }

  // ---- Beat 27 (noCompleteTheory→notReallyEnd): "Split-screen pull" ------
  // A genuine dolly-out (not a literal 2D split) to reveal both the grid
  // (left) and particle cloud (right) at once — see physics.ts's beat 27.
  else if (frame < CUE.notReallyEnd) {
    const t = s(frame, CUE.noCompleteTheory, CUE.notReallyEnd, 0, 1, true);
    position = lerpV(new THREE.Vector3(0, 0.4, 3.2), new THREE.Vector3(0, 0.2, 10), t);
    fov = 44;
  }

  // =========================================================================
  // WHAT IF THE SINGULARITY ISN'T THE END (beats 28-34)
  // =========================================================================

  // ---- Beat 28 (notReallyEnd→somethingHappensThere): "Slow push-in" ------
  else if (frame < CUE.somethingHappensThere) {
    const t = s(frame, CUE.notReallyEnd, CUE.somethingHappensThere, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(2.4, 1.6, t));
    fov = 32;
  }

  // ---- Beat 29 (somethingHappensThere→physicsDoesntKnow): "Reverse zoom" -
  else if (frame < CUE.physicsDoesntKnow) {
    const t = s(frame, CUE.somethingHappensThere, CUE.physicsDoesntKnow, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(1.6, 3.2, t));
    fov = 34;
  }

  // ---- Beat 30 (physicsDoesntKnow→quantumGravityPrevents): "360° --------
  // rotation"
  else if (frame < CUE.quantumGravityPrevents) {
    const t = s(frame, CUE.physicsDoesntKnow, CUE.quantumGravityPrevents, 0, 360, true);
    position = orbit(new THREE.Vector3(0, -0.8, 0), 4.5, t, 20);
    lookAt = new THREE.Vector3(0, -0.8, 0);
    fov = 38;
  }

  // ---- Beat 31 (quantumGravityPrevents→transitionsIntoSomething): -------
  // "Circular orbit"
  else if (frame < CUE.transitionsIntoSomething) {
    const t = s(frame, CUE.quantumGravityPrevents, CUE.transitionsIntoSomething, 0, 90, true);
    position = orbit(ORIGIN, 3.2, t, 14);
    fov = 34;
  }

  // ---- Beat 32 (transitionsIntoSomething→newRegionSpacetime): "Rapid -----
  // outward camera movement"
  else if (frame < CUE.newRegionSpacetime) {
    const t = s(frame, CUE.transitionsIntoSomething, CUE.newRegionSpacetime, 0, 1, true);
    position = new THREE.Vector3(0, 1, THREE.MathUtils.lerp(3.2, 10, t));
    fov = 42;
  }

  // ---- Beat 33 (newRegionSpacetime→newUniverse): "Fly backward through ---
  // new spacetime"
  else if (frame < CUE.newUniverse) {
    const t = s(frame, CUE.newRegionSpacetime, CUE.newUniverse, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(1, 2.5, t), THREE.MathUtils.lerp(10, 16, t));
    fov = 44;
  }

  // ---- Beat 34 (newUniverse→parentUniverse): "Huge pull-back" ------------
  else if (frame < CUE.parentUniverse) {
    const t = s(frame, CUE.newUniverse, CUE.parentUniverse, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(2.5, 5, t), THREE.MathUtils.lerp(16, 30, t));
    fov = 46;
  }

  // =========================================================================
  // THE PARENT UNIVERSE (beats 35-45)
  // =========================================================================

  // ---- Beat 35 (parentUniverse→starCollapses): "Slow fly-through" -------
  else if (frame < CUE.starCollapses) {
    const t = s(frame, CUE.parentUniverse, CUE.starCollapses, 0, 1, true);
    position = new THREE.Vector3(THREE.MathUtils.lerp(-2, 2, t), 4, 26);
    fov = 44;
  }

  // ---- Beat 36 (starCollapses→formsBlackHole): "Close orbital shot" -----
  else if (frame < CUE.formsBlackHole) {
    const t = s(frame, CUE.starCollapses, CUE.formsBlackHole, 0, 70, true);
    position = orbit(ORIGIN, 2.6, t, 10);
    fov = 30;
  }

  // ---- Beat 37 (formsBlackHole→yourPerspective): "Rapid pull-back" ------
  else if (frame < CUE.yourPerspective) {
    const t = s(frame, CUE.formsBlackHole, CUE.yourPerspective, 0, 1, true);
    position = new THREE.Vector3(0, 1, THREE.MathUtils.lerp(2.6, 9, t));
    fov = 40;
  }

  // ---- Beat 38 (yourPerspective→thereIsABlackHole): "Over-the-shoulder ---
  // shot"
  else if (frame < CUE.thereIsABlackHole) {
    position = new THREE.Vector3(0, 0.6, 3.6);
    fov = 40;
  }

  // ---- Beat 39 (thereIsABlackHole→butInsideThat): "Slow push" ------------
  else if (frame < CUE.butInsideThat) {
    const t = s(frame, CUE.thereIsABlackHole, CUE.butInsideThat, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(6, 3.6, t));
    fov = 36;
  }

  // ---- Beat 40 (butInsideThat→expandingRegionForms): "Continuous ---------
  // transition"
  else if (frame < CUE.expandingRegionForms) {
    const t = s(frame, CUE.butInsideThat, CUE.expandingRegionForms, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(3.6, -1.5, t));
    fov = 40;
  }

  // ---- Beat 41 (expandingRegionForms→seeGalaxiesStars): "Massive reverse -
  // zoom"
  else if (frame < CUE.seeGalaxiesStars) {
    const t = s(frame, CUE.expandingRegionForms, CUE.seeGalaxiesStars, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(-1.5, 12, t));
    fov = 42;
  }

  // ---- Beat 42 (seeGalaxiesStars→seeExpandingUniverse): "Rapid nested ----
  // zooms"
  else if (frame < CUE.seeExpandingUniverse) {
    const t = s(frame, CUE.seeGalaxiesStars, CUE.seeExpandingUniverse, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(12, 4, t));
    fov = 40;
  }

  // ---- Beat 43 (seeExpandingUniverse→whereDidThisComeFrom): "Central -----
  // stationary camera"
  else if (frame < CUE.whereDidThisComeFrom) {
    position = new THREE.Vector3(0, 0, 4);
    fov = 42;
  }

  // ---- Beat 44 (whereDidThisComeFrom→answerIsBigBang): "Tilt toward ------
  // stars"
  else if (frame < CUE.answerIsBigBang) {
    const t = s(frame, CUE.whereDidThisComeFrom, CUE.answerIsBigBang, 0, 1, true);
    position = new THREE.Vector3(0, 0.9, 2.6);
    lookAt = lerpV(new THREE.Vector3(0, 1.4, 0), new THREE.Vector3(0, 4.5, -1), t);
    fov = 40;
  }

  // ---- Beat 45 (answerIsBigBang→tinyBallExploding): "Backward time-lapse" -
  else if (frame < CUE.tinyBallExploding) {
    const t = s(frame, CUE.answerIsBigBang, CUE.tinyBallExploding, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(2.6, 6, t));
    fov = 36;
  }

  // =========================================================================
  // THE BIG BANG — NOT AN EXPLOSION (beats 46-52)
  // =========================================================================

  // ---- Beat 46 (tinyBallExploding→notWhatHappened): "Quick zoom" ---------
  else if (frame < CUE.notWhatHappened) {
    const t = Math.pow(s(frame, CUE.tinyBallExploding, CUE.notWhatHappened, 0, 1, true), 0.6);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(6, 12, t));
    fov = 42;
  }

  // ---- Beat 47 (notWhatHappened→spaceExpanding): "Reverse motion" --------
  else if (frame < CUE.spaceExpanding) {
    const t = s(frame, CUE.notWhatHappened, CUE.spaceExpanding, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(12, 4, t));
    fov = 38;
  }

  // ---- Beat 48 (spaceExpanding→earlyUniverseHot): "Camera remains --------
  // embedded in grid"
  else if (frame < CUE.earlyUniverseHot) {
    position = new THREE.Vector3(0, 1.2, 2.4);
    lookAt = new THREE.Vector3(0, -0.4, 0);
    fov = 46;
  }

  // ---- Beat 49 (earlyUniverseHot→universeCooled): "Extreme close-up" -----
  else if (frame < CUE.universeCooled) {
    position = new THREE.Vector3(0, 0, 0.9);
    fov = 30;
  }

  // ---- Beat 50 (universeCooled→blackHoleGoingBoom): "Long time-lapse" ----
  else if (frame < CUE.blackHoleGoingBoom) {
    const t = s(frame, CUE.universeCooled, CUE.blackHoleGoingBoom, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(0.9, 7, t));
    fov = 40;
  }

  // ---- Beat 51 (blackHoleGoingBoom→somethingStranger): "Snap zoom" -------
  // A fast punch-in over the first dozen frames, then a hold — a snap, not
  // a gradual dolly.
  else if (frame < CUE.somethingStranger) {
    const t = s(frame, CUE.blackHoleGoingBoom, CUE.blackHoleGoingBoom + 12, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(7, 3, t));
    fov = 34;
  }

  // ---- Beat 52 (somethingStranger→whereIsHorizon): "Slow morph" ----------
  else if (frame < CUE.whereIsHorizon) {
    const t = s(frame, CUE.somethingStranger, CUE.whereIsHorizon, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(0, 1.6, t), THREE.MathUtils.lerp(3, 6, t));
    fov = 40;
  }

  // =========================================================================
  // WHERE IS THE EVENT HORIZON (beats 53-59)
  // =========================================================================

  // ---- Beat 53 (whereIsHorizon→wheresTheEdge): "Pull-back" ---------------
  else if (frame < CUE.wheresTheEdge) {
    const t = s(frame, CUE.whereIsHorizon, CUE.wheresTheEdge, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(6, 9, t));
    fov = 42;
  }

  // ---- Beat 54 (wheresTheEdge→giantBlackSphere): "Slow approach" ---------
  else if (frame < CUE.giantBlackSphere) {
    const t = s(frame, CUE.wheresTheEdge, CUE.giantBlackSphere, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(9, 4.4, t));
    fov = 38;
  }

  // ---- Beat 55 (giantBlackSphere→notPhysicalWall): "360° pan" ------------
  else if (frame < CUE.notPhysicalWall) {
    const t = s(frame, CUE.giantBlackSphere, CUE.notPhysicalWall, 0, 360, true);
    position = orbit(new THREE.Vector3(0, -0.6, 0), 3.2, t, 8);
    lookAt = new THREE.Vector3(0, -0.2, 0);
    fov = 42;
  }

  // ---- Beat 56 (notPhysicalWall→boundaryInSpacetime): "Camera passes -----
  // through geometry"
  else if (frame < CUE.boundaryInSpacetime) {
    const t = s(frame, CUE.notPhysicalWall, CUE.boundaryInSpacetime, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(3, 0.2, t), THREE.MathUtils.lerp(5, 0.8, t));
    lookAt = new THREE.Vector3(0, -0.8, 0);
    fov = 40;
  }

  // ---- Beat 57 (boundaryInSpacetime→seeBlackCircle): "Slow rotation" -----
  else if (frame < CUE.seeBlackCircle) {
    const t = s(frame, CUE.boundaryInSpacetime, CUE.seeBlackCircle, 0, 90, true);
    position = orbit(ORIGIN, 3.6, t, 8);
    fov = 36;
  }

  // ---- Beat 58 (seeBlackCircle→partOfGeometry): "Pull-back" --------------
  else if (frame < CUE.partOfGeometry) {
    const t = s(frame, CUE.seeBlackCircle, CUE.partOfGeometry, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(3.6, 8, t));
    fov = 40;
  }

  // ---- Beat 59 (partOfGeometry→creatureOnPaper): "Wide orbit" ------------
  else if (frame < CUE.creatureOnPaper) {
    const t = s(frame, CUE.partOfGeometry, CUE.creatureOnPaper, 0, 140, true);
    position = orbit(ORIGIN, 9, t, 16);
    fov = 40;
  }

  // =========================================================================
  // THE PAPER ANALOGY (beats 60-66)
  // =========================================================================

  // ---- Beat 60 (creatureOnPaper→leftAndRight): "Top-down" ----------------
  else if (frame < CUE.leftAndRight) {
    position = new THREE.Vector3(0, 4, 0.01);
    lookAt = ORIGIN.clone();
    fov = 36;
  }

  // ---- Beat 61 (leftAndRight→noConceptOfUp): "Tracking" ------------------
  // Tracks alongside the creature's own left-right motion (physics.ts's
  // Creature2D, sin-wave x position) from a slightly angled top-down view.
  else if (frame < CUE.noConceptOfUp) {
    const t = s(frame, CUE.leftAndRight, CUE.noConceptOfUp, 0, 1, true);
    const x = Math.sin(t * Math.PI * 2) * 1.2;
    position = new THREE.Vector3(x, 3.2, 1.6);
    lookAt = new THREE.Vector3(x, 0, 0);
    fov = 34;
  }

  // ---- Beat 62 (noConceptOfUp→pickItUp): "Vertical crane up" -------------
  else if (frame < CUE.pickItUp) {
    const t = s(frame, CUE.noConceptOfUp, CUE.pickItUp, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(3.2, 7, t), 1.6);
    lookAt = ORIGIN.clone();
    fov = 34;
  }

  // ---- Beat 63 (pickItUp→creaturesPerspective): "Slow upward movement" ---
  // Follows the paper/hand as they're lifted (physics.ts's liftY, 0→1.6).
  else if (frame < CUE.creaturesPerspective) {
    const t = s(frame, CUE.pickItUp, CUE.creaturesPerspective, 0, 1, true);
    const liftY = t * 1.6;
    position = new THREE.Vector3(2.4, liftY + 1.4, 2.4);
    lookAt = new THREE.Vector3(0, liftY, 0);
    fov = 36;
  }

  // ---- Beat 64 (creaturesPerspective→directionItCouldntAccess): "POV" ----
  // From the creature's own low vantage (physics.ts holds paper/creature
  // at y=1.6 for this beat), looking up and around, disoriented.
  else if (frame < CUE.directionItCouldntAccess) {
    const t = s(frame, CUE.creaturesPerspective, CUE.directionItCouldntAccess, 0, 1, true);
    position = new THREE.Vector3(0, 1.65, 0.05);
    lookAt = lerpV(new THREE.Vector3(0.6, 2.6, 0.4), new THREE.Vector3(-0.6, 2.2, -0.4), Math.sin(t * Math.PI));
    fov = 46;
  }

  // ---- Beat 65 (directionItCouldntAccess→intuitionWeNeed): "Large orbit" -
  else if (frame < CUE.intuitionWeNeed) {
    const t = s(frame, CUE.directionItCouldntAccess, CUE.intuitionWeNeed, 0, 130, true);
    position = orbit(new THREE.Vector3(0, 1.6, 0), 4.5, t, 22);
    lookAt = new THREE.Vector3(0, 1.6, 0);
    fov = 40;
  }

  // ---- Beat 66 (intuitionWeNeed→whatsOutside): "Morph transition" --------
  else if (frame < CUE.whatsOutside) {
    const t = s(frame, CUE.intuitionWeNeed, CUE.whatsOutside, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(1.6, 0.4, t), THREE.MathUtils.lerp(4.5, 6, t));
    lookAt = lerpV(new THREE.Vector3(0, 1.6, 0), new THREE.Vector3(0, 0.4, 0), t);
    fov = 38;
  }

  // =========================================================================
  // WHAT'S OUTSIDE OUR UNIVERSE (beats 67-75)
  // =========================================================================

  // ---- Beat 67 (whatsOutside→doesntMakeSense): "Slow pull-back" ----------
  else if (frame < CUE.doesntMakeSense) {
    const t = s(frame, CUE.whatsOutside, CUE.doesntMakeSense, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(5, 8, t));
    fov = 36;
  }

  // ---- Beat 68 (doesntMakeSense→supposeInsideBlackHole): "Camera stops" --
  // Explicitly stationary per the beat's own direction.
  else if (frame < CUE.supposeInsideBlackHole) {
    position = new THREE.Vector3(0, 0, 8);
    fov = 36;
  }

  // ---- Beat 69 (supposeInsideBlackHole→largerSpacetimeOutside): "Rapid ---
  // zoom-out"
  else if (frame < CUE.largerSpacetimeOutside) {
    const t = s(frame, CUE.supposeInsideBlackHole, CUE.largerSpacetimeOutside, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(8, 3, t));
    fov = 42;
  }

  // ---- Beat 70 (largerSpacetimeOutside→parentUniverseAgain): "Massive ----
  // reveal"
  else if (frame < CUE.parentUniverseAgain) {
    const t = s(frame, CUE.largerSpacetimeOutside, CUE.parentUniverseAgain, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(0, 3, t), THREE.MathUtils.lerp(3, 16, t));
    fov = 46;
  }

  // ---- Beat 71 (parentUniverseAgain→theyDSeeBlackHole): "Wide orbit" -----
  else if (frame < CUE.theyDSeeBlackHole) {
    const t = s(frame, CUE.parentUniverseAgain, CUE.theyDSeeBlackHole, 0, 130, true);
    position = orbit(new THREE.Vector3(0, 1, 0), 17, t, 12);
    lookAt = new THREE.Vector3(0, 1, 0);
    fov = 46;
  }

  // ---- Beat 72 (theyDSeeBlackHole→meanwhileInside): "Over-the-shoulder" --
  else if (frame < CUE.meanwhileInside) {
    position = new THREE.Vector3(0, 0.4, 2.4);
    fov = 40;
  }

  // ---- Beat 73 (meanwhileInside→thisIsTheUniverse): "Match cut" ----------
  // Pushes straight through the (fading) horizon, matching beat 40's dive.
  else if (frame < CUE.thisIsTheUniverse) {
    const t = s(frame, CUE.meanwhileInside, CUE.thisIsTheUniverse, 0, 1, true);
    position = new THREE.Vector3(0, 0.4, THREE.MathUtils.lerp(2.4, -1, t));
    fov = 42;
  }

  // ---- Beat 74 (thisIsTheUniverse→differentPerspectives): "Slow ----------
  // planetary orbit"
  else if (frame < CUE.differentPerspectives) {
    const t = s(frame, CUE.thisIsTheUniverse, CUE.differentPerspectives, 0, 60, true);
    position = orbit(ORIGIN, 3.4, t, 10);
    fov = 36;
  }

  // ---- Beat 75 (differentPerspectives→couldWeProve): "Slow synchronized --
  // zoom"
  else if (frame < CUE.couldWeProve) {
    const t = s(frame, CUE.differentPerspectives, CUE.couldWeProve, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(1, 2.5, t), THREE.MathUtils.lerp(4, 9, t));
    fov = 44;
  }

  // =========================================================================
  // CAN WE PROVE IT (beats 76-84)
  // =========================================================================

  // ---- Beat 76 (couldWeProve→beyondCausalHorizon): "Push toward lens" ----
  else if (frame < CUE.beyondCausalHorizon) {
    const t = s(frame, CUE.couldWeProve, CUE.beyondCausalHorizon, 0, 1, true);
    position = lerpV(new THREE.Vector3(1.4, 0.4, 2.4), new THREE.Vector3(0.15, 0.9, 0.9), t);
    fov = 36;
  }

  // ---- Beat 77 (beyondCausalHorizon→biggerTelescope): "Orbit" ------------
  else if (frame < CUE.biggerTelescope) {
    const t = s(frame, CUE.beyondCausalHorizon, CUE.biggerTelescope, 0, 80, true);
    position = orbit(ORIGIN, 4.2, t, 12);
    fov = 40;
  }

  // ---- Beat 78 (biggerTelescope→infoCantReachUs): "Zoom out" -------------
  else if (frame < CUE.infoCantReachUs) {
    const t = s(frame, CUE.biggerTelescope, CUE.infoCantReachUs, 0, 1, true);
    position = new THREE.Vector3(0.5, THREE.MathUtils.lerp(0.5, 3, t), THREE.MathUtils.lerp(3, 10, t));
    fov = 44;
  }

  // ---- Beat 79 (infoCantReachUs→indirectEvidence): "Follow signal" -------
  else if (frame < CUE.indirectEvidence) {
    const t = s(frame, CUE.infoCantReachUs, CUE.indirectEvidence, 0, 1, true);
    position = lerpV(new THREE.Vector3(2, 1.2, 2.2), new THREE.Vector3(0.4, 0.2, 0.6), t);
    fov = 38;
  }

  // ---- Beat 80 (indirectEvidence→particularPatterns): "Camera sweep" -----
  else if (frame < CUE.particularPatterns) {
    const t = s(frame, CUE.indirectEvidence, CUE.particularPatterns, -50, 50, true);
    position = orbit(ORIGIN, 3.6, t, 6);
    fov = 40;
  }

  // ---- Beat 81 (particularPatterns→geometryOfUniverse): "Macro zoom" -----
  else if (frame < CUE.geometryOfUniverse) {
    const t = s(frame, CUE.particularPatterns, CUE.geometryOfUniverse, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(3.6, 1.4, t));
    fov = 30;
  }

  // ---- Beat 82 (geometryOfUniverse→specificPrediction): "Slow rotation" --
  else if (frame < CUE.specificPrediction) {
    const t = s(frame, CUE.geometryOfUniverse, CUE.specificPrediction, 0, 90, true);
    position = orbit(new THREE.Vector3(0, -1.4, 0), 4, t, 18);
    lookAt = new THREE.Vector3(0, -1.4, 0);
    fov = 40;
  }

  // ---- Beat 83 (specificPrediction→hypothesisPredictionTest): "Push -----
  // through equation"
  else if (frame < CUE.hypothesisPredictionTest) {
    const t = s(frame, CUE.specificPrediction, CUE.hypothesisPredictionTest, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(2.2, 0.5, t));
    fov = 32;
  }

  // ---- Beat 84 (hypothesisPredictionTest→bookIntoBlackHole): "Sequential -
  // camera movement" — three discrete positions, one per stage
  // (physics.ts's s.hpt.stage 0/1/2).
  else if (frame < CUE.bookIntoBlackHole) {
    const shotStart = CUE.hypothesisPredictionTest;
    const shotEnd = CUE.bookIntoBlackHole;
    const stageF = s(frame, shotStart, shotStart + (shotEnd - shotStart) * 0.7, 0, 2, true);
    const stagePositions = [new THREE.Vector3(-1.6, 0, 2.4), new THREE.Vector3(0, 0, 2.2), new THREE.Vector3(1.6, 0, 2.4)];
    const idx = THREE.MathUtils.clamp(Math.floor(stageF), 0, 1);
    const localT = THREE.MathUtils.clamp(stageF - idx, 0, 1);
    position = lerpV(stagePositions[idx], stagePositions[idx + 1] ?? stagePositions[idx], localT);
    fov = 34;
  }

  // =========================================================================
  // THE INFORMATION PROBLEM (beats 85-92)
  // =========================================================================

  // ---- Beat 85 (bookIntoBlackHole→bookContainsInfo): "Tracking shot" -----
  // Tracks alongside the book (physics.ts's book, z=2.4→0.3) as it falls.
  else if (frame < CUE.bookContainsInfo) {
    const t = s(frame, CUE.bookIntoBlackHole, CUE.bookContainsInfo, 0, 1, true);
    position = lerpV(new THREE.Vector3(1.4, 0.6, 3.2), new THREE.Vector3(0.7, 0.3, 1.1), t);
    fov = 36;
  }

  // ---- Beat 86 (bookContainsInfo→whatHappensToInfo): "Extreme macro ------
  // zoom"
  else if (frame < CUE.whatHappensToInfo) {
    const t = s(frame, CUE.bookContainsInfo, CUE.whatHappensToInfo, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(1.4, 0.25, t));
    fov = 26;
  }

  // ---- Beat 87 (whatHappensToInfo→hawkingMadeWorse): "Hard cut" ----------
  else if (frame < CUE.hawkingMadeWorse) {
    position = new THREE.Vector3(0, 0, 4.5);
    fov = 36;
  }

  // ---- Beat 88 (hawkingMadeWorse→emitRadiation): "Orbit" -----------------
  else if (frame < CUE.emitRadiation) {
    const t = s(frame, CUE.hawkingMadeWorse, CUE.emitRadiation, 0, 60, true);
    position = orbit(ORIGIN, 3.2, t, 12);
    fov = 36;
  }

  // ---- Beat 89 (emitRadiation→couldEvaporate): "Follow particles" -------
  // Pulls outward with the Hawking particles as their progress increases.
  else if (frame < CUE.couldEvaporate) {
    const t = s(frame, CUE.emitRadiation, CUE.couldEvaporate, 0, 1, true);
    position = new THREE.Vector3(0, 1, THREE.MathUtils.lerp(3.2, 7, t));
    fov = 40;
  }

  // ---- Beat 90 (couldEvaporate→blackHoleDisappears): "Time-lapse" --------
  else if (frame < CUE.blackHoleDisappears) {
    position = new THREE.Vector3(0, 1, 7);
    fov = 40;
  }

  // ---- Beat 91 (blackHoleDisappears→whereDidItGo): "Slow pull-back" ------
  else if (frame < CUE.whereDidItGo) {
    const t = s(frame, CUE.blackHoleDisappears, CUE.whereDidItGo, 0, 1, true);
    position = new THREE.Vector3(0, 1, THREE.MathUtils.lerp(7, 11, t));
    fov = 40;
  }

  // ---- Beat 92 (whereDidItGo→blackHolesCreateMany): "Locked camera" ------
  // Explicitly stationary per the beat's own direction.
  else if (frame < CUE.blackHolesCreateMany) {
    position = new THREE.Vector3(0, 0, 3);
    fov = 30;
  }

  // =========================================================================
  // THE COSMIC FAMILY TREE (beats 93-100)
  // =========================================================================

  // ---- Beat 93 (blackHolesCreateMany→starsFormDie): "Wide shot" ----------
  else if (frame < CUE.starsFormDie) {
    position = new THREE.Vector3(0, 0, 8);
    fov = 42;
  }

  // ---- Beat 94 (starsFormDie→collapseIntoBlackHoles): "Time-lapse" -------
  else if (frame < CUE.collapseIntoBlackHoles) {
    const t = s(frame, CUE.starsFormDie, CUE.collapseIntoBlackHoles, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(0, 0.6, t), 8);
    fov = 42;
  }

  // ---- Beat 95 (collapseIntoBlackHoles→producingNewUniverses): "Rapid ----
  // zoom"
  else if (frame < CUE.producingNewUniverses) {
    const t = s(frame, CUE.collapseIntoBlackHoles, CUE.producingNewUniverses, 0, 1, true);
    position = lerpV(new THREE.Vector3(0.9, 0.6, 8), new THREE.Vector3(1.3, 0.5, 1.6), t);
    fov = 36;
  }

  // ---- Beat 96 (producingNewUniverses→universesFormStars): "Nested zoom" -
  else if (frame < CUE.universesFormStars) {
    const t = s(frame, CUE.producingNewUniverses, CUE.universesFormStars, 0, 1, true);
    position = lerpV(new THREE.Vector3(1.3, 0.5, 1.6), new THREE.Vector3(1.1, 0.4, 0.9), t);
    fov = 32;
  }

  // ---- Beat 97 (universesFormStars→starsFormMoreBlackHoles): "Accelerated
  // evolution"
  else if (frame < CUE.starsFormMoreBlackHoles) {
    const t = Math.pow(s(frame, CUE.universesFormStars, CUE.starsFormMoreBlackHoles, 0, 1, true), 0.5);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(4, 8, t));
    fov = 40;
  }

  // ---- Beat 98 (starsFormMoreBlackHoles→moreUniverses): "Pull-back" ------
  else if (frame < CUE.moreUniverses) {
    const t = s(frame, CUE.starsFormMoreBlackHoles, CUE.moreUniverses, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(0, -1, t), THREE.MathUtils.lerp(8, 13, t));
    fov = 44;
  }

  // ---- Beat 99 (moreUniverses→cosmicFamilyTree): "Massive zoom-out" ------
  else if (frame < CUE.cosmicFamilyTree) {
    const t = s(frame, CUE.moreUniverses, CUE.cosmicFamilyTree, 0, 1, true);
    position = new THREE.Vector3(0, -1, THREE.MathUtils.lerp(13, 22, t));
    fov = 48;
  }

  // ---- Beat 100 (cosmicFamilyTree→notSingleIsolated): "Slow orbital ------
  // camera"
  else if (frame < CUE.notSingleIsolated) {
    const t = s(frame, CUE.cosmicFamilyTree, CUE.notSingleIsolated, 0, 50, true);
    position = orbit(new THREE.Vector3(0, -1, 0), 22, t, 10);
    lookAt = new THREE.Vector3(0, -1, 0);
    fov = 46;
  }

  // =========================================================================
  // FINAL PAYOFF (beats 101-109)
  // =========================================================================

  // ---- Beat 101 (notSingleIsolated→realityMuchBigger): "Extreme --------
  // pull-back"
  else if (frame < CUE.realityMuchBigger) {
    const t = s(frame, CUE.notSingleIsolated, CUE.realityMuchBigger, 0, 1, true);
    position = new THREE.Vector3(0, -1, THREE.MathUtils.lerp(22, 30, t));
    fov = 48;
  }

  // ---- Beat 102 (realityMuchBigger→partWeExperience): "Infinite ---------
  // zoom-out"
  else if (frame < CUE.partWeExperience) {
    const t = s(frame, CUE.realityMuchBigger, CUE.partWeExperience, 0, 1, true);
    position = new THREE.Vector3(0, -1, THREE.MathUtils.lerp(30, 38, t));
    fov = 50;
  }

  // ---- Beat 103 (partWeExperience→beginningOfUniverse): "Further --------
  // pull-back"
  else if (frame < CUE.beginningOfUniverse) {
    const t = s(frame, CUE.partWeExperience, CUE.beginningOfUniverse, 0, 1, true);
    position = new THREE.Vector3(0, -1, THREE.MathUtils.lerp(38, 48, t));
    fov = 50;
  }

  // ---- Beat 104 (beginningOfUniverse→beginningOfOurCorner): "Reverse -----
  // time-lapse" — camera pushes back IN as the visual shrinks/rewinds.
  else if (frame < CUE.beginningOfOurCorner) {
    const t = s(frame, CUE.beginningOfUniverse, CUE.beginningOfOurCorner, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(4, 0.6, t));
    fov = 34;
  }

  // ---- Beat 105 (beginningOfOurCorner→areWeInsideBlackHole): "Orbit -----
  // around branch"
  else if (frame < CUE.areWeInsideBlackHole) {
    const t = s(frame, CUE.beginningOfOurCorner, CUE.areWeInsideBlackHole, 0, 70, true);
    position = orbit(ORIGIN, 2.4, t, 14);
    fov = 36;
  }

  // ---- Beat 106 (areWeInsideBlackHole→noWayToTellYes): "Slow push toward -
  // planet"
  else if (frame < CUE.noWayToTellYes) {
    const t = s(frame, CUE.areWeInsideBlackHole, CUE.noWayToTellYes, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(5, 3, t));
    fov = 32;
  }

  // ---- Beat 107 (noWayToTellYes→loopHold): "Camera slowly pulls away" ----
  else if (frame < CUE.loopHold) {
    const t = s(frame, CUE.noWayToTellYes, CUE.loopHold, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(3, 6, t));
    fov = 34;
  }

  // ---- Beat 108 (loopHold→loopTransform): "Hold for 1 second" ------------
  // Explicitly stationary per the beat's own direction.
  else if (frame < CUE.loopTransform) {
    position = new THREE.Vector3(0, 0, 6);
    fov = 34;
  }

  // ---- Beat 109 (loopTransform→loopEnd): "Seamless loop" -----------------
  // Eases back to exactly beat 1's starting camera (position (0,0,2.6),
  // fov 28) so the wrap to frame 0 is invisible.
  else {
    const t = s(frame, CUE.loopTransform, CUE.loopEnd, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(6, 2.6, t));
    fov = THREE.MathUtils.lerp(34, 28, t);
  }

  return {position, lookAt, fov};
};
