// =============================================================================
// sceneState.ts — the single function that turns `frame` into everything the
// scene needs to render this frame: camera pose, particle/ball/wave/screen/
// detector state. Pure function of `frame` (deterministic, no useEffect/
// useState/animation loops anywhere) so it renders identically no matter how
// Remotion reaches this frame — required for correct server-side rendering.
//
// Organized as one case per BEATS entry in timeline.ts, in shot-list order.
// Each case's comment quotes the narration line it covers for traceability.
// =============================================================================
import {BEATS, type BeatId, FPS} from '../timeline';
import {clamp01, easeIn, easeInOut, easeOut, lerp, lerpV3, prog, pulse, type V3} from './math';

export interface ObjectState {
  position: V3;
  scale: number;
  opacity: number;
}

export interface WaveLobeState {
  position: V3;
  scale: number;
  opacity: number;
}

export interface WaveSheetState {
  from: V3;
  to: V3;
  opacity: number;
}

export interface DetectorState {
  position: V3;
  active: number;
  opacity: number;
}

export interface SceneState {
  time: number;
  camera: {position: V3; lookAt: V3; fov: number};
  particle?: ObjectState;
  secondaryParticle?: ObjectState; // used only for the split-screen "right side" quantum path, never a duplicate of the SAME particle
  classicalBall?: ObjectState & {ghost?: boolean};
  ghostBall?: ObjectState & {ghost: true};
  xMark?: ObjectState;
  waveLobes: WaveLobeState[];
  waveSheets: WaveSheetState[];
  possibilityCloud?: {center: V3; spreadX: number; count: number; opacity: number};
  barrier?: {position: V3; opacity: number; slitGap?: number};
  screen?: {
    position: V3;
    interferenceAmt: number;
    twoBandAmt: number;
    multiAmt: number;
    panelGlow: number;
  };
  detectors: DetectorState[];
  splitDividerOpacity: number;
  humanScaleObject?: ObjectState;
}

// ---------------------------------------------------------------------------
// World layout constants
// ---------------------------------------------------------------------------
const SOURCE: V3 = [0, 0, 4.3];
const BARRIER_Z = 0;
const SLIT_X = 0.55;
const SLIT_L: V3 = [-SLIT_X, 0, BARRIER_Z];
const SLIT_R: V3 = [SLIT_X, 0, BARRIER_Z];
// The barrier-to-screen corridor is deliberately deep (5.5 units) relative to
// the screen's own size (2.6 x 3.6) so that any camera dolly passing through
// it has room to breathe — a camera ending up within ~1.5 units of the
// screen plane makes it fill the frame edge-to-edge and lose all depth.
const SCREEN_POS: V3 = [0, 0, -5.5];
const MID_GAP_Z = -3.3; // ~60% through the corridor — used for "wave reaching toward the screen" shots
const NEAR_SCREEN_Z = -5.3; // just in front of the screen surface — particle/result impact point
const BALL_LEFT: V3 = [-1.3, 0, 2.0];
const GHOST_RIGHT: V3 = [1.3, 0, 2.0];
const ORIGIN: V3 = [0, 0, 0];

const findBeat = (frame: number): {id: BeatId; start: number; end: number} => {
  for (const b of BEATS) {
    if (frame >= b.start && frame < b.end) return b;
  }
  return BEATS[BEATS.length - 1];
};

/** Local progress through the active beat, eased, plus raw linear t. */
const local = (frame: number, start: number, end: number) => {
  const t = prog(frame, start, end);
  return {t, tIn: easeInOut(t)};
};

/** Simple 3-point envelope: fades in over [0,inEnd], holds, fades out over [outStart,1]. */
const envelope = (t: number, inEnd: number, outStart: number): number => {
  if (t < inEnd) return easeOut(t / inEnd);
  if (t > outStart) return 1 - easeIn((t - outStart) / (1 - outStart));
  return 1;
};

/** Camera position orbiting a center point, angle in radians. */
const orbitPos = (center: V3, radius: number, height: number, angle: number): V3 => [
  center[0] + Math.cos(angle) * radius,
  center[1] + height,
  center[2] + Math.sin(angle) * radius,
];

