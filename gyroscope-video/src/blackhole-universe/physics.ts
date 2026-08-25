/**
 * Pure, deterministic choreography for "What If Our Entire Universe Is
 * Inside a Black Hole?" — same architecture as every other video in this
 * project: everything is a function of the absolute frame number only.
 *
 * REBUILT against the exact, mandatory 109-beat storyboard (see timing.ts
 * for the per-beat quoted-line/cue mapping this follows). Built section by
 * section — only beats 1-13 are implemented so far; getSceneState returns
 * a hidden/neutral state for any frame past what's been built.
 *
 * CLARITY & COLOR RULE: this video must read as genuinely clear and
 * well-lit, not a flat near-black palette — see scene/Lighting.tsx for the
 * brighter baseline. The event horizon/photon-ring/disk/grid are all
 * self-illuminating (MeshBasicMaterial, unaffected by scene lighting), so
 * the real levers for "not too dark" are: (a) their own material colors
 * being vivid and high-contrast (see shared/BlackHole.tsx and
 * docs/black_hole_visual_reference.md), (b) enough starfield/ambient
 * content on screen, and (c) fillIntensity driving Earth/spacecraft-style
 * lit materials — bumped up across the board from the first draft's
 * "moody near-black" defaults.
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
 * disk + lensing arcs) — drives shared/BlackHole.tsx, the new spec-accurate
 * component. Distinct from BHSilhouetteState, the lighter-weight "our
 * universe looks like a black hole from outside" motif used in the
 * opening's beat 5. */
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

/** Several LightBeam instances at once (beats 19-20's "multiple glowing
 * trajectories converging"), rather than a separate component. */
export interface TrajectoriesState {
  seeds: number[];
  progress: number;
  opacity: number;
}

/** Generic transform state shared by the several one-off objects added for
 * beats 14-109 (silhouette, telescope, CMB map, light cone, cosmic tree) —
 * they all just need position/rotation/scale/opacity, so one shape avoids
 * a bespoke interface per object. */
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

/** On-screen diagram text — equations, "∞" symbols, HYPOTHESIS -> PREDICTION
 * -> TEST. NOT narration captions (see overlays/Overlays.tsx) — these are
 * the specific beats that explicitly call for on-screen text. */
export interface EquationOverlayState {
  text: string;
  opacity: number;
  warp: number; // 0 = clean, 1 = fragmenting/warping
}
export interface InfinityOverlayState {
  opacity: number;
}
export interface HPTOverlayState {
  stage: number; // 0 = HYPOTHESIS lit, 1 = +PREDICTION, 2 = +TEST
  opacity: number;
}

/** A generic "diagram gets crossed out" annotation (beat 51 — the black
 * hole explosion idea gets rejected) — two bright diagonal lines drawn over
 * whatever's on screen, not narration text. */
export interface CrossOutState {
  opacity: number;
}

export interface SceneState {
  universe: NestedUniverseState | null;
  universeAsBlackHole: BHSilhouetteState | null;
  blackHole: BHState | null;
  grid: GridState | null;
  grid2: GridState | null;
  infall: InfallState | null;
  lightBeam: LightBeamState | null;
  earth: Obj3DState;
  spacecraft: Obj3DState;
  sun: SunState | null;
  silhouette: XformState & {lookUp?: number};
  silhouetteB: (XformState & {lookUp?: number}) | null;
  paper: PaperState | null;
  creature: CreatureState | null;
  telescope: XformState | null;
  cmb: XformState | null;
  lightCone: XformState | null;
  book: BookState | null;
  hawking: HawkingState | null;
  cosmicTree: CosmicTreeState | null;
  splitScreen: number; // 0 = full frame, >0 = split-screen amount (see Overlays.tsx)
  equation: EquationOverlayState | null;
  infinity: InfinityOverlayState | null;
  hpt: HPTOverlayState | null;
  crossOut: CrossOutState | null;
  trajectories: TrajectoriesState | null;
  hand: XformState | null;
  starfieldOpacity: number;
  fillIntensity: number;
}

const HIDDEN_UNIVERSE: NestedUniverseState = {visible: false, position: ORIGIN, scale: 1, opacity: 0, revealLevel: 0};
const HIDDEN_BH: BHSilhouetteState = {visible: false, position: ORIGIN, scale: 1, opacity: 0};
const HIDDEN_FULL_BH: BHState = {
  visible: false,
  position: ORIGIN,
  rotation: [-0.4, 0.32, 0.08],
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
  grid2: null,
  infall: null,
  lightBeam: null,
  earth: HIDDEN3D,
  spacecraft: HIDDEN3D,
  sun: null,
  silhouette: HIDDEN_SILHOUETTE,
  silhouetteB: null,
  paper: null,
  creature: null,
  telescope: null,
  cmb: null,
  lightCone: null,
  book: null,
  hawking: null,
  cosmicTree: null,
  splitScreen: 0,
  equation: null,
  infinity: null,
  hpt: null,
  crossOut: null,
  trajectories: null,
  hand: null,
  starfieldOpacity: 0,
  fillIntensity: 0.4,
});

