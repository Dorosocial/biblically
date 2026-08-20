/**
 * Pure, deterministic choreography for "Scientists Are Terrified of This
 * Black Hole." Same architecture as the other videos in this project:
 * every visual is a function of the absolute frame number only — nothing
 * accumulated via wall-clock time or React state, because Remotion can
 * render frames out of order (or once, standalone, during a still render).
 *
 * NO narration audio — CUE points (timing.ts) are the fixed pacing
 * estimate from the brief, not a transcription.
 */
import * as THREE from 'three';
import {CUE, DURATION_IN_FRAMES} from './timing';
import {Obj3DState} from '../shared/types';

const smoothstep = (t: number) => t * t * (3 - 2 * t);

export const kf = (frame: number, f0: number, f1: number, v0: number, v1: number, linear = false): number => {
  if (f1 <= f0) return v1;
  const t = THREE.MathUtils.clamp((frame - f0) / (f1 - f0), 0, 1);
  return v0 + (v1 - v0) * (linear ? t : smoothstep(t));
};

/** Already-visible-at-peak object that just needs to fade out later — see
 * proton/physics.ts's `holdOut` for why this exists instead of a 1-frame
 * "fade in" idiom (that idiom always dips to 0 for a frame at its own
 * start, which reads as a hard flash to black when nothing else covers it). */
const holdOut = (frame: number, outStart: number, outEnd: number, peak = 1): number =>
  frame <= outStart ? peak : kf(frame, outStart, outEnd, peak, 0, true);

const blurPulse = (frame: number, center: number, halfWidth: number, peak: number): number => {
  const d = Math.abs(frame - center);
  if (d > halfWidth) return 0;
  return peak * (1 - d / halfWidth);
};

export const ORIGIN: [number, number, number] = [0, 0, 0];

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

export interface SunState {
  visible: boolean;
  position: [number, number, number];
  scale: number;
  opacity: number;
}

export interface SceneState {
  starfieldOpacity: number;
  starfieldWarp: number;
  blackHole: BHState | null;
  grid: GridState | null;
  grid2: GridState | null;
  spacecraft: Obj3DState | null;
  sun: SunState | null;
  earth: Obj3DState | null;
  sunLightPosition: [number, number, number] | null;
  sunLightIntensity: number;
  fillIntensity: number;
  blurPx: number;
  // overlay-only fields, consumed by overlays/Overlays.tsx
  titleOpacity: number;
  clockYouAngle: number;
  clockEarthAngle: number;
  clocksOpacity: number;
  redshiftT: number;
  redshiftOpacity: number;
}

const baseState = (): SceneState => ({
  starfieldOpacity: 0,
  starfieldWarp: 0,
  blackHole: null,
  grid: null,
  grid2: null,
  spacecraft: null,
  sun: null,
  earth: null,
  sunLightPosition: null,
  sunLightIntensity: 0,
  fillIntensity: 0.4,
  blurPx: 0,
  titleOpacity: 0,
  clockYouAngle: 0,
  clockEarthAngle: 0,
  clocksOpacity: 0,
  redshiftT: 0,
  redshiftOpacity: 0,
});

const EARTH_ORBIT_RADIUS = 5;
/** Same formula used across shots 10 & 11 (sunToBlackHole / earthContinuesOrbit)
 * so Earth's orbital angle is continuous across that cut — "continues orbiting
 * almost exactly as before" has to actually be continuous, not just claimed.
 * Exported (angle + radius, not just position) so cameraTimeline.ts's shot 11
 * can point its orbit at Earth's actual current azimuth instead of an
 * independent sweep — see the comment there for the bug this fixed. */
export const earthOrbitAngle = (frame: number): number => (frame - CUE.sunToBlackHole) * 0.012;
const earthPos = (frame: number): [number, number, number] => {
  const a = earthOrbitAngle(frame);
  return [Math.cos(a) * EARTH_ORBIT_RADIUS, 0, Math.sin(a) * EARTH_ORBIT_RADIUS];
};

