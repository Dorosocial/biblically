/**
 * Pure, deterministic choreography for the whole video.
 *
 * Everything here is a function of an absolute frame number — nothing is
 * accumulated via wall-clock time or React state. That's required for
 * Remotion + React Three Fiber: frames can render out of order (or once,
 * standalone, during `remotion render`), so every visual must be
 * recomputable from scratch given just `frame`.
 *
 * "Continuous zoom" illusion: rather than one true 19-orders-of-magnitude
 * 3D coordinate system (numerically unworkable, and not how these videos
 * are actually made), each scale object lives at a convenient ~1-unit
 * world scale and shots CROSSFADE between consecutive objects — one grows
 * to fill the frame as the next fades out at the same screen position,
 * repeated down the whole scale chain. That crossfade *is* the zoom.
 */
import * as THREE from 'three';
import {CUE, DURATION_IN_FRAMES} from './timing';
import {ObjectState, HIDDEN} from './types';

const smoothstep = (t: number) => t * t * (3 - 2 * t);

export const kf = (frame: number, f0: number, f1: number, v0: number, v1: number, linear = false): number => {
  if (f1 <= f0) return v1;
  const t = THREE.MathUtils.clamp((frame - f0) / (f1 - f0), 0, 1);
  return v0 + (v1 - v0) * (linear ? t : smoothstep(t));
};

/** Fade in over [inStart,inEnd], hold at `peak`, fade out over [outStart,outEnd]. */
const fade = (frame: number, inStart: number, inEnd: number, outStart: number, outEnd: number, peak = 1): number => {
  if (frame < inStart || frame > outEnd) return 0;
  if (frame < inEnd) return kf(frame, inStart, inEnd, 0, peak, true);
  if (frame > outStart) return kf(frame, outStart, outEnd, peak, 0, true);
  return peak;
};

const lerpVec = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] => [
  THREE.MathUtils.lerp(a[0], b[0], t),
  THREE.MathUtils.lerp(a[1], b[1], t),
  THREE.MathUtils.lerp(a[2], b[2], t),
];

// ---------------------------------------------------------------------------
// shared positions (also used by overlays/Labels.tsx to track objects on screen)
// ---------------------------------------------------------------------------
export const ORIGIN: [number, number, number] = [0, 0, 0];
export const BESIDE_RIGHT: [number, number, number] = [1.55, 0.55, 0];
const BESIDE_RIGHT_LOW: [number, number, number] = [1.75, -0.4, 0];

/**
 * Shot 2's proton position (BESIDE_RIGHT -> ORIGIN as it grows), exported
 * so the camera can track it directly. Originally the camera in this shot
 * just looked at a fixed ORIGIN while the object was still off at
 * BESIDE_RIGHT — with this composition's narrow portrait FOV, that left
 * the small early-growth proton genuinely outside the horizontal frustum
 * for a couple of seconds (confirmed by projecting its NDC coordinates:
 * x values of 5-10, versus the visible range of -1..1). Tracking the same
 * trajectory for `lookAt` keeps the growing object centered throughout.
 */
export const protonGrowthPosition = (frame: number): [number, number, number] => {
  const shotStart = CUE.protonToBasketball;
  const shotEnd = CUE.basketballToEarth;
  const growEnd = shotStart + Math.round((shotEnd - shotStart) * 0.85);
  return lerpVec(BESIDE_RIGHT, ORIGIN, kf(frame, shotStart, growEnd, 0, 1));
};

export type SilhouetteKind = 'molecule' | 'hand' | 'person' | 'city' | 'world';

export interface SceneState {
  basketball: ObjectState;
  earth: ObjectState;
  proton: ObjectState;
  protonColor: string;
  hair: ObjectState;
  tunnel: {visible: boolean; opacity: number};
  atomLattice: (ObjectState & {solidity: number; gridSize: number; spacing: number}) | null;
  atom: (ObjectState & {electronCloudOpacity: number; nucleusScale: number; nucleusHighlightIndex: number | null}) | null;
  nucleusCluster: (ObjectState & {highlightIndex: number | null; count: number; memberRadius: number}) | null;
  chargeViz: ObjectState | null;
  silhouette: (ObjectState & {kind: SilhouetteKind}) | null;
  focusPoint: [number, number, number];
  focusColor: string;
  focusIntensity: number;
  fillIntensity: number;
  freeze: boolean;
  blurPx: number;
}