export const getSceneState = (frame: number): SceneState => {
  const s = baseState();

  // ---- Beat 1 (0-5.52s): absolute darkness, tiny point of light appears -
  // "What if our entire universe is inside a black hole?" This one beat is
  // deliberately dark per its own visual description ("Absolute darkness")
  // — the point itself still reads clearly via NestedUniverse's built-in
  // glow (not flat black-on-black), satisfying the clarity rule without
  // fighting the beat's own intent.
  if (frame < CUE.iMeanLiterally) {
    const fadeIn = kf(frame, CUE.hook, CUE.hook + 12, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: 0.35, opacity: fadeIn, revealLevel: 0};
    s.fillIntensity = 0.15;
  }

  // ---- Beat 2 (5.52-6.88s): point expands into galaxies, stars, Earth ---
  // "I mean that literally." Short, fast beat — rapid zoom-out. Earth
  // starts fading in right at the tail, handing off into beat 3's "flies
  // past Earth" opening.
  else if (frame < CUE.everythingWeCanSee) {
    const shotStart = CUE.iMeanLiterally;
    const shotEnd = CUE.everythingWeCanSee;
    const reveal = kf(frame, shotStart, shotEnd, 0, 0.3);
    const scale = kf(frame, shotStart, shotEnd, 0.35, 0.8);
    s.universe = {visible: true, position: ORIGIN, scale, opacity: 1, revealLevel: reveal};
    const earthIn = kf(frame, shotEnd - 10, shotEnd, 0, 1, true);
    if (earthIn > 0.001) {
      s.earth = {visible: true, position: [1.1, -0.3, 0.9], rotation: [0, frame * 0.01, 0], scale: 0.22, opacity: earthIn};
    }
    s.fillIntensity = 0.45;
  }

  // ---- Beat 3 (6.88-13.16s): flies past Earth -> Solar System -> Milky --
  // Way -> cosmic web. "Everything we can see..." Extreme continuous
  // pull-back: Earth holds briefly then is left behind as the galaxy
  // cluster keeps revealing/growing toward the cosmic-web read.
  else if (frame < CUE.insideBlackHole) {
    const shotStart = CUE.everythingWeCanSee;
    const shotEnd = CUE.insideBlackHole;
    const reveal = kf(frame, shotStart, shotEnd, 0.3, 0.85);
    const scale = kf(frame, shotStart, shotEnd, 0.8, 3.5);
    s.universe = {visible: true, position: ORIGIN, scale, opacity: 1, revealLevel: reveal};
    const earthOut = kf(frame, shotStart + 20, shotStart + 55, 1, 0, true);
    if (earthOut > 0.001) {
      s.earth = {visible: true, position: [1.1, -0.3, 0.9], rotation: [0, frame * 0.01, 0], scale: 0.22, opacity: earthOut};
    }
    s.starfieldOpacity = kf(frame, shotStart, shotEnd, 0.2, 0.55);
    s.fillIntensity = 0.5;
  }

  // ---- Beat 4 (13.16-15.8s): observable universe = glowing sphere -------
  // "...is actually on the inside of a black hole..." Orbit around
  // universe — fully revealed, holding as a glowing sphere.
  else if (frame < CUE.largerUniverse) {
    s.universe = {visible: true, position: ORIGIN, scale: 5.5, opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.55;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 5 (15.8-21.4s): massive zoom-out — our universe now reads ----
  // as a tiny black-hole-like region in an enormous cosmic environment.
  // "...that exists in some much larger universe?" Crossfade the glowing
  // NestedUniverse into the ambiguous dark-silhouette read as the object
  // shrinks and the surrounding starfield grows denser.
  else if (frame < CUE.howIsThatPossible) {
    const shotStart = CUE.largerUniverse;
    const shotEnd = CUE.howIsThatPossible;
    const t = kf(frame, shotStart, shotEnd, 0, 1, true);
    const crossfade = kf(frame, shotStart, shotStart + (shotEnd - shotStart) * 0.5, 0, 1);
    // Scale/distance endpoints tuned together against cameraTimeline.ts's
    // final orbit distance (~55) so the silhouette stays clearly readable
    // (>=40px on screen) through the end of the beat — see the original
    // version of this fix for the still-frame verification that found the
    // earlier, more extreme endpoint shrinking below legibility.
    const scale = THREE.MathUtils.lerp(5.5, 1.3, t);
    s.universe = {visible: true, position: ORIGIN, scale, opacity: 1 - crossfade, revealLevel: 1};
    s.universeAsBlackHole = {visible: true, position: ORIGIN, scale, opacity: crossfade};
    s.starfieldOpacity = kf(frame, shotStart, shotEnd, 0.55, 1);
    s.fillIntensity = kf(frame, shotStart, shotEnd, 0.5, 0.3);
  }

  // ---- Beat 6 (21.4-22.94s): hard stop — screen cuts to black ------------
  // "How's that even possible?" A genuine hard, brief cut (not a long
  // held pause here — that's what the storyboard's own "Hard stop" means),
  // resolving in time for beat 7's establishing shot to fade in.
  else if (frame < CUE.classicBlackHole) {
    const cut = kf(frame, CUE.howIsThatPossible, CUE.howIsThatPossible + 2, 1, 0, true);
    s.universeAsBlackHole = {visible: true, position: ORIGIN, scale: 1.3, opacity: cut};
    s.starfieldOpacity = cut;
    s.fillIntensity = 0.05;
  }

  // ---- Beat 7 (22.94-28.62s): classic black hole + accretion disk -------
  // "We usually picture this giant dark object..." First full reveal of
  // the spec-accurate BlackHole component (sharp horizon, bright photon
  // ring, turbulent white->yellow->orange->red disk, lensing arcs).
  // Slow orbit (camera-side).
  else if (frame < CUE.fallingMatter) {
    const shotStart = CUE.classicBlackHole;
    const fadeIn = kf(frame, shotStart, shotStart + 15, 0, 1, true);
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 1,
      opacity: fadeIn,
      diskOpacity: fadeIn,
      lensingOpacity: fadeIn,
    };
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 8 (28.62-32.58s): stars/gas curve around it ------------------
  // "...pulling everything toward it." Disk holds steady while individual
  // bright particles visibly spiral inward — follow falling particles.
  else if (frame < CUE.notReallyBlackHole) {
    const shotStart = CUE.fallingMatter;
    const shotEnd = CUE.notReallyBlackHole;
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 1,
      opacity: 1,
      diskOpacity: 1,
      lensingOpacity: 1,
    };
    s.infall = {opacity: kf(frame, shotStart, shotStart + 10, 0, 1, true), progress: kf(frame, shotStart, shotEnd, 0, 1, true)};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 9 (32.58-39.02s): freeze, transform into spacetime geometry -
  // "But that's not really what a black hole is." The black hole
  // crossfades into the reused SpacetimeGrid as the camera zooms through.
  else if (frame < CUE.regionOfSpace) {
    const shotStart = CUE.notReallyBlackHole;
    const shotEnd = CUE.regionOfSpace;
    const crossfade = kf(frame, shotStart, shotEnd, 0, 1);
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 1,
      opacity: 1 - crossfade,
      diskOpacity: 1 - crossfade,
      lensingOpacity: 1 - crossfade,
    };
    s.infall = {opacity: 1 - crossfade, progress: 1};
    s.grid = {
      visible: true,
      position: [0, -1.2, 0],
      rotation: [-Math.PI / 2, 0, 0],
      opacity: crossfade,
      warpStrength: crossfade * 0.5,
      wellPosition: [0, 0],
      wellRadius: 3.2,
      wellDepth: 1.8,
    };
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.45;
  }

  // ---- Beat 10 (39.02-45.72s): grid bends increasingly steeply -----------
  // "A region of space where gravity has become extreme..." Per the
  // visual spec, a black hole's well should be dramatically steep/deep,
  // near-vertical close to center — top-down descent (camera-side).
  else if (frame < CUE.crossBoundary) {
    const shotStart = CUE.regionOfSpace;
    const shotEnd = CUE.crossBoundary;
    s.grid = {
      visible: true,
      position: [0, -1.2, 0],
      rotation: [-Math.PI / 2, 0, 0],
      opacity: 1,
      warpStrength: kf(frame, shotStart, shotEnd, 0.5, 1),
      wellPosition: [0, 0],
      wellRadius: kf(frame, shotStart, shotEnd, 3.2, 1.9),
      wellDepth: kf(frame, shotStart, shotEnd, 1.8, 6.5),
    };
    s.starfieldOpacity = 0.45;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 11 (45.72-56.18s): bright circular event horizon forms ------
  // "Once you cross a certain boundary..." Grid fades out as a bare,
  // bright horizon fades in — straight push toward it (camera-side).
  else if (frame < CUE.notEvenLight) {
    const shotStart = CUE.crossBoundary;
    const shotEnd = CUE.notEvenLight;
    const t = kf(frame, shotStart, shotEnd, 0, 1, true);
    s.grid = {
      visible: true,
      position: [0, -1.2, 0],
      rotation: [-Math.PI / 2, 0, 0],
      opacity: 1 - t,
      warpStrength: 1,
      wellPosition: [0, 0],
      wellRadius: 1.9,
      wellDepth: 6.5,
    };
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 1,
      opacity: t,
      diskOpacity: 0,
      lensingOpacity: t,
    };
    s.starfieldOpacity = kf(frame, shotStart, shotEnd, 0.45, 0.6);
    s.fillIntensity = 0.4;
  }

  // ---- Beat 12 (56.18-58.44s): light beam bends inward, disappears -------
  // "Nothing can escape. Not even light." Follow the light.
  else if (frame < CUE.eventHorizonNamed) {
    const shotStart = CUE.notEvenLight;
    const shotEnd = CUE.eventHorizonNamed;
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 1,
      opacity: 1,
      diskOpacity: 0,
      lensingOpacity: 1,
    };
    const drawEnd = shotStart + (shotEnd - shotStart) * 0.7;
    s.lightBeam = {
      opacity: kf(frame, shotEnd - 8, shotEnd, 1, 0, true),
      progress: kf(frame, shotStart, drawEnd, 0, 1, true),
    };
    s.starfieldOpacity = 0.6;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 13 (58.44-62.92s): horizon becomes a clean glowing circle ---
  // "That boundary is called the event horizon." Locked, symmetrical shot.
  else if (frame < CUE.horizonNotWall) {
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 1,
      opacity: 1,
      diskOpacity: 0,
      lensingOpacity: 1,
    };
    s.starfieldOpacity = 0.6;
    s.fillIntensity = 0.4;
  }

  // =====================================================================
  // CROSSING THE HORIZON (beats 14-20)
  // =====================================================================

  // ---- Beat 14 (64.7-66.9s): "The event horizon isn't a wall." ----------
  // "Camera approaches an apparently empty region." Deliberately nothing
  // dramatic to look at yet — that IS the point of the line — just deep
  // space and starfield, smooth forward movement (camera-side).
  else if (frame < CUE.dontHitIt) {
    s.starfieldOpacity = kf(frame, CUE.horizonNotWall, CUE.dontHitIt, 0.6, 0.5);
    s.fillIntensity = 0.4;
  }

  // ---- Beat 15 (66.9-71.36s): "You don't hit it." ------------------------
  // "Camera crosses the horizon with no impact." Continuous shot — visually
  // identical to beat 14 (no impact = no visible change), selling the
  // "you wouldn't notice" idea through absence of drama.
  else if (frame < CUE.fallingIntoMassive) {
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 16 (71.36-74.68s): "If you were falling into a really -------
  // massive black hole..." "Tiny spacecraft approaching enormous horizon."
  // Rear tracking (camera-side).
  else if (frame < CUE.crossWithoutNoticing) {
    const t = kf(frame, CUE.fallingIntoMassive, CUE.crossWithoutNoticing, 0, 1, true);
    s.blackHole = {
      visible: true,
      position: [0, 0, -6],
      rotation: [-0.4, 0.32, 0.08],
      scale: 5,
      opacity: 1,
      diskOpacity: 0.6,
      lensingOpacity: 1,
    };
    s.spacecraft = {visible: true, position: [0, 0, 2 - t * 1.5], rotation: [0, Math.PI, 0], scale: 1, opacity: 1};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 17 (74.68-80.96s): "...you could cross it without -----------
  // noticing..." "Horizon passes over camera." First-person POV — the
  // enormous horizon's blackness swallows the frame as the camera (=
  // the falling POV) reaches it.
  else if (frame < CUE.problemAfter) {
    const t = kf(frame, CUE.crossWithoutNoticing, CUE.problemAfter, 0, 1, true);
    s.blackHole = {
      visible: true,
      position: [0, 0, -6],
      rotation: [-0.4, 0.32, 0.08],
      scale: THREE.MathUtils.lerp(5, 22, t),
      opacity: 1,
      diskOpacity: THREE.MathUtils.lerp(0.6, 0, t),
      lensingOpacity: THREE.MathUtils.lerp(1, 0.3, t),
    };
    s.starfieldOpacity = THREE.MathUtils.lerp(0.5, 0.1, t);
    s.fillIntensity = THREE.MathUtils.lerp(0.4, 0.25, t);
  }

  // ---- Beat 18 (80.96-86.46s): "The problem is what happens after." -----
  // "Camera rotates 180°; exterior is now behind." Slow rotation
  // (camera-side, via lookAt) — the horizon (now "exterior") sits small
  // and distant behind, ahead is just dark space.
  else if (frame < CUE.pathsForward) {
    s.blackHole = {
      visible: true,
      position: [0, 0, 8],
      rotation: [-0.4, 0.32, 0.08],
      scale: 1.4,
      opacity: 0.8,
      diskOpacity: 0.15,
      lensingOpacity: 0.6,
    };
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.28;
  }

  // ---- Beat 19 (86.46-90.1s): "All possible paths forward..." -----------
  // "Multiple glowing trajectories bend inward." Orbiting camera.
  else if (frame < CUE.leadDeeper) {
    const fadeIn = kf(frame, CUE.pathsForward, CUE.pathsForward + 15, 0, 1, true);
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 1,
      opacity: 1,
      diskOpacity: 0,
      lensingOpacity: 0.7,
    };
    s.trajectories = {seeds: [101, 202, 303, 404, 505], progress: fadeIn, opacity: fadeIn};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.35;
  }

  // ---- Beat 20 (90.1-94.72s): "...lead deeper into the black hole." -----
  // "Every trajectory converges toward darkness." Accelerating dive
  // (camera-side).
  else if (frame < CUE.takeToSingularity) {
    const t = kf(frame, CUE.leadDeeper, CUE.takeToSingularity, 0, 1, true);
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 1,
      opacity: 1 - t * 0.6,
      diskOpacity: 0,
      lensingOpacity: 0.7 * (1 - t),
    };
    s.trajectories = {seeds: [101, 202, 303, 404, 505], progress: 1, opacity: 1 - t * 0.3};
    s.starfieldOpacity = kf(frame, CUE.leadDeeper, CUE.takeToSingularity, 0.4, 0.15);
    s.fillIntensity = 0.3;
  }

  // =====================================================================
  // THE SINGULARITY (beats 21-27)
  // =====================================================================

  // ---- Beat 21 (94.72-103.12s): "The equations eventually take you to ---
  // a singularity." "Tiny bright mathematical point appears." Extreme
  // macro zoom (camera-side) — the recurring nested-universe point stands
  // in for the singularity itself.
  else if (frame < CUE.stopMakingSense) {
    const fadeIn = kf(frame, CUE.takeToSingularity, CUE.takeToSingularity + 15, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: 0.12, opacity: fadeIn, revealLevel: 0};
    s.starfieldOpacity = 0.1;
    s.fillIntensity = 0.35;
  }

  // ---- Beat 22 (103.12-104.5s): "The equations stop making sense." ------
  // "Equations begin warping and fragmenting." Camera pushes through
  // equations (camera-side). On-screen diagram text per the storyboard.
  else if (frame < CUE.producingInfinities) {
    s.universe = {visible: true, position: ORIGIN, scale: 0.12, opacity: 1, revealLevel: 0};
    const t = kf(frame, CUE.stopMakingSense, CUE.producingInfinities, 0, 1, true);
    s.equation = {text: 'R_{μν} − ½Rg_{μν} = 8πGT_{μν}', opacity: 1, warp: t};
    s.fillIntensity = 0.35;
  }

  // ---- Beat 23 (104.5-115.28s): "They start producing infinities." ------
  // "Numbers explode outward toward ∞ symbols." Rapid expansion
  // (camera-side). On-screen ∞ symbols per the storyboard.
  else if (frame < CUE.somethingMissing) {
    const shotStart = CUE.producingInfinities;
    const shotEnd = CUE.somethingMissing;
    const eqOut = kf(frame, shotStart, shotStart + 15, 1, 0, true);
    s.universe = {visible: true, position: ORIGIN, scale: kf(frame, shotStart, shotEnd, 0.12, 0.4), opacity: 1, revealLevel: 0};
    s.equation = {text: 'R_{μν} − ½Rg_{μν} = 8πGT_{μν}', opacity: eqOut, warp: 1};
    s.infinity = {opacity: kf(frame, shotStart + 8, shotStart + 30, 0, 1, true)};
    s.starfieldOpacity = 0.1;
    s.fillIntensity = 0.35;
  }

  // ---- Beat 24 (115.28-117.5s): "Something is missing." -----------------
  // "Everything suddenly disappears." Hard cut to black.
  else if (frame < CUE.generalRelativity) {
    s.fillIntensity = 0.03;
  }

  // ---- Beat 25 (117.5-127.92s): "General relativity..." -----------------
  // "Einstein-style spacetime visualization." Slow orbit (camera-side) —
  // the shared SpacetimeGrid stands in for the GR side of the comparison.
  else if (frame < CUE.quantumMechanics) {
    const fadeIn = kf(frame, CUE.generalRelativity, CUE.generalRelativity + 15, 0, 1, true);
    s.grid = {
      visible: true,
      position: [0, -0.6, 0],
      rotation: [-Math.PI / 2, 0, 0],
      opacity: fadeIn,
      warpStrength: 0.7,
      wellPosition: [0, 0],
      wellRadius: 2.6,
      wellDepth: 3.2,
    };
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 26 (127.92-138.42s): "Quantum mechanics..." -----------------
  // "Quantum particles and probability waves appear." Macro tracking
  // (camera-side) — HawkingParticles' outward-cloud technique reused as a
  // stand-in for a cloud of quantum particles/probability waves.
  else if (frame < CUE.noCompleteTheory) {
    const t = kf(frame, CUE.quantumMechanics, CUE.noCompleteTheory, 0, 1, true, );
    s.hawking = {opacity: 1, progress: 0.15 + t * 0.5};
    s.starfieldOpacity = 0.25;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 27 (138.42-149.16s): "We still don't have a complete theory -
  // ..." "Relativity and quantum visuals collide but don't connect."
  // Split-screen pull (camera-side pulls back to reveal both sides at
  // once) — grid (GR) offset left, particle cloud (quantum) offset right,
  // never overlapping.
  else if (frame < CUE.notReallyEnd) {
    s.grid = {
      visible: true,
      position: [-3.2, -0.6, 0],
      rotation: [-Math.PI / 2, 0, 0],
      opacity: 1,
      warpStrength: 0.7,
      wellPosition: [0, 0],
      wellRadius: 2.2,
      wellDepth: 2.6,
    };
    s.hawking = {opacity: 1, progress: 0.5};
    s.starfieldOpacity = 0.25;
    s.fillIntensity = 0.4;
  }

  // =====================================================================
  // WHAT IF THE SINGULARITY ISN'T THE END (beats 28-34)
  // =====================================================================

  // ---- Beat 28 (149.16-151.98s): "What if that singularity isn't --------
  // really the end?" "Singular point begins glowing." Slow push-in
  // (camera-side).
  else if (frame < CUE.somethingHappensThere) {
    const fadeIn = kf(frame, CUE.notReallyEnd, CUE.notReallyEnd + 15, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: 0.15, opacity: fadeIn, revealLevel: 0};
    s.starfieldOpacity = 0.15;
    s.fillIntensity = 0.35;
  }

  // ---- Beat 29 (151.98-153.32s): "What if something happens there..." ---
  // "Point begins expanding outward." Reverse zoom (camera-side pulls
  // back as the subject grows, keeping it framed).
  else if (frame < CUE.physicsDoesntKnow) {
    const t = kf(frame, CUE.somethingHappensThere, CUE.physicsDoesntKnow, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.15, 0.6, t), opacity: 1, revealLevel: t * 0.2};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.35;
  }

  // ---- Beat 30 (153.32-159.88s): "...that physics doesn't know how to ---
  // describe?" "Geometry rapidly changes form." 360deg rotation
  // (camera-side) — grid warping unpredictably stands in for "geometry
  // rapidly changing form."
  else if (frame < CUE.quantumGravityPrevents) {
    const t = kf(frame, CUE.physicsDoesntKnow, CUE.quantumGravityPrevents, 0, 1, true, );
    const wobble = Math.sin(t * Math.PI * 3);
    s.grid = {
      visible: true,
      position: [0, -0.8, 0],
      rotation: [-Math.PI / 2, 0, 0],
      opacity: 1,
      warpStrength: 0.6 + wobble * 0.3,
      wellPosition: [0, 0],
      wellRadius: 2.4 + wobble * 0.6,
      wellDepth: 3 + wobble * 1.5,
    };
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.35;
  }

  // ---- Beat 31 (159.88-169.62s): "Maybe quantum gravity prevents --------
  // collapse..." "Collapse slows and stabilizes into a dense glowing
  // core." Circular orbit (camera-side, steady radius).
  else if (frame < CUE.transitionsIntoSomething) {
    const t = kf(frame, CUE.quantumGravityPrevents, CUE.quantumGravityPrevents + 20, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.6, 0.9, t), opacity: 1, revealLevel: 0.15};
    s.starfieldOpacity = 0.25;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 32 (169.62-176.76s): "Or maybe it transitions into ----------
  // something else." "Core suddenly expands." Rapid outward camera
  // movement (camera-side dollies out fast).
  else if (frame < CUE.newRegionSpacetime) {
    const t = kf(frame, CUE.transitionsIntoSomething, CUE.newRegionSpacetime, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.9, 2.6, t), opacity: 1, revealLevel: THREE.MathUtils.lerp(0.15, 0.4, t)};
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 33 (176.76-179.48s): "Maybe... a new region of spacetime." --
  // "Expanding grid emerges from the core." Fly backward through new
  // spacetime (camera-side, reverse dolly).
  else if (frame < CUE.newUniverse) {
    s.universe = {visible: true, position: ORIGIN, scale: 2.6, opacity: 1, revealLevel: 0.4};
    const t = kf(frame, CUE.newRegionSpacetime, CUE.newUniverse, 0, 1, true);
    s.grid = {
      visible: true,
      position: [0, -3, 0],
      rotation: [-Math.PI / 2, 0, 0],
      opacity: t,
      warpStrength: 0.4,
      wellPosition: [0, 0],
      wellRadius: 4,
      wellDepth: 1.2,
    };
    s.starfieldOpacity = 0.35;
    s.fillIntensity = 0.45;
  }

  // ---- Beat 34 (179.48-183.56s): "Something like a new universe?" -------
  // "Galaxies begin forming inside the expanding region." Huge pull-back
  // (camera-side).
  else if (frame < CUE.parentUniverse) {
    const t = kf(frame, CUE.newUniverse, CUE.parentUniverse, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(2.6, 5, t), opacity: 1, revealLevel: THREE.MathUtils.lerp(0.4, 1, t)};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.35, 0.5, t);
    s.fillIntensity = 0.48;
  }

  // =====================================================================
  // THE PARENT UNIVERSE (beats 35-45)
  // =====================================================================

  // ---- Beat 35 (183.56-187.1s): "Imagine you're living in some giant ----
  // parent universe." "Vast universe filled with galaxies." Slow
  // fly-through (camera-side).
  else if (frame < CUE.starCollapses) {
    s.universe = {visible: true, position: ORIGIN, scale: 5, opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.55;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 36 (187.1-188.7s): "A massive star collapses..." -----------
  // "Giant star collapses dramatically." Close orbital shot (camera-side)
  // — the reused Sun component, shrinking.
  else if (frame < CUE.formsBlackHole) {
    const t = kf(frame, CUE.starCollapses, CUE.formsBlackHole, 0, 1, true);
    s.sun = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(1.4, 0.5, t), opacity: 1};
    s.starfieldOpacity = 0.45;
    s.fillIntensity = 0.45;
  }

  // ---- Beat 37 (188.7-190.54s): "...and forms a black hole." ------------
  // "Explosion -> compact black hole." Rapid pull-back (camera-side) — one
  // continuous transcript sentence split across beats 36/37.
  else if (frame < CUE.yourPerspective) {
    const crossfade = kf(frame, CUE.formsBlackHole, CUE.formsBlackHole + 10, 0, 1, true);
    s.sun = {visible: true, position: ORIGIN, scale: 0.5, opacity: 1 - crossfade};
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 0.5,
      opacity: crossfade,
      diskOpacity: crossfade * 0.7,
      lensingOpacity: crossfade,
    };
    s.starfieldOpacity = 0.45;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 38 (190.54-192.76s): "From your perspective..." -------------
  // "Observer in parent universe looking at black hole." Over-the-shoulder
  // shot (camera-side).
  else if (frame < CUE.thereIsABlackHole) {
    s.blackHole = {
      visible: true,
      position: [0, 0.3, -5],
      rotation: [-0.4, 0.32, 0.08],
      scale: 1.3,
      opacity: 1,
      diskOpacity: 0.8,
      lensingOpacity: 1,
    };
    s.silhouette = {visible: true, position: [0, 0, 1.4], rotation: [0, Math.PI, 0], scale: 1, opacity: 1, lookUp: 0};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 39 (192.76-193.82s): "There's a black hole." ----------------
  // "Black hole dominates frame." Slow push (camera-side).
  else if (frame < CUE.butInsideThat) {
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 1.3,
      opacity: 1,
      diskOpacity: 0.85,
      lensingOpacity: 1,
    };
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 40 (193.82-195.42s): "But inside..." -------------------------
  // "Camera dives into horizon." Continuous transition (camera-side, push
  // through the horizon, frame darkens).
  else if (frame < CUE.expandingRegionForms) {
    const t = kf(frame, CUE.butInsideThat, CUE.expandingRegionForms, 0, 1, true);
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 1.3,
      opacity: 1,
      diskOpacity: THREE.MathUtils.lerp(0.85, 0, t),
      lensingOpacity: THREE.MathUtils.lerp(1, 0.3, t),
    };
    s.starfieldOpacity = THREE.MathUtils.lerp(0.4, 0.05, t);
    s.fillIntensity = THREE.MathUtils.lerp(0.42, 0.2, t);
  }

  // ---- Beat 41 (195.42-204.52s): "A new expanding region forms." --------
  // "Darkness transforms into expanding universe." Massive reverse zoom
  // (camera-side pulls back as the new universe grows to fill the frame).
  else if (frame < CUE.seeGalaxiesStars) {
    const t = kf(frame, CUE.expandingRegionForms, CUE.seeGalaxiesStars, 0, 1, true);
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 1.3,
      opacity: 1 - t,
      diskOpacity: 0,
      lensingOpacity: 0.3 * (1 - t),
    };
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.05, 3.5, t), opacity: t, revealLevel: t};
    s.starfieldOpacity = kf(frame, CUE.expandingRegionForms, CUE.seeGalaxiesStars, 0.05, 0.5);
    s.fillIntensity = kf(frame, CUE.expandingRegionForms, CUE.seeGalaxiesStars, 0.2, 0.48);
  }

  // ---- Beat 42 (204.52-207.08s): "They'd see galaxies, stars and --------
  // planets." "New galaxy -> solar system -> planet." Rapid nested zooms
  // (camera-side) — the same beats-1-3 rapid-reveal technique, compressed.
  else if (frame < CUE.seeExpandingUniverse) {
    const t = kf(frame, CUE.seeGalaxiesStars, CUE.seeExpandingUniverse, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(3.5, 0.8, t), opacity: 1, revealLevel: 1};
    const earthIn = kf(frame, CUE.seeGalaxiesStars + 10, CUE.seeExpandingUniverse, 0, 1, true);
    s.earth = {visible: true, position: [0.9, -0.2, 0.7], rotation: [0, frame * 0.01, 0], scale: 0.2, opacity: earthIn};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.48;
  }

  // ---- Beat 43 (207.08-213.68s): "They'd see an expanding universe." ----
  // "Cosmic web expands in all directions." Central stationary camera
  // (camera-side stays put; the universe/starfield grows around it).
  else if (frame < CUE.whereDidThisComeFrom) {
    const t = kf(frame, CUE.seeExpandingUniverse, CUE.whereDidThisComeFrom, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.8, 3, t), opacity: 1, revealLevel: 1};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.5, 0.7, t);
    s.fillIntensity = 0.48;
  }

  // ---- Beat 44 (213.68-215.96s): "And they'd ask: Where did all this ----
  // come from?" "Civilization looks upward into cosmic sky." Tilt toward
  // stars (camera-side, tilts up from the silhouette toward the sky).
  else if (frame < CUE.answerIsBigBang) {
    s.silhouette = {visible: true, position: [0, 0, 0], rotation: [0, 0, 0], scale: 1, opacity: 1, lookUp: 1};
    s.starfieldOpacity = 0.7;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 45 (215.96-255.36s): "Their answer could be the Big Bang." --
  // "Early hot universe transitions into expansion." Backward time-lapse
  // (camera-side, slow dolly out) — this beat holds a long time before the
  // next quoted line (255.36s), giving the "time-lapse" real duration.
  else if (frame < CUE.tinyBallExploding) {
    const t = kf(frame, CUE.answerIsBigBang, CUE.tinyBallExploding, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.2, 1.2, t), opacity: 1, revealLevel: THREE.MathUtils.lerp(0, 0.5, t)};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.15, 0.4, t);
    s.fillIntensity = THREE.MathUtils.lerp(0.55, 0.4, t);
  }

  // =====================================================================
  // THE BIG BANG — NOT AN EXPLOSION (beats 46-52)
  // =====================================================================

  // ---- Beat 46 (255.36-261.18s): "People imagine a tiny ball -----------
  // exploding..." "Small glowing sphere explodes outward." Quick zoom
  // (camera-side).
  else if (frame < CUE.notWhatHappened) {
    const t = kf(frame, CUE.tinyBallExploding, CUE.tinyBallExploding + 15, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.15, 2.2, t), opacity: 1, revealLevel: 0.3};
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.55;
  }

  // ---- Beat 47 (261.18-269.46s): "That's not really what happened." -----
  // "Explosion freezes and reverses." Reverse motion (camera-side moves
  // back in, retracing).
  else if (frame < CUE.spaceExpanding) {
    const t = kf(frame, CUE.notWhatHappened, CUE.spaceExpanding, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(2.2, 0.3, t), opacity: 1, revealLevel: 0.3};
    s.starfieldOpacity = 0.25;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 48 (269.46-271.34s): "Space itself was expanding." ----------
  // "Entire grid expands everywhere simultaneously." Camera remains
  // embedded in grid (camera-side stays fixed inside it).
  else if (frame < CUE.earlyUniverseHot) {
    const t = kf(frame, CUE.spaceExpanding, CUE.earlyUniverseHot, 0, 1, true);
    s.grid = {
      visible: true,
      position: [0, -0.4, 0],
      rotation: [-Math.PI / 2, 0, 0],
      opacity: 1,
      warpStrength: 0.15,
      wellPosition: [0, 0],
      wellRadius: THREE.MathUtils.lerp(2, 6, t),
      wellDepth: 0.5,
    };
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 49 (271.34-275.32s): "The early universe was incredibly -----
  // hot and dense." "Bright compressed universe." Extreme close-up
  // (camera-side).
  else if (frame < CUE.universeCooled) {
    s.universe = {visible: true, position: ORIGIN, scale: 0.5, opacity: 1, revealLevel: 0.2};
    s.starfieldOpacity = 0.15;
    s.fillIntensity = 0.75;
  }

  // ---- Beat 50 (275.32-282.46s): "As space expanded, the universe -------
  // cooled." "Brightness fades as universe expands." Long time-lapse
  // (camera-side, slow pull back over the whole beat).
  else if (frame < CUE.blackHoleGoingBoom) {
    const t = kf(frame, CUE.universeCooled, CUE.blackHoleGoingBoom, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.5, 3, t), opacity: 1, revealLevel: THREE.MathUtils.lerp(0.2, 0.7, t)};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.15, 0.45, t);
    s.fillIntensity = THREE.MathUtils.lerp(0.75, 0.4, t);
  }

  // ---- Beat 51 (282.46-285.66s): "A black hole going boom? No." ---------
  // "Black hole explosion visual gets crossed out." Snap zoom (camera-side
  // fast in). The crossed-out X is a diagram annotation, not narration
  // text (see CrossOutState/Overlays.tsx).
  else if (frame < CUE.somethingStranger) {
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 1,
      opacity: 1,
      diskOpacity: 0.7,
      lensingOpacity: 1,
    };
    s.crossOut = {opacity: kf(frame, CUE.blackHoleGoingBoom + 6, CUE.blackHoleGoingBoom + 18, 0, 1, true)};
    s.starfieldOpacity = 0.35;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 52 (285.66-302.42s): "Something much stranger." -------------
  // "Black hole transitions smoothly into expanding spacetime." Slow morph
  // (camera-side gentle drift) — long hold before the next quoted line.
  else if (frame < CUE.whereIsHorizon) {
    const t = kf(frame, CUE.somethingStranger, CUE.whereIsHorizon, 0, 1, true);
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 1,
      opacity: 1 - t,
      diskOpacity: 0.7 * (1 - t),
      lensingOpacity: 1 - t,
    };
    s.grid = {
      visible: true,
      position: [0, -0.4, 0],
      rotation: [-Math.PI / 2, 0, 0],
      opacity: t,
      warpStrength: 0.2,
      wellPosition: [0, 0],
      wellRadius: 3,
      wellDepth: 0.6,
    };
    s.starfieldOpacity = 0.35;
    s.fillIntensity = 0.42;
  }

  // =====================================================================
  // WHERE IS THE EVENT HORIZON (beats 53-59)
  // =====================================================================

  // ---- Beat 53 (302.42-306.22s): "If we're inside a black hole, --------
  // where is the event horizon?" "Universe shown as a glowing expanding
  // bubble." Pull-back (camera-side).
  else if (frame < CUE.wheresTheEdge) {
    const t = kf(frame, CUE.whereIsHorizon, CUE.wheresTheEdge, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(3, 4.2, t), opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.48;
  }

  // ---- Beat 54 (306.22-307.54s): "Where's the edge?" --------------------
  // "Camera reaches apparent boundary... but nothing is there." Slow
  // approach (camera-side, push right up to the sphere surface).
  else if (frame < CUE.giantBlackSphere) {
    s.universe = {visible: true, position: ORIGIN, scale: 4.2, opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.48;
  }

  // ---- Beat 55 (307.54-316.64s): "Why don't we see a giant black -------
  // sphere?" "Telescope scans entire sky." 360deg pan (camera-side).
  else if (frame < CUE.notPhysicalWall) {
    s.telescope = {visible: true, position: [0, -0.6, 0], rotation: [0, 0, 0], scale: 1.2, opacity: 1};
    s.starfieldOpacity = 0.55;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 56 (316.64-320.82s): "An event horizon isn't a physical -----
  // wall." "Horizon represented as spacetime geometry rather than
  // surface." Camera passes through geometry.
  else if (frame < CUE.boundaryInSpacetime) {
    s.grid = {
      visible: true,
      position: [0, -0.8, 0],
      rotation: [-Math.PI / 2, 0, 0],
      opacity: 1,
      warpStrength: 0.55,
      wellPosition: [0, 0],
      wellRadius: 2.4,
      wellDepth: 2.6,
    };
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 57 (320.82-333.18s): "It's a boundary in spacetime." --------
  // "Light-cone diagram appears." Slow rotation (camera-side).
  else if (frame < CUE.seeBlackCircle) {
    const fadeIn = kf(frame, CUE.boundaryInSpacetime, CUE.boundaryInSpacetime + 15, 0, 1, true);
    s.lightCone = {visible: true, position: ORIGIN, rotation: [0, 0, 0], scale: 1.4, opacity: fadeIn};
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 58 (333.18-341.76s): "You wouldn't necessarily see a --------
  // black circle." "Black sphere fades away; normal universe remains."
  // Pull-back (camera-side).
  else if (frame < CUE.partOfGeometry) {
    const t = kf(frame, CUE.seeBlackCircle, CUE.seeBlackCircle + 15, 0, 1, true);
    s.universeAsBlackHole = {visible: true, position: ORIGIN, scale: 3, opacity: 1 - t};
    s.universe = {visible: true, position: ORIGIN, scale: 3, opacity: t, revealLevel: 1};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.46;
  }

  // ---- Beat 59 (341.76-361.66s): "The boundary is part of the -----------
  // geometry." "Entire universe bends subtly into geometric structure."
  // Wide orbit (camera-side) — long hold before the paper analogy begins.
  else if (frame < CUE.creatureOnPaper) {
    s.universe = {visible: true, position: ORIGIN, scale: 3.5, opacity: 1, revealLevel: 1};
    s.grid = {
      visible: true,
      position: [0, -4.5, 0],
      rotation: [-Math.PI / 2, 0, 0],
      opacity: 0.55,
      warpStrength: 0.4,
      wellPosition: [0, 0],
      wellRadius: 4.5,
      wellDepth: 1.6,
    };
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.46;
  }

  // =====================================================================
  // THE PAPER ANALOGY (beats 60-66)
  // =====================================================================

  // ---- Beat 60 (361.66-365.62s): "Imagine a creature living on a --------
  // sheet of paper." "Tiny 2D creature on glowing flat plane." Top-down
  // (camera-side).
  else if (frame < CUE.leftAndRight) {
    const fadeIn = kf(frame, CUE.creatureOnPaper, CUE.creatureOnPaper + 15, 0, 1, true);
    s.paper = {visible: true, position: ORIGIN, rotation: [-Math.PI / 2, 0, 0], scale: 1, opacity: fadeIn, size: 4};
    s.creature = {visible: true, position: [0, 0.02, 0], heading: 0, opacity: fadeIn};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 61 (365.62-369.98s): "It can move left and right..." --------
  // "Creature moves horizontally." Tracking (camera-side follows).
  else if (frame < CUE.noConceptOfUp) {
    const t = kf(frame, CUE.leftAndRight, CUE.noConceptOfUp, 0, 1, true, );
    s.paper = {visible: true, position: ORIGIN, rotation: [-Math.PI / 2, 0, 0], scale: 1, opacity: 1, size: 4};
    s.creature = {visible: true, position: [Math.sin(t * Math.PI * 2) * 1.2, 0.02, 0], heading: Math.cos(t * Math.PI * 2) >= 0 ? 0 : Math.PI, opacity: 1};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 62 (369.98-376.62s): "But has no concept of up." ------------
  // "Camera rises above paper while creature remains unaware." Vertical
  // crane up (camera-side).
  else if (frame < CUE.pickItUp) {
    s.paper = {visible: true, position: ORIGIN, rotation: [-Math.PI / 2, 0, 0], scale: 1, opacity: 1, size: 4};
    s.creature = {visible: true, position: [0, 0.02, 0], heading: 0, opacity: 1};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 63 (376.62-379.2s): "You pick it up..." ----------------------
  // "Giant hand lifts paper/creature." Slow upward movement (camera-side
  // follows the lift).
  else if (frame < CUE.creaturesPerspective) {
    const t = kf(frame, CUE.pickItUp, CUE.creaturesPerspective, 0, 1, true);
    const liftY = t * 1.6;
    s.paper = {visible: true, position: [0, liftY, 0], rotation: [-Math.PI / 2, 0, 0], scale: 1, opacity: 1, size: 4};
    s.creature = {visible: true, position: [0, liftY + 0.02, 0], heading: 0, opacity: 1};
    s.hand = {visible: true, position: [0, liftY + 0.9, 0], rotation: [0, 0, 0], scale: 1.6, opacity: 1};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 64 (379.2-389.4s): "From its perspective..." ----------------
  // "Creature sees impossible change in position." POV (camera-side, from
  // the creature's own low vantage looking up/around, disoriented).
  else if (frame < CUE.directionItCouldntAccess) {
    s.paper = {visible: true, position: [0, 1.6, 0], rotation: [-Math.PI / 2, 0, 0], scale: 1, opacity: 1, size: 4};
    s.creature = {visible: true, position: [0, 1.62, 0], heading: 0, opacity: 1};
    s.hand = {visible: true, position: [0, 2.5, 0], rotation: [0, 0, 0], scale: 1.6, opacity: 0.7};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 65 (389.4-394.16s): "You simply used a direction it ---------
  // couldn't access." "Third dimension visualized around the 2D world."
  // Large orbit (camera-side).
  else if (frame < CUE.intuitionWeNeed) {
    s.paper = {visible: true, position: [0, 1.6, 0], rotation: [-Math.PI / 2, 0, 0], scale: 1, opacity: 1, size: 4};
    s.creature = {visible: true, position: [0, 1.62, 0], heading: 0, opacity: 1};
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 66 (394.16-421.86s): "That's roughly the intuition..." ------
  // "Paper transforms into curved spacetime." Morph transition
  // (camera-side) — long hold before "what's outside" opens.
  else if (frame < CUE.whatsOutside) {
    const t = kf(frame, CUE.intuitionWeNeed, CUE.intuitionWeNeed + 20, 0, 1, true);
    s.paper = {visible: true, position: [0, 1.6, 0], rotation: [-Math.PI / 2, 0, 0], scale: 1, opacity: 1 - t, size: 4};
    s.grid = {
      visible: true,
      position: [0, 0.6, 0],
      rotation: [-Math.PI / 2, 0, 0],
      opacity: t,
      warpStrength: 0.5,
      wellPosition: [0, 0],
      wellRadius: 3,
      wellDepth: 2.2,
    };
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.42;
  }

  // =====================================================================
  // WHAT'S OUTSIDE OUR UNIVERSE (beats 67-75)
  // =====================================================================

  // ---- Beat 67 (421.86-426.06s): "What's outside our universe?" ---------
  // "Universe floating against complete darkness." Slow pull-back
  // (camera-side).
  else if (frame < CUE.doesntMakeSense) {
    s.universe = {visible: true, position: ORIGIN, scale: 2.6, opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.05;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 68 (426.06-434.32s): "Normally that question doesn't even ---
  // make sense." "Camera reaches boundary and has nowhere to go." Camera
  // stops (locked, per the beat's own explicit stationary direction).
  else if (frame < CUE.supposeInsideBlackHole) {
    s.universe = {visible: true, position: ORIGIN, scale: 2.6, opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.05;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 69 (434.32-439.92s): "But suppose we're inside a ------------
  // black hole." "Universe becomes nested inside enormous black hole."
  // Rapid zoom-out (camera-side).
  else if (frame < CUE.largerSpacetimeOutside) {
    const t = kf(frame, CUE.supposeInsideBlackHole, CUE.largerSpacetimeOutside, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(2.6, 0.7, t), opacity: 1, revealLevel: 1};
    s.universeAsBlackHole = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(2.6, 0.7, t), opacity: t};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.05, 0.4, t);
    s.fillIntensity = 0.4;
  }

  // ---- Beat 70 (439.92-445.08s): "Maybe there's a larger spacetime ------
  // outside." "Parent universe appears around it." Massive reveal
  // (camera-side pulls back to show a second, larger black hole around
  // the first).
  else if (frame < CUE.parentUniverseAgain) {
    const t = kf(frame, CUE.largerSpacetimeOutside, CUE.parentUniverseAgain, 0, 1, true);
    s.universeAsBlackHole = {visible: true, position: ORIGIN, scale: 0.7, opacity: 1};
    const fadeIn = kf(frame, CUE.largerSpacetimeOutside + 6, CUE.parentUniverseAgain, 0, 1, true);
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: THREE.MathUtils.lerp(3, 7, t),
      opacity: fadeIn,
      diskOpacity: fadeIn * 0.6,
      lensingOpacity: fadeIn,
    };
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 71 (445.08-462.3s): "A parent universe." ---------------------
  // "Multiple cosmic structures appear." Wide orbit (camera-side) — long
  // hold; the cosmic-family-tree motif seeded early via CosmicTree.
  else if (frame < CUE.theyDSeeBlackHole) {
    s.universeAsBlackHole = {visible: true, position: ORIGIN, scale: 0.7, opacity: 1};
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 7,
      opacity: 1,
      diskOpacity: 0.6,
      lensingOpacity: 1,
    };
    const growth = kf(frame, CUE.theyDSeeBlackHole - 90, CUE.theyDSeeBlackHole, 0, 0.4, true);
    s.cosmicTree = {visible: true, position: [0, -8, -6], rotation: [0, 0.4, 0], scale: 1.4, opacity: 0.7, growth};
    s.starfieldOpacity = 0.55;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 72 (462.3-463.4s): "They'd see a black hole." ---------------
  // "Parent observer looks at our universe's black hole." Over-the-
  // shoulder (camera-side).
  else if (frame < CUE.meanwhileInside) {
    s.blackHole = {
      visible: true,
      position: [0, 0, -5],
      rotation: [-0.4, 0.32, 0.08],
      scale: 1.6,
      opacity: 1,
      diskOpacity: 0.7,
      lensingOpacity: 1,
    };
    s.silhouette = {visible: true, position: [0, 0, 1.2], rotation: [0, Math.PI, 0], scale: 1, opacity: 1, lookUp: 0};
    s.starfieldOpacity = 0.45;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 73 (463.4-466.84s): "Meanwhile, inside..." -------------------
  // "Camera dives back through horizon." Match cut (camera-side, push
  // through, brief dark).
  else if (frame < CUE.thisIsTheUniverse) {
    const t = kf(frame, CUE.meanwhileInside, CUE.thisIsTheUniverse, 0, 1, true);
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 1.6,
      opacity: 1 - t,
      diskOpacity: 0,
      lensingOpacity: 0.5 * (1 - t),
    };
    s.starfieldOpacity = THREE.MathUtils.lerp(0.45, 0.1, t);
    s.fillIntensity = THREE.MathUtils.lerp(0.42, 0.25, t);
  }

  // ---- Beat 74 (466.84-470.6s): "We're looking around saying: This is ---
  // the universe." "Earth appears." Slow planetary orbit (camera-side).
  else if (frame < CUE.differentPerspectives) {
    const earthIn = kf(frame, CUE.thisIsTheUniverse, CUE.thisIsTheUniverse + 12, 0, 1, true);
    s.earth = {visible: true, position: ORIGIN, rotation: [0, frame * 0.008, 0], scale: 1.2, opacity: earthIn};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 75 (470.6-490.88s): "Same structure. Different -------------
  // perspectives." "Split-screen parent universe / inner universe." Slow
  // synchronized zoom (camera-side pulls back to reveal both sides).
  else if (frame < CUE.couldWeProve) {
    s.blackHole = {
      visible: true,
      position: [-3, 0, 0],
      rotation: [-0.4, 0.32, 0.08],
      scale: 0.8,
      opacity: 1,
      diskOpacity: 0.6,
      lensingOpacity: 1,
    };
    s.earth = {visible: true, position: [3, 0, 0], rotation: [0, frame * 0.008, 0], scale: 0.8, opacity: 1};
    s.starfieldOpacity = 0.45;
    s.fillIntensity = 0.46;
  }

  // =====================================================================
  // CAN WE PROVE IT (beats 76-84)
  // =====================================================================

  // ---- Beat 76 (490.88-498.72s): "Could we ever prove we're inside a ----
  // black hole?" "Telescope looking into deep space." Push toward lens
  // (camera-side).
  else if (frame < CUE.beyondCausalHorizon) {
    s.telescope = {visible: true, position: [0, -0.3, 0], rotation: [0, 0.3, 0], scale: 1.4, opacity: 1};
    s.starfieldOpacity = 0.55;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 77 (498.72-503.22s): "If the outside is beyond our ----------
  // causal horizon..." "Light cone surrounds observable universe." Orbit
  // (camera-side).
  else if (frame < CUE.biggerTelescope) {
    s.universe = {visible: true, position: ORIGIN, scale: 1.2, opacity: 1, revealLevel: 1};
    s.lightCone = {visible: true, position: ORIGIN, rotation: [0, 0, 0], scale: 2.6, opacity: 0.85};
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 78 (503.22-510.64s): "We can't just build a bigger ----------
  // telescope." "Telescope grows enormous." Zoom out (camera-side).
  else if (frame < CUE.infoCantReachUs) {
    const t = kf(frame, CUE.biggerTelescope, CUE.infoCantReachUs, 0, 1, true);
    s.telescope = {visible: true, position: [0, -0.3, 0], rotation: [0, 0.3, 0], scale: THREE.MathUtils.lerp(1.4, 6, t), opacity: 1};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 79 (510.64-517.6s): "If information can't reach us..." ------
  // "Signals stop at boundary." Follow signal (camera-side) — the shared
  // LightBeam reused as an outbound signal that draws, then stalls/fades.
  else if (frame < CUE.indirectEvidence) {
    const drawEnd = kf(frame, CUE.infoCantReachUs, CUE.infoCantReachUs + 25, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: 1, opacity: 1, revealLevel: 1};
    s.lightBeam = {progress: drawEnd, opacity: kf(frame, CUE.indirectEvidence - 10, CUE.indirectEvidence, 1, 0, true)};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 80 (517.6-525.32s): "We'd have to look for indirect ---------
  // evidence." "CMB map appears." Camera sweep (camera-side, lateral).
  else if (frame < CUE.particularPatterns) {
    const fadeIn = kf(frame, CUE.indirectEvidence, CUE.indirectEvidence + 15, 0, 1, true);
    s.cmb = {visible: true, position: ORIGIN, rotation: [0, 0, 0], scale: 2.4, opacity: fadeIn};
    s.starfieldOpacity = 0.15;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 81 (525.32-530.16s): "Patterns in the cosmic microwave ------
  // background." "CMB pattern highlights anomalies." Macro zoom
  // (camera-side).
  else if (frame < CUE.geometryOfUniverse) {
    s.cmb = {visible: true, position: ORIGIN, rotation: [0, 0, 0], scale: 2.4, opacity: 1};
    s.starfieldOpacity = 0.1;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 82 (530.16-537.16s): "Geometry of our universe." ------------
  // "Cosmic geometry changes shape." Slow rotation (camera-side).
  else if (frame < CUE.specificPrediction) {
    const crossfade = kf(frame, CUE.geometryOfUniverse, CUE.geometryOfUniverse + 15, 0, 1, true);
    s.cmb = {visible: true, position: ORIGIN, rotation: [0, 0, 0], scale: 2.4, opacity: 1 - crossfade};
    s.grid = {
      visible: true,
      position: [0, -2.4, 0],
      rotation: [-Math.PI / 2, 0, 0],
      opacity: crossfade,
      warpStrength: 0.5,
      wellPosition: [0, 0],
      wellRadius: 3.4,
      wellDepth: 2,
    };
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.45;
  }

  // ---- Beat 83 (537.16-555.6s): "A future theory could make a -----------
  // prediction." "Equation -> predicted cosmic signature." Push through
  // equation (camera-side). On-screen diagram text per the storyboard.
  else if (frame < CUE.hypothesisPredictionTest) {
    s.equation = {text: 'ΔT/T ~ f(κ, Ω) → predicted CMB signature', opacity: 1, warp: 0};
    const cmbIn = kf(frame, CUE.specificPrediction + 15, CUE.hypothesisPredictionTest, 0, 1, true);
    s.cmb = {visible: true, position: ORIGIN, rotation: [0, 0, 0], scale: 2.2, opacity: cmbIn};
    s.starfieldOpacity = 0.15;
    s.fillIntensity = 0.48;
  }

  // ---- Beat 84 (555.6-572.12s): "That's the difference between an -------
  // idea and a scientific theory." "HYPOTHESIS -> PREDICTION -> TEST."
  // Sequential camera movement (camera-side steps between three
  // positions as each stage lights up). On-screen diagram text per the
  // storyboard.
  else if (frame < CUE.bookIntoBlackHole) {
    const shotStart = CUE.hypothesisPredictionTest;
    const shotEnd = CUE.bookIntoBlackHole;
    const span = shotEnd - shotStart;
    const stageF = kf(frame, shotStart, shotStart + span * 0.7, 0, 2, true);
    s.hpt = {stage: Math.floor(THREE.MathUtils.clamp(stageF, 0, 2)), opacity: kf(frame, shotStart, shotStart + 12, 0, 1, true)};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.42;
  }

  // =====================================================================
  // THE INFORMATION PROBLEM (beats 85-92)
  // =====================================================================

  // ---- Beat 85 (572.12-575.84s): "Think of throwing a book into a -------
  // black hole." "Book falls toward horizon." Tracking shot (camera-side).
  else if (frame < CUE.bookContainsInfo) {
    const t = kf(frame, CUE.bookIntoBlackHole, CUE.bookContainsInfo, 0, 1, true);
    s.blackHole = {
      visible: true,
      position: [0, 0, -3],
      rotation: [-0.4, 0.32, 0.08],
      scale: 1.6,
      opacity: 1,
      diskOpacity: 0.7,
      lensingOpacity: 1,
    };
    s.book = {visible: true, position: [0, 0, THREE.MathUtils.lerp(2.4, 0.3, t)], rotation: [0.2, t * 4, 0], scale: 1, opacity: 1, dissolveProgress: 0};
    s.starfieldOpacity = 0.3;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 86 (575.84-600.36s): "The book contains information." -------
  // "Pages transform into letters -> molecules -> quantum states."
  // Extreme macro zoom (camera-side).
  else if (frame < CUE.whatHappensToInfo) {
    const t = kf(frame, CUE.bookContainsInfo, CUE.whatHappensToInfo, 0, 1, true);
    s.book = {visible: true, position: ORIGIN, rotation: [0.2, t * 4, 0], scale: 1, opacity: 1, dissolveProgress: t};
    s.starfieldOpacity = 0.15;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 87 (600.36-603.06s): "What happens to all that -------------
  // information?" "Book disappears." Hard cut (camera-side snaps to a
  // fresh, static position).
  else if (frame < CUE.hawkingMadeWorse) {
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 1,
      opacity: 1,
      diskOpacity: 0,
      lensingOpacity: 1,
    };
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 88 (603.06-605.98s): "Then Stephen Hawking made the ---------
  // problem worse." "Hawking radiation begins around horizon." Orbit
  // (camera-side).
  else if (frame < CUE.emitRadiation) {
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 1,
      opacity: 1,
      diskOpacity: 0,
      lensingOpacity: 1,
    };
    s.hawking = {opacity: kf(frame, CUE.hawkingMadeWorse, CUE.hawkingMadeWorse + 15, 0, 1, true), progress: 0.1};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 89 (605.98-619.44s): "Black holes emit radiation." ----------
  // "Particles stream outward." Follow particles (camera-side).
  else if (frame < CUE.couldEvaporate) {
    const t = kf(frame, CUE.emitRadiation, CUE.couldEvaporate, 0, 1, true);
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 1,
      opacity: 1,
      diskOpacity: 0,
      lensingOpacity: 1,
    };
    s.hawking = {opacity: 1, progress: 0.1 + t * 0.8};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 90 (619.44-623s): "They can eventually evaporate." ----------
  // "Black hole shrinks over immense timescale." Time-lapse (camera-side,
  // slow gentle drift as it shrinks).
  else if (frame < CUE.blackHoleDisappears) {
    const t = kf(frame, CUE.couldEvaporate, CUE.blackHoleDisappears, 0, 1, true);
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: THREE.MathUtils.lerp(1, 0.3, t),
      opacity: 1,
      diskOpacity: 0,
      lensingOpacity: 1,
    };
    s.hawking = {opacity: 1 - t * 0.3, progress: 0.7};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 91 (623-627.98s): "So imagine the black hole disappears." ---
  // "Black hole fades completely." Slow pull-back (camera-side).
  else if (frame < CUE.whereDidItGo) {
    const t = kf(frame, CUE.blackHoleDisappears, CUE.whereDidItGo, 0, 1, true);
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 0.3,
      opacity: 1 - t,
      diskOpacity: 0,
      lensingOpacity: (1 - t) * 0.5,
    };
    s.starfieldOpacity = THREE.MathUtils.lerp(0.4, 0.15, t);
    s.fillIntensity = THREE.MathUtils.lerp(0.4, 0.2, t);
  }

  // ---- Beat 92 (627.98-692.14s): "Where did the information go?" -------
  // "One glowing question in darkness." Locked camera (explicitly
  // stationary per the beat) — a single small glowing point is the only
  // thing on screen; long hold before the family-tree section opens.
  else if (frame < CUE.blackHolesCreateMany) {
    const pulse = 0.7 + 0.3 * Math.sin(frame * 0.04);
    s.universe = {visible: true, position: ORIGIN, scale: 0.1 * pulse, opacity: 1, revealLevel: 0};
    s.starfieldOpacity = 0.08;
    s.fillIntensity = 0.15;
  }

  // =====================================================================
  // THE COSMIC FAMILY TREE (beats 93-100)
  // =====================================================================

  // ---- Beat 93 (692.14-700.42s): "What if black holes can create -------
  // many universes?" "One universe appears." Wide shot (camera-side
  // settles).
  else if (frame < CUE.starsFormDie) {
    const fadeIn = kf(frame, CUE.blackHolesCreateMany, CUE.blackHolesCreateMany + 15, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: 2, opacity: fadeIn, revealLevel: 0.5};
    s.starfieldOpacity = 0.35;
    s.fillIntensity = 0.45;
  }

  // ---- Beat 94 (700.42-701.6s): "Stars form..." --------------------------
  // "Stars ignite." Time-lapse (camera-side slow drift) — manual split,
  // one continuous transcript sentence with beat 95.
  else if (frame < CUE.collapseIntoBlackHoles) {
    s.universe = {visible: true, position: ORIGIN, scale: 2, opacity: 1, revealLevel: 1};
    s.sun = {visible: true, position: [1.1, 0.4, 0.8], scale: 0.3, opacity: kf(frame, CUE.starsFormDie, CUE.collapseIntoBlackHoles, 0, 1, true)};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.48;
  }

  // ---- Beat 95 (701.6-708.32s): "Some collapse into black holes." -------
  // "Stars collapse." Rapid zoom (camera-side).
  else if (frame < CUE.producingNewUniverses) {
    const t = kf(frame, CUE.collapseIntoBlackHoles, CUE.collapseIntoBlackHoles + 10, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: 2, opacity: 1, revealLevel: 1};
    s.sun = {visible: true, position: [1.1, 0.4, 0.8], scale: THREE.MathUtils.lerp(0.3, 0.08, t), opacity: 1 - t};
    s.blackHole = {
      visible: true,
      position: [1.1, 0.4, 0.8],
      rotation: [-0.4, 0.32, 0.08],
      scale: 0.15,
      opacity: t,
      diskOpacity: t * 0.5,
      lensingOpacity: t,
    };
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.46;
  }

  // ---- Beat 96 (708.32-712.18s): "And perhaps those create new ----------
  // universes." "Each black hole sprouts a tiny expanding universe."
  // Nested zoom (camera-side pushes through the small black hole into a
  // tiny universe within it).
  else if (frame < CUE.universesFormStars) {
    s.blackHole = {
      visible: true,
      position: [1.1, 0.4, 0.8],
      rotation: [-0.4, 0.32, 0.08],
      scale: 0.15,
      opacity: 1,
      diskOpacity: 0.5,
      lensingOpacity: 1,
    };
    const t = kf(frame, CUE.producingNewUniverses, CUE.universesFormStars, 0, 1, true);
    s.universeAsBlackHole = {visible: true, position: [1.1, 0.4, 0.8], scale: 0.15 * (1 + t), opacity: t};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.46;
  }

  // ---- Beat 97 (712.18-714.32s): "Those universes form stars..." --------
  // "New universe develops stars." Accelerated evolution (camera-side
  // push).
  else if (frame < CUE.starsFormMoreBlackHoles) {
    const t = kf(frame, CUE.universesFormStars, CUE.starsFormMoreBlackHoles, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(2, 3, t), opacity: 1, revealLevel: 1};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.4, 0.55, t);
    s.fillIntensity = 0.48;
  }

  // ---- Beat 98 (714.32-717.4s): "Those stars form more black holes." ----
  // "More black holes appear." Pull-back (camera-side) — CosmicTree's
  // glowing nodes stand in for the newly-formed black holes.
  else if (frame < CUE.moreUniverses) {
    const growth = kf(frame, CUE.starsFormMoreBlackHoles, CUE.moreUniverses, 0, 0.4, true);
    s.cosmicTree = {visible: true, position: [0, -2, -3], rotation: [0, 0.2, 0], scale: 1.6, opacity: 1, growth};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 99 (717.4-721.12s): "And even more universes." --------------
  // "Cosmic branching structure grows." Massive zoom-out (camera-side).
  else if (frame < CUE.cosmicFamilyTree) {
    const growth = kf(frame, CUE.moreUniverses, CUE.cosmicFamilyTree, 0.4, 0.75, true);
    s.cosmicTree = {visible: true, position: [0, -2, -3], rotation: [0, 0.2, 0], scale: 1.6, opacity: 1, growth};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 100 (721.12-741.82s): "A cosmic family tree." ---------------
  // "Entire branching universe tree fills screen." Slow orbital camera
  // (camera-side) — long hold before the final payoff opens.
  else if (frame < CUE.notSingleIsolated) {
    const growth = kf(frame, CUE.cosmicFamilyTree, CUE.cosmicFamilyTree + 20, 0.75, 1, true);
    s.cosmicTree = {visible: true, position: [0, -2, -3], rotation: [0, 0.2, 0], scale: 1.6, opacity: 1, growth};
    s.starfieldOpacity = 0.45;
    s.fillIntensity = 0.42;
  }

  // =====================================================================
  // FINAL PAYOFF (beats 101-109)
  // =====================================================================

  // ---- Beat 101 (741.82-746.1s): "Maybe the universe isn't a single ----
  // isolated thing." "Our universe surrounded by countless others."
  // Extreme pull-back (camera-side).
  else if (frame < CUE.realityMuchBigger) {
    s.cosmicTree = {visible: true, position: [0, -2, -3], rotation: [0, 0.2, 0], scale: 1.6, opacity: 0.7, growth: 1};
    s.universe = {visible: true, position: ORIGIN, scale: 1, opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.55;
    s.fillIntensity = 0.45;
  }

  // ---- Beat 102 (746.1-747.3s): "Maybe reality is much bigger..." -------
  // "Camera continues pulling through nested universes." Infinite
  // zoom-out (camera-side) — manual split, continuous sentence with 103.
  else if (frame < CUE.partWeExperience) {
    s.cosmicTree = {visible: true, position: [0, -2, -3], rotation: [0, 0.2, 0], scale: 2.2, opacity: 0.6, growth: 1};
    s.universe = {visible: true, position: ORIGIN, scale: 0.7, opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.6;
    s.fillIntensity = 0.42;
  }

  // ---- Beat 103 (747.3-750.04s): "...than the part we're able to --------
  // experience." "Observable universe becomes tiny." Further pull-back
  // (camera-side).
  else if (frame < CUE.beginningOfUniverse) {
    const t = kf(frame, CUE.partWeExperience, CUE.beginningOfUniverse, 0, 1, true);
    s.cosmicTree = {visible: true, position: [0, -2, -3], rotation: [0, 0.2, 0], scale: THREE.MathUtils.lerp(2.2, 3, t), opacity: 0.6, growth: 1};
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.7, 0.25, t), opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.6;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 104 (750.04-752.92s): "Maybe what we call the beginning..." -
  // "Big Bang visual rewinds." Reverse time-lapse (camera-side pushes in
  // as the visual shrinks, as if rewinding to the earlier hot/dense
  // beat).
  else if (frame < CUE.beginningOfOurCorner) {
    const t = kf(frame, CUE.beginningOfUniverse, CUE.beginningOfOurCorner, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: THREE.MathUtils.lerp(0.25, 0.08, t), opacity: 1, revealLevel: THREE.MathUtils.lerp(1, 0.1, t)};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.6, 0.2, t);
    s.fillIntensity = THREE.MathUtils.lerp(0.4, 0.6, t);
  }

  // ---- Beat 105 (752.92-757.38s): "...was only the beginning of our -----
  // particular corner of reality." "Big Bang becomes a branching point in
  // cosmic tree." Orbit around branch (camera-side).
  else if (frame < CUE.areWeInsideBlackHole) {
    const t = kf(frame, CUE.beginningOfOurCorner, CUE.beginningOfOurCorner + 15, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: 0.08, opacity: 1 - t, revealLevel: 0.1};
    s.cosmicTree = {visible: true, position: ORIGIN, rotation: [0, 0.2, 0], scale: 0.5, opacity: t, growth: 0.3};
    s.starfieldOpacity = 0.2;
    s.fillIntensity = 0.4;
  }

  // ---- Beat 106 (757.38-760s): "So... are we inside a black hole?" ------
  // "Return to Earth." Slow push toward planet (camera-side).
  else if (frame < CUE.noWayToTellYes) {
    const fadeIn = kf(frame, CUE.areWeInsideBlackHole, CUE.areWeInsideBlackHole + 12, 0, 1, true);
    s.earth = {visible: true, position: ORIGIN, rotation: [0, frame * 0.008, 0], scale: 1.4, opacity: fadeIn};
    s.starfieldOpacity = 0.45;
    s.fillIntensity = 0.5;
  }

  // ---- Beat 107 (760-763.8s): "Right now, there's no way for me to ------
  // honestly tell you yes." "Earth fades into darkness." Camera slowly
  // pulls away (camera-side).
  else if (frame < CUE.loopHold) {
    const t = kf(frame, CUE.noWayToTellYes, CUE.loopHold, 0, 1, true);
    s.earth = {visible: true, position: ORIGIN, rotation: [0, frame * 0.008, 0], scale: 1.4, opacity: 1 - t};
    s.starfieldOpacity = THREE.MathUtils.lerp(0.45, 0.15, t);
    s.fillIntensity = THREE.MathUtils.lerp(0.5, 0.15, t);
  }

  // ---- Beat 108 (763.8-764.8s): [no voice line] "Tiny black hole --------
  // appears where Earth was." Hold for 1 second (explicitly stationary
  // per the beat).
  else if (frame < CUE.loopTransform) {
    const fadeIn = kf(frame, CUE.loopHold, CUE.loopHold + 12, 0, 1, true);
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 0.35,
      opacity: fadeIn,
      diskOpacity: 0,
      lensingOpacity: fadeIn * 0.6,
    };
    s.starfieldOpacity = 0.15;
    s.fillIntensity = 0.15;
  }

  // ---- Beat 109 (764.8-767.8s): [no voice line] "Black hole transforms --
  // into the opening tiny point of light." Seamless loop — crossfades
  // into exactly beat 1's starting state so the loop back to frame 0 is
  // invisible.
  else {
    const t = kf(frame, CUE.loopTransform, CUE.loopEnd, 0, 1, true);
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-0.4, 0.32, 0.08],
      scale: 0.35,
      opacity: 1 - t,
      diskOpacity: 0,
      lensingOpacity: (1 - t) * 0.6,
    };
    s.universe = {visible: true, position: ORIGIN, scale: 0.35, opacity: t, revealLevel: 0};
    s.starfieldOpacity = 0.15;
    s.fillIntensity = THREE.MathUtils.lerp(0.15, 0.15, t);
  }

  return s;
};

export {DURATION_IN_FRAMES};
