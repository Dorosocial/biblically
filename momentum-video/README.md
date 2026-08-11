# Momentum Comparison — "Tiny Ball vs. Giant Ball"

A 9:16 (1080×1920) Remotion composition built with React Three Fiber
(`@remotion/three`), narrated by `public/audio/narration.mp3`.

## Run it

```bash
npm install
npm start        # opens Remotion Studio
npm run build     # renders out/momentum-comparison.mp4
```

Requires `ffmpeg` on the system PATH for rendering.

## How it's built

- **`src/Root.tsx`** — registers the `MomentumComparison` composition.
  `durationInFrames` is computed by `calculateMetadata` from the *real*
  measured duration of `public/audio/narration.mp3` (via
  `getAudioDurationInSeconds`) plus the fixed silent intro — never
  hardcoded.
- **`src/scenes/cues.ts`** — Whisper (medium.en, word-level timestamps)
  transcription of the narration, converted to composition-absolute frame
  numbers. See `whisper-transcript.json` / `.srt` for the raw transcript.
- **`src/scenes/sceneState.ts`** — the shot-by-shot choreography. One
  function per narration cue (`S1`…`S28`) plus a silent `introScene`,
  returning ball positions, camera pose, trails, and momentum arrows for
  any given frame.
- **`src/scenes/labels.ts`** — the short on-screen labels (`HEAVY`, `FAST`,
  `100× MASS`, `P = P`, `MOMENTUM = CONSTANT`, …) and climbing-number
  counters, timed against the same cues.
- **`src/three/`** — R3F primitives: `Balls.tsx` (giant/tiny sphere
  materials + idle motion), `Lighting.tsx` (all-code lighting rig, no
  HDRI), `CameraRig.tsx` (per-frame camera pose), `MotionTrail.tsx`,
  `MomentumArrow.tsx`.
- **`src/components/Overlay.tsx`** — HTML/CSS label + counter overlays.
- **`src/compositions/MomentumComparison.tsx`** — wires the `ThreeCanvas`,
  HTML overlay layer, and the narration `<Audio/>` together. Also documents
  the SFX placeholder cue points (no sound effects are included).

## Known, deliberate departures from the literal brief

1. **Audio says "hit harder", not "have more momentum".** The uploaded
   narration's opening line is *"This tiny ball can hit harder than this
   giant one"*, not the scientifically precise line the brief specified. Per
   user decision, the audio was kept as-is (required for exact sync/
   duration) and the precise momentum framing is carried entirely by
   on-screen labels (`P = P`, `MASS × VELOCITY`, `MOMENTUM = CONSTANT`,
   `4× MOMENTUM`, …), which never repeat "hit harder". See the note at the
   top of `src/scenes/cues.ts`.
2. **A short silent intro precedes the narration.** The brief's "do not
   explain first" wordless-hook requirement and its "sync narration from
   frame 1" requirement can't both be satisfied literally, because the
   audio's first word starts at t=0.00 with no lead-in silence. Resolution:
   a 2.5s silent, wordless hook (`INTRO_FRAMES` in `cues.ts`) plays first,
   then the narration starts and is frame-accurate to the real transcript
   from *its own* frame 0 onward. Composition length = intro + real audio
   duration.
3. **A few script lines were delivered as single merged clauses** in the
   actual recording (e.g. "It's two things, mass and speed." instead of two
   separate sentences). These are split at their real word-boundary
   timestamps in `cues.ts` so every shot-list beat still gets its own timing
   window.

## Sound effects

No SFX are included. See the cue sheet at the top of
`src/compositions/MomentumComparison.tsx` for the exact frames where impact/
whoosh/freeze stingers should be added in a future audio pass.