const baseState = (): SceneState => ({
  basketball: HIDDEN,
  earth: HIDDEN,
  proton: HIDDEN,
  protonColor: '#ff6a3d',
  hair: HIDDEN,
  tunnel: {visible: false, opacity: 0},
  atomLattice: null,
  atom: null,
  nucleusCluster: null,
  chargeViz: null,
  silhouette: null,
  focusPoint: [0, 2, 4],
  focusColor: '#dfe9ff',
  focusIntensity: 30,
  fillIntensity: 0.6,
  freeze: false,
  blurPx: 0,
});

/** CSS-blur "motion blur" fake: spikes for a few frames around a snap/transition point. */
const blurPulse = (frame: number, center: number, halfWidth: number, peak: number): number => {
  const d = Math.abs(frame - center);
  if (d > halfWidth) return 0;
  return peak * (1 - d / halfWidth);
};

export const getSceneState = (frame: number): SceneState => {
  const s = baseState();

  // ---- Shot 1: hook — the proton itself opens the video, alone in the dark;
  // the basketball only fades in afterward as its size reference -----------
  // The narrator's very first line is "How small is a proton?" — the proton
  // has to be the first thing on screen for that question, not a basketball.
  if (frame < CUE.protonToBasketball) {
    const shotStart = CUE.hook;
    const shotEnd = CUE.protonToBasketball;
    const ballIn = shotStart + Math.round((shotEnd - shotStart) * 0.45);
    s.proton = {
      visible: true,
      position: BESIDE_RIGHT,
      scale: 0.05,
      opacity: fade(frame, shotStart, shotStart + 14, shotEnd - 5, shotEnd),
    };
    s.basketball = {
      visible: frame >= ballIn,
      position: ORIGIN,
      scale: 1,
      opacity: fade(frame, ballIn, ballIn + 16, shotEnd - 5, shotEnd),
    };
    s.focusPoint = frame < ballIn ? BESIDE_RIGHT : ORIGIN;
    // A bright, tight rim light on the lone proton against a near-black fill
    // reads as "wide negative space around the proton" — then the fill lifts
    // once the basketball arrives to give it a normal, comparable exposure.
    s.focusIntensity = frame < ballIn ? 36 : 22;
    s.fillIntensity = frame < ballIn ? 0.18 : 0.9;
  }

  // ---- Shot 2: proton expands to basketball size (crossfade) --------------
  // Shot 1 already faded the basketball out to 0 by this point — it stays
  // hidden here (HIDDEN default) so the growing proton has clear negative
  // space to expand into, then shot 3 fades the basketball back in beside Earth.
  else if (frame < CUE.basketballToEarth) {
    const shotStart = CUE.protonToBasketball;
    const shotEnd = CUE.basketballToEarth;
    const growEnd = shotStart + Math.round((shotEnd - shotStart) * 0.85);
    s.proton = {
      visible: true,
      position: protonGrowthPosition(frame),
      scale: kf(frame, shotStart, growEnd, 0.05, 1.35),
      opacity: fade(frame, shotStart, shotStart + 10, shotEnd - 4, shotEnd),
    };
    s.focusPoint = ORIGIN;
    s.focusIntensity = 26;
    s.fillIntensity = 0.9;
    // SFX PLACEHOLDER: scale change — deep whoosh/impact as the proton swells to basketball size
    s.blurPx = blurPulse(frame, shotStart + 12, 10, 4);
  }

  // ---- Shot 3: pull back — basketball beside an enormous Earth -----------
  else if (frame < CUE.reverseToProton) {
    const shotStart = CUE.basketballToEarth;
    const shotEnd = CUE.reverseToProton;
    s.proton = {visible: true, position: ORIGIN, scale: 1.35, opacity: fade(frame, shotStart, shotStart + 1, shotStart, shotStart + 8)};
    s.basketball = {
      visible: true,
      position: BESIDE_RIGHT_LOW,
      scale: 0.9,
      opacity: fade(frame, shotStart + 4, shotStart + 16, shotEnd - 6, shotEnd),
    };
    s.earth = {
      visible: true,
      position: [-0.6, 0.3, -1],
      scale: kf(frame, shotStart, shotEnd - 10, 0.1, 6.2),
      opacity: fade(frame, shotStart + 4, shotStart + 20, shotEnd - 6, shotEnd),
    };
    s.focusPoint = [-0.6, 0.3, -1];
    s.focusIntensity = 40;
    s.fillIntensity = 1.1;
    // SFX PLACEHOLDER: scale change — massive rushing whoosh for the reverse zoom reveal
    s.blurPx = blurPulse(frame, shotStart + 10, 12, 5);
  }

  // ---- Shot 4: Earth shrinks away, proton returns beside the basketball --
  else if (frame < CUE.protonScaleLabel) {
    const shotStart = CUE.reverseToProton;
    const shotEnd = CUE.protonScaleLabel;
    s.earth = {
      visible: true,
      position: [-0.6, 0.3, -1],
      scale: kf(frame, shotStart, shotStart + 20, 6.2, 0),
      opacity: fade(frame, shotStart, shotStart + 1, shotStart + 10, shotStart + 22),
    };
    s.basketball = {visible: true, position: ORIGIN, scale: 1, opacity: fade(frame, shotStart, shotStart + 10, shotEnd - 6, shotEnd)};
    const dotIn = shotStart + 24;
    s.proton = {visible: frame >= dotIn, position: BESIDE_RIGHT, scale: 0.05, opacity: fade(frame, dotIn, dotIn + 10, shotEnd - 6, shotEnd)};
    s.focusPoint = ORIGIN;
    s.focusIntensity = 24;
    s.fillIntensity = 0.85;
  }

  // ---- Shot 5: macro push-in on the proton, scale label appears ----------
  else if (frame < CUE.numberTyping) {
    const shotStart = CUE.protonScaleLabel;
    const shotEnd = CUE.numberTyping;
    s.basketball = {visible: true, position: ORIGIN, scale: 1, opacity: fade(frame, shotStart, shotStart + 1, shotStart + 4, shotStart + 20)};
    s.proton = {visible: true, position: BESIDE_RIGHT, scale: 0.05, opacity: 1};
    s.focusPoint = BESIDE_RIGHT;
    s.focusIntensity = 34;
    s.fillIntensity = 0.35;
  }

  // ---- Shot 6: number-typing beat — locked camera, typography only ------
  else if (frame < CUE.hairCut) {
    s.proton = {visible: true, position: BESIDE_RIGHT, scale: 0.05, opacity: 0.85};
    s.focusPoint = BESIDE_RIGHT;
    s.focusIntensity = 30;
    s.fillIntensity = 0.3;
    // SFX PLACEHOLDER: number-typing — soft rapid ticks synced to each digit, then a "collapse" whoosh into scientific notation
  }

  // ---- Shot 7: hard cut to a human hair, microscopically close ----------
  // Brightly lit on purpose — "you see it" is the whole point of this line,
  // so the hair needs to actually read clearly, not sit in near-darkness.
  else if (frame < CUE.hairTracking) {
    const shotStart = CUE.hairCut;
    const shotEnd = CUE.hairTracking;
    s.proton = {visible: true, position: BESIDE_RIGHT, scale: 0.05, opacity: fade(frame, shotStart, shotStart + 1, shotStart, shotStart + 2)};
    s.hair = {visible: true, position: [0, 0, 0], scale: 1, opacity: fade(frame, shotStart + 2, shotStart + 10, shotEnd - 4, shotEnd)};
    s.focusPoint = ORIGIN;
    s.focusIntensity = 30;
    s.fillIntensity = 0.85;
    // SFX PLACEHOLDER: hard cut — sharp cut sting into the hair close-up
  }

  // ---- Shot 8: hair fills the screen, macro tracking shot ----------------
  else if (frame < CUE.tunnelZoom) {
    const shotStart = CUE.hairTracking;
    const shotEnd = CUE.tunnelZoom;
    s.hair = {visible: true, position: [0, 0, 0], scale: 1, opacity: fade(frame, shotStart, shotStart + 1, shotEnd - 8, shotEnd)};
    s.focusPoint = [0, 0, 1];
    s.focusIntensity = 32;
    s.fillIntensity = 0.8;
  }

  // ---- Shot 9 (CRITICAL): continuous tunnel-zoom dive --------------------
  else if (frame < CUE.atomsReveal) {
    const shotStart = CUE.tunnelZoom;
    const shotEnd = CUE.atomsReveal;
    const span = shotEnd - shotStart;
    s.hair = {visible: true, position: [0, 0, 0], scale: 1, opacity: fade(frame, shotStart, shotStart + 1, shotStart, shotStart + Math.round(span * 0.12))};
    s.tunnel = {
      visible: true,
      opacity: fade(frame, shotStart, shotStart + Math.round(span * 0.1), shotStart + Math.round(span * 0.82), shotEnd),
    };
    // Speed ramps up through the dive — each "again" comes faster, so the
    // blur pulses get tighter/more frequent as frame approaches shotEnd.
    const t = (frame - shotStart) / span;
    s.blurPx = 2 + Math.pow(t, 2) * 10 + (Math.sin(t * 40) > 0.7 ? 3 : 0);
    s.focusPoint = [0, 0, -5];
    s.focusIntensity = 10;
    s.fillIntensity = 0.25;
    // SFX PLACEHOLDER: tunnel dive — accelerating whoosh/riser, pitch climbing toward atomsReveal
  }

  // ---- Shot 10: atoms reveal, dramatic slow-down -------------------------
  else if (frame < CUE.singleAtomNucleus) {
    const shotStart = CUE.atomsReveal;
    const shotEnd = CUE.singleAtomNucleus;
    s.tunnel = {visible: true, opacity: fade(frame, shotStart, shotStart + 1, shotStart, shotStart + 6)};
    s.atomLattice = {
      visible: true,
      position: ORIGIN,
      scale: kf(frame, shotStart, shotEnd, 0.7, 1.1),
      opacity: fade(frame, shotStart + 2, shotStart + 16, shotEnd - 6, shotEnd),
      solidity: 0.15,
      gridSize: 4,
      spacing: 1.1,
    };
    s.focusPoint = ORIGIN;
    s.focusIntensity = 20;
    s.fillIntensity = 0.5;
  }

  // ---- Shot 11: one atom enlarges — push toward the nucleus --------------
  else if (frame < CUE.nucleusToProton) {
    const shotStart = CUE.singleAtomNucleus;
    const shotEnd = CUE.nucleusToProton;
    s.atomLattice = {
      visible: true,
      position: ORIGIN,
      scale: 1.1,
      opacity: fade(frame, shotStart, shotStart + 1, shotStart, shotStart + 14),
      solidity: 0.15,
      gridSize: 4,
      spacing: 1.1,
    };
    s.atom = {
      visible: true,
      position: ORIGIN,
      scale: kf(frame, shotStart, shotEnd, 1.4, 3.2),
      opacity: fade(frame, shotStart + 6, shotStart + 20, shotEnd - 4, shotEnd),
      electronCloudOpacity: kf(frame, shotStart + Math.round((shotEnd - shotStart) * 0.4), shotEnd - 4, 1, 0.05),
      nucleusScale: 0.05,
      nucleusHighlightIndex: null,
    };
    s.focusPoint = ORIGIN;
    s.focusIntensity = 18;
    s.fillIntensity = 0.4;
  }

  // ---- Shot 12: dive through the nucleus, one proton highlighted ---------
  else if (frame < CUE.freezeReset) {
    const shotStart = CUE.nucleusToProton;
    const shotEnd = CUE.freezeReset;
    s.atom = {
      visible: true,
      position: ORIGIN,
      scale: 3.2,
      opacity: fade(frame, shotStart, shotStart + 1, shotStart, shotStart + 8),
      electronCloudOpacity: 0,
      nucleusScale: 0.05,
      nucleusHighlightIndex: null,
    };
    s.nucleusCluster = {
      visible: true,
      position: ORIGIN,
      scale: kf(frame, shotStart, shotEnd - 8, 0.6, 3.4),
      opacity: fade(frame, shotStart + 6, shotStart + 18, shotEnd - 4, shotEnd, 1),
      highlightIndex: 2,
      count: 6,
      memberRadius: 0.34,
    };
    s.focusPoint = ORIGIN;
    s.focusColor = '#ffe27a';
    s.focusIntensity = 26;
    s.fillIntensity = 0.35;
    // SFX PLACEHOLDER: punch-in — fast whoosh with a hard stop/thud landing exactly on the highlighted proton
    s.blurPx = blurPulse(frame, shotStart + 10, 10, 6);
  }

  // ---- Shot 13 (CRITICAL): RETENTION RESET — freeze on the lone proton --
  // Deliberately tiny + far, per the "wide negative space around the
  // proton" camera-language rule: this beat is the whole point of that
  // rule, so the dark emptiness reads before the text even lands.
  else if (frame < CUE.reverseToEmptySpace) {
    s.proton = {visible: true, position: ORIGIN, scale: 0.16, opacity: 1};
    s.focusPoint = ORIGIN;
    s.focusColor = '#ffe27a';
    s.focusIntensity = 7;
    s.fillIntensity = 0.03;
    s.freeze = true;
    // SFX PLACEHOLDER: freeze — everything drops out (silence/sub-drone) under "BUT LOOK AT THE EMPTY SPACE"
  }

  // ---- Shot 14: massive reverse zoom — proton -> nucleus -> full atom ----
  // Continues straight out of the freeze's tiny/far proton (scale 0.16 at
  // camera distance 6.5) rather than jump-cutting to a different framing —
  // the proton itself briefly carries over before the nucleus cluster
  // (which it's secretly "one of") fades in around it.
  else if (frame < CUE.atomToLattice) {
    const shotStart = CUE.reverseToEmptySpace;
    const shotEnd = CUE.atomToLattice;
    s.proton = {visible: true, position: ORIGIN, scale: 0.16, opacity: fade(frame, shotStart, shotStart + 1, shotStart, shotStart + 14)};
    s.nucleusCluster = {
      visible: true,
      position: ORIGIN,
      scale: kf(frame, shotStart, shotEnd, 0.16, 0.05),
      opacity: fade(frame, shotStart + 6, shotStart + 20, shotEnd - 6, shotEnd),
      highlightIndex: 2,
      count: 6,
      memberRadius: 0.34,
    };
    s.atom = {
      visible: true,
      position: ORIGIN,
      scale: kf(frame, shotStart, shotEnd, 0.16, 3.6),
      opacity: fade(frame, shotStart + 8, shotStart + 24, shotEnd - 4, shotEnd),
      electronCloudOpacity: kf(frame, shotStart + 10, shotStart + 30, 0, 1),
      nucleusScale: 0.001,
      nucleusHighlightIndex: null,
    };
    s.focusPoint = ORIGIN;
    s.focusIntensity = 20;
    s.fillIntensity = 0.6;
    // SFX PLACEHOLDER: scale change — long rushing pull-back whoosh revealing the atom's emptiness
  }

  // ---- Shot 15: single atom -> enormous solid lattice --------------------
  else if (frame < CUE.latticeTransparent) {
    const shotStart = CUE.atomToLattice;
    const shotEnd = CUE.latticeTransparent;
    s.atom = {
      visible: true,
      position: ORIGIN,
      scale: 3.6,
      opacity: fade(frame, shotStart, shotStart + 1, shotStart, shotStart + 14),
      electronCloudOpacity: 1,
      nucleusScale: 0.001,
      nucleusHighlightIndex: null,
    };
    s.atomLattice = {
      visible: true,
      position: [0, 0, -1],
      scale: kf(frame, shotStart, shotEnd, 0.3, 1.4),
      opacity: fade(frame, shotStart + 8, shotStart + 24, shotEnd - 4, shotEnd),
      solidity: 1,
      gridSize: 6,
      spacing: 1,
    };
    s.focusPoint = [0, 0, -1];
    s.focusIntensity = 22;
    s.fillIntensity = 0.7;
  }

  // ---- Shot 16: solid -> transparent, mostly empty space -----------------
  else if (frame < CUE.protonAlone) {
    const shotStart = CUE.latticeTransparent;
    const shotEnd = CUE.protonAlone;
    s.atomLattice = {
      visible: true,
      position: [0, 0, -1],
      scale: kf(frame, shotStart, shotEnd, 1.4, 2.2),
      opacity: fade(frame, shotStart, shotStart + 1, shotEnd - 10, shotEnd),
      solidity: kf(frame, shotStart, shotStart + Math.round((shotEnd - shotStart) * 0.7), 1, 0.04),
      gridSize: 6,
      spacing: 1,
    };
    s.focusPoint = [0, 0, -1];
    s.focusIntensity = 16;
    s.fillIntensity = 0.35;
  }

  // ---- Shot 17: everything gone except one proton, extreme close-up -----
  else if (frame < CUE.protonCharge) {
    const shotStart = CUE.protonAlone;
    const shotEnd = CUE.protonCharge;
    s.proton = {visible: true, position: ORIGIN, scale: 1, opacity: fade(frame, shotStart, shotStart + 8, shotEnd - 4, shotEnd)};
    s.focusPoint = ORIGIN;
    s.focusIntensity = 22;
    s.fillIntensity = 0.15;
  }

  // ---- Shot 18: "+" charge visualization, pull back to the nucleus ------
  else if (frame < CUE.explosiveReverseZoom) {
    const shotStart = CUE.protonCharge;
    const shotEnd = CUE.explosiveReverseZoom;
    s.proton = {visible: true, position: ORIGIN, scale: 1, opacity: 1};
    s.chargeViz = {visible: true, position: ORIGIN, scale: 1, opacity: fade(frame, shotStart, shotStart + 10, shotEnd - 10, shotEnd)};
    s.nucleusCluster = {
      visible: true,
      position: ORIGIN,
      scale: kf(frame, shotStart + 14, shotEnd, 0, 1.6),
      opacity: fade(frame, shotStart + 16, shotEnd - 6, shotEnd - 4, shotEnd, 0.9),
      highlightIndex: 2,
      count: 6,
      memberRadius: 0.34,
    };
    s.focusPoint = ORIGIN;
    s.focusColor = '#ffb44d';
    s.focusIntensity = 24;
    s.fillIntensity = 0.4;
  }

  // ---- Shot 19: explosive reverse zoom through six scale stand-ins -------
  else if (frame < CUE.finalPullToDarkness) {
    const shotStart = CUE.explosiveReverseZoom;
    const shotEnd = CUE.finalPullToDarkness;
    const stages: SilhouetteKind[] = ['molecule', 'hand', 'person', 'city', 'world'];
    const stageCount = stages.length + 1; // +1 for the initial proton beat
    const stageLen = (shotEnd - shotStart) / stageCount;
    const stageIndex = Math.min(stageCount - 1, Math.floor((frame - shotStart) / stageLen));
    const stageStart = shotStart + stageIndex * stageLen;
    const stageEnd = stageStart + stageLen;

    if (stageIndex === 0) {
      s.proton = {visible: true, position: ORIGIN, scale: kf(frame, stageStart, stageEnd, 1, 0.3), opacity: fade(frame, stageStart, stageStart + 2, stageEnd - 6, stageEnd)};
    } else {
      const kind = stages[stageIndex - 1];
      s.silhouette = {
        visible: true,
        kind,
        position: ORIGIN,
        scale: kf(frame, stageStart, stageEnd, 0.15, 1.5),
        opacity: fade(frame, stageStart, stageStart + 4, stageEnd - 6, stageEnd, 1),
      };
    }
    s.focusPoint = ORIGIN;
    s.focusIntensity = 18;
    s.fillIntensity = 0.6;
    // SFX PLACEHOLDER: explosive reverse zoom — a rapid-fire whoosh per stage, six quick hits
    s.blurPx = 3 + (((frame - shotStart) % Math.max(1, Math.round(stageLen))) < 4 ? 6 : 0);
  }

  // ---- Shot 20: pull into darkness, proton shrinks away, quark labels ----
  else {
    const shotStart = CUE.finalPullToDarkness;
    const shotEnd = DURATION_IN_FRAMES;
    s.proton = {
      visible: true,
      position: ORIGIN,
      scale: kf(frame, shotStart, shotEnd - 20, 0.3, 0.02),
      opacity: fade(frame, shotStart, shotStart + 4, shotEnd - 30, shotEnd - 6),
    };
    s.focusPoint = ORIGIN;
    s.focusIntensity = kf(frame, shotStart, shotEnd, 16, 0);
    s.fillIntensity = kf(frame, shotStart, shotEnd, 0.5, 0.02);
    // SFX PLACEHOLDER: final pull to darkness — fading rumble, resolving to silence right before the loop cut
  }

  return s;
};
