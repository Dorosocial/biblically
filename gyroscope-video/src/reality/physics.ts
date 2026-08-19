/**
 * Pure, deterministic choreography for "What Is Reality Actually Made Of?"
 * — the opening sequence. Same architecture as proton/physics.ts: every
 * visual is a function of the absolute frame number only — nothing
 * accumulated via wall-clock time or React state — because Remotion can
 * render frames out of order (or once, standalone, during a still render).
 *
 * This video has NO narration audio, so unlike the proton video the CUE
 * points below are the literal fixed shot-list timestamps from the brief,
 * not something transcribed from a recording — see timing.ts.
 */
import * as THREE from 'three';
import {CUE, DURATION_IN_FRAMES} from './timing';
import {Obj3DState, HIDDEN3D} from './types';

const smoothstep = (t: number) => t * t * (3 - 2 * t);

export const kf = (frame: number, f0: number, f1: number, v0: number, v1: number, linear = false): number => {
  if (f1 <= f0) return v1;
  const t = THREE.MathUtils.clamp((frame - f0) / (f1 - f0), 0, 1);
  return v0 + (v1 - v0) * (linear ? t : smoothstep(t));
};

const lerpVec = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] => [
  THREE.MathUtils.lerp(a[0], b[0], t),
  THREE.MathUtils.lerp(a[1], b[1], t),
  THREE.MathUtils.lerp(a[2], b[2], t),
];

export const ORIGIN: [number, number, number] = [0, 0, 0];

export interface SceneState {
  phone: Obj3DState;
  hand: Obj3DState;
  handCurl: number;
  handPress: number;
  glintIntensity: number;
  focusPoint: [number, number, number];
  focusColor: string;
  focusIntensity: number;
  fillIntensity: number;
  blurPx: number;
}

const baseState = (): SceneState => ({
  phone: HIDDEN3D,
  hand: HIDDEN3D,
  handCurl: 0.6,
  handPress: 0,
  glintIntensity: 0,
  focusPoint: [0, 0, 1],
  focusColor: '#eaf3ff',
  focusIntensity: 26,
  fillIntensity: 0.6,
  blurPx: 0,
});

/** CSS-blur "motion blur" fake: spikes for a few frames around a snap/impact point. */
const blurPulse = (frame: number, center: number, halfWidth: number, peak: number): number => {
  const d = Math.abs(frame - center);
  if (d > halfWidth) return 0;
  return peak * (1 - d / halfWidth);
};

