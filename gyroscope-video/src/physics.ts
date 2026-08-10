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

const Y_AXIS = new THREE.Vector3(0, 1, 0);

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

/** x position of the single surviving ("slow") wheel once the fast one leaves, during shots 8-9. */
const slowPosX = (frame: number): number => {
  if (frame < CUE.nowStop) return -1.8;
  return kf(frame, CUE.nowStop, CUE.nowStop + 20, -1.8, 0);
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
      position: new THREE.Vector3(slowPosX(frame), 0, 0),
      dir: dirFromThetaPhi(slowO.theta, slowO.phi),
      spinAngle: slowSpinAngle(frame),
      radius: COMPARISON_WHEEL_RADIUS,
    },
    fast: {
      visible: fastVisible,
      position: new THREE.Vector3(1.8, 0, 0),
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

/** Shot 12: ghost of the original (pre-flip) axle direction. */
export const originalAxleGhost = (frame: number): GhostWheelSpec | null => {
  if (frame >= CUE.flipAxis && frame < CUE.pushesBack + 15) {
    const opacity = kf(frame, CUE.flipAxis, CUE.flipAxis + 10, 0, 0.35);
    return {key: 'original-axle', dir: dirFromThetaPhi(90, 0), opacity};
  }
  return null;
};

/** Shots 17-18: frozen snapshot of the angular-momentum direction right before the change begins. */
export const preChangeGhost = (frame: number): GhostWheelSpec | null => {
  if (frame >= CUE.changeDirection && frame < CUE.createsTorque) {
    const snapshotDir = heroDir(CUE.changeDirection);
    const opacity = kf(frame, CUE.changeDirection, CUE.changeDirection + 10, 0, 0.4);
    return {key: 'pre-change', dir: snapshotDir, opacity};
  }
  return null;
};

// ---------------------------------------------------------------------------
// arrows
// ---------------------------------------------------------------------------

export interface ArrowSpec {
  key: string;
  origin: THREE.Vector3;
  dir: THREE.Vector3;
  length: number;
  radius: number;
  color: string;
  opacity: number;
  emissive?: string;
  emissiveIntensity?: number;
}

const fade = (frame: number, inStart: number, inEnd: number, outStart: number, outEnd: number, peak = 1) => {
  if (frame < inStart || frame > outEnd) return 0;
  if (frame < inEnd) return kf(frame, inStart, inEnd, 0, peak, true);
  if (frame > outStart) return kf(frame, outStart, outEnd, peak, 0, true);
  return peak;
};

export const getArrows = (frame: number): ArrowSpec[] => {
  const arrows: ArrowSpec[] = [];
  const origin = new THREE.Vector3(0, 0, 0);

  // Push-force arrow: appears cue3, pushes the axle down, lingers through
  // the freeze/ghost beat, gone once the sideways sweep is under way.
  // SFX PLACEHOLDER: push — soft push/thud right as this arrow fades in
  const pushOpacity = fade(frame, CUE.tryTilt, CUE.tryTilt + 10, CUE.turnsSideways - 15, CUE.turnsSideways, 0.55);
  if (pushOpacity > 0) {
    const dir = heroDir(frame);
    const edge = dir.clone().multiplyScalar(WHEEL_RADIUS * 0.85);
    arrows.push({
      key: 'push-force',
      origin: edge.add(new THREE.Vector3(0, 1.1, 0)),
      dir: new THREE.Vector3(0, -1, 0),
      length: 1.0,
      radius: 0.045,
      color: '#e8f6ff',
      opacity: pushOpacity,
    });
  }

  // Angular-momentum arrow along the live axle — introduced at "Hold the
  // spinning wheel", stays present (with varying emphasis) from then on.
  // SFX PLACEHOLDER: momentum emphasis — low glowing hum starts here, swells when `dominant`
  if (frame >= CUE.holdWheel) {
    const dir = heroDir(frame);
    const dominant = frame >= CUE.secretAngular && frame < CUE.pointingAlongAxle + 10;
    const introOpacity = fade(frame, CUE.holdWheel, CUE.holdWheel + 12, DURATION_IN_FRAMES - 1, DURATION_IN_FRAMES, 1);
    arrows.push({
      key: 'angular-momentum',
      origin: dir.clone().multiplyScalar(-WHEEL_RADIUS * 0.55),
      dir,
      length: WHEEL_RADIUS * (dominant ? 2.5 : 2.0),
      radius: dominant ? 0.07 : 0.05,
      color: '#5ec8ff',
      emissive: '#5ec8ff',
      emissiveIntensity: dominant ? 2.2 : 1.2,
      opacity: introOpacity,
    });
  }

  // Ghost (frozen) + live vector during the "change direction" beats.
  const ghost = preChangeGhost(frame);
  if (ghost) {
    arrows.push({
      key: 'momentum-ghost',
      origin: ghost.dir.clone().multiplyScalar(-WHEEL_RADIUS * 0.55),
      dir: ghost.dir,
      length: WHEEL_RADIUS * 2.2,
      radius: 0.05,
      color: '#5ec8ff',
      opacity: ghost.opacity,
    });
  }

  // Original-axle ghost arrow during the flip.
  const axleGhost = originalAxleGhost(frame);
  if (axleGhost) {
    arrows.push({
      key: 'original-axle-ghost',
      origin: axleGhost.dir.clone().multiplyScalar(-WHEEL_RADIUS * 0.55),
      dir: axleGhost.dir,
      length: WHEEL_RADIUS * 1.9,
      radius: 0.045,
      color: '#9fb2c8',
      opacity: axleGhost.opacity,
    });
  }

  // Torque arrow: perpendicular to the axle & to vertical (the direction
  // that pushes the axle's azimuth around) — appears once the reaction
  // "snaps" in, and again explicitly during the explanation section.
  const torqueVisible =
    (frame >= REACTION_FRAME && frame < CUE.whatsGoingOn + 30) ||
    frame >= CUE.createsTorque;
  if (torqueVisible) {
    const dir = heroDir(frame);
    const torqueDir = new THREE.Vector3().crossVectors(Y_AXIS, dir);
    if (torqueDir.lengthSq() < 1e-6) torqueDir.set(1, 0, 0);
    torqueDir.normalize();
    const opacity = fade(
      frame,
      REACTION_FRAME,
      REACTION_FRAME + 10,
      DURATION_IN_FRAMES - 1,
      DURATION_IN_FRAMES,
      0.9,
    );
    arrows.push({
      key: 'torque',
      origin: new THREE.Vector3(0, 0, 0),
      dir: torqueDir,
      length: WHEEL_RADIUS * 1.6,
      radius: 0.06,
      color: '#ff5da2',
      emissive: '#ff5da2',
      emissiveIntensity: 1.6,
      opacity,
    });
  }

  return arrows;
};

/** Small curved connector arc showing the momentum vector "sweeping" from its old to its new direction (shot 18). */
export const momentumSweepArc = (frame: number): THREE.Vector3[] | null => {
  if (frame < CUE.changingMomentum || frame >= CUE.createsTorque) return null;
  const fromDir = heroDir(CUE.changeDirection);
  const t = THREE.MathUtils.clamp((frame - CUE.changingMomentum) / (CUE.createsTorque - CUE.changingMomentum), 0, 1);
  const points: THREE.Vector3[] = [];
  const steps = 24;
  const sweepT = smoothstep(t);
  const currentDir = heroDir(frame);
  for (let i = 0; i <= steps; i++) {
    const s = (i / steps) * sweepT;
    points.push(fromDir.clone().lerp(currentDir, s).normalize().multiplyScalar(WHEEL_RADIUS * 1.7));
  }
  return points;
};

// ---------------------------------------------------------------------------
// spin indicator (curved arc arrow hugging the rim)
// ---------------------------------------------------------------------------

export const spinArcVisible = (frame: number): boolean =>
  (frame >= CUE.watchSpinning && frame < CUE.whatIfFaster) || frame >= CUE.whatsGoingOn;

// ---------------------------------------------------------------------------
// trails — deterministic re-sampling of history, never accumulated over time
// ---------------------------------------------------------------------------

/** A faint point on the rim, traced backward in time, for the ambient "it's spinning" trail. */
export const rimTrailPoints = (frame: number, sampleCount = 26, step = 1): THREE.Vector3[] => {
  const pts: THREE.Vector3[] = [];
  const dir = heroDir(frame);
  const tangentBasis = new THREE.Vector3(0, 1, 0);
  if (Math.abs(dir.dot(tangentBasis)) > 0.98) tangentBasis.set(1, 0, 0);
  const u = new THREE.Vector3().crossVectors(dir, tangentBasis).normalize();
  const v = new THREE.Vector3().crossVectors(dir, u).normalize();
  for (let i = sampleCount; i >= 0; i--) {
    const f = Math.max(0, frame - i * step);
    const angle = heroSpinAngle(f);
    const p = u.clone().multiplyScalar(Math.cos(angle) * WHEEL_RADIUS).add(v.clone().multiplyScalar(Math.sin(angle) * WHEEL_RADIUS));
    pts.push(p);
  }
  return pts;
};

/** The axle-tip's swept path since precession began — draws the visible "cone". */
export const precessionConeTrail = (frame: number, maxSamples = 140): THREE.Vector3[] => {
  const from = CUE.pushesBack;
  if (frame <= from) return [];
  const span = frame - from;
  const step = Math.max(1, Math.floor(span / maxSamples));
  const pts: THREE.Vector3[] = [];
  for (let f = from; f <= frame; f += step) {
    pts.push(heroDir(f).clone().multiplyScalar(WHEEL_RADIUS * 1.55));
  }
  pts.push(heroDir(frame).clone().multiplyScalar(WHEEL_RADIUS * 1.55));
  return pts;
};

/** Bright curved trajectory trail behind the KEY SHOT's actual sideways sweep. */
export const sidewaysSweepTrail = (frame: number, maxSamples = 60): THREE.Vector3[] => {
  const from = CUE.turnsSideways;
  if (frame <= from) return [];
  const span = Math.min(frame, CUE.whatIfFaster) - from;
  const step = Math.max(1, Math.floor(span / maxSamples));
  const pts: THREE.Vector3[] = [];
  const end = Math.min(frame, CUE.whatIfFaster);
  for (let f = from; f <= end; f += step) {
    pts.push(heroDir(f).clone().multiplyScalar(WHEEL_RADIUS * 1.3));
  }
  return pts;
};
