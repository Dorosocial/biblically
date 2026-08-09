# Shot list — derived from the confirmed narration transcript

Source: user-provided transcript with timestamps, matched against
`audio/8f8241d5-aballrotating.mp3` (57.2865s, confirmed authoritative
duration). This is my interpretation of how to visualize each line —
not independently confirmed — flag anything that should change.

Cross-checked against `ffmpeg silencedetect` on the narration: the
biggest single pause in the track (34.68–34.98s) lines up almost exactly
with the "So, why does it look like the ball wants to fly outward?" pivot
at 0:34 — good sign the transcript timestamps and audio agree. The long
pause-free stretch (41.7–50.8s) matches the flowing 0:41–0:49 explanation
below, which reads as one continuous argument rather than separate beats.

| Time | Narration | Visual |
|---|---|---|
| 0:00–0:06 | "A ball is attached to a rotating rod, and as the rod spins, the ball is forced to move in a circle." | **Establish.** Ball orbiting, attached to rod, ~2 full turns. Wide/normal FixedCamera framing. |
| 0:06–0:07 | "But something strange happens when that ball is suddenly released." | **Release** at ~0:07 (aligned with the word "released"). |
| 0:07–0:14 | "Rather than fly outward, it shoots straight off. And that's the part that seems completely out of place." | Ball flies in a straight line (tangent to the circle at the release point, constant speed — real physics, not "outward"). Camera follows or holds wide to show the straight path clearly. |
| 0:14–0:25 | "Because while the ball is attached, the rod is constantly pulling it toward the centre. And that inward force keeps bending the ball's path, again and again, until the ball is released." | **Reset** (soft_whoosh_reset.mp3 candidate), ball re-attached, orbits again (~3-4 turns over 11s) — this time with an **inward-pointing force arrow** graphic from ball to pivot, visualizing the centripetal force "bending" the path. |
| 0:25–0:33 | "But the instant that inward pull disappears, the path stops bending, and the ball keeps moving in the direction it was already travelling. And that's straight." | **Release** again at 0:25 (snap_release.mp3 candidate). Arrow disappears at the instant of release. Ball flies straight again, this time maybe with the straight path itself highlighted/traced. |
| 0:33–0:38 | "So, why does it look like the ball wants to fly outward? This is where centrifugal force comes in." | Transition beat (whoosh_transition / scifi_blip candidates). "CENTRIFUGAL FORCE" text appears, setting up the reframe. |
| 0:38–0:46 | "You see, from the rotating frame, it appears as if the ball is being pushed away from the centre. But from the outside, there's no outward force." | **Split-screen** (the shot already technically validated, now at the *correct* time window): left = FixedCamera (no outward force, ball just orbits/releases normally), right = RotatingCamera (ball apparently pushed outward as the world sweeps past it). Outward arrow + "CENTRIFUGAL FORCE" label on the right half only — it's the illusion, not a real force. |
| 0:46–0:53 | "There's only the rod pulling inward, while the ball keeps trying to move straight." | Return to a single view (probably FixedCamera). Show **both** vectors at once: inward rod-pull arrow + straight-tendency arrow, reinforcing that only one of them is a real force. |
| 0:53–0:57.3 | "And that's exactly why a ball is attached to a rotating rod." | Closing wide shot, echoing the opening framing — full circle, literally. |

## What this requires that doesn't exist yet

1. ~~**Orbit → release → straight-line flight motion**~~ — **done**
   (`build_motion.py`). Attach windows at 0-7s/14-25s/38-42s/46s-end,
   releases at 7/25/42s, verified by direct position sampling (constant
   radius while attached, growing during flight, hard reset at each
   window start) and by render comparison, not just code review.

   Building this surfaced a second problem, also fixed: both cameras'
   framing was calibrated to the tight attached orbit, so a released
   ball's tangent velocity carried it out of frame in well under a
   second — "shoots straight off" was an instant vanish. Both cameras now
   bake a dynamic per-frame zoom that widens during flight and snaps back
   once re-attached (`build_cameras.py`). Confirmed visually that
   RotatingCamera now shows the intended illusion clearly: 1s after
   release, the empty rod keeps spinning one way while the ball has
   visibly swung off on its own in that fixed view.

2. **Force-arrow graphics** (inward, and separately outward/apparent) —
   not started.
3. **Text overlays** ("CENTRIFUGAL FORCE" and possibly other labels) —
   not started.
4. **Camera cut timing** matching the table above — `render_rough_cut.py`
   cuts FixedCamera/RotatingCamera per this table at draft quality (no
   graphics/audio yet) to validate pacing before investing further;
   result pending as of this writing.
5. **Split-screen composite** for the 0:38-0:46 window — the mechanism
   was already validated (see `test_renders/`, though at the wrong
   timing/duration before the transcript correction) but isn't wired into
   the rough cut or final edit yet.
6. **Audio mix**: narration + whichever SFX land on release/reset/transition
   moments, per `audio/MANIFEST.md`.

Next: review the rough cut for pacing, then build arrows/text (#2-3) and
the real edit (#4-6) together.
