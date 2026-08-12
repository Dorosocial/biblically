# Quantum Double-Slit — "How Can One Particle Be in Two Places at the Same Time?"

A 9:16 (1080x1920) Remotion + React Three Fiber explainer video. The double-slit
experiment is the visual backbone; the narration audio (`public/narration.mp3`)
drives every timing decision.

## Timing

The composition length is locked to the real narration duration. `ffprobe`
reports **72.803250s**; at 30fps that's **2184 frames** (72.8s), the value used
for `durationInFrames` in `src/Root.tsx`. Whisper (small model, word-level
timestamps) produced the transcript used to derive every beat boundary in
`src/timeline.ts` — the shot-list timestamps in the original brief were pacing
references only; `timeline.ts`'s `BEATS` array holds the real, audio-anchored
numbers, and a self-check at module load throws if the beats ever stop tiling
`[0, 2184)` with no gaps or overlaps.

## Structure

```
src/
  timeline.ts          Beat boundaries (real audio timing) + label overlay timings
  Root.tsx / index.ts   Composition registration (1080x1920, 30fps, 2184 frames)
  Composition.tsx        Audio + <ThreeCanvas> + captions; sound-design placeholder comments
  scene/
    sceneState.ts         The orchestration layer: frame -> {camera, particle, wave, screen, ...}
    Particle.tsx           Glowing quantum particle (emissive sphere + fresnel halo)
    ClassicalBall.tsx       Matte opaque sphere (classical analogy) + XMark
    Wavefunction.tsx        WaveLobe / WaveSheet / PossibilityCloud — the ONLY way "both paths
                            at once" is depicted (never two duplicate particle-balls)
    Barrier.tsx             Two-slit panel (three box segments with two gaps)
    DetectionScreen.tsx     Shader-driven interference / two-band / multi-outcome screen
    Detector.tsx            Which-path measurement marker
    CameraRig.tsx           Imperatively drives the R3F camera from sceneState each frame
    AmbientField.tsx        Always-on subtle particle shimmer (guarantees no dead frames)
    shaders.ts              Halo / wavefunction / screen-pattern GLSL
  overlays/
    Captions.tsx            HTML/CSS label overlays (IMPOSSIBLE?, LEFT, RIGHT, NO, WHICH PATH?, ...)
```

Everything in `sceneState.ts` is a pure function of `frame` — no `useState`/
`useEffect`/animation loops — so every frame renders identically regardless of
how Remotion reaches it (required for correct server-side rendering).

## Science-accuracy notes applied

- The narration audio (pre-recorded, provided as input) says "a particle can
  exist in a superposition..."; the brief's more precise phrasing
  ("Quantum mechanics can describe a particle in a superposition...") could not
  be retrofitted into already-recorded audio without re-recording. If the
  narration is ever re-recorded, update the corresponding line and re-run
  Whisper — `timeline.ts`'s self-check will immediately flag any timing drift.
- The "did it split into two particles?" beat (`splitQuestion`, ~32–35s) never
  renders two discrete opaque particle-balls. It shows two translucent,
  undulating `WaveLobe` shapes (shader-based, additive-blended) — visually
  and materially distinct from the opaque `ClassicalBall` and the crisp
  emissive `Particle` — immediately resolving into the single-particle "No."

## Commands

```bash
npm install
npx remotion studio          # interactive preview
npx remotion render src/index.ts QuantumDoubleSlit out/quantum-double-slit.mp4
```

## Verified before full render

- **~2–4s "punctuated pause"**: camera drifts subtly, particle keeps a slow
  glow pulse, and the always-on `AmbientField` shimmer keeps drifting — never
  a true static frame.
- **"Did it split into two particles?" beat**: confirmed via rendered stills —
  two translucent wave-lobes, no duplicate solid balls.
- **Interference-pattern formation**: confirmed via rendered stills — clear
  alternating bright/dark bands animate in on the detection screen.

## Known follow-ups

- The barrier/detector materials carry a deliberately faint emissive tint so
  they never read as pure black in close shots, but the barrier is still a
  fairly dark, low-contrast object by design (plain dark backdrop, per brief).
  If a brighter barrier is wanted, bump `Barrier.tsx`'s `emissiveIntensity`.
- Sound design is stubbed with `SOUND DESIGN` comments in `Composition.tsx` at
  the four major transitions called out in the brief — no audio has been
  added there yet.
