/**
 * Timing for "What If Our Entire Universe Is Inside a Black Hole?" — a
 * long-form 16:9 documentary explainer. Narration is real (3-part audio,
 * concatenated + Whisper-transcribed into one continuous timeline:
 * public/audio/blackhole-universe/narration.mp3 +
 * transcripts/blackhole-universe/narration.srt / narration_readable.txt).
 *
 * REBUILT against an exact, mandatory 109-beat storyboard (voice line /
 * visual / camera direction given verbatim per beat) that supersedes the
 * looser paraphrase this file originally had — beats 1-13 below are cue
 * points for that storyboard's own voice-line text, matched against the
 * real transcript, not an independent creative pacing choice. Every
 * CUE_SECONDS entry's comment is the storyboard's literal quoted line.
 *
 * Two structural notes, since the storyboard's own line breaks don't
 * perfectly tile the transcript (a few connective phrases the narrator
 * actually says aren't assigned to any beat's quoted text):
 * - A beat's cue point is where ITS quoted line begins; its visual holds
 *   until the next beat's cue, so any un-quoted connective phrase between
 *   two beats' lines plays under whichever beat's visual is already
 *   running (documentary voiceover doesn't need a visual for every single
 *   connective word).
 * - Beat 6 is a literal "Hard stop" cut to black, and it's genuinely
 *   short here (~1.5s) — beat 7's establishing shot starts fading in
 *   during the connective phrase right before its own quoted line
 *   ("Because when we think about a black hole,"), not stalled in black
 *   for the full stretch until "we usually picture..." is spoken.
 */
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const sec = (s: number): number => Math.round(s * FPS);

export const CUE_SECONDS = {
  // ---- Opening (beats 1-6) ----
  hook: 0, // beat 1 — "What if our entire universe is inside a black hole?" (audio also carries the unquoted lead-in "This is a weird one.")
  iMeanLiterally: 5.52, // beat 2 — "I mean that literally."
  everythingWeCanSee: 6.88, // beat 3 — "Everything we can see..."
  insideBlackHole: 13.16, // beat 4 — "...is actually on the inside of a black hole..."
  largerUniverse: 15.8, // beat 5 — "...that exists in some much larger universe?"
  howIsThatPossible: 21.4, // beat 6 — "How's that even possible?" (hard stop, cuts to black)

  // ---- FIRST: WHAT IS A BLACK HOLE (beats 7-13) ----
  classicBlackHole: 22.94, // beat 7 — "We usually picture this giant dark object..." (visual fades in one connective phrase early, under "Because when we think about a black hole,")
  fallingMatter: 28.62, // beat 8 — "...pulling everything toward it."
  notReallyBlackHole: 32.58, // beat 9 — "But that's not really what a black hole is."
  regionOfSpace: 39.02, // beat 10 — "A region of space where gravity has become extreme..."
  crossBoundary: 45.72, // beat 11 — "Once you cross a certain boundary..."
  notEvenLight: 56.18, // beat 12 — "Nothing can escape. Not even light."
  eventHorizonNamed: 58.44, // beat 13 — "That boundary is called the event horizon."
  section3Start: 62.92, // "Now, here's something that's kind of surprising." — end of beat 13, start of CROSSING THE HORIZON
};

/** Same cue points, converted to frame numbers at FPS. */
export const CUE = Object.fromEntries(
  Object.entries(CUE_SECONDS).map(([k, v]) => [k, sec(v)]),
) as Record<keyof typeof CUE_SECONDS, number>;

/** Tracks the last built section's end while the video is being built
 * incrementally. Update as later sections are appended. */
export const DURATION_IN_FRAMES = CUE.section3Start;
