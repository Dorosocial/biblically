# Centrifugal vs Centripetal Force — a deeper-dive follow-up

A 9:16 (1080x1920) Remotion + React Three Fiber explainer video. The
rod-and-ball rig from "the earlier ball-on-rotating-rod video" is the visual
backbone throughout, replayed from three different perspectives at the
video's most important moment (the release).

## Reused components — a note on provenance

The brief asked to reuse the rod-and-ball rig and rotating-frame camera
technique from an earlier ball-on-rotating-rod video and from the wheel
section of a physics-montage video. **Neither project exists in this
repository's history** (checked via `git log --all` before starting — the
only prior video project here is the unrelated quantum double-slit one). This
build creates the rig from scratch, but deliberately isolated and
parameterized — `RodBallRig.tsx`, `Arrow3D.tsx`, `OrbitRing.tsx`,
`RotatingGrid.tsx`, and the `rotateY`/`circlePos`/`tangentDir` helpers are
self-contained and don't depend on anything centrifugal-force-specific — so a
future ball-on-rotating-rod or physics-montage video can import these files
directly instead of rebuilding them again.

## Timing

Composition length is locked to the real narration duration. `ffprobe`
reports **57.286500s**; at 30fps that's **1719 frames** (57.3s). Whisper
(small model, word-level timestamps) produced the transcript behind every
beat boundary in `src/timeline.ts`.

**Content note:** the brief's shot list was written for a longer, more
elaborate script (it references a rotating-coordinate-grid reveal, a second
split-screen near 78-82s, and a "the mystery disappears"-style outro) that
isn't in this recording — the real narration is 57s and considerably more
condensed. Beat boundaries are anchored to the real spoken words; where a
shot-list idea has no corresponding line, its *visual* intent was folded into
whichever beat is thematically closest (documented per-beat in
`sceneState.ts`) rather than inventing narration-free beats. The two
must-verify sequences (triple-replay release, split-screen frame comparison)
both have a natural home in the real narration:

- **Triple-replay of the release** (the brief's 14-23s reference) actually
  spans `releaseOutside` → `freezeOutOfPlace` → `rotatingFrameAttached` →
  `bendingPathBuildup` → `releaseReplayOverlay` (frames 261–1016, ~25s) —
  the real narration explains the release once, then re-explains the
  mechanism in more depth, which is exactly where replays #2 (rotating-frame)
  and #3 (split overlay) land.
- **Split-screen contrast** lands at `splitScreenContrast` (frames
  1372–1470, ~45.7–49s), exactly where the narration says "but from the
  outside, there's no outward force" — a tighter, better-fitting home than
  the brief's 78-82s reference (which doesn't exist in a 57s video).

## Structure

```
src/
  timeline.ts             Beat boundaries (real audio timing) + label overlay timings
  Root.tsx / index.ts      Composition registration (1080x1920, 30fps, 1719 frames)
  Composition.tsx           Audio + <ThreeCanvas> + captions; sound-design placeholder comments
  scene/
    sceneState.ts            The orchestration layer: frame -> {camera, rigs, vectors, rings, grids}
    RodBallRig.tsx            Reusable rig: pivot + rod + ball, plus circlePos/tangentDir/
                              inwardDir/outwardDir/rotateY physics helpers
    Ball.tsx                  Glowing ball (emissive sphere + fresnel halo, reused technique
                              from the quantum-particle-video's Particle)
    Arrow3D.tsx               Force/velocity vectors as real 3D objects (cylinder + cone)
    OrbitRing.tsx             Glowing circular trail (shader-based, supports partial reveal)
    RotatingGrid.tsx          Faint radial grid that spins with the rod — the visual signal
                              for "this shot is the rotating reference frame"
    PhysicsScene.tsx          Assembles everything from sceneState per frame
    CameraRig.tsx / AmbientField.tsx / shaders.ts   Carried over from quantum-particle-video —
                              camera-driving and ambient-shimmer techniques are video-agnostic
  overlays/
    Captions.tsx              HTML/CSS label overlays (INWARD FORCE, CENTRIFUGAL, etc.)
```

Everything in `sceneState.ts` is a pure function of `frame` — no `useState`/
`useEffect`/animation loops — so every frame renders identically regardless
of how Remotion reaches it.

### The rotating-frame camera technique

A camera offset is expressed in the rod's own local coordinates (e.g. "near
the ball, a bit up and back") and then rotated by the rod's current angle
(`rotateY`) into world space each frame. Because the offset rotates in
lockstep with the rod, the ball reads as nearly stationary relative to the
camera while the rest of the world visibly spins — the same trick used for
`rotatingFrameAttached`, `bendingPathBuildup`, `whyOutward`,
`rotatingPushAway`, and (via an explicit inverse-rotation coordinate
transform rather than a moving camera) the rotating half of
`releaseReplayOverlay` and `splitScreenContrast`.

## Commands

```bash
npm install
npx remotion studio          # interactive preview
npx remotion render src/index.ts CentrifugalForce out/centrifugal-force.mp4
```

## Verified before full render

- **Triple-replay release sequence**: confirmed via rendered stills — three
  clearly labeled perspectives (OUTSIDE VIEW / ROTATING FRAME / the earlier
  full-scale rotating-frame replay), the two mini-diorama balls visibly
  diverging in direction after release.
- **Split-screen frame comparison**: confirmed via rendered stills — clean,
  readable, top = rotating frame with a visible outward arrow, bottom =
  outside frame with no outward arrow, only the real inward force.
- **~11.5-14s freeze**: a genuine static hold, capped at 14 frames (<0.5s @
  30fps) before motion resumes.

## Known follow-ups

- Sound design is stubbed with `SOUND DESIGN` comments in `Composition.tsx`
  at the three major transitions called out in the brief — no audio has been
  added there yet.
- Several close-tracking shots (e.g. `approachRelease`, the push-in in
  `freezeOutOfPlace`) frame the ball quite tight by design (matching "close
  tracking shot beside the ball" / "extreme push-in"); loosen the camera
  offsets in `sceneState.ts` if a wider framing is wanted there.
