# Remotion videos

9:16 (1080×1920) Remotion + React Three Fiber compositions. Two so far:

- **`SecondVsBillionYears`** — "A Second vs a Billion Years" scale-comparison video.
- **`ParticleSuperposition`** — "How Can One Particle Be in Two Places at the Same Time?", a double-slit-experiment explainer.

## Run

```bash
npm install
npm run start   # opens Remotion Studio (pick either composition)
npm run build   # renders out/second-vs-billion-years.mp4 (SecondVsBillionYears)
```

To render the other composition directly:

```bash
npx remotion render src/index.ts ParticleSuperposition out/particle-superposition.mp4
```

## Shared approach

Both compositions follow the same architecture:

- **Timing**: the real narration audio is transcribed with Whisper (word-level
  timestamps) to build the shot timeline, and `durationInFrames` is locked to
  the real audio length. Brief shot-list timestamps are pacing references
  against an imagined cut and don't match the real recordings, so every shot
  is placed at the real transcribed word times instead (see each video's
  `timing.ts` for the mapping notes).
- **3D scene**: one persistent `<ThreeCanvas>` for the whole video. A single
  frame-indexed keyframe track (`sceneState.ts`) drives the camera and every
  object's opacity/pose, so nothing pops or re-mounts across cuts. No
  HDRI/environment map — lighting is ambient + directional key + a few
  emissive/point lights, all in code.
- **HTML overlay**: numbers/labels are animated HTML/CSS, cross-fading in/out
  per shot (`shotEnvelope`) so cuts never leave a dead frame.
- **Continuous motion**: an always-on drifting particle field plus a tiny
  procedural camera sway run underneath everything, including punctuated-pause
  beats, so pauses read as a held beat, not a freeze.
- **Loop**: the camera's last keyframe and key objects' opacity tracks return
  to their frame-0 values, so the last frame match-cuts into the first.
- Sound-design placeholders are left as comments in each `ShotOverlay.tsx` at
  major transitions/pauses.

## SecondVsBillionYears specifics

`src/lib/`, `src/three/`, `src/overlay/`, `src/Composition.tsx`. Stopwatch,
person silhouette (capsule + sphere, aging via scale + color/glow shift),
Earth (procedurally textured, no external daymap asset), drifting continents,
displaced/eroding mountain terrain, and simple species-marker silhouettes are
all hand-built Three.js primitives.

## ParticleSuperposition specifics

`src/particle/`. Particle (single glowing sphere, never duplicated), classical
ball + ghosted duplicate (for the "one object, one place" analogy), a real
double-slit barrier (built from separate box segments with two physical
gaps — not a texture cutout), a detection screen whose interference/two-band
texture is redrawn each frame from two scalars, and a `WaveField` component
representing the wavefunction as a translucent, glowing, undulating field
that extends into multiple lobes and recombines.

Science-accuracy notes applied throughout (see `sceneState.ts` and
`overlay/ShotOverlay.tsx` comments):

- Uses "quantum mechanics can describe a particle in a superposition of
  different possible states" framing for any on-screen text (the source
  narration audio itself says the older "a particle can exist in a
  superposition" phrasing, since it can't be re-recorded — but nothing
  on-screen repeats that wording).
- The particle **never** visually splits into two duplicate particle-balls.
  The "did it split into two particles?" beat is represented by the
  `WaveField` flickering ambiguously between a single lobe and two lobes,
  paired with a "2 PARTICLES?" text question — never by two discrete
  objects — followed by a "NO" and a return to the single particle.