export const getSceneState = (frame: number): SceneState => {
  const beat = findBeat(frame);
  const time = frame / FPS;
  const base: SceneState = {
    time,
    camera: {position: [0, 0.4, 6.2], lookAt: ORIGIN, fov: 55},
    waveLobes: [],
    waveSheets: [],
    detectors: [],
    splitDividerOpacity: 0,
  };

  switch (beat.id) {
    // -----------------------------------------------------------------------
    // "How can one particle be in two places at the same time?"
    // Fast push toward the particle, then pull back to reveal both locations.
    // -----------------------------------------------------------------------
    case 'intro': {
      const {t} = local(frame, beat.start, beat.end);
      const pushT = clamp01(t / 0.4);
      const pullT = clamp01((t - 0.4) / 0.6);
      const camPos: V3 =
        t < 0.4
          ? lerpV3([0, 1, 9.5], [0, 0.25, 2.1], easeInOut(pushT))
          : lerpV3([0, 0.25, 2.1], [0, 0.6, 7.2], easeInOut(pullT));
      const targetsOpacity = clamp01((t - 0.45) / 0.4);
      base.camera = {position: camPos, lookAt: ORIGIN, fov: 55};
      base.particle = {position: ORIGIN, scale: 1 + Math.sin(frame * 0.3) * 0.04, opacity: 1};
      base.waveLobes = [
        {position: [-1.8, 0.3, 0.6], scale: 0.3 * targetsOpacity, opacity: targetsOpacity * 0.9},
        {position: [1.9, -0.2, 1.0], scale: 0.3 * targetsOpacity, opacity: targetsOpacity * 0.9},
      ];
      return base;
    }

    // -----------------------------------------------------------------------
    // "It already sounds impossible," — PUNCTUATED PAUSE, not a true freeze:
    // slow camera drift + continuous glow pulse under the "IMPOSSIBLE?" label.
    // -----------------------------------------------------------------------
    case 'impossiblePause': {
      const drift: V3 = [Math.sin(frame * 0.02) * 0.25, 0.35 + Math.cos(frame * 0.015) * 0.08, 6.2];
      base.camera = {position: drift, lookAt: ORIGIN, fov: 52};
      const pulseAmt = pulse(frame, 40);
      base.particle = {position: ORIGIN, scale: 1 + pulseAmt * 0.08, opacity: 1};
      return base;
    }

    // -----------------------------------------------------------------------
    // "because if you put a ball here," — classical ball replaces the
    // particle, side-on locked shot (very slight drift).
    // -----------------------------------------------------------------------
    case 'ballAppears': {
      const {t} = local(frame, beat.start, beat.end);
      const camPos: V3 = [4.6 + Math.sin(frame * 0.02) * 0.08, 0.3, 1.0];
      base.camera = {position: camPos, lookAt: BALL_LEFT, fov: 45};
      base.classicalBall = {position: BALL_LEFT, scale: 1, opacity: easeOut(clamp01(t / 0.3)), ghost: false};
      return base;
    }

    // -----------------------------------------------------------------------
    // "it can't also be over there." — ghost duplicate + X appears on the
    // right, quick pan left -> right.
    // -----------------------------------------------------------------------
    case 'ghostDuplicate': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      const look = lerpV3(BALL_LEFT, GHOST_RIGHT, tIn);
      const camPos = lerpV3([4.6, 0.3, 1.0], [4.6, 0.3, 3.2], tIn);
      base.camera = {position: camPos, lookAt: look, fov: 45};
      base.classicalBall = {position: BALL_LEFT, scale: 1, opacity: 1, ghost: false};
      const ghostOp = easeOut(clamp01((t - 0.15) / 0.35));
      base.ghostBall = {position: GHOST_RIGHT, scale: 1, opacity: ghostOp, ghost: true};
      base.xMark = {position: GHOST_RIGHT, scale: easeOut(clamp01((t - 0.35) / 0.35)), opacity: ghostOp};
      return base;
    }

    // -----------------------------------------------------------------------
    // "But tiny particles don't always behave like that." — ball dissolves
    // into the quantum particle; slow 360 orbit.
    // SOUND DESIGN: ball-to-particle dissolve begins here (frame ~241).
    // -----------------------------------------------------------------------
    case 'ballDissolves': {
      const {t} = local(frame, beat.start, beat.end);
      const angle = t * Math.PI * 2 * 0.85;
      const center = lerpV3(BALL_LEFT, ORIGIN, easeInOut(clamp01(t / 0.7)));
      base.camera = {position: orbitPos(center, 3.4, 0.9, angle), lookAt: center, fov: 50};
      const ballOpacity = 1 - easeInOut(clamp01((t - 0.15) / 0.55));
      base.classicalBall = {position: center, scale: 1 - t * 0.2, opacity: Math.max(0, ballOpacity), ghost: false};
      const particleOpacity = easeInOut(clamp01((t - 0.45) / 0.5));
      base.particle = {position: center, scale: 0.7 + particleOpacity * 0.3, opacity: particleOpacity};
      // dissolve motes: small fading wave-lobes scattering outward as the ball breaks apart
      if (t > 0.1 && t < 0.75) {
        const moteT = clamp01((t - 0.1) / 0.65);
        const moteOpacity = (1 - moteT) * 0.8;
        base.waveLobes = new Array(5).fill(0).map((_, i) => {
          const a = (i / 5) * Math.PI * 2 + t * 4;
          const r = moteT * 0.9;
          return {
            position: [center[0] + Math.cos(a) * r, center[1] + Math.sin(a * 1.3) * r * 0.6, center[2] + Math.sin(a) * r],
            scale: 0.14,
            opacity: moteOpacity,
          };
        });
      }
      return base;
    }

    // -----------------------------------------------------------------------
    // "Let me explain." — pull back to reveal the full double-slit setup.
    // -----------------------------------------------------------------------
    case 'explainReveal': {
      const {tIn} = local(frame, beat.start, beat.end);
      const camPos = lerpV3([0, 0.9, 3.4], [0, 4.3, 5.6], tIn);
      const look = lerpV3(ORIGIN, [0, 0, -1.2], tIn);
      base.camera = {position: camPos, lookAt: look, fov: 55};
      base.particle = {position: SOURCE, scale: 1, opacity: 1};
      base.barrier = {position: [0, 0, BARRIER_Z], opacity: easeOut(tIn)};
      base.screen = {
        position: SCREEN_POS,
        interferenceAmt: 0,
        twoBandAmt: 0,
        multiAmt: 0,
        panelGlow: easeOut(tIn),
      };
      return base;
    }

    // -----------------------------------------------------------------------
    // "In quantum physics, a particle can exist in a superposition of
    // different possible states." — particle approaches the barrier, two
    // translucent probability waves emerge toward the two slits.
    // -----------------------------------------------------------------------
    case 'superposition': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      const particlePos = lerpV3(SOURCE, [0, 0, 1.0], easeInOut(clamp01(t / 0.7)));
      base.camera = {
        position: [lerp(0, 1.0, tIn), lerp(0.9, 1.1, tIn), particlePos[2] + 3],
        lookAt: particlePos,
        fov: 52,
      };
      base.particle = {position: particlePos, scale: 1, opacity: 1};
      base.barrier = {position: [0, 0, BARRIER_Z], opacity: 1};
      base.screen = {position: SCREEN_POS, interferenceAmt: 0, twoBandAmt: 0, multiAmt: 0, panelGlow: 1};
      const waveT = easeOut(clamp01((t - 0.55) / 0.45));
      if (waveT > 0.01) {
        base.waveLobes = [
          {position: SLIT_L, scale: 0.4 * waveT, opacity: waveT},
          {position: SLIT_R, scale: 0.4 * waveT, opacity: waveT},
        ];
        base.waveSheets = [
          {from: particlePos, to: SLIT_L, opacity: waveT},
          {from: particlePos, to: SLIT_R, opacity: waveT},
        ];
      }
      return base;
    }

    // -----------------------------------------------------------------------
    // "And that gets really strange." — particle reaches the barrier, both
    // paths glow simultaneously as possibilities; slow push toward the slits.
    // -----------------------------------------------------------------------
    case 'reallyStrange': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      base.camera = {position: lerpV3([1.0, 1.1, 4.0], [0, 0.4, 1.7], tIn), lookAt: ORIGIN, fov: 50};
      base.particle = {position: [0, 0, 0.2], scale: 1, opacity: 1 - 0.7 * tIn};
      base.barrier = {position: [0, 0, BARRIER_Z], opacity: 1};
      base.screen = {position: SCREEN_POS, interferenceAmt: 0, twoBandAmt: 0, multiAmt: 0, panelGlow: 1};
      const glow = 0.4 + 0.6 * tIn;
      base.waveLobes = [
        {position: SLIT_L, scale: 0.42 * (0.6 + 0.4 * pulse(frame, 30)), opacity: glow},
        {position: SLIT_R, scale: 0.42 * (0.6 + 0.4 * pulse(frame + 15, 30)), opacity: glow},
      ];
      base.waveSheets = [
        {from: [0, 0, 0.2], to: SLIT_L, opacity: glow * 0.8},
        {from: [0, 0, 0.2], to: SLIT_R, opacity: glow * 0.8},
      ];
      return base;
    }

    // -----------------------------------------------------------------------
    // "Imagine sending a single particle toward two openings." — fresh
    // single particle launched toward the slits ("ONE PARTICLE" label).
    // Centered tracking shot.
    // -----------------------------------------------------------------------
    case 'oneParticle': {
      const {t} = local(frame, beat.start, beat.end);
      const particlePos = lerpV3(SOURCE, [0, 0, 0.9], easeInOut(t));
      base.camera = {position: [0, 0.85, particlePos[2] + 2.2], lookAt: particlePos, fov: 50};
      base.particle = {position: particlePos, scale: 1, opacity: 1};
      base.barrier = {position: [0, 0, BARRIER_Z], opacity: 1};
      base.screen = {position: SCREEN_POS, interferenceAmt: 0, twoBandAmt: 0, multiAmt: 0, panelGlow: 1};
      return base;
    }

    // -----------------------------------------------------------------------
    // "You might expect it to choose one, left or right," — LEFT / RIGHT
    // labels, a classical ball (for contrast) shown choosing ONE slit.
    // -----------------------------------------------------------------------
    case 'chooseLeftRight': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      base.camera = {position: [0, 1.6, 3.0], lookAt: [0, 0, -0.3], fov: 60};
      const ballPos = lerpV3(SOURCE, [SLIT_L[0], 0, 0.15], easeInOut(t));
      base.classicalBall = {position: ballPos, scale: 1, opacity: 1, ghost: false};
      base.barrier = {position: [0, 0, BARRIER_Z], opacity: 1};
      base.screen = {position: SCREEN_POS, interferenceAmt: 0, twoBandAmt: 0, multiAmt: 0, panelGlow: 1};
      return base;
    }

    // -----------------------------------------------------------------------
    // "but when you don't measure which path it takes," — no detectors;
    // both possible paths become wave-like and visibly overlap. Camera
    // passes through the slits alongside the wave.
    // -----------------------------------------------------------------------
    case 'dontMeasure': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      const camZ = lerp(1.6, -1.0, tIn);
      base.camera = {position: [0, 0.5, camZ + 2.4], lookAt: [0, 0, camZ - 0.5], fov: 52};
      base.barrier = {position: [0, 0, BARRIER_Z], opacity: lerp(1, 0.3, tIn)};
      base.screen = {position: SCREEN_POS, interferenceAmt: 0, twoBandAmt: 0, multiAmt: 0, panelGlow: 1};
      const waveOp = easeOut(t);
      base.waveLobes = [
        {position: SLIT_L, scale: 0.45 * waveOp, opacity: waveOp},
        {position: SLIT_R, scale: 0.45 * waveOp, opacity: waveOp},
      ];
      base.waveSheets = [
        {from: SLIT_L, to: [0, 0, MID_GAP_Z], opacity: waveOp * 0.85},
        {from: SLIT_R, to: [0, 0, MID_GAP_Z], opacity: waveOp * 0.85},
        {from: SLIT_L, to: SLIT_R, opacity: waveOp * 0.6},
      ];
      return base;
    }

    // -----------------------------------------------------------------------
    // "the results can form an interference pattern." — screen gradually
    // fills with bright/dark bands. Slow push toward the screen.
    // SOUND DESIGN: interference pattern begins forming here (frame ~802).
    // -----------------------------------------------------------------------
    case 'interferenceForms': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      // "Push toward the screen" via FOV narrowing (a dolly-zoom) rather than
      // physically translating the camera past the barrier — the barrier
      // sits right in the corridor, so closing that distance would either
      // swallow the frame in its (dark, unlit) panel or fly through it.
      base.camera = {position: [0, 0.5, 1.5], lookAt: [0, 0, SCREEN_POS[2]], fov: lerp(52, 36, tIn)};
      // Fade the barrier back as attention shifts to the pattern forming on
      // the screen — a wall-sized panel that close to the camera would
      // otherwise block the whole view it's supposed to be receding behind.
      base.barrier = {position: [0, 0, BARRIER_Z], opacity: lerp(1, 0.2, Math.min(1, tIn * 2))};
      base.waveLobes = [
        {position: SLIT_L, scale: 0.45, opacity: 1 - 0.4 * tIn},
        {position: SLIT_R, scale: 0.45, opacity: 1 - 0.4 * tIn},
      ];
      base.waveSheets = [
        {from: SLIT_L, to: [0, 0, MID_GAP_Z], opacity: 0.7},
        {from: SLIT_R, to: [0, 0, MID_GAP_Z], opacity: 0.7},
      ];
      base.screen = {
        position: SCREEN_POS,
        interferenceAmt: easeInOut(t),
        twoBandAmt: 0,
        multiAmt: 0,
        panelGlow: 1,
      };
      return base;
    }

    // -----------------------------------------------------------------------
    // "That's almost like the particle somehow went through both paths." —
    // replay as a single wavefunction extending through both slits, then
    // recombining. Camera follows the wave, weaving between both paths.
    // -----------------------------------------------------------------------
    case 'almostBothPaths': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      const weave = Math.sin(t * Math.PI * 3) * 0.5;
      const recombineZ = MID_GAP_Z - 1.0;
      base.camera = {position: [weave, 0.5, lerp(-1.4, recombineZ + 1.9, tIn)], lookAt: [0, 0, SCREEN_POS[2]], fov: 50};
      base.barrier = {position: [0, 0, BARRIER_Z], opacity: 0.6};
      base.screen = {position: SCREEN_POS, interferenceAmt: 1, twoBandAmt: 0, multiAmt: 0, panelGlow: 1};
      const extend = clamp01(t / 0.7);
      const recombine = easeInOut(clamp01((t - 0.7) / 0.3));
      const farL = lerpV3(SLIT_L, [0, 0, recombineZ], extend);
      const farR = lerpV3(SLIT_R, [0, 0, recombineZ], extend);
      base.waveLobes = [
        {position: farL, scale: 0.45 * (1 - recombine * 0.6), opacity: 1 - recombine},
        {position: farR, scale: 0.45 * (1 - recombine * 0.6), opacity: 1 - recombine},
        {position: [0, 0, recombineZ], scale: 0.5 * recombine, opacity: recombine},
      ];
      base.waveSheets = [
        {from: SLIT_L, to: farL, opacity: 0.75},
        {from: SLIT_R, to: farR, opacity: 0.75},
      ];
      return base;
    }

    // -----------------------------------------------------------------------
    // "So did it actually split into two particles?" — the (incorrect) idea
    // shown ONLY as two faint, flickering, translucent wave-lobes (never
    // solid duplicate particle-balls) posed as a visual question. Quick zoom
    // toward the eventual "NO".
    // -----------------------------------------------------------------------
    case 'splitQuestion': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      // Side-on framing (same trick as ballAppears/ghostDuplicate): the two
      // lobes are 2.6 world-units apart along X, which a portrait frame
      // can't fit head-on at any sane distance. Viewed from the side, that
      // separation reads as depth instead of screen-width, so both fit.
      base.camera = {position: [4.4, 0.3, lerp(2.0, 2.0, tIn)], lookAt: [0, 0, 2], fov: lerp(46, 30, tIn)};
      const flickerL = 0.65 + 0.35 * Math.sin(frame * 0.6);
      const flickerR = 0.65 + 0.35 * Math.sin(frame * 0.6 + 2.1);
      const fade = 1 - easeIn(clamp01((t - 0.7) / 0.3));
      base.waveLobes = [
        {position: BALL_LEFT, scale: 0.62, opacity: flickerL * fade},
        {position: GHOST_RIGHT, scale: 0.62, opacity: flickerR * fade},
      ];
      return base;
    }

    // -----------------------------------------------------------------------
    // "No." — the two question-lobes collapse into a single lobe as the
    // camera punches in. (Label "NO" rendered by Captions.tsx.)
    // -----------------------------------------------------------------------
    case 'no': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      base.camera = {position: [0, 0.2, lerp(1.4, 0.9, tIn)], lookAt: ORIGIN, fov: lerp(42, 36, tIn)};
      base.waveLobes = [{position: ORIGIN, scale: 0.5 * (1 - 0.3 * tIn), opacity: 1}];
      return base;
    }

    // -----------------------------------------------------------------------
    // "There's still only one particle." — return to a single glowing
    // particle hitting the screen. Macro tracking shot.
    // -----------------------------------------------------------------------
    case 'stillOneParticle': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      const particlePos = lerpV3(ORIGIN, [0, 0, NEAR_SCREEN_Z], easeInOut(t));
      base.camera = {position: [0, 0.25, particlePos[2] + 1.3], lookAt: particlePos, fov: 42};
      const lobeOpacity = 1 - easeOut(clamp01(t / 0.25));
      if (lobeOpacity > 0.01) base.waveLobes = [{position: particlePos, scale: 0.4, opacity: lobeOpacity}];
      base.particle = {position: particlePos, scale: 1, opacity: easeIn(clamp01((t - 0.05) / 0.3))};
      base.screen = {
        position: SCREEN_POS,
        interferenceAmt: 1,
        twoBandAmt: 0,
        multiAmt: 0,
        panelGlow: 1 + pulse(frame, 10) * (t > 0.9 ? 0.5 : 0),
      };
      return base;
    }

    // -----------------------------------------------------------------------
    // "And the strangest part ... quantum mechanics describes it using a
    // wave function," — particle transforms into a spreading probability
    // wave. Camera flies alongside the expanding wave.
    // -----------------------------------------------------------------------
    case 'waveFunction': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      const travel = lerpV3([0, 0, 3.6], [0, 0, 0.3], easeInOut(t));
      base.camera = {position: [lerp(-1.6, 1.6, tIn), 0.6, travel[2] + 2.4], lookAt: travel, fov: 50};
      const morph = easeInOut(clamp01((t - 0.25) / 0.6));
      base.particle = {position: travel, scale: 1, opacity: 1 - morph};
      if (morph > 0.01) base.waveLobes = [{position: travel, scale: 0.35 + morph * 0.9, opacity: morph}];
      base.barrier = {position: [0, 0, BARRIER_Z], opacity: 1};
      base.screen = {position: SCREEN_POS, interferenceAmt: 0, twoBandAmt: 0, multiAmt: 0, panelGlow: 1};
      return base;
    }

    // -----------------------------------------------------------------------
    // "which can spread across multiple possibilities." — wavefunction
    // extends through both slits and across multiple positions on the
    // detector. Large pull-back revealing the full probability field.
    // -----------------------------------------------------------------------
    case 'spreadPossibilities': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      base.camera = {position: lerpV3([0, 0.7, 2.2], [0, 2.0, 6.4], tIn), lookAt: [0, 0, -1.2], fov: 58};
      base.barrier = {position: [0, 0, BARRIER_Z], opacity: 1};
      const spread = easeOut(t);
      base.waveLobes = [
        {position: SLIT_L, scale: 0.42, opacity: 1},
        {position: SLIT_R, scale: 0.42, opacity: 1},
      ];
      base.waveSheets = [
        {from: SLIT_L, to: SCREEN_POS, opacity: 0.5},
        {from: SLIT_R, to: SCREEN_POS, opacity: 0.5},
      ];
      base.possibilityCloud = {center: [0, 0, NEAR_SCREEN_Z], spreadX: 1.0 * spread, count: 5, opacity: spread};
      base.screen = {position: SCREEN_POS, interferenceAmt: 0, twoBandAmt: 0, multiAmt: spread, panelGlow: 1};
      return base;
    }

    // -----------------------------------------------------------------------
    // "But now, try to find out exactly which path it took." — small
    // detectors appear beside each slit ("WHICH PATH?"). Slow push toward
    // the detectors.
    // -----------------------------------------------------------------------
    case 'findOutWhichPath': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      base.camera = {position: lerpV3([0, 2.0, 6.4], [0.4, 0.6, 1.6], tIn), lookAt: [0.2, 0, 0], fov: 50};
      base.barrier = {position: [0, 0, BARRIER_Z], opacity: 1};
      const fadeCloud = 1 - easeOut(t);
      base.waveLobes = [
        {position: SLIT_L, scale: 0.4 * fadeCloud, opacity: fadeCloud},
        {position: SLIT_R, scale: 0.4 * fadeCloud, opacity: fadeCloud},
      ];
      const detOp = easeOut(clamp01((t - 0.15) / 0.5));
      base.detectors = [
        {position: [SLIT_L[0] - 0.35, 0.15, 0.25], active: 0, opacity: detOp},
        {position: [SLIT_R[0] + 0.35, 0.15, 0.25], active: 0, opacity: detOp},
      ];
      base.screen = {position: SCREEN_POS, interferenceAmt: fadeCloud, twoBandAmt: 0, multiAmt: 0, panelGlow: 1};
      return base;
    }

    // -----------------------------------------------------------------------
    // "Measure it," — the left detector activates/glows as the particle
    // passes; one path lights up distinctly. Extreme close-up.
    // SOUND DESIGN: measurement / collapse moment (frame ~1454).
    // -----------------------------------------------------------------------
    case 'measureDetector': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      const detPos: V3 = [SLIT_L[0] - 0.35, 0.15, 0.25];
      base.camera = {position: [detPos[0] + 0.45, detPos[1] + 0.25, detPos[2] + 1.5], lookAt: detPos, fov: 38};
      base.detectors = [
        {position: detPos, active: easeOut(t), opacity: 1},
        {position: [SLIT_R[0] + 0.35, 0.15, 0.25], active: 0, opacity: 1},
      ];
      base.barrier = {position: [0, 0, BARRIER_Z], opacity: 1};
      const flashPos = lerpV3(SOURCE, SLIT_L, 0.92);
      base.particle = {position: flashPos, scale: 0.8, opacity: 1 - t};
      return base;
    }

    // -----------------------------------------------------------------------
    // "and that interference completely disappears." — screen animates from
    // interference bands into a simple two-band distribution.
    // -----------------------------------------------------------------------
    case 'interferenceDisappears': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      base.camera = {position: lerpV3([0.6, 0.6, 1.4], [0, 0.4, -1.2], tIn), lookAt: [0, 0, SCREEN_POS[2]], fov: 46};
      base.barrier = {position: [0, 0, BARRIER_Z], opacity: 1};
      base.detectors = [
        {position: [SLIT_L[0] - 0.35, 0.15, 0.25], active: 1 - 0.4 * tIn, opacity: 1},
        {position: [SLIT_R[0] + 0.35, 0.15, 0.25], active: 0, opacity: 1},
      ];
      base.screen = {
        position: SCREEN_POS,
        interferenceAmt: 1 - easeInOut(t),
        twoBandAmt: easeInOut(t),
        multiAmt: 0,
        panelGlow: 1,
      };
      return base;
    }

    // -----------------------------------------------------------------------
    // "The particle gives you one definite result," — one particle at one
    // definite detection point ("ONE RESULT"). Macro push-in.
    // -----------------------------------------------------------------------
    case 'oneResult': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      const resultPoint: V3 = [-0.32 * 1.3, 0, NEAR_SCREEN_Z];
      base.camera = {position: lerpV3([0, 0.4, -1.2], [resultPoint[0] * 0.6, 0.15, resultPoint[2] + 0.9], tIn), lookAt: resultPoint, fov: lerp(46, 34, tIn)};
      base.screen = {position: SCREEN_POS, interferenceAmt: 0, twoBandAmt: 1, multiAmt: 0, panelGlow: 1};
      base.particle = {position: resultPoint, scale: 1, opacity: 1};
      return base;
    }

    // -----------------------------------------------------------------------
    // "meaning the particle isn't literally a tiny ball sitting in two
    // places like a normal object." — return to the classical-ball analogy;
    // the ghosted duplicate dissolves away. Slow pull-back.
    // -----------------------------------------------------------------------
    case 'meaningBallAnalogy': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      base.camera = {position: lerpV3([3.6, 0.5, 1.6], [5.4, 0.6, 2.6], tIn), lookAt: [0, 0, 2.0], fov: 46};
      base.classicalBall = {position: BALL_LEFT, scale: 1, opacity: 1, ghost: false};
      const dissolveT = clamp01((t - 0.35) / 0.45);
      base.ghostBall = {position: GHOST_RIGHT, scale: 1, opacity: (1 - easeInOut(dissolveT)) * 0.55, ghost: true};
      base.xMark = {position: GHOST_RIGHT, scale: 1, opacity: (1 - easeInOut(dissolveT)) * 0.7};
      if (dissolveT > 0.02 && dissolveT < 0.98) {
        base.waveLobes = new Array(4).fill(0).map((_, i) => {
          const a = (i / 4) * Math.PI * 2 + t * 3;
          const r = dissolveT * 0.7;
          return {
            position: [GHOST_RIGHT[0] + Math.cos(a) * r, GHOST_RIGHT[1] + Math.sin(a * 1.4) * r * 0.5, GHOST_RIGHT[2] + Math.sin(a) * r],
            scale: 0.1,
            opacity: (1 - dissolveT) * 0.5,
          };
        });
      }
      return base;
    }

    // -----------------------------------------------------------------------
    // "It's something much stranger." — the ball dissolves into the quantum
    // probability cloud. 360 orbit around the cloud.
    // -----------------------------------------------------------------------
    case 'muchStranger': {
      const {t} = local(frame, beat.start, beat.end);
      const angle = t * Math.PI * 2;
      base.camera = {position: orbitPos(BALL_LEFT, 2.6, 0.7, angle), lookAt: BALL_LEFT, fov: 48};
      const ballOpacity = 1 - easeInOut(clamp01(t / 0.6));
      base.classicalBall = {position: BALL_LEFT, scale: 1, opacity: Math.max(0, ballOpacity), ghost: false};
      const cloudOpacity = easeInOut(clamp01((t - 0.35) / 0.55));
      base.waveLobes = [{position: BALL_LEFT, scale: 0.6 + cloudOpacity * 0.3, opacity: cloudOpacity}];
      return base;
    }

    // -----------------------------------------------------------------------
    // "Before measurement, quantum mechanics can describe multiple possible
    // outcomes at once." — cloud spreads across both paths, then multiple
    // glowing probability regions pulse on the screen. Wide shot, slight
    // drift.
    // -----------------------------------------------------------------------
    case 'beforeMeasurement': {
      const {t} = local(frame, beat.start, beat.end);
      const drift: V3 = [0.4 + Math.sin(frame * 0.015) * 0.15, 0.6 + Math.cos(frame * 0.012) * 0.08, 4.6];
      base.camera = {position: drift, lookAt: [0, 0, -0.8], fov: 56};
      base.barrier = {position: [0, 0, BARRIER_Z], opacity: 1};
      const spreadT = clamp01(t / 0.35);
      base.waveLobes = [
        {position: SLIT_L, scale: 0.42 * easeOut(spreadT), opacity: easeOut(spreadT)},
        {position: SLIT_R, scale: 0.42 * easeOut(spreadT), opacity: easeOut(spreadT)},
      ];
      const multiT = easeOut(clamp01((t - 0.3) / 0.7));
      base.possibilityCloud = {center: [0, 0, NEAR_SCREEN_Z], spreadX: 1.0 * multiT, count: 5, opacity: multiT};
      base.screen = {position: SCREEN_POS, interferenceAmt: 0, twoBandAmt: 0, multiAmt: multiT, panelGlow: 1};
      return base;
    }

    // -----------------------------------------------------------------------
    // "And that's why the quantum world doesn't behave the way our everyday
    // world does." — split screen: left = classical ball, one clean path;
    // right = quantum wavefunction, multiple possibilities at once. Camera
    // slowly moves between the two sides.
    // -----------------------------------------------------------------------
    case 'quantumWorldSplit': {
      const {t, tIn} = local(frame, beat.start, beat.end);
      base.camera = {position: [lerp(-2.6, 2.6, tIn), 0.6, 3.6], lookAt: [lerp(-2.6, 2.6, tIn), 0, 0], fov: 50};
      base.splitDividerOpacity = 1;
      const ballPos = lerpV3([-3.0, 0, 1.4], [-3.0, 0, -1.4], clamp01(t));
      base.classicalBall = {position: ballPos, scale: 0.9, opacity: 1, ghost: false};
      base.possibilityCloud = {center: [3.0, 0, -0.3], spreadX: 0.9, count: 5, opacity: 1};
      return base;
    }

    // -----------------------------------------------------------------------
    // "Because at that scale," — continuous dive from a human-scale
    // reference object down toward the quantum visualization. Extreme
    // continuous zoom, no cuts.
    // -----------------------------------------------------------------------
    case 'diveIntoAtom': {
      const {t} = local(frame, beat.start, beat.end);
      const diveT = easeIn(t);
      base.camera = {position: [0, 0, lerp(14, 0.35, diveT)], lookAt: [0, 0, -2], fov: lerp(45, 70, diveT)};
      base.humanScaleObject = {position: [0, 0, 6], scale: 1.6, opacity: clamp01(1 - diveT * 2.2)};
      base.particle = {position: ORIGIN, scale: 1, opacity: clamp01(diveT * 1.8 - 0.4)};
      return base;
    }

    // -----------------------------------------------------------------------
    // "reality gets weird." — rapid montage (wave -> splits -> interferes ->
    // collapses), then a hard freeze on the final detection point. The
    // freeze is only in the FOREGROUND state; the ambient shimmer field
    // (see AmbientField.tsx) keeps drifting underneath so the screen is
    // never literally dead.
    // LOOP: this final framing (single particle, centered, calm) is chosen
    // to match-cut straight back into `intro`'s opening frame.
    // -----------------------------------------------------------------------
    case 'realityWeird': {
      const rawT = prog(frame, beat.start, beat.end);
      const t = clamp01(rawT / 0.82); // freeze the last ~18% of the beat
      const stage = clamp01(t) * 5;
      base.camera = {position: [0, 0.4, lerp(1.4, 5.8, clamp01(t))], lookAt: ORIGIN, fov: 50};
      base.barrier = {position: [0, 0, BARRIER_Z], opacity: clamp01(stage - 1)};
      base.screen = {
        position: SCREEN_POS,
        interferenceAmt: clamp01(Math.min(stage - 2, 4 - stage)),
        twoBandAmt: clamp01(stage - 3.3),
        multiAmt: 0,
        panelGlow: 1,
      };
      if (stage < 1) {
        base.particle = {position: ORIGIN, scale: 1, opacity: 1};
      } else if (stage < 2) {
        base.waveLobes = [{position: ORIGIN, scale: 0.4 + (stage - 1) * 0.3, opacity: 1}];
      } else if (stage < 3) {
        const s = stage - 2;
        base.waveLobes = [
          {position: SLIT_L, scale: 0.4, opacity: s},
          {position: SLIT_R, scale: 0.4, opacity: s},
        ];
      } else if (stage < 4) {
        // interference reads via screen.interferenceAmt above
      } else {
        base.particle = {position: [-0.4, 0, NEAR_SCREEN_Z], scale: 1, opacity: clamp01(stage - 4)};
      }
      return base;
    }

    default:
      return base;
  }
};
