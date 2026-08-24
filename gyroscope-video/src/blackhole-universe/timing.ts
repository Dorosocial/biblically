/**
 * Timing for "What If Our Entire Universe Is Inside a Black Hole?" — a
 * long-form 16:9 documentary explainer, unlike the other videos in this
 * project. Narration is real (3-part audio, concatenated + Whisper-
 * transcribed into one continuous timeline: public/audio/blackhole-
 * universe/narration.mp3 + transcripts/blackhole-universe/narration.json),
 * so — unlike blackhole/timing.ts's "Scientists Are Terrified" short, which
 * had no audio and had to invent its own pacing — these cue points are a
 * measurement against the real transcript, not a creative pacing guess.
 *
 * Built section-by-section per the brief's recommendation (109 beats across
 * 14 sections is too much to get right in one pass). CUE_SECONDS only
 * carries the sections that have been built + reviewed so far; later
 * sections get appended here as they're built, and DURATION_IN_FRAMES
 * tracks the last defined cue until the final section lands.
 *
 * SECTION 1 (OPENING, beats 1-6) — matched to the transcript by content,
 * not by even time-splitting: the beat list's own wording ("galaxy to the
 * star, planet, even you") echoes the narration's actual enumeration almost
 * verbatim, and beat 5 ("our universe appears as a small black-hole-like
 * region") lands, deliberately, right as the narration describes the
 * *classic misconception* of a black hole ("this giant dark object...
 * pulling everything toward it") — dramatic irony: our own universe, seen
 * from outside, looks exactly like that cliché. Beat 6's "hard cut to
 * black" is NOT a quick punctuation flash here — it's held for the
 * remaining ~6.4s of section 1 ("But that's not really what a black hole
 * is... this whole idea starts getting a lot more interesting"), a
 * deliberate suspenseful pause before section 2's reveal. Flagging this
 * explicitly so a later blackdetect pass doesn't mistake a 6.4s intentional
 * black hold for a lighting bug.
 *
 * SECTION 2 (WHAT IS A BLACK HOLE, beats 7-13) — again matched by content
 * against the real transcript (39.02s-1:39.06s), not evenly split: this
 * stretch of narration is a run of short, punchy sentences ("And I mean
 * anything." / "Nothing can escape this, not even light."), so beats here
 * are naturally quicker (~2-5.5s) than section 1's — that's the source
 * material's own rhythm, not a deviation from "documentary pacing."
 * Beats 12-13 split one longer transcript segment ("And that boundary is
 * called the event horizon.") in two: the light visibly bending/fading
 * plays under the first half, and the horizon "locking" into its clean
 * circular shot lands as the term itself is spoken.
 */
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const sec = (s: number): number => Math.round(s * FPS);

export const CUE_SECONDS = {
  // ---- Section 1: OPENING (beats 1-6) ----
  hook: 0, // beat 1 — "This is a weird one. What if our entire universe is inside a black hole?"
  pointExpands: 5.5, // beat 2 — "I mean that literally. What if everything we can see, from the galaxy to the star, planet, even you..."
  flyPastCosmicWeb: 13.1, // beat 3 — "...is actually on the inside of a black hole that exists in some much larger universe?"
  observableUniverseSphere: 19.5, // beat 4 — "Now, I know what you're probably thinking. How's that even possible?"
  universeAsBlackHoleRegion: 22.9, // beat 5 — "Because when we think about a black hole, we usually picture this giant dark object..."
  hardCutToBlack: 32.4, // beat 6 — "But that's not really what a black hole is... this whole idea starts getting a lot more interesting." (held black, not a flash — see note above)

  // ---- Section 2: WHAT IS A BLACK HOLE (beats 7-13) ----
  blackHoleIntro: 39.02, // beat 7 — "You see, a black hole is basically a region of space"
  fallingMatter: 42.4, // beat 8 — "where gravity has become so extreme"
  freezeToGrid: 45.72, // beat 9 — "that once you cross a certain boundary, you just can't get back out."
  gridSteepens: 50.66, // beat 10 — "And I mean anything. You could have the fastest spaceship imaginable, and it wouldn't even matter."
  horizonForms: 56.18, // beat 11 — "Nothing can escape this, not even light."
  lightBendsIn: 58.44, // beat 12 — "And that boundary is called..." (first half — the light visibly bending/fading)
  horizonLocked: 60.5, // beat 13 — "...the event horizon." (second half — horizon locks into its clean circular shot)
  section3Start: 62.92, // "Now, here's something that's kind of surprising." — end of section 2
};

/** Same cue points, converted to frame numbers at FPS. */
export const CUE = Object.fromEntries(
  Object.entries(CUE_SECONDS).map(([k, v]) => [k, sec(v)]),
) as Record<keyof typeof CUE_SECONDS, number>;

/** Tracks the last built section's end while the video is being built
 * incrementally. Update as later sections are appended. */
export const DURATION_IN_FRAMES = CUE.section3Start;
