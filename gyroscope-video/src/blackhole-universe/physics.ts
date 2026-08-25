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

export interface SceneState {
  universe: NestedUniverseState | null;
  universeAsBlackHole: BHSilhouetteState | null;
  blackHole: BHState | null;
  grid: GridState | null;
  infall: InfallState | null;
  lightBeam: LightBeamState | null;
  earth: Obj3DState;
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

const baseState = (): SceneState => ({
  universe: HIDDEN_UNIVERSE,
  universeAsBlackHole: HIDDEN_BH,
  blackHole: HIDDEN_FULL_BH,
  grid: HIDDEN_GRID,
  infall: null,
  lightBeam: null,
  earth: HIDDEN3D,
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
  else if (frame < CUE.section3Start) {
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

  return s;
};

export {DURATION_IN_FRAMES};
