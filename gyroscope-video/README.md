# Gyroscopic Precession — Bicycle Wheel

A Remotion + React Three Fiber composition explaining gyroscopic precession
using a bicycle wheel, narrated by `public/narration.mp3`.

## Timing

`src/timing.ts` embeds the real Whisper ("small" model, word-level
timestamps) transcription of `public/narration.mp3`. Every cut, camera move,
and animation beat in the video is derived from those real timestamps (see
`CUE`/`CUE_SECONDS`) — not from the original storyboard's second-marks,
which were pacing references only. The composition's `durationInFrames` is
`ceil(realAudioDuration * fps)`, so the video is exactly as long as the
narration audio (54.5175s @ 30fps).

## Architecture

- `src/physics.ts` — pure, deterministic choreography. Everything (wheel
  spin angle, axle direction, ghost snapshots, arrow vectors, trails) is a
  function of an absolute frame number, never accumulated via wall-clock
  time or React state — required for Remotion + R3F, since frames can be
  rendered standalone/out of order during export.
- `src/camera/cameraTimeline.ts` — the camera language (push/pull/orbit/
  snap/lock/360) implemented the same way, as `frame -> {position, lookAt,
  fov}`.
- `src/camera/CameraRig.tsx` — applies that state to the scene's default
  camera via `useThree` each render (not `<PerspectiveCamera makeDefault>`,
  which does not reliably register before a standalone/still frame capture).
- `src/scene/` — the rig built from primitives (torus rim/tire, cylinder
  spokes + hub, chrome `MeshStandardMaterial`), lighting (ambient +
  hemisphere + directional + 2 point lights, no HDRI/environment map), 3D
  arrows (cylinder+cone), the curved rim spin-indicator, and trail lines.
  All trails are built by re-sampling the physics timeline's history at the
  current frame (`*TrailPoints` in physics.ts) — never drei's `<Trail>`,
  which accumulates over the real-time render loop and isn't safe for
  Remotion's frame-by-frame export.
- `src/overlays/Labels.tsx` — the only 2D/HTML pieces: the "ANGULAR
  MOMENTUM" / "GYROSCOPIC PRECESSION" text cards.
- `src/sfxPlaceholders.ts` — a registry of frame-numbered SFX drop points
  (also marked inline as `// SFX PLACEHOLDER:` comments at each site) so
  sound design can be added later without touching any timing.
- One persistent `<ThreeCanvas>` for the whole video (no per-shot remounts),
  so the wheel/camera/trails stay continuous across cuts and the final shot
  can rhyme with frame 0 for a seamless loop.

## Commands

```bash
npm install
npm run studio   # remotion studio — live preview
npm run render   # renders out/gyroscopic-precession.mp4
```
