# Physics Laws That Look Like Magic — montage

9:16 (1080×1920) Remotion + React Three Fiber composition covering four
"impossible" physics demos in rapid-fire order: momentum, angular momentum,
energy conservation, and Newton's first law.

## Timing

`public/narration.mp3` is the source-of-truth audio (duration 47.124875s,
confirmed via `ffprobe`). It was transcribed with OpenAI Whisper
(`--model base --word_timestamps True`) to get exact word-level timestamps;
those timestamps — not the pacing references in the original brief — drive
every cut in `src/timing.ts`. The composition is `Math.ceil(47.124875 * 30)`
= **1414 frames** at 30fps, so the narration is never truncated.

`src/timing.ts` divides the video into five back-to-back `<Sequence>` "acts"
(opening hook, momentum, angular momentum, energy, Newton's first law), each
further split into named "beats" whose frame ranges are derived from the
real transcribed word timings — see the comment block at the top of that
file for the raw timestamps.

## Structure

- `src/Root.tsx` / `src/PhysicsMontage.tsx` — composition registration + the
  five `<Sequence>` acts + the narration `<Audio>` track (starts frame 0).
- `src/shots/*.tsx` — one file per act. Each mounts its own `<ThreeCanvas>`
  (from `@remotion/three`) and computes every transform directly from
  `useCurrentFrame()` — no `useFrame`/rAF-driven animation, so renders are
  frame-exact and reproducible.
- `src/components/` — reusable scene pieces:
  - `BicycleWheel.tsx` — procedural wheel (torus rim + radiating cylinder
    spokes + hub cylinder, brushed-metal material), reused as-is by the
    angular-momentum act.
  - `MetallicSphere.tsx`, `WireSupport` — the cradle/bouncing-ball spheres
    and their wire supports.
  - `PersonSilhouette.tsx` — capsule-body/sphere-head humanoid.
  - `Arrow3D.tsx` — velocity/force/momentum vector arrows + a curved-arrow
    approximation for the gyroscopic reaction cue.
  - `EnergyBar.tsx` — glowing 3D bar + HTML numeric readout.
  - `SceneLighting.tsx` / `Backdrop.tsx` / `CameraRig.tsx` — all lighting is
    built in code (ambient fill + directional key/rim + a per-shot focal
    point light); the backdrop is a solid near-black navy dome — no HDRI,
    no environment file, no grid.
  - `Label.tsx` — short HTML/CSS overlay labels (never paragraphs).

Sound-effect placeholders are left as `// SFX PLACEHOLDER: ...` comments at
every freeze/impact moment in the `src/shots/*.tsx` files.

## Commands

```bash
npm install
npx remotion studio src/index.ts      # interactive preview
npx remotion render src/index.ts PhysicsMontage out/physics-laws-montage.mp4
```
