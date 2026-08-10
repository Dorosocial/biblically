# Twin Paradox — Remotion + React Three Fiber

A ~85s cinematic explainer of the twin paradox / time dilation, built as a
single Remotion composition (`TwinParadox`) driving a React Three Fiber
scene via `@remotion/three`.

## Real timing (read this first)

The brief's shot list used ~112s pacing references. The actual narration
audio (`narration-source.mp3`, transcribed with Whisper — see
`transcribe.py` / `transcript.json`) is **84.610563s**. Per the brief
("Composition length must exactly match the real audio duration"), the
composition is built on the **real** transcript timestamps, not the
pacing references — everything below is scaled to the real recording.

- FPS: 30
- Duration: 2539 frames (84.633s — rounded up from the audio so it's
  never truncated)
- `src/timing.ts` holds `BEATS`: one entry per narration beat, each with
  its exact Whisper-derived start/end (seconds) and the camera-language
  tag from the shot list (`pullback`, `pushin`, `locked`, `orbit`, `snap`,
  `pov`, `massive-pullback`, `dolly`, `chase`, `drift`, `rotate-with`,
  `tracking`, `match-cut`).

## Structure

- `src/Root.tsx` / `src/index.ts` — Remotion composition registration.
- `src/TwinParadoxComposition.tsx` — top-level: `<Audio>` + `<ThreeCanvas>`
  (flat/legacy lighting, no HDRI) + HTML `<Overlay>`.
- `src/Scene.tsx` — the director: per-frame camera pose (`getPose`) and
  per-beat object composition (`SceneContent`), hand-authored per beat to
  match the shot list's camera language.
- `src/Overlay.tsx` — all HTML/CSS text: numerals, split labels, "BOTH ARE
  RIGHT", "YES", "?", the velocity readout. No 3D text anywhere.
- `src/three/` — the reusable, build-once objects: `Earth` (textured
  sphere, `public/earth_daymap.jpg`), `Spacecraft` (procedural capsule +
  cone + fins), `ClockFace` (procedural face + ticks + glow, numerals are
  HTML overlays), `GearMechanism` (procedural meshing gears),
  `SpacetimeGrid` (custom-shader warped wireframe plane), `Humanoid`
  (capsule + sphere silhouette), `Lighting` (ambient + directional key +
  per-shot focus point/spot light — all code, no environment map),
  `CameraRig` (applies the computed pose to the default camera).
- `src/world.ts` — shared world-space layout (Earth/ship positions, the
  outbound/turnaround/return journey curve, the two-clock "studio" slots).

## The three retention moments

Pointers into `src/timing.ts` / rendered frame numbers (30fps):

- **Split-frame contradiction** — beat 4, ~11.0–12.9s, frame **348**.
  Locked-off camera, "TRAVELER — 5 YEARS" / "EARTH — 10 YEARS".
- **Big two-path spacetime reveal** — beat 30, ~73.8–77.2s, frame **2265**.
  Classic twin-paradox spacetime diagram: Earth's straight worldline vs.
  the traveler's bent path, massive pull-back.
- **Invisible loop match-cut** — beat 34, ~84.1–84.6s, frame **2538** is
  the last frame and matches frame 0's opening pose (Earth + launch-pose
  spacecraft) so playback restarts seamlessly.

Verify with:

```
npx remotion still TwinParadox out/frame-348.png --frame=348
npx remotion still TwinParadox out/frame-2265.png --frame=2265
npx remotion still TwinParadox out/frame-2538.png --frame=2538
```

or `npx remotion studio` and scrub to those frames directly.

## SFX placeholders

Marked with `// SFX PLACEHOLDER:` comments in `src/Scene.tsx` at every
freeze / hard beat: the split-frame lock (beat 4), the suspended-time
beat (5), the pre-"?" freeze (7), the "Yes." freeze (21, the big one),
and the big reveal's riser/impact (30).

## Commands

```
npm install
npx remotion studio          # interactive preview
npx remotion still TwinParadox out/frame.png --frame=N   # spot-check a frame
npm run build                 # full render -> out/twin-paradox.mp4
```