export const getSceneState = (frame: number): SceneState => {
  const s = baseState();

  // ---- Shot 1 (0-3s): tiny distorted starfield slowly appears ----------
  if (frame < CUE.bendStars) {
    const shotStart = CUE.hook;
    const shotEnd = CUE.bendStars;
    s.starfieldOpacity = kf(frame, shotStart, shotStart + 40, 0, 1, true);
    s.starfieldWarp = kf(frame, shotStart, shotEnd, 0, 0.25);
    s.fillIntensity = kf(frame, shotStart, shotEnd, 0.08, 0.25);
  }

  // ---- Shot 2 (3-6s): stars visibly bend into arcs, accelerating zoom --
  else if (frame < CUE.blackHoleReveal) {
    const shotStart = CUE.bendStars;
    const shotEnd = CUE.blackHoleReveal;
    s.starfieldOpacity = 1;
    s.starfieldWarp = kf(frame, shotStart, shotEnd, 0.25, 0.95);
    s.fillIntensity = kf(frame, shotStart, shotEnd, 0.25, 0.45);
  }

  // ---- Shot 3 (6-10s, CRITICAL): black hole + disk + lensing reveal ----
  else if (frame < CUE.approachDisk) {
    const shotStart = CUE.blackHoleReveal;
    s.starfieldOpacity = 1;
    s.starfieldWarp = 1;
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [0, kf(frame, shotStart, shotStart + 110, 0, 0.6, true), 0],
      scale: kf(frame, shotStart, shotStart + 50, 0.7, 1),
      opacity: kf(frame, shotStart, shotStart + 30, 0, 1, true),
      diskOpacity: kf(frame, shotStart + 10, shotStart + 45, 0, 1, true),
      haloOpacity: kf(frame, shotStart + 15, shotStart + 55, 0, 1, true),
    };
    s.fillIntensity = 0.55;
  }

  // ---- Shot 4 (10-13s): approach — disk bends around the hole ----------
  else if (frame < CUE.spacetimeGridIntro) {
    const shotStart = CUE.approachDisk;
    const shotEnd = CUE.spacetimeGridIntro;
    s.starfieldOpacity = 1;
    s.starfieldWarp = 1;
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [0, 0.6 + kf(frame, shotStart, shotEnd, 0, 0.3, true), 0],
      scale: 1,
      opacity: 1,
      diskOpacity: 1,
      haloOpacity: 1,
    };
    s.fillIntensity = 0.6;
  }

  // ---- Shot 5 (13-16s): spacetime grid appears, dips toward the hole ---
  else if (frame < CUE.dominateFrame) {
    const shotStart = CUE.spacetimeGridIntro;
    const shotEnd = CUE.dominateFrame;
    s.blackHole = {
      visible: true,
      position: [0, 1.8, 0],
      rotation: [0, 0.9, 0],
      scale: 0.8,
      opacity: holdOut(frame, shotEnd - 10, shotEnd),
      diskOpacity: 1,
      haloOpacity: 0.8,
    };
    s.grid = {
      visible: true,
      position: [0, -0.5, 0],
      rotation: [0, 0, 0],
      opacity: kf(frame, shotStart, shotStart + 30, 0, 1, true),
      warpStrength: kf(frame, shotStart, shotEnd, 0.1, 1),
      wellPosition: [0, 0],
      wellRadius: 3.5,
      wellDepth: 3.5,
    };
    s.fillIntensity = 0.5;
  }

  // ---- Shot 6 (16-19s): black hole suddenly dominates the frame --------
  else if (frame < CUE.titleCard) {
    const shotStart = CUE.dominateFrame;
    const shotEnd = CUE.titleCard;
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [0, 1.1 + kf(frame, shotStart, shotEnd, 0, 0.2, true), 0],
      scale: kf(frame, shotStart, shotEnd, 1, 1.6),
      opacity: 1,
      diskOpacity: 1,
      haloOpacity: 1,
    };
    s.fillIntensity = 0.6;
    s.blurPx = blurPulse(frame, shotStart + 3, 8, 5);
  }

  // ---- Title card (19-20s): "FORGET THE HOLLYWOOD VERSION" -------------
  // Black hole keeps slowly turning behind the text — a beat, not a pause.
  else if (frame < CUE.spacecraftApproach) {
    const shotStart = CUE.titleCard;
    const shotEnd = CUE.spacecraftApproach;
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [0, 1.3 + kf(frame, shotStart, shotEnd, 0, 0.15, true), 0],
      scale: 1.6,
      opacity: 1,
      diskOpacity: 1,
      haloOpacity: 1,
    };
    s.titleOpacity = Math.min(kf(frame, shotStart, shotStart + 5, 0, 1, true), kf(frame, shotEnd - 5, shotEnd, 1, 0, true));
    s.fillIntensity = 0.6;
  }

  // ---- Shot 8 (20-24s): tiny spacecraft heading toward the hole --------
  else if (frame < CUE.scaleComparison) {
    const shotStart = CUE.spacecraftApproach;
    s.starfieldOpacity = kf(frame, shotStart, shotStart + 20, 0, 0.8, true);
    s.starfieldWarp = 0.4;
    s.blackHole = {visible: true, position: [0, 0, -14], rotation: [0, 0.2, 0], scale: 2.2, opacity: 1, diskOpacity: 1, haloOpacity: 1};
    s.spacecraft = {
      visible: true,
      position: [0, 0, -1.2],
      rotation: [0, 0, 0],
      scale: 1,
      opacity: kf(frame, shotStart, shotStart + 15, 0, 1, true),
    };
    s.fillIntensity = 0.4;
  }

  // ---- Shot 9 (24-27s): scale comparison, very wide ---------------------
  else if (frame < CUE.sunToBlackHole) {
    s.starfieldOpacity = 1;
    s.starfieldWarp = 0.15;
    s.blackHole = {visible: true, position: [0, 0, -14], rotation: [0, 0.3, 0], scale: 2.2, opacity: 1, diskOpacity: 1, haloOpacity: 1};
    s.fillIntensity = 0.35;
  }

  // ---- Shot 10 (27-31s): Sun dissolves into the black hole --------------
  else if (frame < CUE.earthContinuesOrbit) {
    const shotStart = CUE.sunToBlackHole;
    const shotEnd = CUE.earthContinuesOrbit;
    const dissolveT = kf(frame, shotStart + 20, shotEnd - 10, 0, 1);
    s.sun = {visible: true, position: ORIGIN, scale: 1.1, opacity: 1 - dissolveT};
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [0, frame * 0.004, 0],
      scale: 1.1,
      opacity: dissolveT,
      diskOpacity: 0,
      haloOpacity: dissolveT * 0.4,
    };
    s.earth = {visible: true, position: earthPos(frame), rotation: [0, frame * 0.03, 0], scale: 0.35, opacity: 1};
    s.sunLightPosition = ORIGIN;
    s.sunLightIntensity = 3 * (1 - dissolveT) + 0.6;
    s.fillIntensity = 0.5;
  }

  // ---- Shot 11 (31-34s): Earth continues on the same orbit --------------
  else if (frame < CUE.sideBySideGravity) {
    s.blackHole = {visible: true, position: ORIGIN, rotation: [0, frame * 0.004, 0], scale: 1.1, opacity: 1, diskOpacity: 0, haloOpacity: 0.4};
    s.earth = {visible: true, position: earthPos(frame), rotation: [0, frame * 0.03, 0], scale: 0.35, opacity: 1};
    s.fillIntensity = 0.35;
  }

  // ---- Shot 12 (34-38s): Sun vs black hole, same gravity well -----------
  else if (frame < CUE.accelerateToward) {
    s.sun = {visible: true, position: [-3.2, 0, 0], scale: 0.9, opacity: 1};
    s.blackHole = {visible: true, position: [3.2, 0, 0], rotation: [0, frame * 0.01, 0], scale: 0.55, opacity: 1, diskOpacity: 0, haloOpacity: 0.5};
    // Deliberately identical wellDepth/wellRadius on both sides — same
    // depression despite the wildly different visible size, which is the
    // entire point of this shot.
    s.grid = {visible: true, position: [-3.2, -1.2, 0], rotation: [0, 0, 0], opacity: 1, warpStrength: 0.8, wellPosition: [0, 0], wellRadius: 2.4, wellDepth: 2.2};
    s.grid2 = {visible: true, position: [3.2, -1.2, 0], rotation: [0, 0, 0], opacity: 1, warpStrength: 0.8, wellPosition: [0, 0], wellRadius: 2.4, wellDepth: 2.2};
    s.sunLightPosition = [-3.2, 0, 0];
    s.sunLightIntensity = 2;
    s.fillIntensity = 0.5;
  }

  // ---- Shot 13 (38-41s): sudden acceleration toward the horizon --------
  else if (frame < CUE.gridWarpsDive) {
    const shotStart = CUE.accelerateToward;
    const shotEnd = CUE.gridWarpsDive;
    s.blackHole = {
      visible: true,
      position: ORIGIN,
      rotation: [0, frame * 0.012, 0],
      scale: 1.3,
      opacity: 1,
      diskOpacity: kf(frame, shotStart + 10, shotEnd, 0, 1, true),
      haloOpacity: 1,
    };
    s.fillIntensity = 0.5;
    s.blurPx = blurPulse(frame, shotStart + 6, 10, 6);
  }

  // ---- Shot 14 (41-45s): straight grid dramatically warps ---------------
  else if (frame < CUE.twinClocks) {
    const shotStart = CUE.gridWarpsDive;
    const shotEnd = CUE.twinClocks;
    s.blackHole = {visible: true, position: [0, 1.6, -2], rotation: [0, frame * 0.012, 0], scale: 1.1, opacity: 1, diskOpacity: 1, haloOpacity: 1};
    s.grid = {
      visible: true,
      position: [0, -0.3, -2],
      rotation: [0, 0, 0],
      opacity: 1,
      warpStrength: kf(frame, shotStart, shotEnd, 0.15, 1),
      wellPosition: [0, 0],
      wellRadius: 3,
      wellDepth: 4,
    };
    s.fillIntensity = 0.5;
  }

  // ---- Shot 15 (45-49s): twin clocks, time dilation ----------------------
  else if (frame < CUE.redshift) {
    const shotStart = CUE.twinClocks;
    s.blackHole = {visible: true, position: [0, 0, -3], rotation: [0, frame * 0.008, 0], scale: 1.3, opacity: 0.7, diskOpacity: 0.7, haloOpacity: 0.7};
    s.clocksOpacity = kf(frame, shotStart, shotStart + 15, 0, 1, true);
    s.clockYouAngle = (frame - shotStart) * 0.35;
    s.clockEarthAngle = (frame - shotStart) * 4.2;
    s.fillIntensity = 0.4;
  }

  // ---- Shot 16 (49-53s): light redshifts -----------------------------------
  else if (frame < CUE.eventHorizonFill) {
    const shotStart = CUE.redshift;
    const shotEnd = CUE.eventHorizonFill;
    s.blackHole = {visible: true, position: [0, 0, -3], rotation: [0, frame * 0.008, 0], scale: 1.3, opacity: 0.5, diskOpacity: 0.5, haloOpacity: 0.5};
    s.redshiftOpacity = kf(frame, shotStart, shotStart + 15, 0, 1, true);
    s.redshiftT = kf(frame, shotStart, shotEnd, 0, 1, true);
    s.fillIntensity = 0.35;
  }

  // ---- Shot 17 (53-58s, unresolved): horizon fills the frame -----------
  else {
    s.blackHole = {visible: true, position: ORIGIN, rotation: [0, frame * 0.006, 0], scale: 1, opacity: 1, diskOpacity: 1, haloOpacity: 1};
    s.fillIntensity = 0.45;
  }

  return s;
};
