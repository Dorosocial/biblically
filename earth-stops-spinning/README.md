# Earth Stops Spinning

A fresh Remotion project scaffolded from scratch for this channel — there
was no existing codebase to build `Figure.tsx` against, so this README
documents the conventions invented to make that request buildable, in case
they need to be reconciled with a "real" version of this channel later.

## What was invented, and why

The task referenced an existing `theme.ts`, `src/physics/rotation.ts`,
`Hook.tsx`, `FreezeFrame.tsx`, and an `EarthStopsSpinning` composition —
none of which existed anywhere in this repo or in any repo available to
this session. Rather than guess at conventions already settled elsewhere
(and likely get them wrong), everything below was built fresh, following
the task's own description as closely as possible:

- **`src/theme.ts`** — `color.accentReference` (cool blue, "the reference
  frame" / stationary) and `color.accentMotion` (warm orange, "the thing
  in motion") are the two colors every diagram in the channel should pick
  between, plus background/text/grid tokens.
- **`src/physics/rotation.ts`** — the angle-in/position-out trig pattern
  `Figure.tsx` was asked to follow. `pointOnCircle` (angle → point on a
  circle, clock convention) and `earthRotationAngle` (frame → angle) are
  the two primitives; `tangentHeading` gives the direction something
  flies off in when it leaves the circle (used by `FreezeFrame.tsx`).
- **`src/scenes/Hook.tsx`** — invented as "Earth spins, a figure rides the
  equator with it, title card asks the premise question." The brief said
  to replace "the plain circle marker riding the equator" with a
  `PosedFigure`; since no prior marker code existed, this scene was built
  around that marker from scratch.
- **`src/scenes/FreezeFrame.tsx`** — invented as "the instant rotation
  stops: one marker (reference) stays glued to the now-static ground, one
  marker (motion) keeps going in a straight line at the ground's old
  tangential speed" — the actual physics of the channel's premise
  (Newton's first law: nothing stops you, so you don't stop).
- **`EarthStopsSpinningComposition.tsx` / `Root.tsx`** — 1920x1080 @
  30fps, Hook (5s) → FreezeFrame (6s) back to back. No aspect ratio was
  specified; landscape was the default guess. No narration audio exists
  for this project yet, so there's no `<Audio>` track and no
  transcript-driven timing.

## Figure.tsx / PosedFigure.tsx

These two files are the **only** files that should define what a person
looks like on this channel. Every future scene imports `PosedFigure`, not
`Figure` directly:

```tsx
<PosedFigure pose="standing" x={960} y={540} color={theme.color.accentReference} />
```

Four poses ship out of the box (`FIGURE_POSES` in `Figure.tsx`):
`standing`, `walking`, `pointing`, `falling`. Each is just a `joints`
object — degrees in, segment endpoints out, no per-pose artwork. See the
comment block at the top of `Figure.tsx` for the joint-angle convention
(absolute shoulder/hip angles, relative elbow/knee bends, plus an added
`torsoTilt` field beyond the brief's original list — needed to actually
build the "falling, torso tilted" pose).

## Commands

```
npm install
npx remotion studio
npx remotion render EarthStopsSpinning out/earth-stops-spinning.mp4
```
