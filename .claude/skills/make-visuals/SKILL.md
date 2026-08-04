---
name: make-visuals
description: Step 2b (faceless-channel variant) of the AI Video Editor pipeline — fills the gaps make-tsx leaves as talking-head pass-through with full-bleed AI-generated images (via the Wavespeed MCP), so the presenter's raw camera footage never appears on screen. Existing make-tsx cutaways (diagrams, UI, verse cards) are untouched; this skill only covers the remaining spans. Covers reading timeline.json to find gaps, the edited-transcript + brand + art-style reference, segmenting gaps into 3-5 second idea-driven beats, authoring Wavespeed prompts, generating images, wiring them through SceneImageShot, adding gap-fill cutaways to timeline.json without overlapping existing shots, rendering, and baking. Companion to make-tsx; defers raw TSX rules to vidtsx-2d-generator.
---

# make-visuals — AI image beats filling the talking-head gaps

Step 2b of the pipeline for this channel: `make-tsx`'s cutaways (diagrams, UI, verse cards, whatever
concept beats the plan calls for) are **untouched and unchanged** — they still carve out their own
spans of `timeline.json` exactly as make-tsx always has. What used to fill the *rest* of the
timeline was the raw camera master (the talking head, pass-through). This skill replaces **only
that remainder** — the spans NOT already claimed by a TSX cutaway — with generated image beats.
Nowhere does the raw camera video ever get shown; but `make-visuals` is not re-covering ground
`make-tsx` already owns, and must not create an image beat that overlaps an existing TSX span.

## Inputs (read these first, every session)

- **The plan** — `videos/video-N/work/edit-plan.md`. What the video covers, section by section.
- **`videos/video-N/work/timeline.json`** — read this FIRST, before touching the transcript.
  Whatever `make-tsx` has already placed as `"cutaway"` or `"overlay"` spans is fixed; everything
  else in `[0, end]` is a gap this skill must fill. Compute the gap list before segmenting anything.
- **`videos/video-N/work/edited-transcript.json`** — word-level times, used only within the gap
  spans. Beat boundaries and image durations both derive from this.
- **`brand.md`** + the **art-style reference** (images/description the user supplies once per
  channel — keep it alongside brand.md, e.g. `videos/<project>/work/art-style.md`, so every session
  reads the same style contract instead of re-deriving it).
- **`videos/video-N/work/scenes.json`** — this skill's own state file (schema below). Tracks every
  beat's prompt, generated image path, and a short description of the motion composition used, **so
  you have real history to check against when authoring the next beat's motion** — not just what's
  visible in the current render.
- **`remotion/src/lib/sceneImage.tsx`** — `SceneImageShot` + the motion **primitives** (`wipeIn`,
  `irisIn`, `lightSweep`, `scalePop`, `blurFocus`, `fadeIn`/`fadeOut`, `shake`, `holdDrift`,
  `combine`). This is a toolkit, not a preset list — motion is authored per beat, not selected
  from an enum.

## Workflow

1. **Find the gaps, then segment only those into beats.** Read `timeline.json` and list every span
   NOT already covered by a `make-tsx` `"cutaway"`/`"overlay"` shot — these gaps are the only
   territory this skill touches. Within each gap, segment idea-driven: a new beat starts wherever
   the idea, scene, or verse reference shifts. No beat may run longer than **5 seconds** or shorter than **3**; durations
   must land on **3, 4, or 5 seconds**, mixed throughout (not a repeating pattern, not settling into
   one length for a stretch). If an idea naturally spans more than 5 seconds, split it into 2+ beats
   at a natural clause/breath break, not mid-phrase. forcing an image into a sliver too small to read (under ~3s — a quick breath between two TSX
   beats) — leave that as master pass-through instead and flag it to the user rather than silently
   deciding either way. Discuss the beat list before generating anything on a long/dense passage —
   cheap to fix as text, expensive to fix as regenerated images.
2. **Write a Wavespeed prompt per beat** using the fixed template in `videos/<project>/work/art-style.md`
   — the style block never changes, only the one-line scene description per beat. Don't pre-empt
   (same P2 principle as make-tsx: don't depict a scene element before it's spoken). Framing is
   already fixed in the template (16:9 full-bleed, MS-Paint doodle style, leave headroom if
   captions will overlay).
3. **Generate via the Wavespeed MCP tool** already connected in this session. Save outputs to
   `media/projects/video-N/scenes/beat-<NN>.png` (or the format Wavespeed returns). Record the
   prompt, seed/params, and output path in `scenes.json` immediately — don't regenerate what's
   already recorded.
