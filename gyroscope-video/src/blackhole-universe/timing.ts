/**
 * Timing for "What If Our Entire Universe Is Inside a Black Hole?" — a
 * long-form 16:9 documentary explainer. Narration is real (3-part audio,
 * concatenated + Whisper-transcribed into one continuous timeline:
 * public/audio/blackhole-universe/narration.mp3 +
 * transcripts/blackhole-universe/narration.srt / narration_readable.txt).
 *
 * Built against an exact, mandatory 109-beat storyboard (voice line /
 * visual / camera direction given verbatim per beat). Every CUE_SECONDS
 * entry's comment is the storyboard's literal quoted line (or a close
 * paraphrase where the storyboard's own phrasing doesn't appear verbatim
 * in the audio — the audio is fixed, so the cue tracks where that content
 * actually starts being spoken).
 *
 * A beat's cue point is where ITS quoted line begins; its visual holds
 * until the next beat's cue, so any connective narration between two
 * beats' lines plays under whichever beat's visual is already running.
 * All 107 spoken beats' cue points were located programmatically (exact
 * substring match against the Whisper transcript, not manual timestamp
 * arithmetic) to avoid transcription errors at this scale. A few beats
 * split one continuous transcript sentence in two (e.g. beats 36/37, 94/95,
 * 102/103) — those get a small manual offset since the source audio has no
 * natural cut between them.
 *
 * Beats 108-109 have no voice line (the storyboard marks them "—") — the
 * narration ends at beat 107 (~760-763.8s). The video runs a few seconds
 * past the raw narration to give the closing "hold, then transform and
 * loop back to beat 1" visual room to breathe before looping — a normal
 * silent visual coda, not a sync error.
 */
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const sec = (s: number): number => Math.round(s * FPS);

