# Gyroscopic Precession — Bicycle Wheel

A Remotion + React Three Fiber composition explaining gyroscopic precession
using a bicycle wheel, narrated by `public/narration.mp3`. 1080×1920 (9:16).

Deliberately minimal visuals: the wheel(s), ghost wheels for the "expected
vs. actual" key shot, and exactly one arrow — the glowing angular-velocity
arc hugging the rim. No straight vector arrows (push/momentum/torque), no
trail lines — the wheel's own motion and the camera language carry the
explanation.

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
  spin angle, axle direction, ghost snapshots) is a function of an absolute
  frame number, never accumulated via wall-clock time or React state —
  required for Remotion + R3F, since frames can be rendered standalone/out
  of order during export. The split-screen comparison (shots 6-9) stacks
  its two wheels top/bottom (not side-by-side), to fit the 9:16 frame.
- `src/camera/cameraTimeline.ts` — the camera language (push/pull/orbit/
  snap/lock/360) implemented the same way, as `frame -> {position, lookAt,
  fov}`.
- `src/camera/CameraRig.tsx` — applies that state to the scene's default
  camera via `useThree` each render (not `<PerspectiveCamera makeDefault>`,
  which does not reliably register before a standalone/still frame capture).
- `src/scene/` — the rig built from primitives (torus rim/tire, cylinder
  spokes + hub, chrome `MeshStandardMaterial`), lighting (ambient +
  hemisphere + directional + 2 point lights, no HDRI/environment map), the
  one arrow (`SpinArc.tsx` — a curved line + cone hugging the rim, rebuilt
  every frame from the wheel's live axle direction and spin angle), and
  ghost wheels (`Wheel.tsx`'s `ghost` prop) for the key comparison shot.
- `src/overlays/Labels.tsx` — the only 2D/HTML pieces: the "ANGULAR
  MOMENTUM" / "GYROSCOPIC PRECESSION" text cards.
- `src/sfxPlaceholders.ts` — a registry of frame-numbered SFX drop points
  (also marked inline as `// SFX PLACEHOLDER:` comments at each site) so
  sound design can be added later without touching any timing.
- One persistent `<ThreeCanvas>` for the whole video (no per-shot remounts),
  so the wheel/camera stay continuous across cuts and the final shot can
  rhyme with frame 0 for a seamless loop.

## Commands

```bash
npm install
npm run studio   # remotion studio — live preview
npm run render   # renders out/gyroscopic-precession.mp4
```
