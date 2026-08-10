/**
 * Camera language, applied per-shot:
 *   push in = discovery · pull out = reveal of scale/context · orbit = rotation/precession
 *   snap pan = surprising change · locked = comparison · slow push = explanation
 *   360 orbit = vector/3D relationship. Fast movement reserved for major reveals.
 *
 * Like physics.ts, this is a pure function of the absolute frame number.
 */
import * as THREE from 'three';
import {CUE, DURATION_IN_FRAMES} from '../timing';
import {kf, heroOrientation, REACTION_FRAME, WHEEL_RADIUS} from '../physics';

export interface CameraState {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov: number;
}

const ORIGIN = new THREE.Vector3(0, 0, 0);

const orbit = (center: THREE.Vector3, radius: number, azimuthDeg: number, elevationDeg: number): THREE.Vector3 => {
  const az = THREE.MathUtils.degToRad(azimuthDeg);
  const el = THREE.MathUtils.degToRad(elevationDeg);
  return new THREE.Vector3(
    center.x + radius * Math.cos(el) * Math.cos(az),
    center.y + radius * Math.sin(el),
    center.z + radius * Math.cos(el) * Math.sin(az),
  );
};

const lerpV = (a: THREE.Vector3, b: THREE.Vector3, t: number): THREE.Vector3 => a.clone().lerp(b, t);

const s = (frame: number, f0: number, f1: number, v0: number, v1: number, linear = false) => kf(frame, f0, f1, v0, v1, linear);