export const CUE_SECONDS = {
  // ---- OPENING (beats 1-6) ----
  hook: 0, // beat 1 — "What if our entire universe is inside a black hole?"
  iMeanLiterally: 5.52, // beat 2 — "I mean that literally."
  everythingWeCanSee: 6.88, // beat 3 — "Everything we can see..."
  insideBlackHole: 13.16, // beat 4 — "...is actually on the inside of a black hole..."
  largerUniverse: 15.8, // beat 5 — "...that exists in some much larger universe?"
  howIsThatPossible: 21.4, // beat 6 — "How's that even possible?" (hard stop, cuts to black)

  // ---- FIRST: WHAT IS A BLACK HOLE (beats 7-13) ----
  classicBlackHole: 22.94, // beat 7 — "We usually picture this giant dark object..."
  fallingMatter: 28.62, // beat 8 — "...pulling everything toward it."
  notReallyBlackHole: 32.58, // beat 9 — "But that's not really what a black hole is."
  regionOfSpace: 39.02, // beat 10 — "A region of space where gravity has become extreme..."
  crossBoundary: 45.72, // beat 11 — "Once you cross a certain boundary..."
  notEvenLight: 56.18, // beat 12 — "Nothing can escape. Not even light."
  eventHorizonNamed: 58.44, // beat 13 — "That boundary is called the event horizon."

  // ---- CROSSING THE HORIZON (beats 14-20) ----
  horizonNotWall: 64.7, // beat 14 — "The event horizon isn't a wall."
  dontHitIt: 66.9, // beat 15 — "You don't hit it."
  fallingIntoMassive: 71.36, // beat 16 — "If you were falling into a really massive black hole..."
  crossWithoutNoticing: 74.68, // beat 17 — "...you could cross it without noticing..."
  problemAfter: 80.96, // beat 18 — "The problem is what happens after."
  pathsForward: 86.46, // beat 19 — "All possible paths forward..."
  leadDeeper: 90.1, // beat 20 — "...lead deeper into the black hole."

  // ---- THE SINGULARITY (beats 21-27) ----
  takeToSingularity: 94.72, // beat 21 — "The equations eventually take you to a singularity."
  stopMakingSense: 103.12, // beat 22 — "The equations stop making sense."
  producingInfinities: 104.5, // beat 23 — "They start producing infinities."
  somethingMissing: 115.28, // beat 24 — "Something is missing." (hard cut to black)
  generalRelativity: 117.5, // beat 25 — "General relativity..."
  quantumMechanics: 127.92, // beat 26 — "Quantum mechanics..."
  noCompleteTheory: 138.42, // beat 27 — "We still don't have a complete theory..."

  // ---- WHAT IF THE SINGULARITY ISN'T THE END (beats 28-34) ----
  notReallyEnd: 149.16, // beat 28 — "What if that singularity isn't really the end?"
  somethingHappensThere: 151.98, // beat 29 — "What if something happens there..."
  physicsDoesntKnow: 153.32, // beat 30 — "...that physics doesn't know how to describe?"
  quantumGravityPrevents: 159.88, // beat 31 — "Maybe quantum gravity prevents collapse..."
  transitionsIntoSomething: 169.62, // beat 32 — "Or maybe it transitions into something else."
  newRegionSpacetime: 176.76, // beat 33 — "Maybe... a new region of spacetime."
  newUniverse: 179.48, // beat 34 — "Something like a new universe?"

  // ---- THE PARENT UNIVERSE (beats 35-45) ----
  parentUniverse: 183.56, // beat 35 — "Imagine you're living in some giant parent universe."
  starCollapses: 187.1, // beat 36 — "A massive star collapses..."
  formsBlackHole: 188.7, // beat 37 — "...and forms a black hole." (manual split — one continuous sentence in the audio)
  yourPerspective: 190.54, // beat 38 — "From your perspective..."
  thereIsABlackHole: 192.76, // beat 39 — "There's a black hole."
  butInsideThat: 193.82, // beat 40 — "But inside..."
  expandingRegionForms: 195.42, // beat 41 — "A new expanding region forms."
  seeGalaxiesStars: 204.52, // beat 42 — "They'd see galaxies, stars and planets."
  seeExpandingUniverse: 207.08, // beat 43 — "They'd see an expanding universe."
  whereDidThisComeFrom: 213.68, // beat 44 — "And they'd ask: Where did all this come from?"
  answerIsBigBang: 215.96, // beat 45 — "Their answer could be the Big Bang."

  // ---- THE BIG BANG — NOT AN EXPLOSION (beats 46-52) ----
  tinyBallExploding: 255.36, // beat 46 — "People imagine a tiny ball exploding..."
  notWhatHappened: 261.18, // beat 47 — "That's not really what happened."
  spaceExpanding: 269.46, // beat 48 — "Space itself was expanding."
  earlyUniverseHot: 271.34, // beat 49 — "The early universe was incredibly hot and dense."
  universeCooled: 275.32, // beat 50 — "As space expanded, the universe cooled."
  blackHoleGoingBoom: 282.46, // beat 51 — "A black hole going boom? No."
  somethingStranger: 285.66, // beat 52 — "Something much stranger."

  // ---- WHERE IS THE EVENT HORIZON (beats 53-59) ----
  whereIsHorizon: 302.42, // beat 53 — "If we're inside a black hole, where is the event horizon?"
  wheresTheEdge: 306.22, // beat 54 — "Where's the edge?"
  giantBlackSphere: 307.54, // beat 55 — "Why don't we see a giant black sphere?"
  notPhysicalWall: 316.64, // beat 56 — "An event horizon isn't a physical wall."
  boundaryInSpacetime: 320.82, // beat 57 — "It's a boundary in spacetime."
  seeBlackCircle: 333.18, // beat 58 — "You wouldn't necessarily see a black circle."
  partOfGeometry: 341.76, // beat 59 — "The boundary is part of the geometry."

  // ---- THE PAPER ANALOGY (beats 60-66) ----
  creatureOnPaper: 361.66, // beat 60 — "Imagine a creature living on a sheet of paper."
  leftAndRight: 365.62, // beat 61 — "It can move left and right..."
  noConceptOfUp: 369.98, // beat 62 — "But has no concept of up."
  pickItUp: 376.62, // beat 63 — "You pick it up..."
  creaturesPerspective: 379.2, // beat 64 — "From its perspective..."
  directionItCouldntAccess: 389.4, // beat 65 — "You simply used a direction it couldn't access."
  intuitionWeNeed: 394.16, // beat 66 — "That's roughly the intuition..."

  // ---- WHAT'S OUTSIDE OUR UNIVERSE (beats 67-75) ----
  whatsOutside: 421.86, // beat 67 — "What's outside our universe?"
  doesntMakeSense: 426.06, // beat 68 — "Normally that question doesn't even make sense."
  supposeInsideBlackHole: 434.32, // beat 69 — "But suppose we're inside a black hole."
  largerSpacetimeOutside: 439.92, // beat 70 — "Maybe there's a larger spacetime outside."
  parentUniverseAgain: 445.08, // beat 71 — "A parent universe."
  theyDSeeBlackHole: 462.3, // beat 72 — "They'd see a black hole."
  meanwhileInside: 463.4, // beat 73 — "Meanwhile, inside..."
  thisIsTheUniverse: 466.84, // beat 74 — "We're looking around saying: This is the universe."
  differentPerspectives: 470.6, // beat 75 — "Same structure. Different perspectives."

  // ---- CAN WE PROVE IT (beats 76-84) ----
  couldWeProve: 490.88, // beat 76 — "Could we ever prove we're inside a black hole?"
  beyondCausalHorizon: 498.72, // beat 77 — "If the outside is beyond our causal horizon..."
  biggerTelescope: 503.22, // beat 78 — "We can't just build a bigger telescope."
  infoCantReachUs: 510.64, // beat 79 — "If information can't reach us..."
  indirectEvidence: 517.6, // beat 80 — "We'd have to look for indirect evidence."
  particularPatterns: 525.32, // beat 81 — "Patterns in the cosmic microwave background."
  geometryOfUniverse: 530.16, // beat 82 — "Geometry of our universe."
  specificPrediction: 537.16, // beat 83 — "A future theory could make a prediction."
  hypothesisPredictionTest: 555.6, // beat 84 — "That's the difference between an idea and a scientific theory."

  // ---- THE INFORMATION PROBLEM (beats 85-92) ----
  bookIntoBlackHole: 572.12, // beat 85 — "Think of throwing a book into a black hole."
  bookContainsInfo: 575.84, // beat 86 — "The book contains information."
  whatHappensToInfo: 600.36, // beat 87 — "What happens to all that information?"
  hawkingMadeWorse: 603.06, // beat 88 — "Then Stephen Hawking made the problem worse."
  emitRadiation: 605.98, // beat 89 — "Black holes emit radiation."
  couldEvaporate: 619.44, // beat 90 — "They can eventually evaporate."
  blackHoleDisappears: 623.0, // beat 91 — "So imagine the black hole disappears."
  whereDidItGo: 627.98, // beat 92 — "Where did the information go?"

  // ---- THE COSMIC FAMILY TREE (beats 93-100) ----
  blackHolesCreateMany: 692.14, // beat 93 — "What if black holes can create many universes?"
  starsFormDie: 700.42, // beat 94 — "Stars form..."
  collapseIntoBlackHoles: 701.6, // beat 95 — "Some collapse into black holes." (manual split)
  producingNewUniverses: 708.32, // beat 96 — "And perhaps those create new universes."
  universesFormStars: 712.18, // beat 97 — "Those universes form stars..."
  starsFormMoreBlackHoles: 714.32, // beat 98 — "Those stars form more black holes."
  moreUniverses: 717.4, // beat 99 — "And even more universes."
  cosmicFamilyTree: 721.12, // beat 100 — "A cosmic family tree."

  // ---- FINAL PAYOFF (beats 101-109) ----
  notSingleIsolated: 741.82, // beat 101 — "Maybe the universe isn't a single isolated thing."
  realityMuchBigger: 746.1, // beat 102 — "Maybe reality is much bigger..."
  partWeExperience: 747.3, // beat 103 — "...than the part we're able to experience." (manual split)
  beginningOfUniverse: 750.04, // beat 104 — "Maybe what we call the beginning..."
  beginningOfOurCorner: 752.92, // beat 105 — "...was only the beginning of our particular corner of reality."
  areWeInsideBlackHole: 757.38, // beat 106 — "So... are we inside a black hole?"
  noWayToTellYes: 760.0, // beat 107 — "Right now, there's no way for me to honestly tell you yes."
  loopHold: 763.8, // beat 108 — Tiny black hole appears where Earth was. Hold ~1s. (no voice line)
  loopTransform: 764.8, // beat 109 — Black hole transforms into the opening tiny point of light. Seamless loop. (no voice line)
  loopEnd: 767.8, // end of video — loops back to frame 0 (beat 1)
};

/** Same cue points, converted to frame numbers at FPS. */
export const CUE = Object.fromEntries(
  Object.entries(CUE_SECONDS).map(([k, v]) => [k, sec(v)]),
) as Record<keyof typeof CUE_SECONDS, number>;

export const DURATION_IN_FRAMES = CUE.loopEnd;
