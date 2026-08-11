/**
 * Real transcript timing, transcribed with Whisper (model: small) from the
 * uploaded narration audio (public/audio/narration.mp3).
 *
 * Full transcript (for reference):
 * [0.00–2.76]   "What is the color of absolutely nothing, seriously?"
 * [3.26–6.20]   "If there's absolutely nothing there, what would you see?"
 * [6.56–6.78]   "Black?"
 * [7.08–7.36]   "Maybe?"
 * [7.80–10.64]  "Let's say you're standing in a completely dark room."
 * [10.94–13.90] "There are no lights, screens, nothing glowing."
 * [14.28–15.44] "I mean, nothing at all."
 * [15.64–18.62] "At this point, your eyes aren't receiving visible light."
 * [18.90–21.22] "So your brain gives you the experience of darkness."
 * [21.58–25.22] "Now remove the room, the walls, I mean every other object."
 * [25.52–27.80] "And imagine there's just empty space."
 * [27.80–29.86] "So what color is that space?"
 * [30.32–30.96] "Here's the catch."
 * [31.32–33.72] "Color isn't something that exists by itself."
 * [34.08–39.86] "You see, your eyes receive light, and your brain turns that
 *                 information into the colors you see."
 * [40.12–44.62] "So when there's no visible light reaching your eyes,
 *                 there's no color information to process."
 * [44.96–46.88] "So would nothing be black?"
 * [47.30–48.64] "Um, not exactly."
 * [48.96–55.76] "This is because black is what you can perceive when your
 *                 visual system receives essentially no visible light."
 * [56.04–59.70] "But absolute nothingness doesn't have a color waiting inside it."
 * [59.88–61.98] "Color isn't just out there in the universe."
 * [62.34–64.78] "It's something your brain creates from light."
 * [65.08–67.04] "So what is the color of nothing?"
 * [67.60–68.32] "There isn't one."
 * [68.68–71.82] "Because without light, there's nothing for your eyes to see."
 *
 * Total audio duration (ffprobe): 72.124063s
 *
 * NOTE: the real narration is considerably more condensed than the pacing
 * sketch in the brief (several sketch lines were recorded merged into a
 * single sentence). Beats below are mapped by CONTENT match to the real
 * audio, not by the sketch's second-marks — the sketch numbers were
 * explicitly "pacing references, not final values."
 */

export const FPS = 30;
export const AUDIO_DURATION_SEC = 72.124063;
export const DURATION_FRAMES = Math.round(AUDIO_DURATION_SEC * FPS); // 2164

/** Convert a real-audio second mark into a frame number at FPS. */
export const f = (seconds: number): number => Math.round(seconds * FPS);

// ---------------------------------------------------------------------------
// Beat boundaries (seconds), derived from the transcript above.
// ---------------------------------------------------------------------------

export const BEATS = {
  opening: {start: 0.0, end: 2.76, clearAt: 2.36}, // "...seriously?"
  possibilities: {start: 3.26, end: 6.2},
  blackMoment: {start: 6.56, end: 7.08},
  hardCutToRoom: {start: 7.08, end: 7.8}, // "Maybe?"
  roomReveal: {start: 7.8, end: 10.64},
  lights: {
    start: 10.94,
    end: 13.9,
    lamp: {start: 10.94, end: 11.94},
    screen: {start: 11.94, end: 12.94},
    window: {start: 12.94, end: 13.9},
  },
  finalLightGone: {start: 14.28, end: 15.44}, // camera STOPS
  photonApproach: {start: 15.64, end: 18.62},
  neuralPathway: {start: 18.9, end: 21.22},
  wallsDissolve: {
    start: 21.58,
    end: 25.22,
    walls: {start: 21.58, end: 23.42},
    objects: {start: 23.8, end: 25.22},
  },
  emptySpace: {start: 25.52, end: 27.8, freezeFrom: 27.45}, // "So..." freeze at tail
  colorCycle1: {start: 27.8, end: 30.32}, // COLOR MOMENT 1
  beamZoom: {start: 30.32, end: 30.96},
  waves: {start: 31.32, end: 33.72},
  photonToRetina: {start: 34.08, end: 36.16},
  brainSignal: {start: 36.16, end: 38.5},
  colorBurst2: {start: 38.5, end: 40.12}, // COLOR MOMENT 2
  drain: {start: 40.12, end: 42.68},
  eyeOrbitNoSignal: {start: 42.86, end: 44.62},
  blackText: {start: 44.96, end: 46.88},
  blackTextGlitch: {start: 47.3, end: 48.64},
  fourStage: {
    start: 48.96,
    end: 55.76,
    noLight: {start: 48.96, end: 50.06},
    eye: {start: 50.06, end: 51.6},
    brain: {start: 51.6, end: 53.52},
    blackExperience: {start: 53.52, end: 55.76},
  },
  keyTransition: {
    start: 56.04,
    end: 59.88,
    world: {start: 56.04, end: 56.8},
    light: {start: 56.8, end: 57.56},
    eye: {start: 57.56, end: 58.32},
    observer: {start: 58.32, end: 59.08},
    everythingGone: {start: 59.08, end: 59.88},
  },
  rainbow: {start: 59.88, end: 61.98}, // COLOR MOMENT 3
  flythrough: {start: 62.34, end: 64.78},
  returnToSpace: {start: 65.08, end: 67.04},
  eyesGoneStatic: {start: 67.6, end: 68.32}, // camera stops completely
  photonAlone: {start: 68.68, end: 69.72},
  photonGone: {start: 69.94, end: 71.82}, // no movement
  loopTail: {start: 71.82, end: AUDIO_DURATION_SEC},
} as const;

/**
 * Windows for the recurring, extremely-subtle "viewer eyes" motif.
 *
 * The brief's summary names "exactly four moments" (opening, dark-room
 * sequence, light/photon explanation, just-before-the-ending) as coarse
 * anchors, but the shot list's own per-line descriptions are more specific
 * and are followed here: eyes stay visible continuously through the whole
 * intro (opening -> "seriously" -> possibilities text -> "Black?"), reappear
 * once the room goes fully dark ("only the subtle eye shapes remain"),
 * reappear behind the "BLACK?" text, reappear just before the ending, and
 * finally hint at reappearing for the loop.
 */
export const VIEWER_EYES_WINDOWS = [
  {start: BEATS.opening.start, end: BEATS.blackMoment.end, fadeIn: 0.6, fadeOut: 0.3},
  {start: BEATS.hardCutToRoom.start, end: BEATS.roomReveal.end, fadeIn: 0.2, fadeOut: 0.4},
  {start: BEATS.finalLightGone.start, end: BEATS.finalLightGone.end, fadeIn: 0.25, fadeOut: 0.2},
  {start: BEATS.blackText.start, end: BEATS.blackText.end, fadeIn: 0.3, fadeOut: 0.3},
  {start: BEATS.returnToSpace.start, end: BEATS.returnToSpace.end, fadeIn: 0.4, fadeOut: 0.3},
  {start: BEATS.loopTail.start, end: BEATS.loopTail.end, fadeIn: 0.15, fadeOut: 0},
] as const;

/** Total stillness windows: camera fully locked, zero movement. */
export const STATIC_WINDOWS = [
  BEATS.blackMoment,
  BEATS.finalLightGone,
  {start: BEATS.emptySpace.freezeFrom, end: BEATS.emptySpace.end},
  BEATS.eyesGoneStatic,
  BEATS.photonGone,
] as const;

export const isInStaticWindow = (seconds: number): boolean =>
  STATIC_WINDOWS.some((w) => seconds >= w.start && seconds <= w.end);
