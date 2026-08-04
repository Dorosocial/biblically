// =============================================================================
// sceneImage.tsx — full-bleed AI-generated image beats (faceless-channel mode).
//
// Replaces the talking head entirely: every span of the video is a
// SceneImageShot instead of the master camera feed. Built for /make-visuals.
//
// NOT a preset picker. This file is a MOTION TOOLKIT — raw, continuously
// parameterized primitives (wipe at any angle, iris of any shape, sweep at any
// angle/color, parallax, shake, drift). Claude composes a bespoke combination
// per beat during /make-visuals, reading the beat's content/mood, the same way
// it hand-authors a TSX shot rather than picking #3 from a dropdown. Two beats
// should not look like they used "the same effect" even if they both happen to
// use a wipe, because the angle/duration/easing/direction are chosen fresh
// each time, not reused wholesale.
//
// Frame-based only. No useState/useEffect — every value here is a pure
// function of `frame` and the params passed in, so it's deterministic and
// re-renderable.
// =============================================================================
import React from 'react';
import { AbsoluteFill, interpolate, Img, useCurrentFrame } from 'remotion';
import { EASINGS } from '../brand';
import { CLAMP } from './kit';

const r = (frame: number, a: number, b: number, from = 0, to = 1, easing = EASINGS.easeOut) =>
  interpolate(frame, [a, b], [from, to], { ...CLAMP, easing });

// ---------------------------------------------------------------------------
// PRIMITIVES — each takes explicit params (angle, direction, duration, shape…)
// and returns a style patch. None of these are "a style" on their own; they're
// ingredients. Compose 1-3 together per beat (e.g. wipe + light sweep, or
// scale + blur-focus) and vary the params every time.
// ---------------------------------------------------------------------------

/** Directional wipe reveal at an arbitrary angle (degrees, 0 = left-to-right). */
export function wipeIn(frame: number, dur: number, angleDeg: number, easing = EASINGS.easeInOut): React.CSSProperties {
  const p = r(frame, 0, dur, 0, 100, easing);
  // build an inset-style wedge by rotating a linear gradient mask
  return { clipPath: `polygon(0% 0%, ${p}% 0%, ${p}% 100%, 0% 100%)`, transform: `rotate(0deg)`, WebkitMaskImage: `linear-gradient(${angleDeg}deg, #000 ${p}%, transparent ${p}%)`, maskImage: `linear-gradient(${angleDeg}deg, #000 ${p}%, transparent ${p}%)` };
}

/** Iris reveal — circle or arbitrary polygon shape, arbitrary origin point. */
export function irisIn(frame: number, dur: number, opts: { shape?: 'circle' | 'ellipse'; originX?: number; originY?: number; maxRadius?: number } = {}): React.CSSProperties {
  const { shape = 'circle', originX = 50, originY = 50, maxRadius = 75 } = opts;
  const p = r(frame, 0, dur, 0, maxRadius, EASINGS.easeInOut);
  return { clipPath: `${shape}(${p}% at ${originX}% ${originY}%)` };
}

/** A light/color sweep pass at an arbitrary angle, color, and width. */
export function lightSweep(frame: number, dur: number, opts: { angleDeg?: number; color?: string; width?: number } = {}): React.CSSProperties {
  const { angleDeg = 115, color = 'rgba(255,255,255,0.35)', width = 18 } = opts;
  const sweep = r(frame, 0, dur, -20, 120, EASINGS.easeInOut);
  return {
    backgroundImage: `linear-gradient(${angleDeg}deg, transparent ${sweep - width}%, ${color} ${sweep}%, transparent ${sweep + width}%)`,
    backgroundBlendMode: 'overlay' as const,
  };
}

/** Scale/pop with tunable overshoot amount and duration. amount=0 -> no overshoot. */
export function scalePop(frame: number, dur: number, opts: { from?: number; overshoot?: number } = {}): React.CSSProperties {
  const { from = 0.92, overshoot = 0.03 } = opts;
  const settle = dur * 0.65;
  const s1 = r(frame, 0, settle, from, 1 + overshoot, EASINGS.easeOut);
  const s2 = r(frame, settle, dur, 1 + overshoot, 1, EASINGS.easeInOut);
  const scale = frame < settle ? s1 : s2;
  return { transform: `scale(${scale})` };
}

/** Blur-to-focus with a paired slight zoom-out, tunable strength. */
export function blurFocus(frame: number, dur: number, opts: { startBlur?: number; startScale?: number } = {}): React.CSSProperties {
  const { startBlur = 14, startScale = 1.08 } = opts;
  const blur = r(frame, 0, dur, startBlur, 0, EASINGS.easeOut);
  const scale = r(frame, 0, dur, startScale, 1, EASINGS.easeOut);
  return { filter: `blur(${blur}px)`, transform: `scale(${scale})` };
}

