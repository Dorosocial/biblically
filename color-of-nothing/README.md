# "What Is the Color of Absolutely Nothing?" — Remotion + React Three Fiber

A standalone atmospheric short (9:16, 1080×1920) built with [Remotion](https://www.remotion.dev)
and [`@remotion/three`](https://www.remotion.dev/docs/three) (React Three Fiber). Near-total
darkness by default, with three deliberate, richly-saturated color-burst moments as the
emotional/visual payoff.

This is a **separate, unrelated project** from the MS-Paint-doodle Bible-teaching pipeline that
otherwise lives in this repo — different aspect ratio, different visual language, different stack.
It lives entirely inside `color-of-nothing/`.

## Structure

```
src/
  index.ts               Remotion entry point
  Root.tsx                <Composition> registration (fps=30, 1080x1920)
  timing.ts               Real Whisper-transcribed beat map — the source of truth for every cue
  ColorOfNothing.tsx       Top-level composition: audio + <ThreeCanvas> + HTML text overlays
  three/
    Scene.tsx              Central R3F scene — reads `seconds`, decides what's mounted per beat
    CameraRig.tsx           Keyframed camera (position/look/fov) driven by real audio timing
    EyeMark.tsx             The recurring "eyes" motif (also reused as the bigger diagram eye)
    ParticleField.tsx       Generic deterministic point-cloud (photons, dissolve debris, sparks)
    NeuralPathway.tsx       Glowing eye->brain curve with an optional traveling pulse
    BrainShape.tsx          Minimal abstract brain shape
    RoomEnvironment.tsx     POV dark-room wireframe + lamp/screen/window
    ColorField.tsx          ColorOrbs (distinct-hue scatter) + RainbowGradientPlane
    KeyTransitionSequence.tsx  The sequential WORLD->LIGHT->EYE->OBSERVER->gone disappearance
    lib/                    utils.ts (easing/interpolation), palette.ts, dotTexture.ts
  overlays/
    TextOverlay.tsx          Generic minimal sans-serif text overlay
    Overlays.tsx             PossibilityWords, BlackQuestionText, FourStageLabels, KeyTransitionLabels
public/audio/narration.mp3   The narration audio (copied from the uploaded file)
```

## Timing: transcribed, not guessed

`src/timing.ts` is transcribed from the real narration audio with Whisper (word-level
timestamps), not estimated from the brief's pacing sketch. The composition's `durationInFrames`
is derived directly from the audio's real duration (72.124063s @ 30fps = 2164 frames) — see the
comment block at the top of `timing.ts` for the full transcript and the reasoning behind mapping
each shot-list beat onto the real (considerably more condensed) audio.

## Motion language

- **Default**: restrained, subtle motion everywhere — slow camera drift/creep, a faint rim pulse
  on the eye marks, gentle particle movement. See `CameraRig.tsx`'s `driftAmpScale` /
  `gentleSine`-based idle sway.
- **Genuinely static**: camera fully locked (zero interpolation) only during the moments the brief
  explicitly marks "static" / "camera stops" — see `STATIC_WINDOWS` in `timing.ts`.
- **Color bursts**: three deliberate, vivid, multi-hue moments (color-cycle, world-floods, rainbow
  spectrum) — see `palette.ts` and the `ColorOrbs` / `RainbowGradientPlane` components.

## Rendering

```bash
npm install
npx remotion studio src/index.ts          # interactive preview
npx remotion render src/index.ts ColorOfNothing out/color-of-nothing.mp4
npx remotion still src/index.ts ColorOfNothing out/frame.png --frame=<N>
```

## Audio / sound design

Narration is synced from frame 1 using the real transcribed timing. This video calls for
near-silence / a restrained ambient tone rather than SFX hits — placeholder comments for where
sound design could land are left inline in `ColorOfNothing.tsx` (the four "eyes" moments, the
three color-burst moments, and the key transition sequence). Worth a dedicated pass once the
visual cut is locked.
