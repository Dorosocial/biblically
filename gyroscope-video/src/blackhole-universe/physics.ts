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

export interface SceneState {
  universe: NestedUniverseState | null;
  universeAsBlackHole: BHSilhouetteState | null;
  earth: Obj3DState;
  starfieldOpacity: number;
  fillIntensity: number;
}

const HIDDEN_UNIVERSE: NestedUniverseState = {visible: false, position: ORIGIN, scale: 1, opacity: 0, revealLevel: 0};
const HIDDEN_BH: BHSilhouetteState = {visible: false, position: ORIGIN, scale: 1, opacity: 0};

const baseState = (): SceneState => ({
  universe: HIDDEN_UNIVERSE,
  universeAsBlackHole: HIDDEN_BH,
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
  else if (frame < CUE.section2Start) {
    const cut = kf(frame, CUE.hardCutToBlack, CUE.hardCutToBlack + 2, 1, 0, true);
    s.universeAsBlackHole = {visible: true, position: ORIGIN, scale: 1.3, opacity: cut};
    s.starfieldOpacity = cut * 1;
    s.fillIntensity = 0.02;
  }

  return s;
};

export {DURATION_IN_FRAMES};
