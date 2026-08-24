/**
 * Pure, deterministic choreography for "What If Our Entire Universe Is
 * Inside a Black Hole?" — same architecture as every other video in this
 * project: everything is a function of the absolute frame number only.
 *
 * Built section-by-section (see timing.ts) — only Section 1 (beats 1-6) is
 * implemented so far. getSceneState returns a HIDDEN/neutral state for any
 * frame past what's been built yet.
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

/** Full black hole state (event horizon + disk + halo), for Section 2's
 * "classic black hole" establishing shots — distinct from the lighter-
 * weight BHSilhouetteState used for the "our universe looks like a black
 * hole from outside" motif in Section 1. */
export interface BHState {
  visible: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  opacity: number;
  diskOpacity: number;
  haloOpacity: number;
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
  rotation: [0, 0, 0],
  scale: 1,
  opacity: 0,
  diskOpacity: 0,
  haloOpacity: 0,
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
  fillIntensity: 0.15,
});

export const getSceneState = (frame: number): SceneState => {
  const s = baseState();

  // ---- Beat 1 (0-5.5s): absolute darkness, tiny point of light appears --
  // "This is a weird one. What if our entire universe is inside a black
  // hole?" — extremely slow push-in (camera-side). The point itself fades
  // in over the first few frames so frame 0 isn't a hard pop from nothing,
  // but stays a bare, glowing, unrevealed point throughout the beat.
  if (frame < CUE.pointExpands) {
    const fadeIn = kf(frame, CUE.hook, CUE.hook + 12, 0, 1, true);
    s.universe = {visible: true, position: ORIGIN, scale: 0.35, opacity: fadeIn, revealLevel: 0};
    s.fillIntensity = 0.1;
  }

  // ---- Beat 2 (5.5-13.1s): point expands into galaxies/stars/Earth ------
  // "I mean that literally. What if everything we can see, from the galaxy
  // to the star, planet, even you sitting there watching this" — the
  // enumeration IS the zoom-out's stops, so Earth briefly appears right as
  // "planet"/"you" land (~9.5-13.1s) alongside the expanding galaxy cluster.
  else if (frame < CUE.flyPastCosmicWeb) {
    const shotStart = CUE.pointExpands;
    const shotEnd = CUE.flyPastCosmicWeb;
    const reveal = kf(frame, shotStart, shotEnd, 0, 0.7);
    const scale = kf(frame, shotStart, shotEnd, 0.35, 3.2);
    s.universe = {visible: true, position: ORIGIN, scale, opacity: 1, revealLevel: reveal};

    const earthCue = shotStart + (shotEnd - shotStart) * 0.55; // "...planet..."
    if (frame >= earthCue) {
      const earthIn = kf(frame, earthCue, earthCue + 15, 0, 1, true);
      const earthOut = kf(frame, shotEnd - 10, shotEnd, 1, 0, true);
      s.earth = {
        visible: true,
        position: [1.6, -0.4, 1.2],
        rotation: [0, frame * 0.01, 0],
        scale: 0.28,
        opacity: earthIn * earthOut,
      };
    }
    s.fillIntensity = kf(frame, shotStart, shotEnd, 0.1, 0.3);
  }

  // ---- Beat 3 (13.1-19.5s): fly past Earth -> Solar System -> Milky Way -
  // -> cosmic web, continuous pull-back. "...is actually on the inside of
  // a black hole that exists in some much larger universe?" Earth is
  // already gone (left behind); the galaxy cluster keeps growing/revealing
  // toward the full "cosmic web" read.
  else if (frame < CUE.observableUniverseSphere) {
    const shotStart = CUE.flyPastCosmicWeb;
    const shotEnd = CUE.observableUniverseSphere;
    const reveal = kf(frame, shotStart, shotEnd, 0.7, 1);
    const scale = kf(frame, shotStart, shotEnd, 3.2, 6.5);
    s.universe = {visible: true, position: ORIGIN, scale, opacity: 1, revealLevel: reveal};
    s.starfieldOpacity = kf(frame, shotStart, shotEnd, 0, 0.5);
    s.fillIntensity = 0.3;
  }

  // ---- Beat 4 (19.5-22.9s): observable universe = glowing sphere, orbit -
  // "Now, I know what you're probably thinking. How's that even possible?"
  else if (frame < CUE.universeAsBlackHoleRegion) {
    s.universe = {visible: true, position: ORIGIN, scale: 6.5, opacity: 1, revealLevel: 1};
    s.starfieldOpacity = 0.5;
    s.fillIntensity = 0.3;
  }

  // ---- Beat 5 (22.9-32.4s): pull back further — our universe now reads --
  // as a small black-hole-like region in a larger cosmic environment.
  // "Because when we think about a black hole, we usually picture this
  // giant dark object somewhere out in space, pulling everything toward
  // it." Deliberate dramatic irony: the classic-misconception line lands
  // exactly as our own universe, from outside, starts looking like that
  // cliché. Crossfade NestedUniverse (glowing) -> BlackHole silhouette
  // (dark, thin halo) as the object shrinks and the starfield around it
  // grows denser (bigger cosmic environment).
  else if (frame < CUE.hardCutToBlack) {
    const shotStart = CUE.universeAsBlackHoleRegion;
    const shotEnd = CUE.hardCutToBlack;
    const t = kf(frame, shotStart, shotEnd, 0, 1, true);
    const crossfade = kf(frame, shotStart, shotStart + (shotEnd - shotStart) * 0.5, 0, 1);
    // Scale endpoint tuned against the actual camera distance in
    // cameraTimeline.ts (not picked independently): the first pass shrank
    // this to 0.9 while the camera retreated to distance ~96, which
    // checked out fine at t=0.6 (frame 800, still clearly a readable
    // haloed sphere) but by t=1 (frame 900+) had shrunk to a ~15px-radius
    // smudge indistinguishable from a background star — confirmed via a
    // direct still-frame check, not just angular-size arithmetic. Fixed by
    // keeping BOTH the endpoint scale (0.9->1.3) and the camera's final
    // distance (~96->~55, see cameraTimeline.ts) less extreme, so the
    // halo's screen-space radius stays >= ~40px through the whole beat —
    // "small... region" per the beat description, not "invisible."
    const scale = THREE.MathUtils.lerp(6.5, 1.3, t);
    s.universe = {
      visible: true,
      position: ORIGIN,
      scale,
      opacity: 1 - crossfade,
      revealLevel: 1,
    };
    s.universeAsBlackHole = {visible: true, position: ORIGIN, scale, opacity: crossfade};
    s.starfieldOpacity = kf(frame, shotStart, shotEnd, 0.5, 1);
    s.fillIntensity = kf(frame, shotStart, shotEnd, 0.3, 0.12);
  }

  // ---- Beat 6 (32.4-39.0s): hard cut to black ----------------------------
  // "But that's not really what a black hole is... this whole idea starts
  // getting a lot more interesting." NOT a brief punctuation flash — held
  // black for the rest of section 1, a deliberate suspenseful pause before
  // section 2's reveal (see timing.ts's note). Everything snaps to
  // invisible within a couple of frames (a real hard cut, not a fade).
  else if (frame < CUE.blackHoleIntro) {
    const cut = kf(frame, CUE.hardCutToBlack, CUE.hardCutToBlack + 2, 1, 0, true);
    s.universeAsBlackHole = {visible: true, position: ORIGIN, scale: 1.3, opacity: cut};
    s.starfieldOpacity = cut * 1;
    s.fillIntensity = 0.02;
  }

  // ---- Beat 7 (39.02-42.4s): classic black hole + accretion disk --------
  // "You see, a black hole is basically a region of space" — the first
  // proper close-up reveal of the reused BlackHole component (event
  // horizon + disk + halo), establishing the object section 2 explains.
  else if (frame < CUE.fallingMatter) {
    const shotStart = CUE.blackHoleIntro;
    const fadeIn = kf(frame, shotStart, shotStart + 15, 0, 1, true);
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-1.35, 0, 0],
      scale: 1,
      opacity: fadeIn,
      diskOpacity: fadeIn,
      haloOpacity: fadeIn * 0.5,
    };
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.35;
  }

  // ---- Beat 8 (42.4-45.72s): gas curves in, follow falling particles ----
  // "where gravity has become so extreme" — the disk/halo stay visible
  // while individual bright particles visibly spiral inward.
  else if (frame < CUE.freezeToGrid) {
    const shotStart = CUE.fallingMatter;
    const shotEnd = CUE.freezeToGrid;
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-1.35, 0, 0],
      scale: 1,
      opacity: 1,
      diskOpacity: 1,
      haloOpacity: 0.5,
    };
    s.infall = {opacity: kf(frame, shotStart, shotStart + 10, 0, 1, true), progress: kf(frame, shotStart, shotEnd, 0, 1, true)};
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.35;
  }

  // ---- Beat 9 (45.72-50.66s): freeze, transform into spacetime geometry -
  // "that once you cross a certain boundary, you just can't get back out."
  // The black hole crossfades into the reused SpacetimeGrid — the "freeze"
  // reads as the disk/infall holding still while the grid fades up under it.
  else if (frame < CUE.gridSteepens) {
    const shotStart = CUE.freezeToGrid;
    const shotEnd = CUE.gridSteepens;
    const crossfade = kf(frame, shotStart, shotEnd, 0, 1);
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-1.35, 0, 0],
      scale: 1,
      opacity: 1 - crossfade,
      diskOpacity: 1 - crossfade,
      haloOpacity: 0.5 * (1 - crossfade),
    };
    s.infall = {opacity: 1 - crossfade, progress: 1};
    s.grid = {
      visible: true,
      position: [0, -1.2, 0],
      rotation: [-Math.PI / 2, 0, 0],
      opacity: crossfade,
      warpStrength: crossfade * 0.6,
      wellPosition: [0, 0],
      wellRadius: 3,
      wellDepth: 2,
    };
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.3;
  }

  // ---- Beat 10 (50.66-56.18s): grid bends increasingly steep -------------
  // "And I mean anything. You could have the fastest spaceship imaginable,
  // and it wouldn't even matter." — the well deepens/narrows as she piles
  // on emphasis, top-down descent (camera-side).
  else if (frame < CUE.horizonForms) {
    const shotStart = CUE.gridSteepens;
    const shotEnd = CUE.horizonForms;
    s.grid = {
      visible: true,
      position: [0, -1.2, 0],
      rotation: [-Math.PI / 2, 0, 0],
      opacity: 1,
      warpStrength: kf(frame, shotStart, shotEnd, 0.6, 1.3),
      wellPosition: [0, 0],
      wellRadius: kf(frame, shotStart, shotEnd, 3, 2.1),
      wellDepth: kf(frame, shotStart, shotEnd, 2, 4.5),
    };
    s.starfieldOpacity = 0.4;
    s.fillIntensity = 0.3;
  }

  // ---- Beat 11 (56.18-58.44s): bright circular event horizon forms ------
  // "Nothing can escape this, not even light." Grid fades out as a bare,
  // bright horizon fades in — push toward it (camera-side).
  else if (frame < CUE.lightBendsIn) {
    const shotStart = CUE.horizonForms;
    const shotEnd = CUE.lightBendsIn;
    const t = kf(frame, shotStart, shotEnd, 0, 1, true);
    s.grid = {
      visible: true,
      position: [0, -1.2, 0],
      rotation: [-Math.PI / 2, 0, 0],
      opacity: 1 - t,
      warpStrength: 1.3,
      wellPosition: [0, 0],
      wellRadius: 2.1,
      wellDepth: 4.5,
    };
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-1.35, 0, 0],
      scale: 1,
      opacity: t,
      diskOpacity: 0,
      haloOpacity: t * 0.9,
    };
    s.starfieldOpacity = kf(frame, shotStart, shotEnd, 0.4, 0.6);
    s.fillIntensity = 0.25;
  }

  // ---- Beat 12 (58.44-60.5s): light beam bends inward, fades out ---------
  // "And that boundary is called..." (first half) — follow the light.
  else if (frame < CUE.horizonLocked) {
    const shotStart = CUE.lightBendsIn;
    const shotEnd = CUE.horizonLocked;
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-1.35, 0, 0],
      scale: 1,
      opacity: 1,
      diskOpacity: 0,
      haloOpacity: 0.9,
    };
    const beamProgress = kf(frame, shotStart, shotEnd, 0, 1, true);
    s.lightBeam = {opacity: kf(frame, shotEnd - 15, shotEnd, 1, 0, true), progress: beamProgress};
    s.starfieldOpacity = 0.6;
    s.fillIntensity = 0.25;
  }

  // ---- Beat 13 (60.5-62.92s): horizon becomes a clean glowing circle ----
  // "...the event horizon." Locked, symmetrical shot (camera-side) — the
  // term lands as the horizon settles into its final, clean form.
  else if (frame < CUE.section3Start) {
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [-1.35, 0, 0],
      scale: 1,
      opacity: 1,
      diskOpacity: 0,
      haloOpacity: 1,
    };
    s.starfieldOpacity = 0.6;
    s.fillIntensity = 0.25;
  }

  return s;
};

export {DURATION_IN_FRAMES};
