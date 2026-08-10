/**
 * Pure, deterministic choreography for the whole video.
 *
 * Everything here is a function of an absolute frame number — nothing is
 * accumulated via wall-clock time or React state. That's required for
 * Remotion + React Three Fiber: frames can render out of order (or once,
 * standalone, during `remotion render`), so every visual — wheel spin,
 * axle direction, arrows, ghosts, trails — must be recomputable from
 * scratch given just `frame`.
 */
import * as THREE from 'three';
import {CUE, DURATION_IN_FRAMES, FPS} from './timing';

export const WHEEL_RADIUS = 1.6;
export const COMPARISON_WHEEL_RADIUS = 1.05;

// ---------------------------------------------------------------------------
// small math helpers
// ---------------------------------------------------------------------------

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** Interpolate frame -> value between two frame keyframes, clamped outside range. */
export const kf = (
  frame: number,
  f0: number,
  f1: number,
  v0: number,
  v1: number,
  linear = false,
): number => {
  if (f1 <= f0) return v1;
  const t = THREE.MathUtils.clamp((frame - f0) / (f1 - f0), 0, 1);
  return v0 + (v1 - v0) * (linear ? t : smoothstep(t));
};

/** theta = polar angle from vertical (+Y); phi = azimuth around +Y from +X toward +Z. Both in degrees. */
export const dirFromThetaPhi = (thetaDeg: number, phiDeg: number): THREE.Vector3 => {
  const theta = THREE.MathUtils.degToRad(thetaDeg);
  const phi = THREE.MathUtils.degToRad(phiDeg);
  return new THREE.Vector3(
    Math.sin(theta) * Math.cos(phi),
    Math.cos(theta),
    Math.sin(theta) * Math.sin(phi),
  ).normalize();
};

// ---------------------------------------------------------------------------
// spin speeds (rad/s) + integrated spin angle (rad)
// ---------------------------------------------------------------------------

export const BASE_SPIN = Math.PI * 2 * 1.35; // ~1.35 rev/s
export const SLOW_SPIN = BASE_SPIN * 0.55;
export const FAST_SPIN = BASE_SPIN * 2.15;

/** Angular speed of the "hero" (main storyline) wheel, shots 1-5 & 10-21. */
const heroSpinSpeed = (frame: number): number => {
  if (frame < CUE.hook + 15) {
    return kf(frame, CUE.hook, CUE.hook + 15, 0, BASE_SPIN, true);
  }
  if (frame < CUE.anotherCase) {
    return BASE_SPIN; // shots 6-9 render dedicated comparison wheels instead
  }
  if (frame < CUE.anotherCase + 20) {
    // "wheel reappears spinning from a new angle" — spins back up
    return kf(frame, CUE.anotherCase, CUE.anotherCase + 20, 0, BASE_SPIN, true);
  }
  return BASE_SPIN;
};

const integrate = (speedFn: (f: number) => number, toFrame: number): number[] => {
  const arr: number[] = [0];
  for (let f = 1; f <= toFrame; f++) {
    arr[f] = arr[f - 1] + speedFn(f) / FPS;
  }
  return arr;
};

const HERO_SPIN_ANGLE = integrate(heroSpinSpeed, DURATION_IN_FRAMES);
export const heroSpinAngle = (frame: number): number =>
  HERO_SPIN_ANGLE[THREE.MathUtils.clamp(Math.round(frame), 0, DURATION_IN_FRAMES)];

/** Comparison-demo spin speeds, only meaningful across [whatIfFaster, anotherCase). */
const slowSpinSpeed = (frame: number): number => {
  if (frame < CUE.nowStop) return SLOW_SPIN;
  if (frame < CUE.suddenlyDisappears) {
    return kf(frame, CUE.nowStop, CUE.suddenlyDisappears, SLOW_SPIN, 0, true);
  }
  return 0;
};
const fastSpinSpeed = (frame: number): number => (frame < CUE.nowStop ? FAST_SPIN : 0);

const SLOW_SPIN_ANGLE = integrate(slowSpinSpeed, CUE.anotherCase);
const FAST_SPIN_ANGLE = integrate(fastSpinSpeed, CUE.anotherCase);
export const slowSpinAngle = (frame: number): number =>
  SLOW_SPIN_ANGLE[THREE.MathUtils.clamp(Math.round(frame), 0, CUE.anotherCase)];
export const fastSpinAngle = (frame: number): number =>
  FAST_SPIN_ANGLE[THREE.MathUtils.clamp(Math.round(frame), 0, CUE.anotherCase)];

// ---------------------------------------------------------------------------
// hero wheel orientation (theta/phi in degrees)
// ---------------------------------------------------------------------------