export const getSceneState = (frame: number): SceneState => {
  const s = baseState();

  // ---- Shot A (0-3s): phone emerges from black, floating toward camera --
  if (frame < CUE.ordinary) {
    const shotStart = CUE.emerge;
    const shotEnd = CUE.ordinary;
    s.phone = {
      visible: true,
      position: ORIGIN,
      rotation: [0.04, Math.sin(frame * 0.03) * 0.08, 0.02],
      scale: kf(frame, shotStart, shotEnd, 0.82, 1),
      opacity: kf(frame, shotStart, shotStart + 22, 0, 1, true),
    };
    s.focusPoint = ORIGIN;
    s.focusIntensity = kf(frame, shotStart, shotEnd, 10, 28);
    s.fillIntensity = kf(frame, shotStart, shotEnd, 0.04, 0.55);
  }

  // ---- Shot B (3-6s): slow spin, fully ordinary-looking ------------------
  else if (frame < CUE.pickup) {
    s.phone = {
      visible: true,
      position: ORIGIN,
      rotation: [0.05 + Math.sin(frame * 0.025) * 0.04, frame * 0.014, 0.02],
      scale: 1,
      opacity: 1,
    };
    s.focusPoint = ORIGIN;
    s.focusIntensity = 28;
    s.fillIntensity = 0.65;
  }

  // ---- Shot C (6-10s): a hand picks the phone up, POV, subtle glint -----
  else if (frame < CUE.rapidCuts) {
    const shotStart = CUE.pickup;
    const shotEnd = CUE.rapidCuts;
    const gripT = kf(frame, shotStart, shotStart + 46, 0, 1);
    s.phone = {
      visible: true,
      position: lerpVec(ORIGIN, [0, 0.1, 0], gripT),
      rotation: [0.05 + gripT * 0.1, frame * 0.014, 0.02 + gripT * 0.08],
      scale: 1,
      opacity: 1,
    };
    s.hand = {
      visible: true,
      position: lerpVec([0, -1.4, 0.4], [0, -0.62, 0.24], gripT),
      rotation: [1.3 - gripT * 0.5, 0, 0],
      scale: 1,
      opacity: kf(frame, shotStart, shotStart + 10, 0, 1, true),
    };
    s.handCurl = kf(frame, shotStart + 10, shotStart + 46, 0.1, 0.75);
    // A single specular sweep across the glass, once, mid-shot — "a subtle
    // reflective glint suggesting the viewer's own perspective."
    const glintT = (frame - shotStart) / (shotEnd - shotStart);
    s.glintIntensity = Math.max(0, 1 - Math.abs(glintT - 0.55) * 6);
    s.focusPoint = [0, 0.1, 0.3];
    s.focusIntensity = 30;
    s.fillIntensity = 0.6;
  }

  // ---- Shot D (10-14s): three hard-cut rapid macro beats -----------------
  else if (frame < CUE.macroTouch) {
    if (frame < CUE.cutDrop) {
      // D1 — fingers press the glass
      const shotStart = CUE.cutPress;
      const pressT = kf(frame, shotStart, shotStart + 14, 0, 1);
      s.phone = {visible: true, position: [0, 0.1, 0], rotation: [0.15, 0.3, 0.08], scale: 1, opacity: 1};
      s.hand = {visible: true, position: [0, -0.5, 0.3], rotation: [1.0, 0, 0], scale: 1, opacity: 1};
      s.handCurl = 0.75;
      s.handPress = pressT;
      s.focusPoint = [0.15, 0.35, 0.1];
      s.focusIntensity = 32;
      s.fillIntensity = 0.7;
    } else if (frame < CUE.cutCatch) {
      // D2 — the phone drops, tumbling
      const shotStart = CUE.cutDrop;
      const shotEnd = CUE.cutCatch;
      const t = kf(frame, shotStart, shotEnd, 0, 1, true);
      const fallY = THREE.MathUtils.lerp(0.3, -2.2, t * t);
      s.phone = {
        visible: true,
        position: [0.1, fallY, 0],
        rotation: [frame * 0.22, frame * 0.16, frame * 0.1],
        scale: 1,
        opacity: 1,
      };
      s.hand = HIDDEN3D;
      s.focusPoint = [0.1, fallY, 0];
      s.focusIntensity = 26;
      s.fillIntensity = 0.55;
      s.blurPx = 5 + t * 9;
    } else {
      // D3 — caught mid-air, hard stop
      const shotStart = CUE.cutCatch;
      const settleT = kf(frame, shotStart, shotStart + 8, 0, 1, true);
      s.phone = {
        visible: true,
        position: [0, THREE.MathUtils.lerp(-2.2, -0.3, settleT), 0],
        rotation: [
          THREE.MathUtils.lerp(2.4, 0.1, settleT),
          THREE.MathUtils.lerp(1.8, 0.15, settleT),
          THREE.MathUtils.lerp(1.1, 0.05, settleT),
        ],
        scale: 1,
        opacity: 1,
      };
      s.hand = {
        visible: true,
        position: [0, -0.85, 0.25],
        rotation: [1.05, 0, 0],
        scale: 1,
        opacity: kf(frame, shotStart, shotStart + 6, 0, 1, true),
      };
      s.handCurl = 0.7;
      s.focusPoint = [0, -0.4, 0.2];
      s.focusIntensity = 34;
      s.fillIntensity = 0.65;
      s.blurPx = blurPulse(frame, shotStart + 4, 6, 6);
    }
  }

  // ---- Shot E (14-18s): extreme close-up, fingertip on glass -------------
  else if (frame < CUE.microscope) {
    s.phone = {visible: true, position: [0, -0.3, 0], rotation: [0.1, 0.15, 0.05], scale: 1, opacity: 1};
    s.hand = {visible: true, position: [0, -0.5, 0.28], rotation: [1.0, 0, 0], scale: 1, opacity: 1};
    s.handCurl = 0.7;
    s.handPress = 1;
    s.focusPoint = [0.05, -0.4, 0.15];
    s.focusIntensity = 36;
    s.fillIntensity = 0.9;
  }

  // ---- Shot F (18-22s, CRITICAL): microscope frame, unresolved dive ------
  // Same static pose as shot E (the cut into the vignette is a graphic
  // overlay + camera-push event, not another object change) — everything
  // the continuous zoom needs is carried entirely by cameraTimeline.ts.
  // Lighting starts exactly at E's ending values and only THEN eases down,
  // rather than stepping to a dimmer constant on the very first frame —
  // that step (0.9 -> 0.6 fill) landed on the same instant as the vignette
  // cut and read as a flash to black right where the shot needs to open.
  else {
    const shotStart = CUE.microscope;
    const shotEnd = DURATION_IN_FRAMES;
    s.phone = {visible: true, position: [0, -0.3, 0], rotation: [0.1, 0.15, 0.05], scale: 1, opacity: 1};
    s.hand = {visible: true, position: [0, -0.5, 0.28], rotation: [1.0, 0, 0], scale: 1, opacity: 1};
    s.handCurl = 0.7;
    s.handPress = 1;
    s.focusPoint = [0.03, -0.35, 0.1];
    s.focusIntensity = kf(frame, shotStart, shotEnd, 36, 30, true);
    s.fillIntensity = kf(frame, shotStart, shotEnd, 0.9, 0.55, true);
  }

  return s;
};
