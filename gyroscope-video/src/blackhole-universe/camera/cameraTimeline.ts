/**
 * Camera language — one literal camera direction per beat, taken from the
 * 125-beat storyboard (see timing.ts). The camera rule: whatever direction
 * a beat specifies must be continuously executing for that beat's FULL
 * duration, never idle, except where the beat explicitly says "locked" /
 * "stops". Comments below quote which beat + direction each branch
 * implements, so it's checkable against the storyboard directly.
 *
 * FRAMING DISCIPLINE (learned the hard way across two earlier bug passes on
 * this same video): every close/tight shot below has its distance computed
 * from the actual object radius in physics.ts via
 * requiredDistance ~= objectRadius / (marginFraction * tan(fov/2))
 * rather than guessed — guessing caused several real overflow bugs
 * (beats filling the entire frame with one flat color, no visible edge)
 * in the 109-beat build. Known object radii used throughout: BlackHole
 * lensing-arc radius ~= 1.28*scale, disk ~= 4.6*scale; NestedUniverse
 * outer-glow radius ~= 1.15*scale once revealLevel > 0 (else a tiny
 * ~0.29*scale point); Sun outer-glow radius ~= 1.8*scale; Paper2D
 * half-extent = size/2 (default size 4 -> half-extent 2); Book half-extent
 * ~= 0.3.
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
  let position = new THREE.Vector3(0, 0, 2.4);
  let lookAt = ORIGIN.clone();
  let fov = 30;

  // =====================================================================
  // OPENING — THE IMPOSSIBLE IDEA (beats 1-10)
  // =====================================================================

  // ---- Beat 1 (hook->iMeanLiterally): "Extremely slow push-in" ---------
  if (frame < CUE.iMeanLiterally) {
    const t = s(frame, CUE.hook, CUE.iMeanLiterally, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(2.4, 2.2, t));
    fov = 28;
  }

  // ---- Beat 2 (iMeanLiterally->whatIfEverythingWeCanSee): "Violent -----
  // zoom-out"
  else if (frame < CUE.whatIfEverythingWeCanSee) {
    const t = Math.pow(s(frame, CUE.iMeanLiterally, CUE.whatIfEverythingWeCanSee, 0, 1, true), 0.5);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(2.2, 4, t));
    fov = 32;
  }

  // ---- Beat 3 (whatIfEverythingWeCanSee->fromGalaxies): "Extreme -------
  // continuous pull-back"
  else if (frame < CUE.fromGalaxies) {
    const t = s(frame, CUE.whatIfEverythingWeCanSee, CUE.fromGalaxies, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(4, 6, t));
    fov = 34;
  }

  // ---- Beat 4 (fromGalaxies->toStarsPlanets): "Continue pulling back" --
  else if (frame < CUE.toStarsPlanets) {
    const t = s(frame, CUE.fromGalaxies, CUE.toStarsPlanets, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(6, 8, t));
    fov = 36;
  }

  // ---- Beat 5 (toStarsPlanets->evenYou): "Camera accelerates backward" -
  else if (frame < CUE.evenYou) {
    const t = Math.pow(s(frame, CUE.toStarsPlanets, CUE.evenYou, 0, 1, true), 0.6);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(8, 12, t));
    fov = 38;
  }

  // ---- Beat 6 (evenYou->isActuallyOnTheInside): "Pull-back suddenly -----
  // slows"
  else if (frame < CUE.isActuallyOnTheInside) {
    const t = s(frame, CUE.evenYou, CUE.isActuallyOnTheInside, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(12, 13, t));
    fov = 38;
  }

  // ---- Beat 7 (isActuallyOnTheInside->ofABlackHole): "Orbital ----------
  // movement"
  else if (frame < CUE.ofABlackHole) {
    const t = s(frame, CUE.isActuallyOnTheInside, CUE.ofABlackHole, 0, 25, true);
    position = orbit(ORIGIN, 13, t, 8);
    fov = 38;
  }

  // ---- Beat 8 (ofABlackHole->thatExistsInSomeLargerUniverse): "Slow ----
  // push toward horizon"
  else if (frame < CUE.thatExistsInSomeLargerUniverse) {
    const t = s(frame, CUE.ofABlackHole, CUE.thatExistsInSomeLargerUniverse, 0, 1, true);
    position = lerpV(orbit(ORIGIN, 13, 25, 8), new THREE.Vector3(0, 2, 10), t);
    fov = 38;
  }

  // ---- Beat 9 (thatExistsInSomeLargerUniverse->howsThatEvenPossible): --
  // "Massive zoom-out"
  else if (frame < CUE.howsThatEvenPossible) {
    const t = Math.pow(s(frame, CUE.thatExistsInSomeLargerUniverse, CUE.howsThatEvenPossible, 0, 1, true), 0.8);
    position = lerpV(new THREE.Vector3(0, 2, 10), new THREE.Vector3(3, 8, 40), t);
    fov = 40;
  }

  // ---- Beat 10 (howsThatEvenPossible->weUsuallyPicture): "Hard stop" ---
  else if (frame < CUE.weUsuallyPicture) {
    position = new THREE.Vector3(3, 8, 40);
    fov = 40;
  }

  // =====================================================================
  // FIRST: WHAT IS A BLACK HOLE (beats 11-19)
  // =====================================================================

  // ---- Beat 11 (weUsuallyPicture->pullingEverythingTowardIt): "Slow ----
  // orbital camera"
  else if (frame < CUE.pullingEverythingTowardIt) {
    const t = s(frame, CUE.weUsuallyPicture, CUE.pullingEverythingTowardIt, 0, 20, true);
    position = orbit(ORIGIN, 12, t, 18);
    fov = 50;
  }

  // ---- Beat 12 (pullingEverythingTowardIt->notReallyWhatABlackHoleIs): -
  // "Follow falling particles"
  else if (frame < CUE.notReallyWhatABlackHoleIs) {
    const t = s(frame, CUE.pullingEverythingTowardIt, CUE.notReallyWhatABlackHoleIs, 20, 40, true);
    const radius = s(frame, CUE.pullingEverythingTowardIt, CUE.notReallyWhatABlackHoleIs, 12, 9, true);
    position = orbit(ORIGIN, radius, t, 14);
    fov = 48;
  }

  // ---- Beat 13 (notReallyWhatABlackHoleIs->aRegionOfSpace): "Camera ----
  // pushes through it"
  else if (frame < CUE.aRegionOfSpace) {
    const t = s(frame, CUE.notReallyWhatABlackHoleIs, CUE.aRegionOfSpace, 0, 1, true);
    const eased = Math.pow(t, 1.4);
    position = lerpV(orbit(ORIGIN, 9, 55, 14), new THREE.Vector3(0.4, 5, 1.1), eased);
    fov = THREE.MathUtils.lerp(48, 36, eased);
    lookAt = lerpV(ORIGIN, new THREE.Vector3(0, -1.2, 0), eased);
  }

  // ---- Beat 14 (aRegionOfSpace->whereGravityHasBecomeExtreme): -----------
  // "Top-down descent"
  else if (frame < CUE.whereGravityHasBecomeExtreme) {
    const t = s(frame, CUE.aRegionOfSpace, CUE.whereGravityHasBecomeExtreme, 0, 1, true);
    position = lerpV(new THREE.Vector3(0.4, 5, 1.1), new THREE.Vector3(0.3, 3, 0.8), t);
    lookAt = lerpV(new THREE.Vector3(0, -1.2, 0), new THREE.Vector3(0, -2, 0.1), t);
    fov = 38;
  }

  // ---- Beat 15 (whereGravityHasBecomeExtreme->onceYouCrossABoundary): --
  // "Camera dives downward"
  else if (frame < CUE.onceYouCrossABoundary) {
    const t = s(frame, CUE.whereGravityHasBecomeExtreme, CUE.onceYouCrossABoundary, 0, 1, true);
    position = lerpV(new THREE.Vector3(0.3, 3, 0.8), new THREE.Vector3(0.25, 1.6, 0.5), t);
    lookAt = lerpV(new THREE.Vector3(0, -2, 0.1), new THREE.Vector3(0, -3.2, 0.15), t);
    fov = 38;
  }

  // ---- Beat 16 (onceYouCrossABoundary->nothingCanEscape): "Straight ----
  // push toward it"
  else if (frame < CUE.nothingCanEscape) {
    const t = s(frame, CUE.onceYouCrossABoundary, CUE.nothingCanEscape, 0, 1, true);
    position = lerpV(new THREE.Vector3(0, 3, 12), new THREE.Vector3(0, 1.2, 8), t);
    fov = 32;
  }

  // ---- Beat 17 (nothingCanEscape->notEvenLight): "Follow beam" ---------
  else if (frame < CUE.notEvenLight) {
    const t = s(frame, CUE.nothingCanEscape, CUE.notEvenLight, 0, 1, true);
    position = lerpV(new THREE.Vector3(0, 1.2, 8), new THREE.Vector3(-2, 1.7, 7.3), t);
    fov = 32;
  }

  // ---- Beat 18 (notEvenLight->calledTheEventHorizon): "Camera follows --
  // it into darkness"
  else if (frame < CUE.calledTheEventHorizon) {
    const t = s(frame, CUE.notEvenLight, CUE.calledTheEventHorizon, 0, 1, true);
    position = lerpV(new THREE.Vector3(-2, 1.7, 7.3), new THREE.Vector3(-3, 2.3, 7), t);
    fov = 32;
  }

  // ---- Beat 19 (calledTheEventHorizon->horizonIsntAWall): "Camera ------
  // locks centrally"
  else if (frame < CUE.horizonIsntAWall) {
    position = new THREE.Vector3(0, 0, 7.5);
    fov = 30;
  }

  // =====================================================================
  // CROSSING THE HORIZON (beats 20-26)
  // =====================================================================

  // ---- Beat 20 (horizonIsntAWall->youDontHitIt): "Smooth forward -------
  // movement"
  else if (frame < CUE.youDontHitIt) {
    const t = s(frame, CUE.horizonIsntAWall, CUE.youDontHitIt, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(6, 2, t));
    fov = 34;
  }

  // ---- Beat 21 (youDontHitIt->fallingIntoMassive): "Continuous POV" ----
  else if (frame < CUE.fallingIntoMassive) {
    const t = s(frame, CUE.youDontHitIt, CUE.fallingIntoMassive, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(2, -2, t));
    fov = 34;
  }

  // ---- Beat 22 (fallingIntoMassive->crossWithoutNoticing): "Rear -------
  // tracking"
  else if (frame < CUE.crossWithoutNoticing) {
    const t = s(frame, CUE.fallingIntoMassive, CUE.crossWithoutNoticing, 0, 1, true);
    position = lerpV(new THREE.Vector3(0, 0.4, 4), new THREE.Vector3(0, 0.3, 1.5), t);
    fov = 40;
  }

  // ---- Beat 23 (crossWithoutNoticing->problemIsWhatHappensAfter): ------
  // "First-person POV"
  else if (frame < CUE.problemIsWhatHappensAfter) {
    const t = s(frame, CUE.crossWithoutNoticing, CUE.problemIsWhatHappensAfter, 0, 1, true);
    position = lerpV(new THREE.Vector3(0, 0.3, 1.5), new THREE.Vector3(0, 0, -2), t);
    fov = 44;
  }

  // ---- Beat 24 (problemIsWhatHappensAfter->allPossiblePaths): "Slow ----
  // rotation"
  else if (frame < CUE.allPossiblePaths) {
    const t = s(frame, CUE.problemIsWhatHappensAfter, CUE.allPossiblePaths, 0, 1, true);
    position = new THREE.Vector3(0, 0, -2);
    lookAt = lerpV(new THREE.Vector3(0, 0, -6), new THREE.Vector3(0, 0.3, 8), t);
    fov = 40;
  }

  // ---- Beat 25 (allPossiblePaths->leadDeeper): "Orbit around -----------
  // trajectories"
  else if (frame < CUE.leadDeeper) {
    const t = s(frame, CUE.allPossiblePaths, CUE.leadDeeper, 0, 90, true);
    position = orbit(ORIGIN, 5.5, t, 12);
    fov = 42;
  }

  // ---- Beat 26 (leadDeeper->takeToSingularity): "Accelerating dive" ----
  else if (frame < CUE.takeToSingularity) {
    const t = Math.pow(s(frame, CUE.leadDeeper, CUE.takeToSingularity, 0, 1, true), 1.8);
    const radius = THREE.MathUtils.lerp(5.5, 0.6, t);
    position = orbit(ORIGIN, radius, 90 + t * 40, THREE.MathUtils.lerp(12, 2, t));
    fov = 42;
  }

  // =====================================================================
  // THE SINGULARITY (beats 27-33)
  // =====================================================================

  // ---- Beat 27 (takeToSingularity->stopMakingSense): "Extreme macro ----
  // zoom"
  else if (frame < CUE.stopMakingSense) {
    const t = s(frame, CUE.takeToSingularity, CUE.stopMakingSense, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(0.6, 0.16, t));
    fov = 26;
  }

  // ---- Beat 28 (stopMakingSense->producingInfinities): "Camera flies ---
  // through them"
  else if (frame < CUE.producingInfinities) {
    const t = s(frame, CUE.stopMakingSense, CUE.producingInfinities, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(0.55, 0.2, t));
    fov = 30;
  }

  // ---- Beat 29 (producingInfinities->somethingIsMissing): "Rapid -------
  // expansion"
  else if (frame < CUE.somethingIsMissing) {
    const t = s(frame, CUE.producingInfinities, CUE.somethingIsMissing, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(0.6, 6, t));
    fov = 40;
  }

  // ---- Beat 30 (somethingIsMissing->generalRelativity): "Hard cut" -----
  else if (frame < CUE.generalRelativity) {
    position = new THREE.Vector3(0, 0, 4);
    fov = 40;
  }

  // ---- Beat 31 (generalRelativity->quantumMechanics): "Slow orbit" -----
  else if (frame < CUE.quantumMechanics) {
    const t = s(frame, CUE.generalRelativity, CUE.quantumMechanics, 0, 60, true);
    position = orbit(new THREE.Vector3(0, -0.6, 0), 6, t, 22);
    lookAt = new THREE.Vector3(0, -0.6, 0);
    fov = 38;
  }

  // ---- Beat 32 (quantumMechanics->noCompleteTheory): "Macro tracking" --
  else if (frame < CUE.noCompleteTheory) {
    const t = s(frame, CUE.quantumMechanics, CUE.noCompleteTheory, -1.5, 1.5, true);
    position = new THREE.Vector3(t, 0.4, 3.2);
    fov = 38;
  }

  // ---- Beat 33 (noCompleteTheory->singularityIsntTheEnd): "Split- ------
  // screen pull"
  else if (frame < CUE.singularityIsntTheEnd) {
    const t = s(frame, CUE.noCompleteTheory, CUE.singularityIsntTheEnd, 0, 1, true);
    position = lerpV(new THREE.Vector3(0, 0.4, 3.2), new THREE.Vector3(0, 0.2, 10), t);
    fov = 44;
  }

  // =====================================================================
  // WHAT IF THE SINGULARITY ISN'T THE END (beats 34-40)
  // =====================================================================

  // ---- Beat 34 (singularityIsntTheEnd->somethingHappensThere): "Slow ---
  // push-in"
  else if (frame < CUE.somethingHappensThere) {
    const t = s(frame, CUE.singularityIsntTheEnd, CUE.somethingHappensThere, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(2.4, 1.6, t));
    fov = 32;
  }

  // ---- Beat 35 (somethingHappensThere->physicsDoesntKnow): "Reverse ----
  // zoom"
  else if (frame < CUE.physicsDoesntKnow) {
    const t = s(frame, CUE.somethingHappensThere, CUE.physicsDoesntKnow, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(1.6, 3.2, t));
    fov = 34;
  }

  // ---- Beat 36 (physicsDoesntKnow->quantumGravityPrevents): "360deg ----
  // rotation"
  else if (frame < CUE.quantumGravityPrevents) {
    const t = s(frame, CUE.physicsDoesntKnow, CUE.quantumGravityPrevents, 0, 360, true);
    position = orbit(new THREE.Vector3(0, -0.8, 0), 4.5, t, 20);
    lookAt = new THREE.Vector3(0, -0.8, 0);
    fov = 38;
  }

  // ---- Beat 37 (quantumGravityPrevents->transitionsIntoSomething): -----
  // "Circular orbit"
  else if (frame < CUE.transitionsIntoSomething) {
    const t = s(frame, CUE.quantumGravityPrevents, CUE.transitionsIntoSomething, 0, 90, true);
    position = orbit(ORIGIN, 3.2, t, 14);
    fov = 34;
  }

  // ---- Beat 38 (transitionsIntoSomething->newRegionSpacetime): "Rapid --
  // backward movement"
  else if (frame < CUE.newRegionSpacetime) {
    const t = s(frame, CUE.transitionsIntoSomething, CUE.newRegionSpacetime, 0, 1, true);
    position = new THREE.Vector3(0, 1, THREE.MathUtils.lerp(3.2, 10, t));
    fov = 42;
  }

  // ---- Beat 39 (newRegionSpacetime->somethingLikeANewUniverse): "Fly ---
  // backward through grid"
  else if (frame < CUE.somethingLikeANewUniverse) {
    const t = s(frame, CUE.newRegionSpacetime, CUE.somethingLikeANewUniverse, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(1, 2.5, t), THREE.MathUtils.lerp(10, 16, t));
    fov = 44;
  }

  // ---- Beat 40 (somethingLikeANewUniverse->parentUniverse): "Huge ------
  // pull-back"
  else if (frame < CUE.parentUniverse) {
    const t = s(frame, CUE.somethingLikeANewUniverse, CUE.parentUniverse, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(2.5, 5, t), THREE.MathUtils.lerp(16, 30, t));
    fov = 46;
  }

  // =====================================================================
  // THE PARENT UNIVERSE (beats 41-52)
  // =====================================================================

  // ---- Beat 41 (parentUniverse->starCollapses): "Slow fly-through" -----
  else if (frame < CUE.starCollapses) {
    const t = s(frame, CUE.parentUniverse, CUE.starCollapses, 0, 1, true);
    position = new THREE.Vector3(THREE.MathUtils.lerp(-2, 2, t), 4, 26);
    fov = 44;
  }

  // ---- Beat 42 (starCollapses->formsBlackHole): "Close orbit" ----------
  // Sun's outer-glow radius ~= 1.8*scale, max scale 1.4 here -> radius
  // ~2.52; orbit 8.5/fov44 keeps it framed (see file header note).
  else if (frame < CUE.formsBlackHole) {
    const t = s(frame, CUE.starCollapses, CUE.formsBlackHole, 0, 70, true);
    position = orbit(ORIGIN, 8.5, t, 10);
    fov = 44;
  }

  // ---- Beat 43 (formsBlackHole->yourPerspective): "Rapid pull-back" ----
  else if (frame < CUE.yourPerspective) {
    const t = s(frame, CUE.formsBlackHole, CUE.yourPerspective, 0, 1, true);
    position = new THREE.Vector3(0, 1, THREE.MathUtils.lerp(8.5, 12, t));
    fov = 42;
  }

  // ---- Beat 44 (yourPerspective->thereIsABlackHole): "Over-shoulder" ---
  else if (frame < CUE.thereIsABlackHole) {
    position = new THREE.Vector3(0, 0.6, 3.6);
    fov = 40;
  }

  // ---- Beat 45 (thereIsABlackHole->butInside): "Slow push" -------------
  else if (frame < CUE.butInside) {
    const t = s(frame, CUE.thereIsABlackHole, CUE.butInside, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(6, 3.6, t));
    fov = 36;
  }

  // ---- Beat 46 (butInside->expandingRegionForms): "Continuous ----------
  // transition"
  else if (frame < CUE.expandingRegionForms) {
    const t = s(frame, CUE.butInside, CUE.expandingRegionForms, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(3.6, -1.5, t));
    fov = 40;
  }

  // ---- Beat 47 (expandingRegionForms->seeGalaxies): "Massive reverse ---
  // zoom"
  else if (frame < CUE.seeGalaxies) {
    const t = s(frame, CUE.expandingRegionForms, CUE.seeGalaxies, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(-1.5, 12, t));
    fov = 42;
  }

  // ---- Beat 48 (seeGalaxies->starsAndPlanets): "Nested zoom" -----------
  else if (frame < CUE.starsAndPlanets) {
    const t = s(frame, CUE.seeGalaxies, CUE.starsAndPlanets, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(12, 8, t));
    fov = 40;
  }

  // ---- Beat 49 (starsAndPlanets->seeExpandingUniverse): "Rapid nested --
  // zooms"
  else if (frame < CUE.seeExpandingUniverse) {
    const t = s(frame, CUE.starsAndPlanets, CUE.seeExpandingUniverse, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(8, 4, t));
    fov = 40;
  }

  // ---- Beat 50 (seeExpandingUniverse->whereDidThisComeFrom): "Camera ---
  // stationary"
  else if (frame < CUE.whereDidThisComeFrom) {
    position = new THREE.Vector3(0, 0, 4);
    fov = 42;
  }

  // ---- Beat 51 (whereDidThisComeFrom->answerIsBigBang): "Tilt upward" --
  else if (frame < CUE.answerIsBigBang) {
    const t = s(frame, CUE.whereDidThisComeFrom, CUE.answerIsBigBang, 0, 1, true);
    position = new THREE.Vector3(0, 0.9, 2.6);
    lookAt = lerpV(new THREE.Vector3(0, 1.4, 0), new THREE.Vector3(0, 4.5, -1), t);
    fov = 40;
  }

  // ---- Beat 52 (answerIsBigBang->tinyBallExploding): "Reverse ----------
  // time-lapse"
  else if (frame < CUE.tinyBallExploding) {
    const t = s(frame, CUE.answerIsBigBang, CUE.tinyBallExploding, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(2.6, 6, t));
    fov = 36;
  }

  // =====================================================================
  // BIG BANG — NOT AN EXPLOSION (beats 53-61)
  // =====================================================================

  // ---- Beat 53 (tinyBallExploding->notWhatHappened): "Quick zoom" ------
  else if (frame < CUE.notWhatHappened) {
    const t = Math.pow(s(frame, CUE.tinyBallExploding, CUE.notWhatHappened, 0, 1, true), 0.6);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(6, 12, t));
    fov = 42;
  }

  // ---- Beat 54 (notWhatHappened->spaceExpanding): "Camera stops --------
  // (explosion reverses)"
  else if (frame < CUE.spaceExpanding) {
    const t = s(frame, CUE.notWhatHappened, CUE.spaceExpanding, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(12, 4, t));
    fov = 38;
  }

  // ---- Beat 55 (spaceExpanding->earlyUniverseHot): "Camera embedded in -
  // grid"
  else if (frame < CUE.earlyUniverseHot) {
    position = new THREE.Vector3(0, 1.2, 2.4);
    lookAt = new THREE.Vector3(0, -0.4, 0);
    fov = 46;
  }

  // ---- Beat 56 (earlyUniverseHot->incrediblyDense): "Extreme close-up" -
  else if (frame < CUE.incrediblyDense) {
    position = new THREE.Vector3(0, 0, 0.9);
    fov = 30;
  }

  // ---- Beat 57 (incrediblyDense->asSpaceExpanded): "Slow push" ---------
  else if (frame < CUE.asSpaceExpanded) {
    const t = s(frame, CUE.incrediblyDense, CUE.asSpaceExpanded, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(0.9, 0.75, t));
    fov = 30;
  }

  // ---- Beat 58 (asSpaceExpanded->universeCooled): "Pull-back" ----------
  else if (frame < CUE.universeCooled) {
    const t = s(frame, CUE.asSpaceExpanded, CUE.universeCooled, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(0.75, 2.5, t));
    fov = 34;
  }

  // ---- Beat 59 (universeCooled->blackHoleGoingBoom): "Long time-lapse" -
  else if (frame < CUE.blackHoleGoingBoom) {
    const t = s(frame, CUE.universeCooled, CUE.blackHoleGoingBoom, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(2.5, 7, t));
    fov = 40;
  }

  // ---- Beat 60 (blackHoleGoingBoom->somethingStranger): "Snap zoom" ----
  else if (frame < CUE.somethingStranger) {
    const t = s(frame, CUE.blackHoleGoingBoom, CUE.blackHoleGoingBoom + 12, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(7, 3, t));
    fov = 34;
  }

  // ---- Beat 61 (somethingStranger->ifWereInsideABlackHole): "Slow ------
  // morph"
  else if (frame < CUE.ifWereInsideABlackHole) {
    const t = s(frame, CUE.somethingStranger, CUE.ifWereInsideABlackHole, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(0, 1.6, t), THREE.MathUtils.lerp(3, 6, t));
    fov = 40;
  }

  // =====================================================================
  // WHERE IS THE EVENT HORIZON (beats 62-69)
  // =====================================================================

  // ---- Beat 62 (ifWereInsideABlackHole->whereIsTheEventHorizon): -------
  // "Pull-back"
  else if (frame < CUE.whereIsTheEventHorizon) {
    const t = s(frame, CUE.ifWereInsideABlackHole, CUE.whereIsTheEventHorizon, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(6, 7.5, t));
    fov = 42;
  }

  // ---- Beat 63 (whereIsTheEventHorizon->wheresTheEdge): "Slow -----------
  // approach"
  else if (frame < CUE.wheresTheEdge) {
    const t = s(frame, CUE.whereIsTheEventHorizon, CUE.wheresTheEdge, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(7.5, 9, t));
    fov = 42;
  }

  // ---- Beat 64 (wheresTheEdge->giantBlackSphere): "Camera stops" -------
  else if (frame < CUE.giantBlackSphere) {
    position = new THREE.Vector3(0, 0, 9);
    fov = 42;
  }

  // ---- Beat 65 (giantBlackSphere->notPhysicalWall): "360deg pan" -------
  else if (frame < CUE.notPhysicalWall) {
    const t = s(frame, CUE.giantBlackSphere, CUE.notPhysicalWall, 0, 360, true);
    position = orbit(new THREE.Vector3(0, -0.6, 0), 3.2, t, 8);
    lookAt = new THREE.Vector3(0, -0.2, 0);
    fov = 42;
  }

  // ---- Beat 66 (notPhysicalWall->boundaryInSpacetime): "Camera passes --
  // through"
  else if (frame < CUE.boundaryInSpacetime) {
    const t = s(frame, CUE.notPhysicalWall, CUE.boundaryInSpacetime, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(3, 0.2, t), THREE.MathUtils.lerp(5, 0.8, t));
    lookAt = new THREE.Vector3(0, -0.8, 0);
    fov = 40;
  }

  // ---- Beat 67 (boundaryInSpacetime->seeBlackCircle): "Slow rotation" --
  else if (frame < CUE.seeBlackCircle) {
    const t = s(frame, CUE.boundaryInSpacetime, CUE.seeBlackCircle, 0, 90, true);
    position = orbit(ORIGIN, 3.6, t, 8);
    fov = 36;
  }

  // ---- Beat 68 (seeBlackCircle->partOfGeometry): "Pull-back" -----------
  else if (frame < CUE.partOfGeometry) {
    const t = s(frame, CUE.seeBlackCircle, CUE.partOfGeometry, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(3.6, 8, t));
    fov = 40;
  }

  // ---- Beat 69 (partOfGeometry->creatureOnPaper): "Wide orbit" ---------
  else if (frame < CUE.creatureOnPaper) {
    const t = s(frame, CUE.partOfGeometry, CUE.creatureOnPaper, 0, 140, true);
    position = orbit(ORIGIN, 9, t, 16);
    fov = 40;
  }

  // =====================================================================
  // THE PAPER ANALOGY (beats 70-77)
  // =====================================================================

  // Paper2D half-extent = 2 (size 4). Distances 9-14 below keep it framed
  // (this exact class of bug — camera far too close for the paper's real
  // size — was found and fixed once already in the 109-beat build).

  // ---- Beat 70 (creatureOnPaper->leftAndRight): "Top-down" -------------
  else if (frame < CUE.leftAndRight) {
    position = new THREE.Vector3(0, 9, 0.01);
    lookAt = ORIGIN.clone();
    fov = 36;
  }

  // ---- Beat 71 (leftAndRight->forwardAndBackward): "Side tracking" -----
  else if (frame < CUE.forwardAndBackward) {
    const t = s(frame, CUE.leftAndRight, CUE.forwardAndBackward, 0, 1, true);
    const x = THREE.MathUtils.lerp(-1.1, 1.1, t);
    position = new THREE.Vector3(x, 9, 1.2);
    lookAt = new THREE.Vector3(x, 0, 0);
    fov = 34;
  }

  // ---- Beat 72 (forwardAndBackward->noConceptOfUp): "Top-down ----------
  // tracking"
  else if (frame < CUE.noConceptOfUp) {
    const t = s(frame, CUE.forwardAndBackward, CUE.noConceptOfUp, 0, 1, true);
    const z = THREE.MathUtils.lerp(-1.1, 1.1, t);
    position = new THREE.Vector3(1.2, 9, z);
    lookAt = new THREE.Vector3(0, 0, z);
    fov = 34;
  }

  // ---- Beat 73 (noConceptOfUp->pickItUp): "Vertical crane" -------------
  else if (frame < CUE.pickItUp) {
    const t = s(frame, CUE.noConceptOfUp, CUE.pickItUp, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(9, 14, t), 1.2);
    lookAt = ORIGIN.clone();
    fov = 34;
  }

  // ---- Beat 74 (pickItUp->creaturesPerspective): "Upward movement" -----
  else if (frame < CUE.creaturesPerspective) {
    const t = s(frame, CUE.pickItUp, CUE.creaturesPerspective, 0, 1, true);
    const liftY = t * 1.6;
    position = new THREE.Vector3(5, liftY + 3, 5);
    lookAt = new THREE.Vector3(0, liftY, 0);
    fov = 36;
  }

  // ---- Beat 75 (creaturesPerspective->directionItCouldntAccess): -------
  // "Camera at creature height"
  else if (frame < CUE.directionItCouldntAccess) {
    const t = s(frame, CUE.creaturesPerspective, CUE.directionItCouldntAccess, 0, 1, true);
    position = new THREE.Vector3(0, 1.65, 0.05);
    lookAt = lerpV(new THREE.Vector3(0.6, 2.6, 0.4), new THREE.Vector3(-0.6, 2.2, -0.4), Math.sin(t * Math.PI));
    fov = 46;
  }

  // ---- Beat 76 (directionItCouldntAccess->intuitionWeNeed): "Large -----
  // orbital move"
  else if (frame < CUE.intuitionWeNeed) {
    const t = s(frame, CUE.directionItCouldntAccess, CUE.intuitionWeNeed, 0, 130, true);
    position = orbit(new THREE.Vector3(0, 1.6, 0), 4.5, t, 22);
    lookAt = new THREE.Vector3(0, 1.6, 0);
    fov = 40;
  }

  // ---- Beat 77 (intuitionWeNeed->whatsOutside): "Morph transition" -----
  else if (frame < CUE.whatsOutside) {
    const t = s(frame, CUE.intuitionWeNeed, CUE.whatsOutside, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(1.6, 0.4, t), THREE.MathUtils.lerp(4.5, 6, t));
    lookAt = lerpV(new THREE.Vector3(0, 1.6, 0), new THREE.Vector3(0, 0.4, 0), t);
    fov = 38;
  }

  // =====================================================================
  // WHAT'S OUTSIDE OUR UNIVERSE (beats 78-87)
  // =====================================================================

  // ---- Beat 78 (whatsOutside->doesntMakeSense): "Slow pull-back" -------
  else if (frame < CUE.doesntMakeSense) {
    const t = s(frame, CUE.whatsOutside, CUE.doesntMakeSense, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(5, 8, t));
    fov = 36;
  }

  // ---- Beat 79 (doesntMakeSense->supposeInsideBlackHole): "Camera ------
  // stops"
  else if (frame < CUE.supposeInsideBlackHole) {
    position = new THREE.Vector3(0, 0, 8);
    fov = 36;
  }

  // ---- Beat 80 (supposeInsideBlackHole->largerSpacetimeOutside): -------
  // "Rapid zoom-out"
  else if (frame < CUE.largerSpacetimeOutside) {
    const t = s(frame, CUE.supposeInsideBlackHole, CUE.largerSpacetimeOutside, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(8, 3, t));
    fov = 42;
  }

  // ---- Beat 81 (largerSpacetimeOutside->parentUniverseAgain): "Massive -
  // reveal" — blackHole scale grows 3->7 here (physics.ts); distance
  // recomputed from the object's actual radius, not guessed (see file
  // header — this exact bug class was found and fixed once already).
  else if (frame < CUE.parentUniverseAgain) {
    const t = s(frame, CUE.largerSpacetimeOutside, CUE.parentUniverseAgain, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(2, 8, t), THREE.MathUtils.lerp(15, 34, t));
    fov = 46;
  }

  // ---- Beat 82 (parentUniverseAgain->theyDSeeBlackHole): "Wide orbit" --
  // blackHole scale is a constant 7 through this whole beat; orbit radius
  // 32 keeps its ~9-unit lensing radius comfortably framed at fov 46.
  else if (frame < CUE.theyDSeeBlackHole) {
    const t = s(frame, CUE.parentUniverseAgain, CUE.theyDSeeBlackHole, 0, 130, true);
    position = orbit(new THREE.Vector3(0, 1, 0), 32, t, 12);
    lookAt = new THREE.Vector3(0, 1, 0);
    fov = 46;
  }

  // ---- Beat 83 (theyDSeeBlackHole->meanwhileInside): "Over-shoulder" ---
  else if (frame < CUE.meanwhileInside) {
    position = new THREE.Vector3(0, 0.4, 2.4);
    fov = 40;
  }

  // ---- Beat 84 (meanwhileInside->lookingAroundSaying): "Match cut" -----
  else if (frame < CUE.lookingAroundSaying) {
    const t = s(frame, CUE.meanwhileInside, CUE.lookingAroundSaying, 0, 1, true);
    position = new THREE.Vector3(0, 0.4, THREE.MathUtils.lerp(2.4, -1, t));
    fov = 42;
  }

  // ---- Beat 85 (lookingAroundSaying->thisIsTheUniverse): "Slow -----------
  // planetary orbit"
  else if (frame < CUE.thisIsTheUniverse) {
    const t = s(frame, CUE.lookingAroundSaying, CUE.thisIsTheUniverse, 0, 30, true);
    position = orbit(ORIGIN, 3.4, t, 10);
    fov = 36;
  }

  // ---- Beat 86 (thisIsTheUniverse->differentPerspectives): "Continuous -
  // zoom-out"
  else if (frame < CUE.differentPerspectives) {
    const t = s(frame, CUE.thisIsTheUniverse, CUE.differentPerspectives, 30, 60, true);
    const radius = s(frame, CUE.thisIsTheUniverse, CUE.differentPerspectives, 3.4, 6, true);
    position = orbit(ORIGIN, radius, t, 10);
    fov = 38;
  }

  // ---- Beat 87 (differentPerspectives->couldWeProve): "Synchronized ----
  // zoom"
  else if (frame < CUE.couldWeProve) {
    const t = s(frame, CUE.differentPerspectives, CUE.couldWeProve, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(1, 2.5, t), THREE.MathUtils.lerp(6, 9, t));
    fov = 44;
  }

  // =====================================================================
  // CAN WE PROVE IT (beats 88-97)
  // =====================================================================

  // ---- Beat 88 (couldWeProve->beyondCausalHorizon): "Push toward lens" -
  else if (frame < CUE.beyondCausalHorizon) {
    const t = s(frame, CUE.couldWeProve, CUE.beyondCausalHorizon, 0, 1, true);
    position = lerpV(new THREE.Vector3(1.4, 0.4, 2.4), new THREE.Vector3(0.15, 0.9, 0.9), t);
    fov = 36;
  }

  // ---- Beat 89 (beyondCausalHorizon->biggerTelescope): "Orbit" ---------
  else if (frame < CUE.biggerTelescope) {
    const t = s(frame, CUE.beyondCausalHorizon, CUE.biggerTelescope, 0, 80, true);
    position = orbit(ORIGIN, 4.2, t, 12);
    fov = 40;
  }

  // ---- Beat 90 (biggerTelescope->infoCantReachUs): "Zoom out" ----------
  else if (frame < CUE.infoCantReachUs) {
    const t = s(frame, CUE.biggerTelescope, CUE.infoCantReachUs, 0, 1, true);
    position = new THREE.Vector3(0.5, THREE.MathUtils.lerp(0.5, 3, t), THREE.MathUtils.lerp(3, 10, t));
    fov = 44;
  }

  // ---- Beat 91 (infoCantReachUs->nothingForTelescopeToSee): "Follow ----
  // signal"
  else if (frame < CUE.nothingForTelescopeToSee) {
    const t = s(frame, CUE.infoCantReachUs, CUE.nothingForTelescopeToSee, 0, 1, true);
    position = lerpV(new THREE.Vector3(2, 1.2, 2.2), new THREE.Vector3(0.7, 0.4, 0.9), t);
    fov = 38;
  }

  // ---- Beat 92 (nothingForTelescopeToSee->indirectEvidence): "Camera ---
  // enters eyepiece"
  else if (frame < CUE.indirectEvidence) {
    const t = s(frame, CUE.nothingForTelescopeToSee, CUE.indirectEvidence, 0, 1, true);
    position = lerpV(new THREE.Vector3(0.7, 0.4, 0.9), new THREE.Vector3(0.1, 0.05, 0.15), t);
    fov = THREE.MathUtils.lerp(38, 55, t);
  }

  // ---- Beat 93 (indirectEvidence->particularPatterns): "Pull through ---
  // screen"
  else if (frame < CUE.particularPatterns) {
    const t = s(frame, CUE.indirectEvidence, CUE.particularPatterns, -50, 50, true);
    position = orbit(ORIGIN, 3.6, t, 6);
    fov = 40;
  }

  // ---- Beat 94 (particularPatterns->geometryOfUniverse): "Macro zoom" --
  else if (frame < CUE.geometryOfUniverse) {
    const t = s(frame, CUE.particularPatterns, CUE.geometryOfUniverse, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(3.6, 1.4, t));
    fov = 30;
  }

  // ---- Beat 95 (geometryOfUniverse->specificPrediction): "Slow ---------
  // rotation"
  else if (frame < CUE.specificPrediction) {
    const t = s(frame, CUE.geometryOfUniverse, CUE.specificPrediction, 0, 90, true);
    position = orbit(new THREE.Vector3(0, -1.4, 0), 4, t, 18);
    lookAt = new THREE.Vector3(0, -1.4, 0);
    fov = 40;
  }

  // ---- Beat 96 (specificPrediction->ideaVsTheory): "Push through -------
  // equation"
  else if (frame < CUE.ideaVsTheory) {
    const t = s(frame, CUE.specificPrediction, CUE.ideaVsTheory, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(2.2, 0.5, t));
    fov = 32;
  }

  // ---- Beat 97 (ideaVsTheory->bookIntoBlackHole): "Sequential forward --
  // movement" — three discrete positions, one per stage (physics.ts's
  // s.hpt.stage 0/1/2).
  else if (frame < CUE.bookIntoBlackHole) {
    const shotStart = CUE.ideaVsTheory;
    const shotEnd = CUE.bookIntoBlackHole;
    const stageF = s(frame, shotStart, shotStart + (shotEnd - shotStart) * 0.7, 0, 2, true);
    const stagePositions = [new THREE.Vector3(-1.6, 0, 2.4), new THREE.Vector3(0, 0, 2.2), new THREE.Vector3(1.6, 0, 2.4)];
    const idx = THREE.MathUtils.clamp(Math.floor(stageF), 0, 1);
    const localT = THREE.MathUtils.clamp(stageF - idx, 0, 1);
    position = lerpV(stagePositions[idx], stagePositions[idx + 1] ?? stagePositions[idx], localT);
    fov = 34;
  }

  // =====================================================================
  // THE INFORMATION PROBLEM (beats 98-106)
  // =====================================================================

  // ---- Beat 98 (bookIntoBlackHole->bookContainsInfo): "Tracking shot" --
  else if (frame < CUE.bookContainsInfo) {
    const t = s(frame, CUE.bookIntoBlackHole, CUE.bookContainsInfo, 0, 1, true);
    position = lerpV(new THREE.Vector3(1.4, 0.6, 3.2), new THREE.Vector3(0.7, 0.3, 1.1), t);
    fov = 36;
  }

  // ---- Beat 99 (bookContainsInfo->everyWordLetterMolecule): "Macro -----
  // zoom" — book half-extent ~0.3; distance 1.4->0.9 stays outside it
  // comfortably at fov 30.
  else if (frame < CUE.everyWordLetterMolecule) {
    const t = s(frame, CUE.bookContainsInfo, CUE.everyWordLetterMolecule, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(1.4, 0.9, t));
    fov = 30;
  }

  // ---- Beat 100 (everyWordLetterMolecule->whatHappensToInfo): "Extreme -
  // nested zoom" — BUG CLASS AVOIDED: distance floor kept above the
  // book's own half-extent (~0.3) even at this beat's closest, unlike the
  // 109-beat build's original 0.25 (which overflowed the entire frame).
  else if (frame < CUE.whatHappensToInfo) {
    const t = s(frame, CUE.everyWordLetterMolecule, CUE.whatHappensToInfo, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(0.9, 0.55, t));
    fov = 30;
  }

  // ---- Beat 101 (whatHappensToInfo->hawkingMadeWorse): "Follow it -------
  // (hard blackout)"
  else if (frame < CUE.hawkingMadeWorse) {
    position = new THREE.Vector3(0, 0, 4.5);
    fov = 36;
  }

  // ---- Beat 102 (hawkingMadeWorse->emitRadiation): "Orbit" -------------
  else if (frame < CUE.emitRadiation) {
    const t = s(frame, CUE.hawkingMadeWorse, CUE.emitRadiation, 0, 60, true);
    position = orbit(ORIGIN, 3.2, t, 12);
    fov = 36;
  }

  // ---- Beat 103 (emitRadiation->couldEvaporate): "Follow outward -------
  // particle"
  else if (frame < CUE.couldEvaporate) {
    const t = s(frame, CUE.emitRadiation, CUE.couldEvaporate, 0, 1, true);
    position = new THREE.Vector3(0, 1, THREE.MathUtils.lerp(3.2, 7, t));
    fov = 40;
  }

  // ---- Beat 104 (couldEvaporate->blackHoleDisappears): "Time-lapse ------
  // pull-back"
  else if (frame < CUE.blackHoleDisappears) {
    const t = s(frame, CUE.couldEvaporate, CUE.blackHoleDisappears, 0, 1, true);
    position = new THREE.Vector3(0, 1, THREE.MathUtils.lerp(7, 9, t));
    fov = 40;
  }

  // ---- Beat 105 (blackHoleDisappears->whereDidItGo): "Slow pull-back" --
  else if (frame < CUE.whereDidItGo) {
    const t = s(frame, CUE.blackHoleDisappears, CUE.whereDidItGo, 0, 1, true);
    position = new THREE.Vector3(0, 1, THREE.MathUtils.lerp(9, 11, t));
    fov = 40;
  }

  // ---- Beat 106 (whereDidItGo->blackHolesCreateMany): "Locked camera" --
  else if (frame < CUE.blackHolesCreateMany) {
    position = new THREE.Vector3(0, 0, 3);
    fov = 30;
  }

  // =====================================================================
  // COSMIC FAMILY TREE (beats 107-114)
  // =====================================================================

  // ---- Beat 107 (blackHolesCreateMany->starsForm): "Wide shot" ---------
  else if (frame < CUE.starsForm) {
    position = new THREE.Vector3(0, 0, 8);
    fov = 42;
  }

  // ---- Beat 108 (starsForm->collapseIntoBlackHoles): "Time-lapse" ------
  else if (frame < CUE.collapseIntoBlackHoles) {
    const t = s(frame, CUE.starsForm, CUE.collapseIntoBlackHoles, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(0, 0.6, t), 8);
    fov = 42;
  }

  // ---- Beat 109 (collapseIntoBlackHoles->producingNewUniverses): -------
  // "Rapid zoom"
  else if (frame < CUE.producingNewUniverses) {
    const t = s(frame, CUE.collapseIntoBlackHoles, CUE.producingNewUniverses, 0, 1, true);
    position = lerpV(new THREE.Vector3(0.9, 0.6, 8), new THREE.Vector3(1.3, 0.5, 1.6), t);
    fov = 36;
  }

  // ---- Beat 110 (producingNewUniverses->universesFormStars): "Nested ---
  // zoom" — tiny black hole here is scale 0.15 (lensing radius ~0.19); a
  // wide FOV lets the camera dive close without clipping through the
  // geometry (the exact fix applied when this bug was first found).
  else if (frame < CUE.universesFormStars) {
    const t = s(frame, CUE.producingNewUniverses, CUE.universesFormStars, 0, 1, true);
    position = lerpV(new THREE.Vector3(1.3, 0.5, 1.6), new THREE.Vector3(1.23, 0.47, 1.33), t);
    fov = THREE.MathUtils.lerp(36, 70, t);
  }

  // ---- Beat 111 (universesFormStars->starsFormMoreBlackHoles): --------
  // "Accelerated evolution"
  else if (frame < CUE.starsFormMoreBlackHoles) {
    const t = Math.pow(s(frame, CUE.universesFormStars, CUE.starsFormMoreBlackHoles, 0, 1, true), 0.5);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(4, 8, t));
    fov = 40;
  }

  // ---- Beat 112 (starsFormMoreBlackHoles->moreUniverses): "Pull-back" --
  else if (frame < CUE.moreUniverses) {
    const t = s(frame, CUE.starsFormMoreBlackHoles, CUE.moreUniverses, 0, 1, true);
    position = new THREE.Vector3(0, THREE.MathUtils.lerp(0, -1, t), THREE.MathUtils.lerp(8, 13, t));
    fov = 44;
  }

  // ---- Beat 113 (moreUniverses->cosmicFamilyTree): "Massive zoom-out" --
  else if (frame < CUE.cosmicFamilyTree) {
    const t = s(frame, CUE.moreUniverses, CUE.cosmicFamilyTree, 0, 1, true);
    position = new THREE.Vector3(0, -1, THREE.MathUtils.lerp(13, 22, t));
    fov = 48;
  }

  // ---- Beat 114 (cosmicFamilyTree->notSingleIsolated): "Slow orbital ---
  // camera"
  else if (frame < CUE.notSingleIsolated) {
    const t = s(frame, CUE.cosmicFamilyTree, CUE.notSingleIsolated, 0, 50, true);
    position = orbit(new THREE.Vector3(0, -1, 0), 22, t, 10);
    lookAt = new THREE.Vector3(0, -1, 0);
    fov = 46;
  }

  // =====================================================================
  // FINAL PAYOFF (beats 115-125)
  // =====================================================================

  // ---- Beat 115 (notSingleIsolated->realityMuchBigger): "Extreme -------
  // pull-back"
  else if (frame < CUE.realityMuchBigger) {
    const t = s(frame, CUE.notSingleIsolated, CUE.realityMuchBigger, 0, 1, true);
    position = new THREE.Vector3(0, -1, THREE.MathUtils.lerp(22, 30, t));
    fov = 48;
  }

  // ---- Beat 116 (realityMuchBigger->partWeExperience): "Infinite -------
  // zoom-out"
  else if (frame < CUE.partWeExperience) {
    const t = s(frame, CUE.realityMuchBigger, CUE.partWeExperience, 0, 1, true);
    position = new THREE.Vector3(0, -1, THREE.MathUtils.lerp(30, 38, t));
    fov = 50;
  }

  // ---- Beat 117 (partWeExperience->beginningOfUniverse): "Continue -----
  // pulling away"
  else if (frame < CUE.beginningOfUniverse) {
    const t = s(frame, CUE.partWeExperience, CUE.beginningOfUniverse, 0, 1, true);
    position = new THREE.Vector3(0, -1, THREE.MathUtils.lerp(38, 48, t));
    fov = 50;
  }

  // ---- Beat 118 (beginningOfUniverse->beginningOfOurCorner): "Reverse --
  // time-lapse" — camera pushes back IN as the visual shrinks/rewinds.
  else if (frame < CUE.beginningOfOurCorner) {
    const t = s(frame, CUE.beginningOfUniverse, CUE.beginningOfOurCorner, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(4, 0.6, t));
    fov = 34;
  }

  // ---- Beat 119 (beginningOfOurCorner->soDotDotDot): "Orbit around -----
  // branch"
  else if (frame < CUE.soDotDotDot) {
    const t = s(frame, CUE.beginningOfOurCorner, CUE.soDotDotDot, 0, 70, true);
    position = orbit(ORIGIN, 2.4, t, 14);
    fov = 36;
  }

  // ---- Beat 120 (soDotDotDot->areWeInsideBlackHole): "Slow push toward -
  // planet"
  else if (frame < CUE.areWeInsideBlackHole) {
    position = new THREE.Vector3(0, 0, 5);
    fov = 32;
  }

  // ---- Beat 121 (areWeInsideBlackHole->noWayToTellYes): "Slow push" ----
  else if (frame < CUE.noWayToTellYes) {
    const t = s(frame, CUE.areWeInsideBlackHole, CUE.noWayToTellYes, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(5, 3, t));
    fov = 32;
  }

  // ---- Beat 122 (noWayToTellYes->loopBlackHoleAppears): "Slow pull -----
  // away"
  else if (frame < CUE.loopBlackHoleAppears) {
    const t = s(frame, CUE.noWayToTellYes, CUE.loopBlackHoleAppears, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(3, 6, t));
    fov = 34;
  }

  // ---- Beat 123 (loopBlackHoleAppears->loopContracts): "Locked frame" --
  else if (frame < CUE.loopContracts) {
    position = new THREE.Vector3(0, 0, 6);
    fov = 34;
  }

  // ---- Beat 124 (loopContracts->loopEnd): "Rapid zoom-out" -------------
  else if (frame < CUE.loopEnd) {
    const t = s(frame, CUE.loopContracts, CUE.loopEnd, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(6, 9, t));
    fov = 36;
  }

  // ---- Beat 125 (loopEnd->loopVideoEnd): "Seamless transition" ---------
  // Eases back to exactly beat 1's starting camera (position (0,0,2.4),
  // fov 28) so the wrap to frame 0 is invisible.
  else {
    const t = s(frame, CUE.loopEnd, CUE.loopVideoEnd, 0, 1, true);
    position = new THREE.Vector3(0, 0, THREE.MathUtils.lerp(9, 2.4, t));
    fov = THREE.MathUtils.lerp(36, 28, t);
  }

  return {position, lookAt, fov};
};