export const getCameraState = (frame: number): CameraState => {
  let position = new THREE.Vector3(0, 1, 6);
  let lookAt = ORIGIN.clone();
  let fov = 38;

  // ---- Shot 1: hook — extreme close-up on rim, rapid pull-back ----------
  if (frame < CUE.watchSpinning) {
    const closeUp = new THREE.Vector3(1.05, WHEEL_RADIUS * 0.92, 0.4);
    const closeUpLook = new THREE.Vector3(0, WHEEL_RADIUS * 0.85, 0);
    const reveal = new THREE.Vector3(4.4, 0.7, 5.6);
    const revealLook = ORIGIN.clone();
    const t = s(frame, CUE.hook, CUE.hook + 50, 0, 1);
    position = lerpV(closeUp, reveal, t);
    lookAt = lerpV(closeUpLook, revealLook, t);
    fov = s(frame, CUE.hook, CUE.hook + 50, 24, 38);
  }
  // ---- Shot 2: watchSpinning — slow 3/4 orbit, axle centered -------------
  else if (frame < CUE.tryTilt) {
    const az = s(frame, CUE.watchSpinning, CUE.tryTilt, 40, 300, true);
    position = orbit(ORIGIN, 5.6, az, 14);
    lookAt = ORIGIN.clone();
    fov = 36;
  }
  // ---- Shot 3: tryTilt — camera moves sideways with the push -------------
  else if (frame < CUE.insteadFalling) {
    const az = 300;
    const start = orbit(ORIGIN, 5.6, az, 14);
    const end = new THREE.Vector3(start.x - 2.6, 1.7, start.z * 0.7);
    const t = s(frame, CUE.tryTilt, CUE.insteadFalling, 0, 1);
    position = lerpV(start, end, t);
    lookAt = new THREE.Vector3(0, 0.3, 0);
    fov = 36;
  }
  // ---- Shot 4: insteadFalling — locked, then a quick orbit ---------------
  else if (frame < CUE.turnsSideways) {
    const lockedPos = new THREE.Vector3(2.0, 1.7, 3.9);
    const orbitStartFrame = CUE.insteadFalling + Math.round((CUE.turnsSideways - CUE.insteadFalling) * 0.65);
    if (frame < orbitStartFrame) {
      position = lockedPos;
    } else {
      const az = s(frame, orbitStartFrame, CUE.turnsSideways, 297, 340);
      position = orbit(ORIGIN, 4.6, az, 16);
    }
    lookAt = new THREE.Vector3(0, 0.3, 0);
    fov = 36;
  }
  // ---- Shot 5 (KEY): fast 90deg orbit matching the sideways sweep --------
  else if (frame < CUE.whatIfFaster) {
    const az = s(frame, CUE.turnsSideways, CUE.whatIfFaster, 340, 430, true);
    position = orbit(ORIGIN, 4.3, az, 20);
    lookAt = ORIGIN.clone();
    fov = 40;
  }
  // ---- Shot 6: whatIfFaster — static centered, both wheels in frame ------
  else if (frame < CUE.immediatelyStronger) {
    position = new THREE.Vector3(0, 0.9, 7.3);
    lookAt = ORIGIN.clone();
    fov = 42;
  }
  // ---- Shot 7: immediatelyStronger — push to fast wheel, pull to reveal --
  else if (frame < CUE.nowStop) {
    const wide = new THREE.Vector3(0, 0.9, 7.3);
    const fastWheelTarget = new THREE.Vector3(0, -1.35, 0);
    const close = new THREE.Vector3(0.3, -1.0, 3.4);
    const mid = CUE.immediatelyStronger + Math.round((CUE.nowStop - CUE.immediatelyStronger) * 0.55);
    if (frame < mid) {
      const t = s(frame, CUE.immediatelyStronger, mid, 0, 1);
      position = lerpV(wide, close, t);
      lookAt = lerpV(ORIGIN, fastWheelTarget, t);
    } else {
      const t = s(frame, mid, CUE.nowStop, 0, 1);
      position = lerpV(close, wide, t);
      lookAt = lerpV(fastWheelTarget, ORIGIN, t);
    }
    fov = 40;
  }
  // ---- Shot 8: nowStop — slow push-in as motion dies down ----------------
  else if (frame < CUE.suddenlyDisappears) {
    const t = s(frame, CUE.nowStop, CUE.suddenlyDisappears, 0, 1);
    position = lerpV(new THREE.Vector3(0, 0.9, 6.4), new THREE.Vector3(0, 0.7, 4.4), t);
    lookAt = ORIGIN.clone();
    fov = 38;
  }
  // ---- Shot 9: suddenlyDisappears — locked side view ---------------------
  else if (frame < CUE.anotherCase) {
    position = new THREE.Vector3(4.6, 0.5, 0.3);
    lookAt = ORIGIN.clone();
    fov = 36;
  }
  // ---- Shot 10: anotherCase — dark beat, fast whip-pan into new angle ----
  // SFX PLACEHOLDER: whip-pan — swoosh timed to the `whipAt` cut below
  else if (frame < CUE.holdWheel) {
    const whipAt = CUE.anotherCase + 18;
    const darkPos = new THREE.Vector3(-3.5, 3.2, -2.5);
    const newPos = new THREE.Vector3(-4.6, 1.1, 2.1);
    position = frame < whipAt ? darkPos : newPos;
    lookAt = ORIGIN.clone();
    fov = 34;
  }
  // ---- Shot 11: holdWheel — slow orbit around the axle -------------------
  else if (frame < CUE.flipAxis) {
    const az = s(frame, CUE.holdWheel, CUE.flipAxis, 155, 195, true);
    position = orbit(ORIGIN, 4.4, az, 10);
    lookAt = ORIGIN.clone();
    fov = 34;
  }
  // ---- Shot 12: flipAxis — camera follows the rotation -------------------
  else if (frame < CUE.pushesBack) {
    const az = s(frame, CUE.flipAxis, CUE.pushesBack, 195, 195 + 140, true);
    position = orbit(ORIGIN, 4.6, az, 12);
    lookAt = ORIGIN.clone();
    fov = 34;
  }
  // ---- Shot 13: pushesBack — snap to the side exactly on the reaction ----
  else if (frame < CUE.whatsGoingOn) {
    const preAz = 195 + 140;
    const pre = orbit(ORIGIN, 4.6, preAz, 12);
    const side = orbit(ORIGIN, 5.4, preAz + 90, 22);
    if (frame < REACTION_FRAME) {
      position = pre;
    } else {
      const t = s(frame, REACTION_FRAME, CUE.whatsGoingOn, 0, 1, true);
      position = lerpV(side, orbit(ORIGIN, 5.4, preAz + 90 + t * 30, 22), 1);
    }
    lookAt = ORIGIN.clone();
    fov = 36;
  }
  // ---- Shot 14: whatsGoingOn — freeze beat, slow push-in -----------------
  else if (frame < CUE.secretAngular) {
    const t = s(frame, CUE.whatsGoingOn, CUE.secretAngular, 0, 1);
    position = lerpV(new THREE.Vector3(4.9, 1.9, 3.4), new THREE.Vector3(3.6, 1.4, 2.5), t);
    lookAt = ORIGIN.clone();
    fov = 34;
  }
  // ---- Shot 15: secretAngular — macro push toward the axle/hub -----------
  else if (frame < CUE.pointingAlongAxle) {
    const dir = heroOrientation(frame);
    const axleDir = new THREE.Vector3(Math.sin(THREE.MathUtils.degToRad(dir.theta)) * Math.cos(THREE.MathUtils.degToRad(dir.phi)), Math.cos(THREE.MathUtils.degToRad(dir.theta)), Math.sin(THREE.MathUtils.degToRad(dir.theta)) * Math.sin(THREE.MathUtils.degToRad(dir.phi)));
    const t = s(frame, CUE.secretAngular, CUE.pointingAlongAxle, 0, 1);
    const near = axleDir.clone().multiplyScalar(WHEEL_RADIUS * 1.6).add(new THREE.Vector3(0.6, 0.3, 1.1));
    position = lerpV(new THREE.Vector3(3.6, 1.4, 2.5), near, t);
    lookAt = axleDir.clone().multiplyScalar(WHEEL_RADIUS * 1.9);
    fov = s(frame, CUE.secretAngular, CUE.pointingAlongAxle, 34, 22);
  }
  // ---- Shot 16: pointingAlongAxle — orbit, vector stays centered ---------
  else if (frame < CUE.changeDirection) {
    const az = s(frame, CUE.pointingAlongAxle, CUE.changeDirection, 20, 190, true);
    position = orbit(ORIGIN, 5.2, az, 16);
    lookAt = ORIGIN.clone();
    fov = 34;
  }
  // ---- Shot 17: changeDirection — camera follows the vector in 3D -------
  else if (frame < CUE.changingMomentum) {
    const az = s(frame, CUE.changeDirection, CUE.changingMomentum, 190, 250, true);
    position = orbit(ORIGIN, 4.8, az, 20);
    lookAt = ORIGIN.clone();
    fov = 34;
  }
  // ---- Shot 18: changingMomentum — full 360deg orbit ---------------------
  else if (frame < CUE.createsTorque) {
    const az = s(frame, CUE.changingMomentum, CUE.createsTorque, 250, 250 + 360, true);
    position = orbit(ORIGIN, 5.0, az, 18);
    lookAt = ORIGIN.clone();
    fov = 36;
  }
  // ---- Shot 19: createsTorque — pull back to show the whole wheel --------
  else if (frame < CUE.turningSidewaysAgain) {
    const t = s(frame, CUE.createsTorque, CUE.turningSidewaysAgain, 0, 1);
    position = lerpV(orbit(ORIGIN, 5.0, 250, 18), orbit(ORIGIN, 7.4, 260, 20), t);
    lookAt = ORIGIN.clone();
    fov = 40;
  }
  // ---- Shot 20: turningSidewaysAgain — large circular orbit --------------
  else if (frame < CUE.gyroscopicPrecession) {
    const az = s(frame, CUE.turningSidewaysAgain, CUE.gyroscopicPrecession, 260, 260 + 200, true);
    position = orbit(ORIGIN, 7.6, az, 22);
    lookAt = ORIGIN.clone();
    fov = 40;
  }
  // ---- Shot 21: gyroscopicPrecession — slow pull-back revealing the cone,
  //      then ease into the loop-matching close-up on the rim -------------
  else {
    const settleStart = DURATION_IN_FRAMES - 40;
    if (frame < settleStart) {
      const az = s(frame, CUE.gyroscopicPrecession, settleStart, 460, 500, true);
      const radius = s(frame, CUE.gyroscopicPrecession, settleStart, 7.6, 9.4);
      position = orbit(ORIGIN, radius, az, 26);
      lookAt = ORIGIN.clone();
      fov = s(frame, CUE.gyroscopicPrecession, settleStart, 40, 46);
    } else {
      // Rhymes with frame 0's opening close-up, for a seamless loop.
      const t = s(frame, settleStart, DURATION_IN_FRAMES, 0, 1);
      const wide = orbit(ORIGIN, 9.4, 500, 26);
      const closeUp = new THREE.Vector3(1.05, WHEEL_RADIUS * 0.92, 0.4);
      position = lerpV(wide, closeUp, t);
      lookAt = lerpV(ORIGIN, new THREE.Vector3(0, WHEEL_RADIUS * 0.85, 0), t);
      fov = s(frame, settleStart, DURATION_IN_FRAMES, 46, 24);
    }
  }

  return {position, lookAt, fov};
};
