/**
 * Pure, deterministic choreography for "What If Our Entire Universe Is
 * Inside a Black Hole?" — REBUILT against a new, more granular 125-beat
 * storyboard (see timing.ts for how each beat's real cue point was
 * re-derived from the existing narration transcript). Same architecture as
 * every other video in this project: everything is a function of the
 * absolute frame number only.
 *
 * RETENTION RULE: the new storyboard calls for no visually static shot for
 * more than ~1.5-2s. With 125 beats packed into the same ~765s of real
 * narration, most beats are already that short or shorter just from the
 * real speech's own pacing — the camera (see camera/cameraTimeline.ts) is
 * built to be continuously moving within every beat regardless of its
 * duration, so this falls out naturally rather than needing special-casing.
 *
 * CLARITY & COLOR RULE (carried over from the previous build): this video
 * must read as genuinely clear and well-lit — see scene/Lighting.tsx for
 * the brighter baseline, and shared/BlackHole.tsx / docs/black_hole_visual_
 * reference.md for the black hole's high-contrast horizon/disk/lensing
 * spec, used consistently everywhere a black hole appears.
 *
 * REAL 3D GEOMETRY RULE (new): every object is built from genuine Three.js
 * primitives (spheres, boxes, cylinders, capsules, cones, rings, points) —
 * no flat 2D/CSS/canvas stand-ins for objects. Canvas is only ever used to
 * generate a *texture* applied to a real 3D mesh (BlackHole's disk,
 * CMBMap's sphere) — see docs/black_hole_visual_reference.md. The only
 * flat/HTML content in this video is the on-screen diagram text/labels the
 * storyboard explicitly calls for (equations, infinity symbols, IDEA ->
 * PREDICTION -> TEST, and the new SPECULATIVE IDEA / NOT ESTABLISHED /
 * HYPOTHESIS labels) plus a subtle full-video film-grain overlay and
 * lightning-flash punctuation — none of those stand in for a scene object.
 */
import * as THREE from 'three';
import {CUE, DURATION_IN_FRAMES} from './timing';
import {Obj3DState, HIDDEN3D} from '../shared/types';

const smoothstep = (t: number) => t * t * (3 - 2 * t);

export const kf = (frame: number, f0: number, f1: number, v0: number, v1: number, linear = false): number => {
  if (f1 <= f0) return v1;
  const t = THREE.MathUtils.clamp((frame - f0) / (f1 - f0), 0, 1);
  return v0 + (v1 - v0) * (linear ? t : smoothstep(t));
};

export const ORIGIN: [number, number, number] = [0, 0, 0];
const BH_TILT: [number, number, number] = [-0.4, 0.32, 0.08];

export interface NestedUniverseState {
  visible: boolean;
  position: [number, number, number];
  scale: number;
  opacity: number;
  revealLevel: number;
}

export interface BHSilhouetteState {
  visible: boolean;
  position: [number, number, number];
  scale: number;
  opacity: number;
}

/** Full detailed black hole state (event horizon + photon ring + turbulent
 * disk + lensing arcs) — drives shared/BlackHole.tsx, the spec-accurate
 * component (docs/black_hole_visual_reference.md). */
export interface BHState {
  visible: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  opacity: number;
  diskOpacity: number;
  lensingOpacity: number;
}

export interface GridState {
  visible: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  opacity: number;
  warpStrength: number;
  wellPosition: [number, number];
  wellRadius: number;
  wellDepth: number;
}

export interface InfallState {
  opacity: number;
  progress: number;
}

export interface LightBeamState {
  opacity: number;
  progress: number;
}

/** Several LightBeam instances at once ("multiple glowing trajectories
 * converging"), rather than a separate component. */
export interface TrajectoriesState {
  seeds: number[];
  progress: number;
  opacity: number;
}

/** Generic transform state shared by the several one-off objects — they all
 * just need position/rotation/scale/opacity, so one shape avoids a bespoke
 * interface per object. */
export interface XformState {
  visible: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  opacity: number;
}

export interface SunState {
  visible: boolean;
  position: [number, number, number];
  scale: number;
  opacity: number;
}

export interface PaperState extends XformState {
  size: number;
}

export interface CreatureState {
  visible: boolean;
  position: [number, number, number];
  heading: number;
  opacity: number;
}

export interface BookState extends XformState {
  dissolveProgress: number;
}

export interface HawkingState {
  opacity: number;
  progress: number;
}

export interface CosmicTreeState extends XformState {
  growth: number;
}

/** On-screen diagram text — equations, "∞" symbols, IDEA -> PREDICTION ->
 * TEST. NOT narration captions (see overlays/Overlays.tsx) — these are the
 * specific beats that explicitly call for on-screen text. */
export interface EquationOverlayState {
  text: string;
  opacity: number;
  warp: number; // 0 = clean, 1 = fragmenting/warping
}
export interface InfinityOverlayState {
  opacity: number;
}
export interface HPTOverlayState {
  stage: number; // 0 = IDEA lit, 1 = +PREDICTION, 2 = +TEST
  opacity: number;
}

/** A generic "diagram gets crossed out" annotation — two bright diagonal
 * lines drawn over whatever's on screen, not narration text. */
export interface CrossOutState {
  opacity: number;
}

/** New for the 125-beat rebuild: a brief full-frame lightning-style flash,
 * used as visual punctuation at the storyboard's called-out moments (black-
 * hole reveal, singularity, physics breaking down, universe transition,
 * parent-universe reveal, cosmic family tree, final reveal) and as a hard
 * scene-transition device. Pure HTML overlay (see Overlays.tsx) — cheap,
 * no extra render pass, consistent with the project's established
 * no-shader-postprocess constraint. */
export interface LightningState {
  opacity: number;
}

/** New for the 125-beat rebuild: small on-screen scientific-honesty labels
 * ("SPECULATIVE IDEA", "NOT ESTABLISHED", "HYPOTHESIS") shown at specific
 * moments so the video's speculative framing stays honest without needing
 * narration captions. */
export interface SpeculativeLabelState {
  text: string;
  opacity: number;
}

export interface SceneState {
  universe: NestedUniverseState | null;
  universeAsBlackHole: BHSilhouetteState | null;
  blackHole: BHState | null;
  grid: GridState | null;
  infall: InfallState | null;
  lightBeam: LightBeamState | null;
  earth: Obj3DState;
  spacecraft: Obj3DState;
  sun: SunState | null;
  silhouette: XformState & {lookUp?: number};
  paper: PaperState | null;
  creature: CreatureState | null;
  telescope: XformState | null;
  cmb: XformState | null;
  lightCone: XformState | null;
  book: BookState | null;
  hawking: HawkingState | null;
  cosmicTree: CosmicTreeState | null;
  hand: XformState | null;
  equation: EquationOverlayState | null;
  infinity: InfinityOverlayState | null;
  hpt: HPTOverlayState | null;
  crossOut: CrossOutState | null;
  trajectories: TrajectoriesState | null;
  lightning: LightningState | null;
  speculative: SpeculativeLabelState | null;
  starfieldOpacity: number;
  fillIntensity: number;
}

const HIDDEN_UNIVERSE: NestedUniverseState = {visible: false, position: ORIGIN, scale: 1, opacity: 0, revealLevel: 0};
const HIDDEN_BH: BHSilhouetteState = {visible: false, position: ORIGIN, scale: 1, opacity: 0};
const HIDDEN_FULL_BH: BHState = {
  visible: false,
  position: ORIGIN,
  rotation: BH_TILT,
  scale: 1,
  opacity: 0,
  diskOpacity: 0,
  lensingOpacity: 0,
};
const HIDDEN_GRID: GridState = {
  visible: false,
  position: ORIGIN,
  rotation: [-Math.PI / 2, 0, 0],
  opacity: 0,
  warpStrength: 0,
  wellPosition: [0, 0],
  wellRadius: 3,
  wellDepth: 2,
};
const HIDDEN_XFORM: XformState = {visible: false, position: ORIGIN, rotation: [0, 0, 0], scale: 1, opacity: 0};
const HIDDEN_SILHOUETTE: XformState & {lookUp?: number} = {...HIDDEN_XFORM, lookUp: 0};

const baseState = (): SceneState => ({
  universe: HIDDEN_UNIVERSE,
  universeAsBlackHole: HIDDEN_BH,
  blackHole: HIDDEN_FULL_BH,
  grid: HIDDEN_GRID,
  infall: null,
  lightBeam: null,
  earth: HIDDEN3D,
  spacecraft: HIDDEN3D,
  sun: null,
  silhouette: HIDDEN_SILHOUETTE,
  paper: null,
  creature: null,
  telescope: null,
  cmb: null,
  lightCone: null,
  book: null,
  hawking: null,
  cosmicTree: null,
  hand: null,
  equation: null,
  infinity: null,
  hpt: null,
  crossOut: null,
  trajectories: null,
  lightning: null,
  speculative: null,
  starfieldOpacity: 0,
  fillIntensity: 0.4,
});

/** Small helper for the lightning-flash punctuation moments: a brief
 * bright flash that spikes in over a few frames and decays back out. */
const flash = (frame: number, at: number, riseFrames = 3, fallFrames = 10): number => {
  if (frame < at || frame > at + riseFrames + fallFrames) return 0;
  if (frame < at + riseFrames) return kf(frame, at, at + riseFrames, 0, 1, true);
  return kf(frame, at + riseFrames, at + riseFrames + fallFrames, 1, 0, true);
};