/** Simple fade, for compositing under any of the above (most beats want opacity + one other primitive). */
export function fadeIn(frame: number, dur: number): React.CSSProperties {
  return { opacity: r(frame, 0, dur) };
}
export function fadeOut(frame: number, exitStart: number, dur: number): React.CSSProperties {
  const t = frame - exitStart;
  if (t < 0) return {};
  return { opacity: r(t, 0, dur, 1, 0) };
}

/** Fine tremor/shake — for storm, conflict, urgency beats. Small amplitude by default. */
export function shake(frame: number, opts: { ampPx?: number; freq?: number } = {}): { transform: string } {
  const { ampPx = 4, freq = 2.4 } = opts;
  const x = Math.sin(frame * freq) * ampPx;
  const y = Math.cos(frame * freq * 1.3) * ampPx * 0.6;
  return { transform: `translate(${x}px, ${y}px)` };
}

/** Continuous slow hold-drift so a beat never reads as a static frame. Direction/scale are per-beat choices, not fixed. */
export function holdDrift(frame: number, durationInFrames: number, opts: { dirXPx?: number; dirYPx?: number; zoomDelta?: number } = {}): React.CSSProperties {
  const { dirXPx = 0, dirYPx = 0, zoomDelta = 0.04 } = opts;
  const x = interpolate(frame, [0, durationInFrames], [0, dirXPx], { ...CLAMP, easing: EASINGS.easeInOut });
  const y = interpolate(frame, [0, durationInFrames], [0, dirYPx], { ...CLAMP, easing: EASINGS.easeInOut });
  const s = interpolate(frame, [0, durationInFrames], [1, 1 + zoomDelta], { ...CLAMP, easing: EASINGS.easeInOut });
  return { transform: `translate(${x}px, ${y}px) scale(${s})` };
}

// ---------------------------------------------------------------------------
// combine() — merges style patches; later entries win on collision, but
// transforms/filters/clipPaths COMPOSE (concatenate) instead of overwriting,
// so e.g. scalePop + holdDrift both apply rather than one clobbering the other.
// ---------------------------------------------------------------------------
export function combine(...patches: React.CSSProperties[]): React.CSSProperties {
  const out: React.CSSProperties = {};
  let transforms: string[] = [];
  let filters: string[] = [];
  for (const p of patches) {
    for (const [k, v] of Object.entries(p)) {
      if (v === undefined) continue;
      if (k === 'transform') { transforms.push(v as string); continue; }
      if (k === 'filter') { filters.push(v as string); continue; }
      (out as any)[k] = v;
    }
  }
  if (transforms.length) out.transform = transforms.join(' ');
  if (filters.length) out.filter = filters.join(' ');
  return out;
}

// ---------------------------------------------------------------------------
// SceneImageShot — a thin frame. It does NOT decide the motion. Pass in
// `entrance` / `exit` / `hold` as functions of `frame`, composed per beat in
// the calling shot file using the primitives above. This keeps every beat's
// motion authored, not templated.
// ---------------------------------------------------------------------------
export const SceneImageShot: React.FC<{
  src: string;
  durationInFrames: number;
  frameStyle: (frame: number, durationInFrames: number) => React.CSSProperties;
}> = ({ src, durationInFrames, frameStyle }) => {
  const frame = useCurrentFrame();
  const style = frameStyle(frame, durationInFrames);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#0a0a0f' }}>
      <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', ...style }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Example composition (this is what an authored beat looks like — write one
// like this per beat in remotion/src/shots/video-N/, don't loop a preset):
//
//   <SceneImageShot
//     src={lib('projects/video-1/scenes/beat-04.png')}
//     durationInFrames={190}
//     frameStyle={(frame, dur) => combine(
//       fadeIn(frame, 20),
//       wipeIn(frame, 20, 62),                       // angle chosen for THIS beat
//       frame >= dur - 18 ? fadeOut(frame, dur - 18, 18) : {},
//       holdDrift(frame, dur, { dirXPx: -30, zoomDelta: 0.05 }),
//     )}
//   />
//
// KNOWN LIMITATION — bake.py concatenates shots at hard frame boundaries (no
// inter-shot blend). A fadeOut/wipe-out against the next beat's entrance READS
// as a transition but is not a literal blended cross-dissolve of two frames.
// A true overlapping dissolve needs a small bake.py change (short overlap-
// blend at each cutaway boundary) — flag to the user, don't silently skip it.
// ---------------------------------------------------------------------------