export const FLIP_PHI_DEG = 140;
export const CONE_THETA_DEG = 75;
/** Frame the perpendicular reaction/torque "snaps" in — camera + arrow cue. */
export const REACTION_FRAME = CUE.pushesBack + 33;

export interface Orientation {
  theta: number;
  phi: number;
}

export const heroOrientation = (frame: number): Orientation => {
  // Shots 1-2: steady, horizontal axle.
  if (frame < CUE.tryTilt) {
    return {theta: 90, phi: 0};
  }
  // Shot 3: push force lands, axle starts to dip.
  if (frame < CUE.insteadFalling) {
    return {theta: kf(frame, CUE.tryTilt, CUE.insteadFalling, 90, 80), phi: 0};
  }
  // Shot 4: freeze + ghost-comparison beat. Dip settles, then it starts
  // curving sideways instead of continuing to fall.
  if (frame < CUE.turnsSideways) {
    const settleEnd = CUE.insteadFalling + 55;
    if (frame < settleEnd) {
      return {theta: kf(frame, CUE.insteadFalling, settleEnd, 80, 78), phi: 0};
    }
    return {
      theta: kf(frame, settleEnd, CUE.turnsSideways, 78, 82),
      phi: kf(frame, settleEnd + 15, CUE.turnsSideways, 0, 14),
    };
  }
  // Shot 5 — KEY SHOT: the actual sideways sweep, away from the naive "fall".
  if (frame < CUE.whatIfFaster) {
    return {
      theta: kf(frame, CUE.turnsSideways, CUE.whatIfFaster, 82, 88),
      phi: kf(frame, CUE.turnsSideways, CUE.whatIfFaster, 14, 95),
    };
  }
  // Shots 6-9: dedicated comparison/stop-demo wheels render separately.
  if (frame < CUE.anotherCase) {
    return {theta: 90, phi: 0};
  }
  // Shot 10: dark beat -> wheel reappears "from a new angle", clean reset.
  // Shot 11: hold steady while the angular-momentum arrow is introduced.
  if (frame < CUE.flipAxis) {
    return {theta: 90, phi: 0};
  }
  // Shot 12: "flip its axis around."
  // SFX PLACEHOLDER: axis-flip — mechanical turn/creak tracking this rotation
  if (frame < CUE.pushesBack) {
    return {theta: 90, phi: kf(frame, CUE.flipAxis, CUE.pushesBack, 0, FLIP_PHI_DEG)};
  }
  // Shot 13 onward: automatic precession — constant azimuthal rate, sweeping
  // exactly one full 360deg cycle from the flip to the very last frame, so
  // the loop lands back on the same orientation the flip ended on (matching
  // the opening shot's steady spin for a seamless repeat).
  const precessFrames = DURATION_IN_FRAMES - CUE.pushesBack;
  const phi = FLIP_PHI_DEG + ((frame - CUE.pushesBack) / precessFrames) * 360;
  // SFX PLACEHOLDER: tension build — low rising bed leading into REACTION_FRAME's snap
  let theta = kf(frame, REACTION_FRAME, REACTION_FRAME + 40, 90, CONE_THETA_DEG);
  const loopEase = DURATION_IN_FRAMES - 45;
  if (frame > loopEase) {
    theta = kf(frame, loopEase, DURATION_IN_FRAMES, CONE_THETA_DEG, 90);
  }
  return {theta, phi};
};

export const heroDir = (frame: number): THREE.Vector3 => {
  const {theta, phi} = heroOrientation(frame);
  return dirFromThetaPhi(theta, phi);
};

// ---------------------------------------------------------------------------
// comparison demo (shots 6-9): slow (left) + fast (right) wheels
// ---------------------------------------------------------------------------

export interface ComparisonWheelState {
  visible: boolean;
  position: THREE.Vector3;
  dir: THREE.Vector3;
  spinAngle: number;
  radius: number;
}

const slowOrientation = (frame: number): Orientation => {
  if (frame < CUE.immediatelyStronger) {
    return {theta: kf(frame, CUE.whatIfFaster, CUE.immediatelyStronger, 90, 80), phi: 0};
  }
  if (frame < CUE.nowStop) {
    return {
      theta: kf(frame, CUE.immediatelyStronger, CUE.nowStop, 80, 65),
      phi: kf(frame, CUE.immediatelyStronger, CUE.nowStop, 0, 4),
    };
  }
  if (frame < CUE.suddenlyDisappears) {
    // "Now when you stop the wheel..." — holds its tilt while decelerating.
    return {theta: 65, phi: 4};
  }
  // "suddenly that strange behavior disappears" — reset upright, then a
  // fresh push simply tips it over normally (no sideways yaw at all).
  const resetEnd = CUE.suddenlyDisappears + 15;
  if (frame < resetEnd) {
    return {theta: kf(frame, CUE.suddenlyDisappears, resetEnd, 65, 90), phi: kf(frame, CUE.suddenlyDisappears, resetEnd, 4, 0)};
  }
  return {theta: kf(frame, resetEnd, CUE.anotherCase, 90, 30), phi: 0};
};