export const getSceneState = (frame: number): SceneState => {
  const s = baseState();

  // =====================================================================
  // OPENING — THE IMPOSSIBLE IDEA (beats 1-10)
  // =====================================================================

  // ---- Beat 1 (1.5-5.52s): "What if our entire universe is inside a ----
  // black hole?" "Pure black. A microscopic blue-white point appears in
  // the center." Extremely slow push-in.
  if (frame < CUE.iMeanLiterally) {
    const fadeIn = kf(frame, CUE.hook, CUE.hook + 12, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: 0.3, opacity: fadeIn, revealLevel: 0};
    s.fillIntensity = 0.15;
  }

  // ---- Beat 2 (5.52-6.88s): "I mean that literally." "Point suddenly ---
  // expands into a galaxy." Violent zoom-out.
  else if (frame < CUE.whatIfEverythingWeCanSee) {
    const t = kf(frame, CUE.iMeanLiterally, CUE.whatIfEverythingWeCanSee, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.3, 0.7, t), opacity: 1, revealLevel: t * 0.25};
    s.fillIntensity = 0.4;
  }

  // ---- Beat 3 (6.88-8.64s): "What if everything we can see..." Camera --
  // races backward: Earth -> Solar System -> Milky Way. Extreme
  // continuous pull-back.
  else if (frame < CUE.fromGalaxies) {
    const t = kf(frame, CUE.whatIfEverythingWeCanSee, CUE.fromGalaxies, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.7, 1.1, t), opacity: 1, revealLevel: THREE.MathUtils.lerp(0.25, 0.4, t)};
    const earthIn = kf(frame, CUE.fromGalaxies - 8, CUE.fromGalaxies, 0, 1, true);
    if (earthIn > 0.001) {
      s.earth = {visible: true, position: [0.55, -0.15, 0.45], rotation: [0, frame * 0.015, 0], scale: 0.11, opacity: earthIn};
    }
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 4 (8.64-9.78s): "...from galaxies..." "Milky Way becomes ---
  // one spiral among thousands." Continue pulling back.
  else if (frame < CUE.toStarsPlanets) {
    const t = kf(frame, CUE.fromGalaxies, CUE.toStarsPlanets, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(1.1, 1.6, t), opacity: 1, revealLevel: THREE.MathUtils.lerp(0.4, 0.55, t)};
    s.earth = {visible: true, position: [0.55, -0.15, 0.45], rotation: [0, frame * 0.015, 0], scale: 0.11, opacity: 1 - t};
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.44;
  }

  // ---- Beat 5 (9.78-11.3s): "...to stars, planets..." "Cosmic web ------
  // fills frame." Camera accelerates backward.
  else if (frame < CUE.evenYou) {
    const t = kf(frame, CUE.toStarsPlanets, CUE.evenYou, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(1.6, 2.4, t), opacity: 1, revealLevel: THREE.MathUtils.lerp(0.55, 0.75, t)};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.3, 0.45, t);
    s.fillIntensity = 0.46;
  }

  // ---- Beat 6 (11.3-13.16s): "...even you..." "Universe compresses ----
  // into a glowing sphere." Pull-back suddenly slows.
  else if (frame < CUE.isActuallyOnTheInside) {
    const t = kf(frame, CUE.evenYou, CUE.isActuallyOnTheInside, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(2.4, 3.2, t), opacity: 1, revealLevel: 1};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.45, 0.5, t);
    s.fillIntensity = 0.48;
  }

  // ---- Beat 7 (13.16-14.81s): "...is actually on the inside..." Camera -
  // rotates around the sphere. Orbital movement, lensing bends stars.
  else if (frame < CUE.ofABlackHole) {
    s.universe = {visible: true, position: ORIGIN, scale: 3.2, opacity: 1, revealLevel: 1};
    s.starfieldOpacity = kf(frame, CUE.isActuallyOnTheInside, CUE.ofABlackHole, 0.5, 0.7, true);
    s.fillIntensity = 0.48;
  }

  // ---- Beat 8 (14.81-15.8s): "...of a black hole..." "Black-hole -------
  // silhouette forms around the universe." Slow push toward horizon.
  else if (frame < CUE.thatExistsInSomeLargerUniverse) {
    const crossfade = kf(frame, CUE.ofABlackHole, CUE.thatExistsInSomeLargerUniverse, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: 3.2, opacity: 1 - crossfade * 0.4, revealLevel: 1};
    s.universeAsBlackHole = {visible: true, position: ORIGIN, scale: 3.2, opacity: crossfade};
    s.lightning = {opacity: flash(frame, CUE.ofABlackHole + 2)};
    s.starfieldOpacity = 0.7;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 9 (15.8-21.4s): "...that exists in some much larger --------
  // universe?" Camera pulls farther away. Our universe becomes tiny.
  // Massive zoom-out.
  else if (frame < CUE.howsThatEvenPossible) {
    const t = Math.pow(kf(frame, CUE.thatExistsInSomeLargerUniverse, CUE.howsThatEvenPossible, 0, 1, true), 0.8);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(3.2, 0.8, t), opacity: 1 - t, revealLevel: 1};
    s.universeAsBlackHole = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(3.2, 0.8, t), opacity: 1};
    s.starfieldOpacity = kf(frame, CUE.thatExistsInSomeLargerUniverse, CUE.howsThatEvenPossible, 0.7, 1);
    s.fillIntensity = kf(frame, CUE.thatExistsInSomeLargerUniverse, CUE.howsThatEvenPossible, 0.4, 0.3);
  }

  // ---- Beat 10 (21.4-25.2s): "How's that even possible?" EVERYTHING ----
  // cuts to black. Hard stop, one bass-like visual pulse.
  else if (frame < CUE.weUsuallyPicture) {
    const cut = kf(frame, CUE.howsThatEvenPossible, CUE.howsThatEvenPossible + 2, 1, 0, true);
    s.universeAsBlackHole = {visible: true, position: ORIGIN, scale: 0.8, opacity: cut};
    s.starfieldOpacity = cut;
    s.fillIntensity = 0.05;
  }

  // =====================================================================
  // FIRST: WHAT IS A BLACK HOLE (beats 11-19)
  // =====================================================================

  // ---- Beat 11 (25.2-30.37s): "We usually picture this giant dark ------
  // object..." Classic black hole + accretion disk. Slow orbital camera.
  else if (frame < CUE.pullingEverythingTowardIt) {
    const fadeIn = kf(frame, CUE.weUsuallyPicture, CUE.weUsuallyPicture + 15, 0, 1, true);
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 1, opacity: fadeIn, diskOpacity: fadeIn, lensingOpacity: fadeIn};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 12 (30.37-32.58s): "...pulling everything toward it." ------
  // Stars/gas curve toward horizon. Follow falling particles.
  else if (frame < CUE.notReallyWhatABlackHoleIs) {
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 1, opacity: 1, diskOpacity: 1, lensingOpacity: 1};
    s.infall = {opacity: kf(frame, CUE.pullingEverythingTowardIt, CUE.pullingEverythingTowardIt + 8, 0, 1, true), progress: kf(frame, CUE.pullingEverythingTowardIt, CUE.notReallyWhatABlackHoleIs, 0, 1, true)};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 13 (32.58-39.02s): "But that's not really what a black -----
  // hole is." Black hole freezes; camera pushes through it, morphs into
  // spacetime grid.
  else if (frame < CUE.aRegionOfSpace) {
    const crossfade = kf(frame, CUE.notReallyWhatABlackHoleIs, CUE.aRegionOfSpace, 0, 1, true);
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 1, opacity: 1 - crossfade, diskOpacity: 1 - crossfade, lensingOpacity: 1 - crossfade};
    s.infall = {opacity: 1 - crossfade, progress: 1};
    s.grid = {visible: true, position: [0, -1.2, 0], rotation: [-Math.PI / 2, 0, 0], opacity: crossfade, warpStrength: crossfade * 0.5, wellPosition: [0, 0], wellRadius: 3.2, wellDepth: 1.8};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.45;
  }

  // ---- Beat 14 (39.02-42.4s): "A region of space..." Grid stretches ----
  // around massive object. Top-down descent.
  else if (frame < CUE.whereGravityHasBecomeExtreme) {
    const t = kf(frame, CUE.aRegionOfSpace, CUE.whereGravityHasBecomeExtreme, 0, 1, true);
    s.grid = {visible: true, position: [0, -1.2, 0], rotation: [-Math.PI / 2, 0, 0], opacity: 1, warpStrength: THREE.MathUtils.lerp(0.5, 0.75, t), wellPosition: [0, 0], wellRadius: THREE.MathUtils.lerp(3.2, 2.4, t), wellDepth: THREE.MathUtils.lerp(1.8, 3.5, t)};
    s.starfieldOpacity = 0.45;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 15 (42.4-45.72s): "...where gravity has become extreme..." -
  // Grid bends almost vertically. Camera dives downward.
  else if (frame < CUE.onceYouCrossABoundary) {
    const t = kf(frame, CUE.whereGravityHasBecomeExtreme, CUE.onceYouCrossABoundary, 0, 1, true);
    s.grid = {visible: true, position: [0, -1.2, 0], rotation: [-Math.PI / 2, 0, 0], opacity: 1, warpStrength: THREE.MathUtils.lerp(0.75, 1, t), wellPosition: [0, 0], wellRadius: THREE.MathUtils.lerp(2.4, 1.9, t), wellDepth: THREE.MathUtils.lerp(3.5, 6.5, t)};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 16 (45.72-56.18s): "Once you cross a certain boundary..." --
  // Circular event horizon forms. Straight push toward it, bright ring
  // appears.
  else if (frame < CUE.nothingCanEscape) {
    const t = kf(frame, CUE.onceYouCrossABoundary, CUE.nothingCanEscape, 0, 1, true);
    s.grid = {visible: true, position: [0, -1.2, 0], rotation: [-Math.PI / 2, 0, 0], opacity: 1 - t, warpStrength: 1, wellPosition: [0, 0], wellRadius: 1.9, wellDepth: 6.5};
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 1, opacity: t, diskOpacity: 0, lensingOpacity: t};
    s.starfieldOpacity = kf(frame, CUE.onceYouCrossABoundary, CUE.nothingCanEscape, 0.4, 0.6);
    s.fillIntensity = 0.4;
  }

  // ---- Beat 17 (56.18-57.57s): "Nothing can escape." Light beam shoots -
  // toward horizon. Follow beam, beam stretches and curves.
  else if (frame < CUE.notEvenLight) {
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 1, opacity: 1, diskOpacity: 0, lensingOpacity: 1};
    s.lightBeam = {opacity: 1, progress: kf(frame, CUE.nothingCanEscape, CUE.notEvenLight, 0, 0.6, true)};
    s.starfieldOpacity = 0.6;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 18 (57.57-58.44s): "Not even light." Photon disappears -----
  // behind horizon. Camera follows it into darkness, sudden blackout.
  else if (frame < CUE.calledTheEventHorizon) {
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 1, opacity: 1, diskOpacity: 0, lensingOpacity: 1};
    const t = kf(frame, CUE.notEvenLight, CUE.calledTheEventHorizon, 0, 1, true);
    s.lightBeam = {opacity: kf(frame, CUE.calledTheEventHorizon - 5, CUE.calledTheEventHorizon, 1, 0, true), progress: kf(frame, CUE.notEvenLight, CUE.calledTheEventHorizon, 0.6, 1, true)};
    s.fillIntensity = THREE.MathUtils.lerp(0.4, 0.15, t);
  }

  // ---- Beat 19 (58.44-64.7s): "That boundary is called the event -------
  // horizon." Clean symmetrical black hole. Camera locks centrally,
  // horizon pulses once.
  else if (frame < CUE.horizonIsntAWall) {
    const pulse = 1 + 0.03 * Math.sin(kf(frame, CUE.calledTheEventHorizon, CUE.calledTheEventHorizon + 12, 0, Math.PI, true));
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: pulse, opacity: 1, diskOpacity: 0, lensingOpacity: 1};
    s.starfieldOpacity = 0.6;
    s.fillIntensity = 0.4;
  }

  // =====================================================================
  // CROSSING THE HORIZON (beats 20-26)
  // =====================================================================

  // ---- Beat 20 (64.7-66.9s): "The event horizon isn't a wall." ---------
  // Empty-looking region of space. Smooth forward movement, almost
  // invisible horizon distortion.
  else if (frame < CUE.youDontHitIt) {
    s.starfieldOpacity = kf(frame, CUE.horizonIsntAWall, CUE.youDontHitIt, 0.6, 0.5);
    s.fillIntensity = 0.4;
  }

  // ---- Beat 21 (66.9-71.36s): "You don't hit it." Camera crosses -------
  // horizon, nothing happens. Continuous POV — no impact, important
  // contrast.
  else if (frame < CUE.fallingIntoMassive) {
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 22 (71.36-74.68s): "If you were falling into a really ------
  // massive black hole..." Tiny spacecraft against enormous horizon. Rear
  // tracking, stars warp around ship.
  else if (frame < CUE.crossWithoutNoticing) {
    const t = kf(frame, CUE.fallingIntoMassive, CUE.crossWithoutNoticing, 0, 1, true);
    s.blackHole = {visible: true, position: [0, 0, -6], rotation: BH_TILT, scale: 5, opacity: 1, diskOpacity: 0.6, lensingOpacity: 1};
    s.spacecraft = {visible: true, position: [0, 0, 2 - t * 1.5], rotation: [0, Math.PI, 0], scale: 1, opacity: 1};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 23 (74.68-80.96s): "...you could cross it without ----------
  // noticing..." Horizon sweeps over camera. First-person POV, lens
  // warping.
  else if (frame < CUE.problemIsWhatHappensAfter) {
    const t = kf(frame, CUE.crossWithoutNoticing, CUE.problemIsWhatHappensAfter, 0, 1, true);
    s.blackHole = {visible: true, position: [0, 0, -6], rotation: BH_TILT, scale: THREE.MathUtils.lerp(5, 22, t), opacity: 1, diskOpacity: THREE.MathUtils.lerp(0.6, 0, t), lensingOpacity: THREE.MathUtils.lerp(1, 0.3, t)};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.5, 0.1, t);
    s.fillIntensity = THREE.MathUtils.lerp(0.4, 0.25, t);
  }

  // ---- Beat 24 (80.96-86.46s): "The problem is what happens after." ----
  // Camera rotates 180deg; outside universe now behind.
  else if (frame < CUE.allPossiblePaths) {
    s.blackHole = {visible: true, position: [0, 0, 8], rotation: BH_TILT, scale: 1.4, opacity: 0.8, diskOpacity: 0.15, lensingOpacity: 0.6};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.28;
  }

  // ---- Beat 25 (86.46-90.1s): "All possible paths forward..." ----------
  // Multiple glowing trajectories appear. Orbit around trajectories,
  // lines bend inward.
  else if (frame < CUE.leadDeeper) {
    const fadeIn = kf(frame, CUE.allPossiblePaths, CUE.allPossiblePaths + 15, 0, 1, true);
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 1, opacity: 1, diskOpacity: 0, lensingOpacity: 0.7};
    s.trajectories = {seeds: [101, 202, 303, 404, 505], progress: fadeIn, opacity: fadeIn};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.35;
  }

  // ---- Beat 26 (90.1-94.72s): "...lead deeper into the black hole." ----
  // Every trajectory curves toward one direction. Accelerating dive,
  // increasing darkness.
  else if (frame < CUE.takeToSingularity) {
    const t = kf(frame, CUE.leadDeeper, CUE.takeToSingularity, 0, 1, true);
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 1, opacity: 1 - t * 0.6, diskOpacity: 0, lensingOpacity: 0.7 * (1 - t)};
    s.trajectories = {seeds: [101, 202, 303, 404, 505], progress: 1, opacity: 1 - t * 0.3};
    s.starfieldOpacity = kf(frame, CUE.leadDeeper, CUE.takeToSingularity, 0.4, 0.15);
    s.fillIntensity = 0.3;
  }

  // =====================================================================
  // THE SINGULARITY (beats 27-33)
  // =====================================================================

  // ---- Beat 27 (94.72-103.12s): "The equations eventually take you to --
  // a singularity." Tiny luminous point. Extreme macro zoom, point
  // flickers violently.
  else if (frame < CUE.stopMakingSense) {
    const fadeIn = kf(frame, CUE.takeToSingularity, CUE.takeToSingularity + 15, 0, 1, true);
    const flicker = 1 + 0.15 * Math.sin(frame * 0.7) * kf(frame, CUE.stopMakingSense - 20, CUE.stopMakingSense, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: 0.12 * flicker, opacity: fadeIn, revealLevel: 0};
    s.starfieldOpacity = 0.1;
    s.fillIntensity = 0.35;
  }

  // ---- Beat 28 (103.12-104.5s): "The equations stop making sense." -----
  // Equations surround camera; camera flies through them, letters warp.
  else if (frame < CUE.producingInfinities) {
    s.universe = {visible: true, position: ORIGIN, scale: 0.12, opacity: 1, revealLevel: 0};
    const t = kf(frame, CUE.stopMakingSense, CUE.producingInfinities, 0, 1, true);
    s.equation = {text: 'R_{μν} − ½Rg_{μν} = 8πGT_{μν}', opacity: 1, warp: t};
    s.fillIntensity = 0.35;
  }

  // ---- Beat 29 (104.5-115.28s): "They start producing infinities." -----
  // Numbers explode outward. Rapid expansion, ∞ symbols multiply.
  else if (frame < CUE.somethingIsMissing) {
    const shotStart = CUE.producingInfinities;
    const shotEnd = CUE.somethingIsMissing;
    const eqOut = kf(frame, shotStart, shotStart + 15, 1, 0, true);
    s.universe = {visible: true, position: ORIGIN, scale: kf(frame, shotStart, shotEnd, 0.12, 0.4), opacity: 1, revealLevel: 0};
    s.equation = {text: 'R_{μν} − ½Rg_{μν} = 8πGT_{μν}', opacity: eqOut, warp: 1};
    s.infinity = {opacity: kf(frame, shotStart + 8, shotStart + 30, 0, 1, true)};
    s.starfieldOpacity = 0.1;
    s.fillIntensity = 0.35;
  }

  // ---- Beat 30 (115.28-123.68s): "Something is missing." Everything ----
  // disappears. Hard cut, absolute black.
  else if (frame < CUE.generalRelativity) {
    s.fillIntensity = 0.03;
  }

  // ---- Beat 31 (123.68-127.92s): "General relativity..." Curved --------
  // spacetime grid appears. Slow orbit, grid pulses.
  else if (frame < CUE.quantumMechanics) {
    const fadeIn = kf(frame, CUE.generalRelativity, CUE.generalRelativity + 15, 0, 1, true);
    const pulse = 0.7 + 0.05 * Math.sin(frame * 0.15);
    s.grid = {visible: true, position: [0, -0.6, 0], rotation: [-Math.PI / 2, 0, 0], opacity: fadeIn, warpStrength: pulse, wellPosition: [0, 0], wellRadius: 2.6, wellDepth: 3.2};
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 32 (127.92-138.42s): "Quantum mechanics..." Particle -------
  // waves and probability clouds appear. Macro tracking, particles
  // flicker.
  else if (frame < CUE.noCompleteTheory) {
    const t = kf(frame, CUE.quantumMechanics, CUE.noCompleteTheory, 0, 1, true);
    s.hawking = {opacity: 1, progress: 0.15 + t * 0.5};
    s.starfieldOpacity = 0.25;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 33 (138.42-149.16s): "We still don't have a complete -------
  // theory..." Relativity grid + quantum field collide. Split-screen
  // pull, collision produces visual distortion.
  else if (frame < CUE.singularityIsntTheEnd) {
    s.grid = {visible: true, position: [-3.2, -0.6, 0], rotation: [-Math.PI / 2, 0, 0], opacity: 1, warpStrength: 0.7, wellPosition: [0, 0], wellRadius: 2.2, wellDepth: 2.6};
    s.hawking = {opacity: 1, progress: 0.5};
    s.starfieldOpacity = 0.25;
    s.fillIntensity = 0.4;
  }

  // =====================================================================
  // WHAT IF THE SINGULARITY ISN'T THE END (beats 34-40)
  // =====================================================================

  // ---- Beat 34 (149.16-151.98s): "What if that singularity isn't ------
  // really the end?" Point begins glowing. Slow push-in, pulsing energy.
  else if (frame < CUE.somethingHappensThere) {
    const fadeIn = kf(frame, CUE.singularityIsntTheEnd, CUE.singularityIsntTheEnd + 15, 0, 1, true);
    const pulse = 1 + 0.08 * Math.sin(frame * 0.2);
    s.universe = {visible: true, position: ORIGIN, scale: 0.15 * pulse, opacity: fadeIn, revealLevel: 0};
    s.starfieldOpacity = 0.15;
    s.fillIntensity = 0.35;
  }

  // ---- Beat 35 (151.98-153.32s): "What if something happens there..." -
  // Point begins expanding. Reverse zoom, space cracks around it.
  else if (frame < CUE.physicsDoesntKnow) {
    const t = kf(frame, CUE.somethingHappensThere, CUE.physicsDoesntKnow, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.15, 0.6, t), opacity: 1, revealLevel: t * 0.2};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.35;
  }

  // ---- Beat 36 (153.32-159.88s): "...that physics doesn't know how to --
  // describe?" Geometry twists into impossible shapes. 360deg rotation,
  // reality distortion.
  else if (frame < CUE.quantumGravityPrevents) {
    const t = kf(frame, CUE.physicsDoesntKnow, CUE.quantumGravityPrevents, 0, 1, true);
    const wobble = Math.sin(t * Math.PI * 3);
    s.grid = {visible: true, position: [0, -0.8, 0], rotation: [-Math.PI / 2, 0, 0], opacity: 1, warpStrength: 0.6 + wobble * 0.3, wellPosition: [0, 0], wellRadius: 2.4 + wobble * 0.6, wellDepth: 3 + wobble * 1.5};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.35;
  }

  // ---- Beat 37 (159.88-169.62s): "Maybe quantum gravity prevents -------
  // collapse..." Collapse slows into glowing core. Circular orbit, energy
  // stabilizes.
  else if (frame < CUE.transitionsIntoSomething) {
    const t = kf(frame, CUE.quantumGravityPrevents, CUE.quantumGravityPrevents + 20, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.6, 0.9, t), opacity: 1, revealLevel: 0.15};
    s.starfieldOpacity = 0.25;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 38 (169.62-176.76s): "Or maybe it transitions into ---------
  // something else." Core suddenly expands. Rapid backward movement,
  // shockwave.
  else if (frame < CUE.newRegionSpacetime) {
    const t = kf(frame, CUE.transitionsIntoSomething, CUE.newRegionSpacetime, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.9, 2.6, t), opacity: 1, revealLevel: THREE.MathUtils.lerp(0.15, 0.4, t)};
    s.lightning = {opacity: flash(frame, CUE.transitionsIntoSomething + 4)};
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 39 (176.76-179.48s): "Maybe... a new region of -------------
  // spacetime." New spacetime grid expands outward. Fly backward through
  // grid, waves ripple outward.
  else if (frame < CUE.somethingLikeANewUniverse) {
    s.universe = {visible: true, position: ORIGIN, scale: 2.6, opacity: 1, revealLevel: 0.4};
    const t = kf(frame, CUE.newRegionSpacetime, CUE.somethingLikeANewUniverse, 0, 1, true);
    s.grid = {visible: true, position: [0, -3, 0], rotation: [-Math.PI / 2, 0, 0], opacity: t, warpStrength: 0.4, wellPosition: [0, 0], wellRadius: 4, wellDepth: 1.2};
    s.starfieldOpacity = 0.35;
    s.fillIntensity = 0.45;
  }

  // ---- Beat 40 (179.48-183.56s): "Something like a new universe?" ------
  // First galaxies appear. Huge pull-back, stars ignite one after
  // another.
  else if (frame < CUE.parentUniverse) {
    const t = kf(frame, CUE.somethingLikeANewUniverse, CUE.parentUniverse, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(2.6, 5, t), opacity: 1, revealLevel: THREE.MathUtils.lerp(0.4, 1, t)};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.35, 0.5, t);
    s.fillIntensity = 0.48;
  }

  // =====================================================================
  // THE PARENT UNIVERSE (beats 41-52)
  // =====================================================================

  // ---- Beat 41 (183.56-187.1s): "Imagine you're living in some giant ---
  // parent universe." Enormous cosmic environment. Slow fly-through,
  // nebulae + galaxies.
  else if (frame < CUE.starCollapses) {
    s.universe = {visible: true, position: ORIGIN, scale: 5, opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.55;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 42 (187.1-188.75s): "A massive star collapses..." Giant ----
  // star fills frame. Close orbit, surface eruptions.
  else if (frame < CUE.formsBlackHole) {
    const t = kf(frame, CUE.starCollapses, CUE.formsBlackHole, 0, 1, true);
    s.sun = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(1.4, 0.5, t), opacity: 1};
    s.starfieldOpacity = 0.45;
    s.fillIntensity = 0.45;
  }

  // ---- Beat 43 (188.75-190.54s): "...and forms a black hole." Star -----
  // collapses inward. Rapid pull-back, supernova flash -> black hole.
  else if (frame < CUE.yourPerspective) {
    const crossfade = kf(frame, CUE.formsBlackHole, CUE.formsBlackHole + 10, 0, 1, true);
    s.sun = {visible: true, position: ORIGIN, scale: 0.5, opacity: 1 - crossfade};
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 0.5, opacity: crossfade, diskOpacity: crossfade * 0.7, lensingOpacity: crossfade};
    s.lightning = {opacity: flash(frame, CUE.formsBlackHole)};
    s.starfieldOpacity = 0.45;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 44 (190.54-192.76s): "From your perspective..." Observer ---
  // silhouette looking at black hole. Over-shoulder, horizon reflection.
  else if (frame < CUE.thereIsABlackHole) {
    s.blackHole = {visible: true, position: [0, 0.3, -5], rotation: BH_TILT, scale: 1.3, opacity: 1, diskOpacity: 0.8, lensingOpacity: 1};
    s.silhouette = {visible: true, position: [0, 0, 1.4], rotation: [0, Math.PI, 0], scale: 1, opacity: 1, lookUp: 0};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 45 (192.76-193.82s): "There's a black hole." Black hole ----
  // dominates frame. Slow push, accretion disk rotates.
  else if (frame < CUE.butInside) {
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 1.3, opacity: 1, diskOpacity: 0.85, lensingOpacity: 1};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 46 (193.82-195.42s): "But inside..." Camera dives directly -
  // into horizon. Continuous transition, screen becomes darkness.
  else if (frame < CUE.expandingRegionForms) {
    const t = kf(frame, CUE.butInside, CUE.expandingRegionForms, 0, 1, true);
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 1.3, opacity: 1, diskOpacity: THREE.MathUtils.lerp(0.85, 0, t), lensingOpacity: THREE.MathUtils.lerp(1, 0.3, t)};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.4, 0.05, t);
    s.fillIntensity = THREE.MathUtils.lerp(0.42, 0.2, t);
  }

  // ---- Beat 47 (195.42-204.52s): "A new expanding region forms." -------
  // Darkness becomes glowing spacetime. Massive reverse zoom, expansion
  // wave.
  else if (frame < CUE.seeGalaxies) {
    const t = kf(frame, CUE.expandingRegionForms, CUE.seeGalaxies, 0, 1, true);
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 1.3, opacity: 1 - t, diskOpacity: 0, lensingOpacity: 0.3 * (1 - t)};
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.05, 3.5, t), opacity: t, revealLevel: t};
    s.starfieldOpacity = kf(frame, CUE.expandingRegionForms, CUE.seeGalaxies, 0.05, 0.5);
    s.fillIntensity = kf(frame, CUE.expandingRegionForms, CUE.seeGalaxies, 0.2, 0.48);
  }

  // ---- Beat 48 (204.52-205.83s): "They'd see galaxies..." Galaxy -------
  // forms. Nested zoom, stars ignite.
  else if (frame < CUE.starsAndPlanets) {
    s.universe = {visible: true, position: ORIGIN, scale: 3.5, opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.48;
  }

  // ---- Beat 49 (205.83-207.08s): "stars and planets." Galaxy -> solar --
  // system -> planet. Rapid nested zooms, orbital trails.
  else if (frame < CUE.seeExpandingUniverse) {
    const t = kf(frame, CUE.starsAndPlanets, CUE.seeExpandingUniverse, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(3.5, 0.8, t), opacity: 1, revealLevel: 1};
    const earthIn = kf(frame, CUE.starsAndPlanets + 5, CUE.seeExpandingUniverse, 0, 1, true);
    s.earth = {visible: true, position: [0.9, -0.2, 0.7], rotation: [0, frame * 0.01, 0], scale: 0.2, opacity: earthIn};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.48;
  }

  // ---- Beat 50 (207.08-213.68s): "They'd see an expanding universe." ---
  // Cosmic web expands around camera. Camera stationary, filaments
  // stretch outward.
  else if (frame < CUE.whereDidThisComeFrom) {
    const t = kf(frame, CUE.seeExpandingUniverse, CUE.whereDidThisComeFrom, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.8, 3, t), opacity: 1, revealLevel: 1};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.5, 0.7, t);
    s.fillIntensity = 0.48;
  }

  // ---- Beat 51 (213.68-215.96s): "Where did all of this come from?" ----
  // Alien/human civilization looking at stars. Tilt upward, stars slowly
  // rotate overhead.
  else if (frame < CUE.answerIsBigBang) {
    s.silhouette = {visible: true, position: [0, 0, 0], rotation: [0, 0, 0], scale: 1, opacity: 1, lookUp: 1};
    s.starfieldOpacity = 0.7;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 52 (215.96-255.36s): "Their answer could be the Big Bang." -
  // Hot dense universe appears. Reverse time-lapse, expansion begins.
  else if (frame < CUE.tinyBallExploding) {
    const t = kf(frame, CUE.answerIsBigBang, CUE.tinyBallExploding, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.2, 1.2, t), opacity: 1, revealLevel: THREE.MathUtils.lerp(0, 0.5, t)};
    s.speculative = {text: 'SPECULATIVE IDEA', opacity: kf(frame, CUE.answerIsBigBang + 20, CUE.answerIsBigBang + 60, 0, 1, true) * kf(frame, CUE.tinyBallExploding - 40, CUE.tinyBallExploding - 10, 1, 0, true)};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.15, 0.4, t);
    s.fillIntensity = THREE.MathUtils.lerp(0.55, 0.4, t);
  }

  // =====================================================================
  // BIG BANG — NOT AN EXPLOSION (beats 53-61)
  // =====================================================================

  // ---- Beat 53 (255.36-261.18s): "People imagine a tiny ball ------------
  // exploding..." Small glowing sphere explodes outward. Quick zoom,
  // fireball.
  else if (frame < CUE.notWhatHappened) {
    const t = kf(frame, CUE.tinyBallExploding, CUE.tinyBallExploding + 15, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.15, 2.2, t), opacity: 1, revealLevel: 0.3};
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.55;
  }

  // ---- Beat 54 (261.18-269.46s): "That's not really what happened." ----
  // Explosion freezes; camera stops, explosion reverses.
  else if (frame < CUE.spaceExpanding) {
    const t = kf(frame, CUE.notWhatHappened, CUE.spaceExpanding, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(2.2, 0.3, t), opacity: 1, revealLevel: 0.3};
    s.crossOut = {opacity: kf(frame, CUE.notWhatHappened + 5, CUE.notWhatHappened + 18, 0, 0.8, true)};
    s.starfieldOpacity = 0.25;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 55 (269.46-271.34s): "Space itself was expanding." ---------
  // Entire grid expands everywhere. Camera embedded in grid, uniform
  // expansion.
  else if (frame < CUE.earlyUniverseHot) {
    const t = kf(frame, CUE.spaceExpanding, CUE.earlyUniverseHot, 0, 1, true);
    s.grid = {visible: true, position: [0, -0.4, 0], rotation: [-Math.PI / 2, 0, 0], opacity: 1, warpStrength: 0.15, wellPosition: [0, 0], wellRadius: THREE.MathUtils.lerp(2, 6, t), wellDepth: 0.5};
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 56 (271.34-273.98s): "The early universe was incredibly ----
  // hot..." Blinding compressed plasma. Extreme close-up, white-hot glow.
  else if (frame < CUE.incrediblyDense) {
    s.universe = {visible: true, position: ORIGIN, scale: 0.5, opacity: 1, revealLevel: 0.2};
    s.starfieldOpacity = 0.15;
    s.fillIntensity = 0.78;
  }

  // ---- Beat 57 (273.98-275.32s): "...and incredibly dense." Matter -----
  // packed tightly together. Slow push, particles swarm.
  else if (frame < CUE.asSpaceExpanded) {
    s.universe = {visible: true, position: ORIGIN, scale: 0.42, opacity: 1, revealLevel: 0.15};
    s.starfieldOpacity = 0.1;
    s.fillIntensity = 0.8;
  }

  // ---- Beat 58 (275.32-276.64s): "As space expanded..." Grid expands. --
  // Pull-back, particles separate.
  else if (frame < CUE.universeCooled) {
    const t = kf(frame, CUE.asSpaceExpanded, CUE.universeCooled, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.5, 1.6, t), opacity: 1, revealLevel: THREE.MathUtils.lerp(0.2, 0.45, t)};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.15, 0.3, t);
    s.fillIntensity = THREE.MathUtils.lerp(0.78, 0.55, t);
  }

  // ---- Beat 59 (276.64-282.46s): "...the universe cooled." Brightness --
  // fades as universe expands. Long time-lapse, glow fades.
  else if (frame < CUE.blackHoleGoingBoom) {
    const t = kf(frame, CUE.universeCooled, CUE.blackHoleGoingBoom, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(1.6, 3, t), opacity: 1, revealLevel: THREE.MathUtils.lerp(0.45, 0.7, t)};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.3, 0.45, t);
    s.fillIntensity = THREE.MathUtils.lerp(0.55, 0.4, t);
  }

  // ---- Beat 60 (282.46-285.66s): "A black hole going boom? No." --------
  // Black hole explosion appears. Snap zoom, giant red X.
  else if (frame < CUE.somethingStranger) {
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 1, opacity: 1, diskOpacity: 0.7, lensingOpacity: 1};
    s.crossOut = {opacity: kf(frame, CUE.blackHoleGoingBoom + 6, CUE.blackHoleGoingBoom + 18, 0, 1, true)};
    s.starfieldOpacity = 0.35;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 61 (285.66-302.42s): "Something much stranger." Explosion --
  // morphs into expanding spacetime. Slow morph, cosmic shockwave.
  else if (frame < CUE.ifWereInsideABlackHole) {
    const t = kf(frame, CUE.somethingStranger, CUE.ifWereInsideABlackHole, 0, 1, true);
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 1, opacity: 1 - t, diskOpacity: 0.7 * (1 - t), lensingOpacity: 1 - t};
    s.grid = {visible: true, position: [0, -0.4, 0], rotation: [-Math.PI / 2, 0, 0], opacity: t, warpStrength: 0.2, wellPosition: [0, 0], wellRadius: 3, wellDepth: 0.6};
    s.lightning = {opacity: flash(frame, CUE.somethingStranger + 3)};
    s.starfieldOpacity = 0.35;
    s.fillIntensity = 0.42;
  }

  // =====================================================================
  // WHERE IS THE EVENT HORIZON (beats 62-69)
  // =====================================================================

  // ---- Beat 62 (302.42-304.28s): "If we're inside a black hole..." -----
  // Universe as glowing expanding sphere. Pull-back, boundary distortion.
  else if (frame < CUE.whereIsTheEventHorizon) {
    s.universe = {visible: true, position: ORIGIN, scale: 3, opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.48;
  }

  // ---- Beat 63 (304.28-306.22s): "Where is the event horizon?" ---------
  // Camera approaches apparent edge. Slow approach, edge becomes
  // transparent.
  else if (frame < CUE.wheresTheEdge) {
    const t = kf(frame, CUE.whereIsTheEventHorizon, CUE.wheresTheEdge, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(3, 4.2, t), opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.48;
  }

  // ---- Beat 64 (306.22-307.54s): "Where's the edge?" Camera reaches ----
  // boundary — but nothing there. Camera stops, visual stillness for
  // contrast.
  else if (frame < CUE.giantBlackSphere) {
    s.universe = {visible: true, position: ORIGIN, scale: 4.2, opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.48;
  }

  // ---- Beat 65 (307.54-316.64s): "Why don't we see a giant black -------
  // sphere?" Telescope scans sky. 360deg pan, stars sweep across lens.
  else if (frame < CUE.notPhysicalWall) {
    s.telescope = {visible: true, position: [0, -0.6, 0], rotation: [0, 0, 0], scale: 1.2, opacity: 1};
    s.starfieldOpacity = 0.55;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 66 (316.64-320.82s): "An event horizon isn't a physical -----
  // wall." Horizon becomes geometric structure. Camera passes through,
  // geometry lines appear.
  else if (frame < CUE.boundaryInSpacetime) {
    s.grid = {visible: true, position: [0, -0.8, 0], rotation: [-Math.PI / 2, 0, 0], opacity: 1, warpStrength: 0.55, wellPosition: [0, 0], wellRadius: 2.4, wellDepth: 2.6};
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 67 (320.82-333.18s): "It's a boundary in spacetime." -------
  // Light cones appear around observer. Slow rotation, cone trajectories
  // animate.
  else if (frame < CUE.seeBlackCircle) {
    const fadeIn = kf(frame, CUE.boundaryInSpacetime, CUE.boundaryInSpacetime + 15, 0, 1, true);
    s.lightCone = {visible: true, position: ORIGIN, rotation: [0, 0, 0], scale: 1.4, opacity: fadeIn};
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 68 (333.18-341.76s): "You wouldn't necessarily see a --------
  // black circle." Black sphere fades; normal universe remains.
  // Pull-back, horizon dissolves.
  else if (frame < CUE.partOfGeometry) {
    const t = kf(frame, CUE.seeBlackCircle, CUE.seeBlackCircle + 15, 0, 1, true);
    s.universeAsBlackHole = {visible: true, position: ORIGIN, scale: 3, opacity: 1 - t};
    s.universe = {visible: true, position: ORIGIN, scale: 3, opacity: t, revealLevel: 1};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.46;
  }

  // ---- Beat 69 (341.76-361.66s): "The boundary is part of the -----------
  // geometry." Entire universe bends subtly. Wide orbit, gravitational
  // waves ripple outward.
  else if (frame < CUE.creatureOnPaper) {
    s.universe = {visible: true, position: ORIGIN, scale: 3.5, opacity: 1, revealLevel: 1};
    s.grid = {visible: true, position: [0, -4.5, 0], rotation: [-Math.PI / 2, 0, 0], opacity: 0.55, warpStrength: 0.4, wellPosition: [0, 0], wellRadius: 4.5, wellDepth: 1.6};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.46;
  }

  // =====================================================================
  // THE PAPER ANALOGY (beats 70-77)
  // =====================================================================

  // ---- Beat 70 (361.66-365.62s): "Imagine a creature living on a -------
  // sheet of paper." Tiny 2D creature on glowing grid. Top-down, grid
  // pulses.
  else if (frame < CUE.leftAndRight) {
    const fadeIn = kf(frame, CUE.creatureOnPaper, CUE.creatureOnPaper + 15, 0, 1, true);
    s.paper = {visible: true, position: ORIGIN, rotation: [-Math.PI / 2, 0, 0], scale: 1, opacity: fadeIn, size: 4};
    s.creature = {visible: true, position: [0, 0.02, 0], heading: 0, opacity: fadeIn};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 71 (365.62-367.54s): "It can move left and right..." -------
  // Creature moves horizontally. Side tracking, direction arrows.
  else if (frame < CUE.forwardAndBackward) {
    const t = kf(frame, CUE.leftAndRight, CUE.forwardAndBackward, 0, 1, true);
    s.paper = {visible: true, position: ORIGIN, rotation: [-Math.PI / 2, 0, 0], scale: 1, opacity: 1, size: 4};
    s.creature = {visible: true, position: [THREE.MathUtils.lerp(-1.1, 1.1, t), 0.02, 0], heading: 0, opacity: 1};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 72 (367.54-369.98s): "...and forward and backward." --------
  // Creature moves vertically on paper. Top-down tracking, trails.
  else if (frame < CUE.noConceptOfUp) {
    const t = kf(frame, CUE.forwardAndBackward, CUE.noConceptOfUp, 0, 1, true);
    s.paper = {visible: true, position: ORIGIN, rotation: [-Math.PI / 2, 0, 0], scale: 1, opacity: 1, size: 4};
    s.creature = {visible: true, position: [0, 0.02, THREE.MathUtils.lerp(-1.1, 1.1, t)], heading: Math.PI / 2, opacity: 1};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 73 (369.98-376.62s): "But has no concept of up." Camera ----
  // rises above paper. Vertical crane, third dimension revealed.
  else if (frame < CUE.pickItUp) {
    s.paper = {visible: true, position: ORIGIN, rotation: [-Math.PI / 2, 0, 0], scale: 1, opacity: 1, size: 4};
    s.creature = {visible: true, position: [0, 0.02, 0], heading: 0, opacity: 1};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 74 (376.62-379.2s): "Now imagine you pick it up..." Giant --
  // hand lifts paper. Upward movement, world stretches.
  else if (frame < CUE.creaturesPerspective) {
    const t = kf(frame, CUE.pickItUp, CUE.creaturesPerspective, 0, 1, true);
    const liftY = t * 1.6;
    s.paper = {visible: true, position: [0, liftY, 0], rotation: [-Math.PI / 2, 0, 0], scale: 1, opacity: 1, size: 4};
    s.creature = {visible: true, position: [0, liftY + 0.02, 0], heading: 0, opacity: 1};
    s.hand = {visible: true, position: [0, liftY + 0.9, 0], rotation: [0, 0, 0], scale: 1.6, opacity: 1};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 75 (379.2-389.4s): "From the creature's perspective..." ----
  // Creature POV. Camera at creature height, world seems impossible.
  else if (frame < CUE.directionItCouldntAccess) {
    s.paper = {visible: true, position: [0, 1.6, 0], rotation: [-Math.PI / 2, 0, 0], scale: 1, opacity: 1, size: 4};
    s.creature = {visible: true, position: [0, 1.62, 0], heading: 0, opacity: 1};
    s.hand = {visible: true, position: [0, 2.5, 0], rotation: [0, 0, 0], scale: 1.6, opacity: 0.7};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 76 (389.4-394.16s): "You simply used a direction it --------
  // couldn't access." 3D space surrounds 2D world. Large orbital move,
  // axis appears.
  else if (frame < CUE.intuitionWeNeed) {
    s.paper = {visible: true, position: [0, 1.6, 0], rotation: [-Math.PI / 2, 0, 0], scale: 1, opacity: 1, size: 4};
    s.creature = {visible: true, position: [0, 1.62, 0], heading: 0, opacity: 1};
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 77 (394.16-421.86s): "That's roughly the kind of -----------
  // intuition..." Paper transforms into spacetime. Morph transition, grid
  // curves.
  else if (frame < CUE.whatsOutside) {
    const t = kf(frame, CUE.intuitionWeNeed, CUE.intuitionWeNeed + 20, 0, 1, true);
    s.paper = {visible: true, position: [0, 1.6, 0], rotation: [-Math.PI / 2, 0, 0], scale: 1, opacity: 1 - t, size: 4};
    s.grid = {visible: true, position: [0, 0.6, 0], rotation: [-Math.PI / 2, 0, 0], opacity: t, warpStrength: 0.5, wellPosition: [0, 0], wellRadius: 3, wellDepth: 2.2};
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.42;
  }

  // =====================================================================
  // WHAT'S OUTSIDE OUR UNIVERSE (beats 78-87)
  // =====================================================================

  // ---- Beat 78 (421.86-426.06s): "What's outside our universe?" --------
  // Universe floating in darkness. Slow pull-back, tiny stars drift.
  else if (frame < CUE.doesntMakeSense) {
    s.universe = {visible: true, position: ORIGIN, scale: 2.6, opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.05;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 79 (426.06-434.32s): "Normally that question doesn't even --
  // make sense." Camera reaches apparent boundary. Camera stops,
  // everything beyond is black.
  else if (frame < CUE.supposeInsideBlackHole) {
    s.universe = {visible: true, position: ORIGIN, scale: 2.6, opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.05;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 80 (434.32-439.92s): "But suppose we're inside a black -----
  // hole." Universe nested inside giant horizon. Rapid zoom-out, lensing
  // intensifies.
  else if (frame < CUE.largerSpacetimeOutside) {
    const t = kf(frame, CUE.supposeInsideBlackHole, CUE.largerSpacetimeOutside, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(2.6, 0.7, t), opacity: 1, revealLevel: 1};
    s.universeAsBlackHole = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(2.6, 0.7, t), opacity: t};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.05, 0.4, t);
    s.fillIntensity = 0.4;
  }

  // ---- Beat 81 (439.92-445.08s): "Maybe there's a larger spacetime -----
  // outside." Parent universe materializes. Massive reveal, galaxies
  // appear.
  else if (frame < CUE.parentUniverseAgain) {
    const t = kf(frame, CUE.largerSpacetimeOutside, CUE.parentUniverseAgain, 0, 1, true);
    s.universeAsBlackHole = {visible: true, position: ORIGIN, scale: 0.7, opacity: 1};
    const fadeIn = kf(frame, CUE.largerSpacetimeOutside + 6, CUE.parentUniverseAgain, 0, 1, true);
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: THREE.MathUtils.lerp(3, 7, t), opacity: fadeIn, diskOpacity: fadeIn * 0.6, lensingOpacity: fadeIn};
    s.lightning = {opacity: flash(frame, CUE.largerSpacetimeOutside + 8)};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 82 (445.08-462.3s): "A parent universe." Multiple cosmic ---
  // structures surround ours. Wide orbit, scale increases.
  else if (frame < CUE.theyDSeeBlackHole) {
    s.universeAsBlackHole = {visible: true, position: ORIGIN, scale: 0.7, opacity: 1};
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 7, opacity: 1, diskOpacity: 0.6, lensingOpacity: 1};
    const growth = kf(frame, CUE.theyDSeeBlackHole - 90, CUE.theyDSeeBlackHole, 0, 0.4, true);
    s.cosmicTree = {visible: true, position: [0, -8, -6], rotation: [0, 0.4, 0], scale: 1.4, opacity: 0.7, growth};
    s.starfieldOpacity = 0.55;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 83 (462.3-463.4s): "They'd see a black hole." Parent -------
  // observer sees black hole. Over-shoulder, horizon glows.
  else if (frame < CUE.meanwhileInside) {
    s.blackHole = {visible: true, position: [0, 0, -5], rotation: BH_TILT, scale: 1.6, opacity: 1, diskOpacity: 0.7, lensingOpacity: 1};
    s.silhouette = {visible: true, position: [0, 0, 1.2], rotation: [0, Math.PI, 0], scale: 1, opacity: 1, lookUp: 0};
    s.starfieldOpacity = 0.45;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 84 (463.4-464.94s): "Meanwhile, inside..." Camera dives ----
  // into horizon. Match cut, darkness.
  else if (frame < CUE.lookingAroundSaying) {
    const t = kf(frame, CUE.meanwhileInside, CUE.lookingAroundSaying, 0, 1, true);
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 1.6, opacity: 1 - t, diskOpacity: 0, lensingOpacity: 0.5 * (1 - t)};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.45, 0.1, t);
    s.fillIntensity = THREE.MathUtils.lerp(0.42, 0.25, t);
  }

  // ---- Beat 85 (464.94-466.84s): "We're looking around saying..." ------
  // Earth appears (about to be named "the universe"). Slow planetary
  // orbit.
  else if (frame < CUE.thisIsTheUniverse) {
    const earthIn = kf(frame, CUE.lookingAroundSaying, CUE.thisIsTheUniverse, 0, 1, true);
    s.earth = {visible: true, position: ORIGIN, rotation: [0, frame * 0.008, 0], scale: 1.2, opacity: earthIn};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 86 (466.84-470.6s): "This is the universe." Camera pulls ---
  // away from Earth to galaxy. Continuous zoom-out, cosmic scale.
  else if (frame < CUE.differentPerspectives) {
    const t = kf(frame, CUE.thisIsTheUniverse, CUE.differentPerspectives, 0, 1, true);
    s.earth = {visible: true, position: ORIGIN, rotation: [0, frame * 0.008, 0], scale: 1.2, opacity: 1 - t * 0.3};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.5, 0.6, t);
    s.fillIntensity = 0.48;
  }

  // ---- Beat 87 (470.6-490.88s): "Same structure. Different -------------
  // perspectives." Split-screen: parent observer / inner universe.
  // Synchronized zoom, mirrored views.
  else if (frame < CUE.couldWeProve) {
    s.blackHole = {visible: true, position: [-3, 0, 0], rotation: BH_TILT, scale: 0.8, opacity: 1, diskOpacity: 0.6, lensingOpacity: 1};
    s.earth = {visible: true, position: [3, 0, 0], rotation: [0, frame * 0.008, 0], scale: 0.8, opacity: 1};
    s.starfieldOpacity = 0.45;
    s.fillIntensity = 0.46;
  }

  // =====================================================================
  // CAN WE PROVE IT (beats 88-97)
  // =====================================================================

  // ---- Beat 88 (490.88-498.72s): "Could we ever prove we're inside a ---
  // black hole?" Giant telescope pointed toward sky. Push toward lens,
  // lens reflections.
  else if (frame < CUE.beyondCausalHorizon) {
    s.telescope = {visible: true, position: [0, -0.3, 0], rotation: [0, 0.3, 0], scale: 1.4, opacity: 1};
    s.starfieldOpacity = 0.55;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 89 (498.72-503.22s): "If the outside is beyond our causal --
  // horizon..." Light cone surrounds universe. Orbit, signals move along
  // cone.
  else if (frame < CUE.biggerTelescope) {
    s.universe = {visible: true, position: ORIGIN, scale: 1.2, opacity: 1, revealLevel: 1};
    s.lightCone = {visible: true, position: ORIGIN, rotation: [0, 0, 0], scale: 2.6, opacity: 0.85};
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 90 (503.22-510.64s): "We can't just build a bigger ---------
  // telescope." Telescope grows absurdly huge. Zoom out, scale gag.
  else if (frame < CUE.infoCantReachUs) {
    const t = kf(frame, CUE.biggerTelescope, CUE.infoCantReachUs, 0, 1, true);
    s.telescope = {visible: true, position: [0, -0.3, 0], rotation: [0, 0.3, 0], scale: THREE.MathUtils.lerp(1.4, 6, t), opacity: 1};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 91 (510.64-514.06s): "If information can't reach us..." ----
  // Signal travels toward boundary. Follow signal, signal fades.
  else if (frame < CUE.nothingForTelescopeToSee) {
    const drawEnd = kf(frame, CUE.infoCantReachUs, CUE.infoCantReachUs + 25, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: 1, opacity: 1, revealLevel: 1};
    s.lightBeam = {progress: drawEnd, opacity: 1};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 92 (514.06-517.6s): "...there's nothing for the telescope --
  // to see." Telescope view becomes black/static. Camera enters
  // eyepiece, signal disappears.
  else if (frame < CUE.indirectEvidence) {
    const t = kf(frame, CUE.nothingForTelescopeToSee, CUE.indirectEvidence, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: 1, opacity: 1, revealLevel: 1};
    s.lightBeam = {progress: 1, opacity: 1 - t};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.4, 0.1, t);
    s.fillIntensity = THREE.MathUtils.lerp(0.42, 0.25, t);
  }

  // ---- Beat 93 (517.6-527.28s): "We'd have to look for indirect --------
  // evidence." Telescope transforms into data visualization. Pull
  // through screen, data particles.
  else if (frame < CUE.particularPatterns) {
    const fadeIn = kf(frame, CUE.indirectEvidence, CUE.indirectEvidence + 15, 0, 1, true);
    s.cmb = {visible: true, position: ORIGIN, rotation: [0, 0, 0], scale: 2.4, opacity: fadeIn};
    s.starfieldOpacity = 0.15;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 94 (527.28-530.16s): "Patterns in the cosmic microwave -----
  // background." CMB map fills screen. Macro zoom, anomaly highlights.
  else if (frame < CUE.geometryOfUniverse) {
    s.cmb = {visible: true, position: ORIGIN, rotation: [0, 0, 0], scale: 2.4, opacity: 1};
    s.starfieldOpacity = 0.1;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 95 (530.16-537.16s): "Geometry of our universe." Universe --
  // geometry bends into different shapes. Slow rotation, grid
  // deformation.
  else if (frame < CUE.specificPrediction) {
    const crossfade = kf(frame, CUE.geometryOfUniverse, CUE.geometryOfUniverse + 15, 0, 1, true);
    s.cmb = {visible: true, position: ORIGIN, rotation: [0, 0, 0], scale: 2.4, opacity: 1 - crossfade};
    s.grid = {visible: true, position: [0, -2.4, 0], rotation: [-Math.PI / 2, 0, 0], opacity: crossfade, warpStrength: 0.5, wellPosition: [0, 0], wellRadius: 3.4, wellDepth: 2};
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.45;
  }

  // ---- Beat 96 (537.16-558.38s): "A future theory could make a ---------
  // prediction." Equation forms from particles. Push through equation,
  // formula illuminates.
  else if (frame < CUE.ideaVsTheory) {
    s.equation = {text: 'ΔT/T ~ f(κ, Ω) → predicted CMB signature', opacity: 1, warp: 0};
    const cmbIn = kf(frame, CUE.specificPrediction + 15, CUE.ideaVsTheory - 15, 0, 1, true);
    s.cmb = {visible: true, position: ORIGIN, rotation: [0, 0, 0], scale: 2.2, opacity: cmbIn};
    s.starfieldOpacity = 0.15;
    s.fillIntensity = 0.48;
  }

  // ---- Beat 97 (558.38-572.12s): "That's the difference between an -----
  // idea and a scientific theory." IDEA -> PREDICTION -> TEST. Sequential
  // forward movement, each word locks into place.
  else if (frame < CUE.bookIntoBlackHole) {
    const shotStart = CUE.ideaVsTheory;
    const shotEnd = CUE.bookIntoBlackHole;
    const span = shotEnd - shotStart;
    const stageF = kf(frame, shotStart, shotStart + span * 0.7, 0, 2, true);
    s.hpt = {stage: Math.floor(THREE.MathUtils.clamp(stageF, 0, 2)), opacity: kf(frame, shotStart, shotStart + 12, 0, 1, true)};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.42;
  }

  // =====================================================================
  // THE INFORMATION PROBLEM (beats 98-106)
  // =====================================================================

  // ---- Beat 98 (572.12-575.84s): "Think of throwing a book into a ------
  // black hole." Book floats toward horizon. Tracking shot, pages
  // flutter.
  else if (frame < CUE.bookContainsInfo) {
    const t = kf(frame, CUE.bookIntoBlackHole, CUE.bookContainsInfo, 0, 1, true);
    s.blackHole = {visible: true, position: [0, 0, -3], rotation: BH_TILT, scale: 1.6, opacity: 1, diskOpacity: 0.7, lensingOpacity: 1};
    s.book = {visible: true, position: [0, 0, THREE.MathUtils.lerp(2.4, 0.3, t)], rotation: [0.2, t * 4, 0], scale: 1, opacity: 1, dissolveProgress: 0};
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 99 (575.84-578.36s): "The book contains information." ------
  // Words lift from pages. Macro zoom, letters become particles.
  else if (frame < CUE.everyWordLetterMolecule) {
    const t = kf(frame, CUE.bookContainsInfo, CUE.everyWordLetterMolecule, 0, 1, true);
    s.book = {visible: true, position: ORIGIN, rotation: [0.2, t * 4, 0], scale: 1, opacity: 1, dissolveProgress: t * 0.2};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 100 (578.36-600.36s): "Every word, letter, molecule..." ----
  // Text -> atoms -> molecules. Extreme nested zoom, molecular animation.
  else if (frame < CUE.whatHappensToInfo) {
    const t = kf(frame, CUE.everyWordLetterMolecule, CUE.whatHappensToInfo, 0, 1, true);
    s.book = {visible: true, position: ORIGIN, rotation: [0.2, t * 4, 0], scale: 1, opacity: 1, dissolveProgress: THREE.MathUtils.lerp(0.2, 1, t)};
    s.starfieldOpacity = 0.15;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 101 (600.36-603.06s): "What happens to all that ------------
  // information?" Book disappears into horizon. Follow it, hard
  // blackout.
  else if (frame < CUE.hawkingMadeWorse) {
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 1, opacity: 1, diskOpacity: 0, lensingOpacity: 1};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 102 (603.06-605.98s): "Then Stephen Hawking made the -------
  // problem worse." Black hole glows around edges. Orbit, Hawking
  // radiation particles.
  else if (frame < CUE.emitRadiation) {
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 1, opacity: 1, diskOpacity: 0, lensingOpacity: 1};
    s.hawking = {opacity: kf(frame, CUE.hawkingMadeWorse, CUE.hawkingMadeWorse + 15, 0, 1, true), progress: 0.1};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 103 (605.98-619.44s): "Black holes emit radiation." --------
  // Particles escape around horizon. Follow outward particle, energy
  // trails.
  else if (frame < CUE.couldEvaporate) {
    const t = kf(frame, CUE.emitRadiation, CUE.couldEvaporate, 0, 1, true);
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 1, opacity: 1, diskOpacity: 0, lensingOpacity: 1};
    s.hawking = {opacity: 1, progress: 0.1 + t * 0.8};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 104 (619.44-623s): "They can eventually evaporate." --------
  // Black hole slowly shrinks. Time-lapse pull-back, horizon contracts.
  else if (frame < CUE.blackHoleDisappears) {
    const t = kf(frame, CUE.couldEvaporate, CUE.blackHoleDisappears, 0, 1, true);
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: THREE.MathUtils.lerp(1, 0.3, t), opacity: 1, diskOpacity: 0, lensingOpacity: 1};
    s.hawking = {opacity: 1 - t * 0.3, progress: 0.7};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 105 (623-627.98s): "So imagine the black hole ---------------
  // disappears." Final glow disappears. Slow pull-back, darkness.
  else if (frame < CUE.whereDidItGo) {
    const t = kf(frame, CUE.blackHoleDisappears, CUE.whereDidItGo, 0, 1, true);
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 0.3, opacity: 1 - t, diskOpacity: 0, lensingOpacity: (1 - t) * 0.5};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.4, 0.15, t);
    s.fillIntensity = THREE.MathUtils.lerp(0.4, 0.2, t);
  }

  // ---- Beat 106 (627.98-692.14s): "Where did the information go?" ------
  // One glowing question mark in darkness. Locked camera, single
  // flickering particle.
  else if (frame < CUE.blackHolesCreateMany) {
    const pulse = 0.7 + 0.3 * Math.sin(frame * 0.04);
    s.universe = {visible: true, position: ORIGIN, scale: 0.1 * pulse, opacity: 1, revealLevel: 0};
    s.starfieldOpacity = 0.08;
    s.fillIntensity = 0.15;
  }

  // =====================================================================
  // COSMIC FAMILY TREE (beats 107-114)
  // =====================================================================

  // ---- Beat 107 (692.14-700.42s): "What if black holes can create ------
  // many universes?" One glowing universe. Wide shot, pulsing boundary.
  else if (frame < CUE.starsForm) {
    const fadeIn = kf(frame, CUE.blackHolesCreateMany, CUE.blackHolesCreateMany + 15, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: 2, opacity: fadeIn, revealLevel: 0.5};
    s.speculative = {text: 'HYPOTHESIS', opacity: kf(frame, CUE.blackHolesCreateMany + 20, CUE.blackHolesCreateMany + 50, 0, 1, true) * kf(frame, CUE.starsForm - 30, CUE.starsForm - 5, 1, 0, true)};
    s.starfieldOpacity = 0.35;
    s.fillIntensity = 0.45;
  }

  // ---- Beat 108 (700.42-703.29s): "Stars form..." Stars ignite. --------
  // Time-lapse, rapid star formation.
  else if (frame < CUE.collapseIntoBlackHoles) {
    s.universe = {visible: true, position: ORIGIN, scale: 2, opacity: 1, revealLevel: 1};
    s.sun = {visible: true, position: [1.1, 0.4, 0.8], scale: 0.3, opacity: kf(frame, CUE.starsForm, CUE.collapseIntoBlackHoles, 0, 1, true)};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.48;
  }

  // ---- Beat 109 (703.29-708.32s): "Some collapse into black holes." ----
  // Stars collapse. Rapid zoom, black-hole formation.
  else if (frame < CUE.producingNewUniverses) {
    const t = kf(frame, CUE.collapseIntoBlackHoles, CUE.collapseIntoBlackHoles + 10, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: 2, opacity: 1, revealLevel: 1};
    s.sun = {visible: true, position: [1.1, 0.4, 0.8], scale: THREE.MathUtils.lerp(0.3, 0.08, t), opacity: 1 - t};
    s.blackHole = {visible: true, position: [1.1, 0.4, 0.8], rotation: BH_TILT, scale: 0.15, opacity: t, diskOpacity: t * 0.5, lensingOpacity: t};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.46;
  }

  // ---- Beat 110 (708.32-712.18s): "And perhaps those create new --------
  // universes." Each black hole becomes tiny expanding universe. Nested
  // zoom, expansion shockwaves.
  else if (frame < CUE.universesFormStars) {
    s.blackHole = {visible: true, position: [1.1, 0.4, 0.8], rotation: BH_TILT, scale: 0.15, opacity: 1, diskOpacity: 0.5, lensingOpacity: 1};
    const t = kf(frame, CUE.producingNewUniverses, CUE.universesFormStars, 0, 1, true);
    s.universeAsBlackHole = {visible: true, position: [1.1, 0.4, 0.8], scale: 0.15 * (1 + t), opacity: t};
    s.lightning = {opacity: flash(frame, CUE.producingNewUniverses + 3)};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.46;
  }

  // ---- Beat 111 (712.18-714.32s): "Those universes form stars..." ------
  // New galaxies and stars emerge. Accelerated evolution, starbirth
  // particles.
  else if (frame < CUE.starsFormMoreBlackHoles) {
    const t = kf(frame, CUE.universesFormStars, CUE.starsFormMoreBlackHoles, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(2, 3, t), opacity: 1, revealLevel: 1};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.4, 0.55, t);
    s.fillIntensity = 0.48;
  }

  // ---- Beat 112 (714.32-717.4s): "Those stars form more black holes." --
  // More stars collapse. Pull-back, multiple horizons.
  else if (frame < CUE.moreUniverses) {
    const growth = kf(frame, CUE.starsFormMoreBlackHoles, CUE.moreUniverses, 0, 0.4, true);
    s.cosmicTree = {visible: true, position: [0, -2, -3], rotation: [0, 0.2, 0], scale: 1.6, opacity: 1, growth};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 113 (717.4-721.12s): "And even more universes." Every ------
  // black hole branches into another universe. Massive zoom-out,
  // branching light trails.
  else if (frame < CUE.cosmicFamilyTree) {
    const growth = kf(frame, CUE.moreUniverses, CUE.cosmicFamilyTree, 0.4, 0.75, true);
    s.cosmicTree = {visible: true, position: [0, -2, -3], rotation: [0, 0.2, 0], scale: 1.6, opacity: 1, growth};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 114 (721.12-741.82s): "A cosmic family tree." Entire -------
  // cosmic tree fills frame. Slow orbital camera, thousands of glowing
  // branches.
  else if (frame < CUE.notSingleIsolated) {
    const growth = kf(frame, CUE.cosmicFamilyTree, CUE.cosmicFamilyTree + 20, 0.75, 1, true);
    s.cosmicTree = {visible: true, position: [0, -2, -3], rotation: [0, 0.2, 0], scale: 1.6, opacity: 1, growth};
    s.speculative = {text: 'NOT ESTABLISHED', opacity: kf(frame, CUE.cosmicFamilyTree + 30, CUE.cosmicFamilyTree + 60, 0, 1, true) * kf(frame, CUE.notSingleIsolated - 40, CUE.notSingleIsolated - 10, 1, 0, true)};
    s.starfieldOpacity = 0.45;
    s.fillIntensity = 0.42;
  }

  // =====================================================================
  // FINAL PAYOFF (beats 115-125)
  // =====================================================================

  // ---- Beat 115 (741.82-746.1s): "Maybe the universe isn't a single ----
  // isolated thing." Our universe surrounded by countless others.
  // Extreme pull-back, cosmic branches.
  else if (frame < CUE.realityMuchBigger) {
    s.cosmicTree = {visible: true, position: [0, -2, -3], rotation: [0, 0.2, 0], scale: 1.6, opacity: 0.7, growth: 1};
    s.universe = {visible: true, position: ORIGIN, scale: 1, opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.55;
    s.fillIntensity = 0.45;
  }

  // ---- Beat 116 (746.1-747.75s): "Maybe reality is much bigger..." -----
  // Camera continues through nested universes. Infinite zoom-out, rapid
  // scale transitions.
  else if (frame < CUE.partWeExperience) {
    s.cosmicTree = {visible: true, position: [0, -2, -3], rotation: [0, 0.2, 0], scale: 2.2, opacity: 0.6, growth: 1};
    s.universe = {visible: true, position: ORIGIN, scale: 0.7, opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.6;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 117 (747.75-750.04s): "...than the part we're able to ------
  // experience." Observable universe becomes microscopic. Continue
  // pulling away, light fades with distance.
  else if (frame < CUE.beginningOfUniverse) {
    const t = kf(frame, CUE.partWeExperience, CUE.beginningOfUniverse, 0, 1, true);
    s.cosmicTree = {visible: true, position: [0, -2, -3], rotation: [0, 0.2, 0], scale: THREE.MathUtils.lerp(2.2, 3, t), opacity: 0.6, growth: 1};
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.7, 0.25, t), opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.6;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 118 (750.04-752.92s): "Maybe what we call the beginning..." -
  // Big Bang rewinds. Reverse time-lapse, galaxies collapse backward.
  else if (frame < CUE.beginningOfOurCorner) {
    const t = kf(frame, CUE.beginningOfUniverse, CUE.beginningOfOurCorner, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.25, 0.08, t), opacity: 1, revealLevel: THREE.MathUtils.lerp(1, 0.1, t)};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.6, 0.2, t);
    s.fillIntensity = THREE.MathUtils.lerp(0.4, 0.6, t);
  }

  // ---- Beat 119 (752.92-757.38s): "...was only the beginning of our ----
  // particular corner of reality." Big Bang becomes one branch of cosmic
  // tree. Orbit around branch, other branches ignite.
  else if (frame < CUE.soDotDotDot) {
    const t = kf(frame, CUE.beginningOfOurCorner, CUE.beginningOfOurCorner + 15, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: 0.08, opacity: 1 - t, revealLevel: 0.1};
    s.cosmicTree = {visible: true, position: ORIGIN, rotation: [0, 0.2, 0], scale: 0.5, opacity: t, growth: 0.3};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 120 (757.38-757.56s): "So..." Cut to Earth. Slow push -------
  // toward planet; all cosmic sound visually falls away.
  else if (frame < CUE.areWeInsideBlackHole) {
    const fadeIn = kf(frame, CUE.soDotDotDot, CUE.soDotDotDot + 8, 0, 1, true);
    s.earth = {visible: true, position: ORIGIN, rotation: [0, frame * 0.008, 0], scale: 1.4, opacity: fadeIn};
    s.starfieldOpacity = 0.45;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 121 (757.56-760s): "Are we inside a black hole?" Earth ------
  // reflected inside a black-hole horizon. Slow push, horizon subtly
  // curves around Earth.
  else if (frame < CUE.noWayToTellYes) {
    s.earth = {visible: true, position: ORIGIN, rotation: [0, frame * 0.008, 0], scale: 1.4, opacity: 1};
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 2.6, opacity: 0.2, diskOpacity: 0, lensingOpacity: 0.35};
    s.starfieldOpacity = 0.45;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 122 (760-763s): "Right now, there's no way for me to -------
  // honestly tell you yes." Earth fades into darkness. Slow pull away,
  // stars disappear one by one.
  else if (frame < CUE.loopBlackHoleAppears) {
    const t = kf(frame, CUE.noWayToTellYes, CUE.loopBlackHoleAppears, 0, 1, true);
    s.earth = {visible: true, position: ORIGIN, rotation: [0, frame * 0.008, 0], scale: 1.4, opacity: 1 - t};
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 2.6, opacity: 0.2 * (1 - t), diskOpacity: 0, lensingOpacity: 0.35 * (1 - t)};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.45, 0.15, t);
    s.fillIntensity = THREE.MathUtils.lerp(0.5, 0.15, t);
  }

  // ---- Beat 123 (763-764s): [no voice] "Tiny black hole remains where --
  // Earth was." Locked frame, accretion disk slowly rotates.
  else if (frame < CUE.loopContracts) {
    const fadeIn = kf(frame, CUE.loopBlackHoleAppears, CUE.loopBlackHoleAppears + 12, 0, 1, true);
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 0.35, opacity: fadeIn, diskOpacity: fadeIn * 0.4, lensingOpacity: fadeIn * 0.6};
    s.starfieldOpacity = 0.15;
    s.fillIntensity = 0.15;
  }

  // ---- Beat 124 (764-765s): [no voice] "Black hole contracts into a ----
  // tiny point of light." Rapid zoom-out, light pulse.
  else if (frame < CUE.loopEnd) {
    const t = kf(frame, CUE.loopContracts, CUE.loopEnd, 0, 1, true);
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: THREE.MathUtils.lerp(0.35, 0.05, t), opacity: 1 - t * 0.3, diskOpacity: 0.4 * (1 - t), lensingOpacity: 0.6 * (1 - t)};
    s.lightning = {opacity: flash(frame, CUE.loopEnd - 4, 2, 6)};
    s.starfieldOpacity = 0.15;
    s.fillIntensity = 0.15;
  }

  // ---- Beat 125 (765-768s): [no voice] "Tiny point becomes the exact ---
  // opening shot." Seamless transition — crossfades into exactly beat 1's
  // starting state so the loop back to frame 0 is invisible.
  else {
    const t = kf(frame, CUE.loopEnd, CUE.loopVideoEnd, 0, 1, true);
    s.blackHole = {visible: true, position: ORIGIN, rotation: BH_TILT, scale: 0.05, opacity: (1 - t) * 0.7, diskOpacity: 0, lensingOpacity: (1 - t) * 0.4};
    s.universe = {visible: true, position: ORIGIN, scale: 0.3, opacity: t, revealLevel: 0};
    s.starfieldOpacity = 0.15;
    s.fillIntensity = 0.15;
  }

  return s;
};

export {DURATION_IN_FRAMES};
