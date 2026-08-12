# A Second vs a Billion Years

9:16 (1080×1920) Remotion + React Three Fiber scale-comparison video.

## Run

```bash
npm install
npm run start   # opens Remotion Studio
npm run build   # renders out/second-vs-billion-years.mp4
```

## How it's built

- **Timing** (`src/lib/timing.ts`): the real narration (`public/audio/narration.mp3`,
  66.77s) was transcribed with Whisper (word-level timestamps) to build the
  25-shot timeline. The composition's `durationInFrames` is locked to that
  real audio length — the shot-list timestamps in the original brief were
  pacing references against a longer imagined cut and don't match the actual
  ~67s recording, so every shot here is placed at the real transcribed word
  times instead.
- **3D scene** (`src/three/`): one persistent `<ThreeCanvas>` for the whole
  video. A single frame-indexed keyframe track (`src/lib/sceneState.ts`)
  drives the camera and every object's opacity/pose, so nothing pops or
  re-mounts across cuts. Stopwatch, person silhouette (capsule + sphere,
  aging via scale + color/glow shift), Earth (procedurally textured, no
  external daymap asset), drifting continents, displaced/eroding mountain
  terrain, and simple species-marker silhouettes are all hand-built
  Three.js primitives — no HDRI/environment map; lighting is ambient +
  directional key + a couple of drifting point lights, all in code.
- **HTML overlay** (`src/overlay/`): all numbers/timelines/counters are
  animated HTML/CSS, cross-fading in/out per shot (`shotEnvelope`) so cuts
  never leave a dead frame.
- **Continuous motion**: an always-on drifting particle field
  (`AmbientField`) plus a tiny procedural camera sway run underneath
  everything, including both punctuated-pause beats ("That's already
  insane." / "Just think about that."), so pauses read as a held beat, not
  a freeze.
- **Loop**: the camera's last keyframe and the stopwatch/number opacity
  tracks both return to their frame-0 values, so the last frame match-cuts
  into the first.
- Sound-design placeholders are left as comments in `src/overlay/ShotOverlay.tsx`
  at each major scale-transition and at both pause moments.
