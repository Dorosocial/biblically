# Rotating rod — "ball on a rotating rod" educational video

Status: **technical foundation validated, shot content not yet built.**

## What's here

A reproducible pipeline (`build_all.sh`, chaining the four `build_*.py`
scripts) that builds `scene.blend`: a chrome ball on a pivoting metal rod,
its circular trajectory curve, a fully-enclosed circular studio backdrop,
a `FixedCamera` (normal outside view) and a `RotatingCamera` (parented to
the rig so it co-rotates, keeping the ball stationary in frame — the
"rotating reference frame" the split-screen shot needs).

Rebuild from scratch:
```
./rotating_rod/build_all.sh [path-to-blender-binary]
```

`test_renders/split_screen_isolated_test.mp4` is a 3s isolated render
(frames 736-826) proving the split-screen concept works: left half =
FixedCamera (ball orbits normally), right half = RotatingCamera (ball
held stationary, floor sweeps past instead) — same frame, same moment,
both halves.

## Real bugs found and fixed getting here

(See commit `60613f8` for full detail.) All three were caught by direct
render comparison, not code review alone:

1. Camera distance math read `ball.location` as a local-to-pivot offset;
   it was actually stale world-space coordinates from before parenting.
2. The RotatingCamera sweeps all 360° of azimuth as the rig spins. The
   inherited linear "infinity cove" backdrop only has a lit front side —
   fixed by replacing it with a backdrop that's a full surface of
   revolution around the rig's axis (`build_circular_backdrop.py`).
3. That circular backdrop's first version left a hollow, floorless void
   directly under the rig (only built the outer ring, not the center
   disc). Fixed the profile generation and a related camera-framing bug.

Fixing #2 also roughly halved render time per frame (30-60s → 11-20s
at 8 samples, 1080×1920, EEVEE Next + ray tracing).

## What's NOT done yet

- **The actual shot list.** `rig_pivot`'s rotation is currently a
  placeholder: constant angular velocity, 12 turns over the full 36s
  (`build_cameras.py --rot-period`). The real video needs a specific
  per-shot motion profile (freeze-frames, slow-motion, release into a
  straight line, etc.) and specific framing per shot — none of that is
  encoded here. The detailed shot list this project is meant to follow
  was discussed earlier in chat but is not captured in this repo; if
  you're picking this up, get it from whoever specified the video before
  building shot content, rather than guessing from what's here.
- **Graphics overlays** (on-screen text, arrows, labels like
  "CENTRIFUGAL FORCE") — not started.
- **Audio sync.** Sound assets are now preserved in `audio/` (see
  `audio/MANIFEST.md`) but not wired into any timeline/edit. One file,
  `aballrotating.mp3` (57s, mono — unlike every SFX here, which are
  stereo), is flagged in the manifest as possibly being a narration/VO
  track rather than a sound effect; if so its pacing likely determines
  real shot timing and is worth checking before building shot content.
- **Full-quality render of the whole 36s sequence.** At current per-frame
  timing (~16-20s/frame, single camera, 8 samples/1080p) a full 1080-frame
  render is roughly 5-6 hours; shots needing both cameras cost double for
  their span. Draft-quality (8 samples) is what's used above; a final
  pass should compare against a higher sample count before committing to
  a multi-hour render.

## Resolved since first written

- ~~Lighting/exposure style pass~~ — done. World background (HDRI ambient)
  strength raised from 1.0 to 2.0 in `build_render_settings.py`, fixing a
  noticeably dark backdrop wall on the side opposite the single SUN light
  (the RotatingCamera can face any azimuth, so with only one directional
  light some angle was always going to be underlit). Compared 1.0/1.8/2.5
  side by side from both cameras before picking 2.0.