const fastOrientation = (frame: number): Orientation => {
  if (frame < CUE.immediatelyStronger) {
    return {theta: kf(frame, CUE.whatIfFaster, CUE.immediatelyStronger, 90, 88), phi: 0};
  }
  return {
    theta: kf(frame, CUE.immediatelyStronger, CUE.nowStop, 88, 84),
    phi: kf(frame, CUE.immediatelyStronger, CUE.nowStop, 0, 170),
  };
};

/**
 * Vertical (top/bottom) stacking for the split-comparison shot — this reads
 * as a portrait-friendly "split screen" for the 9:16 frame, where a
 * side-by-side layout would either crop or shrink both wheels down to
 * nothing. The "slow" wheel sits on top and is the one that survives
 * (recentering) once the "fast" one leaves for the stop/tilt-normally demo.
 */
const COMPARISON_OFFSET_Y = 1.35;

/** y position of the single surviving ("slow") wheel once the fast one leaves, during shots 8-9. */
const slowPosY = (frame: number): number => {
  if (frame < CUE.nowStop) return COMPARISON_OFFSET_Y;
  return kf(frame, CUE.nowStop, CUE.nowStop + 20, COMPARISON_OFFSET_Y, 0);
};

export const comparisonState = (
  frame: number,
): {slow: ComparisonWheelState; fast: ComparisonWheelState} => {
  const inWindow = frame >= CUE.whatIfFaster && frame < CUE.anotherCase;
  const fastVisible = frame >= CUE.whatIfFaster && frame < CUE.nowStop;
  const slowO = slowOrientation(frame);
  const fastO = fastOrientation(frame);
  return {
    slow: {
      visible: inWindow,
      position: new THREE.Vector3(0, slowPosY(frame), 0),
      dir: dirFromThetaPhi(slowO.theta, slowO.phi),
      spinAngle: slowSpinAngle(frame),
      radius: COMPARISON_WHEEL_RADIUS,
    },
    fast: {
      visible: fastVisible,
      position: new THREE.Vector3(0, -COMPARISON_OFFSET_Y, 0),
      dir: dirFromThetaPhi(fastO.theta, fastO.phi),
      spinAngle: fastSpinAngle(frame),
      radius: COMPARISON_WHEEL_RADIUS,
    },
  };
};

// ---------------------------------------------------------------------------
// ghosts (translucent snapshots for comparison)
// ---------------------------------------------------------------------------

export interface GhostWheelSpec {
  key: string;
  dir: THREE.Vector3;
  opacity: number;
  label?: string;
}

/** Shots 4 & 5: the naive "it should just fall over" expectation(s). */
export const fallGhosts = (frame: number): GhostWheelSpec[] => {
  // SFX PLACEHOLDER: freeze — time-freeze whoosh/tick right as the first ghost fades in
  if (frame >= CUE.insteadFalling && frame < CUE.turnsSideways) {
    const fadeIn = kf(frame, CUE.insteadFalling, CUE.insteadFalling + 12, 0, 0.42);
    return [{key: 'expected-1', dir: dirFromThetaPhi(45, 0), opacity: fadeIn, label: 'EXPECTED'}];
  }
  if (frame >= CUE.turnsSideways && frame < CUE.whatIfFaster) {
    const fadeOut = kf(frame, CUE.whatIfFaster - 10, CUE.whatIfFaster, 0.42, 0, true);
    return [
      {key: 'expected-1', dir: dirFromThetaPhi(45, 0), opacity: fadeOut, label: 'EXPECTED'},
      {key: 'expected-2', dir: dirFromThetaPhi(20, 0), opacity: fadeOut, label: 'EXPECTED'},
    ];
  }
  return [];
};

// ---------------------------------------------------------------------------
// spin indicator (curved arc arrow hugging the rim) — the ONE arrow the
// video uses. Everything else (push/momentum/torque arrows, ghost vectors,
// trail lines) was deliberately cut in favor of just the wheel + this one
// glowing indicator, to keep the frame clean.
// ---------------------------------------------------------------------------

export const spinArcVisible = (frame: number): boolean => frame >= CUE.watchSpinning;