4. **Author the motion for this beat.** Don't select from a fixed list — compose 1–3 primitives
   from `sceneImage.tsx` (`wipeIn`, `irisIn`, `lightSweep`, `scalePop`, `blurFocus`, `shake`,
   `holdDrift`, combined via `combine()`) with parameters that fit *this beat's content and mood*
   (a still, ordinary-declaration beat might get a quiet `fadeIn` + slow `holdDrift`; a beat about
   a storm or conflict gets `shake` + a steep-angle `wipeIn`; a dawn/revelation beat gets a
   low-angle `lightSweep`). Before finalizing, skim the last 4–5 entries in `scenes.json` and
   deliberately avoid reusing the same primitive combination, angle, or timing you just used —
   there's no enum to prevent repetition for you, so this is a judgment call every beat, same as
   choosing a TSX layout. Record the chosen composition (as a short description, not just a code
   diff) in `scenes.json` so the next session can check against it too.
5. **Wire each beat as a shot.** One `SceneImageShot` per beat in `remotion/src/shots/video-N/`,
   passing a `frameStyle` function that composes that beat's primitives (see the example at the
   bottom of `sceneImage.tsx`). Each file is a small, real, hand-authored beat — not a loop over
   a shared template.
6. **Update `timeline.json` — additively.** Add each image beat as its own `"type": "cutaway"`
   entry spanning exactly its gap slice. Never edit, remove, or reorder the existing `make-tsx`
   shots. After adding, walk the full shot list sorted by `master_in_s` and confirm zero overlaps
   and zero remaining gaps — every second of `[0, end]` should now be either a TSX shot or an image
   beat, with nothing falling through to master pass-through (unless deliberately left, per step 1).
7. **Render + VERIFY BY SCREENSHOT.** Same discipline as make-tsx: still frames at the exact
   entrance/exit windows, not just the hold. Confirm no two adjacent beats' motion compositions
   read as "the same effect" (spot-check `scenes.json`'s `motion` descriptions, not just the render).
8. **Bake**: `python tools/bake.py`. Only the newly-added gap beats are new work — existing TSX
   spans render from their own cached output. Bake incrementally (`--end SECONDS`) while iterating
   on a section rather than the full runtime every pass.

## scenes.json (this skill's state file)

```jsonc
{
  "project": "video-1",
  "beats": [
    {
      "index": 0, "in_s": 0.0, "out_s": 4.0,
      "cue": "In the beginning God created the heavens and the earth",
      "prompt": "<art-style tokens> + <scene description>",
      "image": "media/projects/video-1/scenes/beat-00.png",
      "motion": "irisIn from top-left (origin 15/10), fadeOut+wipeDown@250deg exit, slow rightward holdDrift"
    }
  ]
}
```

## Principles

- **One art style, zero drift (P1).** The style reference is law. If a generated image breaks
  style, regenerate — don't ship an off-style beat to save a Wavespeed call.
- **Don't pre-empt (P2).** Inherited from make-tsx — never show a scene element before it's spoken.
- **Never static (P3).** Every beat has entrance motion, continuous hold-drift, and exit motion
  (all built into `SceneImageShot`). A beat that's on screen long enough to feel like a still frame
  is a sign it should probably be split into two beats, not left static.
- **Authored, not enumerated (P4).** Motion is composed fresh per beat from primitives, the same
  way a TSX shot is hand-built rather than instantiated from a template. Two beats using `wipeIn`
  should still feel different because the angle/duration/pairing differ — check `scenes.json`'s
  recent history before finalizing a beat so variety is a deliberate check, not an accident.
- **Know the transition limitation.** `bake.py` hard-cuts at cutaway boundaries — the fade/wipe-out
  of one beat against the entrance of the next reads as a transition but is not a blended
  cross-dissolve. If the user wants a literal dissolve, that's a `bake.py` change (short overlap
  blend at each boundary), not something `sceneImage.tsx` alone can do — flag it, don't silently
  under-deliver.

## Tooling quick reference

- Register shots: `node remotion/scripts/gen-registry.mjs`.
- Render: `node remotion/scripts/render-all.mjs [--still] [--scale=1|2] <ShotIds...>`.
- Bake: `python tools/bake.py [timeline.json] [--end S] [--keep]`.

Done = every beat in `scenes.json` has a generated image + recorded motion picks, `timeline.json`
covers the full runtime with no gaps, the changed beats render and have been **looked at** at their
entrance/exit frames, and the preview is re-baked.
