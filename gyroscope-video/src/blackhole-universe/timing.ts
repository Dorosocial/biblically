/**
 * Timing for "What If Our Entire Universe Is Inside a Black Hole?" — REBUILT
 * against a new, more granular 125-beat storyboard (up from the earlier
 * 109-beat version). The new storyboard's own stated timestamps (0-380s,
 * fixed round numbers per beat) do NOT correspond to any real audio in this
 * project — only the original 3-part narration (concatenated to
 * public/audio/blackhole-universe/narration.mp3, 764.26s, transcribed to
 * transcripts/blackhole-universe/narration.srt / narration_readable.txt)
 * exists. Comparing the two storyboards line-by-line shows the new one is a
 * further subdivision of the SAME underlying narration script (most new
 * beats map onto an existing real sentence; a few beats split one real
 * sentence that used to be a single beat into two or three shorter beats)
 * — not a different recording. Per explicit user direction, this timing
 * reuses the existing real narration.mp3 and re-derives every one of the
 * 125 new beats' cue points from where its quoted line actually starts in
 * the real transcript (found programmatically, not by hand), ignoring the
 * storyboard's own literal 0-380s numbers. A handful of beats split one
 * continuous real sentence in two (e.g. beats 4/5, 7/8, 42/43, 58/59,
 * 108/109, 116/117, 120/121) — those get a small proportional-character-
 * count offset within that sentence's real span, since the source audio has
 * no natural cut between them.
 *
 * Beats 123-125 have no voice line (the storyboard marks them "—") — the
 * narration ends at beat 122 (~760s). The video runs a few seconds past the
 * raw narration for the closing "black hole contracts to a point, loops"
 * visual coda to breathe before looping — a normal silent coda, not a sync
 * error.
 */
export const FPS = 30;
// Temporarily rendering at 720p instead of the spec's 1920x1080 — this
// environment has no GPU (no /dev/dri, software WebGL only), and a
// measured concurrency/GPU/effects audit found no other lever that cuts
// render time; 1280x720 is ~2.25x fewer pixels/frame, which roughly
// halves render time on this CPU-bound box. 16:9 aspect ratio preserved,
// so no framing/composition math changes. Revisit at full 1920x1080 in
// an environment with real GPU acceleration.
export const WIDTH = 1280;
export const HEIGHT = 720;

export const sec = (s: number): number => Math.round(s * FPS);

export const CUE_SECONDS = {
  // ---- OPENING — THE IMPOSSIBLE IDEA ----
  hook: 1.5, // beat 1 — "What if our entire universe is inside a black hole?"
  iMeanLiterally: 5.52, // beat 2 — "I mean that literally."
  whatIfEverythingWeCanSee: 6.88, // beat 3 — "What if everything we can see..."
  fromGalaxies: 8.64, // beat 4 — "...from galaxies..."
  toStarsPlanets: 9.78, // beat 5 — "...to stars, planets..."
  evenYou: 11.3, // beat 6 — "...even you..."
  isActuallyOnTheInside: 13.16, // beat 7 — "...is actually on the inside..."
  ofABlackHole: 14.81, // beat 8 — "...of a black hole..."
  thatExistsInSomeLargerUniverse: 15.8, // beat 9 — "...that exists in some much larger universe?"
  howsThatEvenPossible: 21.4, // beat 10 — "How's that even possible?"
  // ---- FIRST: WHAT IS A BLACK HOLE ----
  weUsuallyPicture: 25.2, // beat 11 — "We usually picture this giant dark object..."
  pullingEverythingTowardIt: 30.37, // beat 12 — "...pulling everything toward it."
  notReallyWhatABlackHoleIs: 32.58, // beat 13 — "But that's not really what a black hole is."
  aRegionOfSpace: 39.02, // beat 14 — "A region of space..."
  whereGravityHasBecomeExtreme: 42.4, // beat 15 — "...where gravity has become extreme..."
  onceYouCrossABoundary: 45.72, // beat 16 — "Once you cross a certain boundary..."
  nothingCanEscape: 56.18, // beat 17 — "Nothing can escape."
  notEvenLight: 57.57, // beat 18 — "Not even light."
  calledTheEventHorizon: 58.44, // beat 19 — "That boundary is called the event horizon."
  // ---- CROSSING THE HORIZON ----
  horizonIsntAWall: 64.7, // beat 20 — "The event horizon isn't a wall."
  youDontHitIt: 66.9, // beat 21 — "You don't hit it."
  fallingIntoMassive: 71.36, // beat 22 — "If you were falling into a really massive black hole..."
  crossWithoutNoticing: 74.68, // beat 23 — "...you could cross it without noticing..."
  problemIsWhatHappensAfter: 80.96, // beat 24 — "The problem is what happens after."
  allPossiblePaths: 86.46, // beat 25 — "All possible paths forward..."
  leadDeeper: 90.1, // beat 26 — "...lead deeper into the black hole."
  // ---- THE SINGULARITY ----
  takeToSingularity: 94.72, // beat 27 — "The equations eventually take you to a singularity."
  stopMakingSense: 103.12, // beat 28 — "The equations stop making sense."
  producingInfinities: 104.5, // beat 29 — "They start producing infinities."
  somethingIsMissing: 115.28, // beat 30 — "Something is missing."
  generalRelativity: 123.68, // beat 31 — "General relativity..."
  quantumMechanics: 127.92, // beat 32 — "Quantum mechanics..."
  noCompleteTheory: 138.42, // beat 33 — "We still don't have a complete theory..."
  // ---- WHAT IF THE SINGULARITY ISN'T THE END ----
  singularityIsntTheEnd: 149.16, // beat 34 — "What if that singularity isn't really the end?"
  somethingHappensThere: 151.98, // beat 35 — "What if something happens there..."
  physicsDoesntKnow: 153.32, // beat 36 — "...that physics doesn't know how to describe?"
  quantumGravityPrevents: 159.88, // beat 37 — "Maybe quantum gravity prevents collapse..."
  transitionsIntoSomething: 169.62, // beat 38 — "Or maybe it transitions into something else."
  newRegionSpacetime: 176.76, // beat 39 — "Maybe... a new region of spacetime."
  somethingLikeANewUniverse: 179.48, // beat 40 — "Something like a new universe?"
  // ---- THE PARENT UNIVERSE ----
  parentUniverse: 183.56, // beat 41 — "Imagine you're living in some giant parent universe."
  starCollapses: 187.1, // beat 42 — "A massive star collapses..."
  formsBlackHole: 188.75, // beat 43 — "...and forms a black hole."
  yourPerspective: 190.54, // beat 44 — "From your perspective..."
  thereIsABlackHole: 192.76, // beat 45 — "There's a black hole."
  butInside: 193.82, // beat 46 — "But inside..."
  expandingRegionForms: 195.42, // beat 47 — "A new expanding region forms."
  seeGalaxies: 204.52, // beat 48 — "They'd see galaxies..."
  starsAndPlanets: 205.83, // beat 49 — "stars and planets."
  seeExpandingUniverse: 207.08, // beat 50 — "They'd see an expanding universe."
  whereDidThisComeFrom: 213.68, // beat 51 — "Where did all of this come from?"
  answerIsBigBang: 215.96, // beat 52 — "Their answer could be the Big Bang."
  // ---- BIG BANG — NOT AN EXPLOSION ----
  tinyBallExploding: 255.36, // beat 53 — "People imagine a tiny ball exploding..."
  notWhatHappened: 261.18, // beat 54 — "That's not really what happened."
  spaceExpanding: 269.46, // beat 55 — "Space itself was expanding."
  earlyUniverseHot: 271.34, // beat 56 — "The early universe was incredibly hot..."
  incrediblyDense: 273.98, // beat 57 — "...and incredibly dense."
  asSpaceExpanded: 275.32, // beat 58 — "As space expanded..."
  universeCooled: 276.64, // beat 59 — "...the universe cooled."
  blackHoleGoingBoom: 282.46, // beat 60 — "A black hole going boom? No."
  somethingStranger: 285.66, // beat 61 — "Something much stranger."
  // ---- WHERE IS THE EVENT HORIZON ----
  ifWereInsideABlackHole: 302.42, // beat 62 — "If we're inside a black hole..."
  whereIsTheEventHorizon: 304.28, // beat 63 — "Where is the event horizon?"
  wheresTheEdge: 306.22, // beat 64 — "Where's the edge?"
  giantBlackSphere: 307.54, // beat 65 — "Why don't we see a giant black sphere?"
  notPhysicalWall: 316.64, // beat 66 — "An event horizon isn't a physical wall."
  boundaryInSpacetime: 320.82, // beat 67 — "It's a boundary in spacetime."
  seeBlackCircle: 333.18, // beat 68 — "You wouldn't necessarily see a black circle."
  partOfGeometry: 341.76, // beat 69 — "The boundary is part of the geometry."
  // ---- THE PAPER ANALOGY ----
  creatureOnPaper: 361.66, // beat 70 — "Imagine a creature living on a sheet of paper."
  leftAndRight: 365.62, // beat 71 — "It can move left and right..."
  forwardAndBackward: 367.54, // beat 72 — "...and forward and backward."
  noConceptOfUp: 369.98, // beat 73 — "But has no concept of up."
  pickItUp: 376.62, // beat 74 — "Now imagine you pick it up..."
  creaturesPerspective: 379.2, // beat 75 — "From the creature's perspective..."
  directionItCouldntAccess: 389.4, // beat 76 — "You simply used a direction it couldn't access."
  intuitionWeNeed: 394.16, // beat 77 — "That's roughly the kind of intuition..."
  // ---- WHAT'S OUTSIDE OUR UNIVERSE ----
  whatsOutside: 421.86, // beat 78 — "What's outside our universe?"
  doesntMakeSense: 426.06, // beat 79 — "Normally that question doesn't even make sense."
  supposeInsideBlackHole: 434.32, // beat 80 — "But suppose we're inside a black hole."
  largerSpacetimeOutside: 439.92, // beat 81 — "Maybe there's a larger spacetime outside."
  parentUniverseAgain: 445.08, // beat 82 — "A parent universe."
  theyDSeeBlackHole: 462.3, // beat 83 — "They'd see a black hole."
  meanwhileInside: 463.4, // beat 84 — "Meanwhile, inside..."
  lookingAroundSaying: 464.94, // beat 85 — "We're looking around saying..."
  thisIsTheUniverse: 466.84, // beat 86 — "This is the universe."
  differentPerspectives: 470.6, // beat 87 — "Same structure. Different perspectives."
  // ---- CAN WE PROVE IT ----
  couldWeProve: 490.88, // beat 88 — "Could we ever prove we're inside a black hole?"
  beyondCausalHorizon: 498.72, // beat 89 — "If the outside is beyond our causal horizon..."
  biggerTelescope: 503.22, // beat 90 — "We can't just build a bigger telescope."
  infoCantReachUs: 510.64, // beat 91 — "If information can't reach us..."
  nothingForTelescopeToSee: 514.06, // beat 92 — "...there's nothing for the telescope to see."
  indirectEvidence: 517.6, // beat 93 — "We'd have to look for indirect evidence."
  particularPatterns: 527.28, // beat 94 — "Patterns in the cosmic microwave background."
  geometryOfUniverse: 530.16, // beat 95 — "Geometry of our universe."
  specificPrediction: 537.16, // beat 96 — "A future theory could make a prediction."
  ideaVsTheory: 558.38, // beat 97 — "That's the difference between an idea and a scientific theory."
  // ---- THE INFORMATION PROBLEM ----
  bookIntoBlackHole: 572.12, // beat 98 — "Think of throwing a book into a black hole."
  bookContainsInfo: 575.84, // beat 99 — "The book contains information."
  everyWordLetterMolecule: 578.36, // beat 100 — "Every word, letter, molecule..."
  whatHappensToInfo: 600.36, // beat 101 — "What happens to all that information?"
  hawkingMadeWorse: 603.06, // beat 102 — "Then Stephen Hawking made the problem worse."
  emitRadiation: 605.98, // beat 103 — "Black holes emit radiation."
  couldEvaporate: 619.44, // beat 104 — "They can eventually evaporate."
  blackHoleDisappears: 623.0, // beat 105 — "So imagine the black hole disappears."
  whereDidItGo: 627.98, // beat 106 — "Where did the information go?"
  // ---- COSMIC FAMILY TREE ----
  blackHolesCreateMany: 692.14, // beat 107 — "What if black holes can create many universes?"
  starsForm: 700.42, // beat 108 — "Stars form..."
  collapseIntoBlackHoles: 703.29, // beat 109 — "Some collapse into black holes."
  producingNewUniverses: 708.32, // beat 110 — "And perhaps those create new universes."
  universesFormStars: 712.18, // beat 111 — "Those universes form stars..."
  starsFormMoreBlackHoles: 714.32, // beat 112 — "Those stars form more black holes."
  moreUniverses: 717.4, // beat 113 — "And even more universes."
  cosmicFamilyTree: 721.12, // beat 114 — "A cosmic family tree."
  // ---- FINAL PAYOFF ----
  notSingleIsolated: 741.82, // beat 115 — "Maybe the universe isn't a single isolated thing."
  realityMuchBigger: 746.1, // beat 116 — "Maybe reality is much bigger..."
  partWeExperience: 747.75, // beat 117 — "...than the part we're able to experience."
  beginningOfUniverse: 750.04, // beat 118 — "Maybe what we call the beginning..."
  beginningOfOurCorner: 752.92, // beat 119 — "...was only the beginning of our particular corner of reality."
  soDotDotDot: 757.38, // beat 120 — "So..."
  areWeInsideBlackHole: 757.56, // beat 121 — "Are we inside a black hole?"
  noWayToTellYes: 760.0, // beat 122 — "Right now, there's no way for me to honestly tell you yes."
  loopBlackHoleAppears: 763.0, // beat 123 — no voice line: tiny black hole remains where Earth was
  loopContracts: 764.0, // beat 124 — no voice line: black hole contracts into a tiny point of light
  loopEnd: 765.0, // beat 125 — no voice line: tiny point becomes the exact opening shot
  loopVideoEnd: 768.0, // end of video — loops back to frame 0 (beat 1)
};

/** Same cue points, converted to frame numbers at FPS. */
export const CUE = Object.fromEntries(
  Object.entries(CUE_SECONDS).map(([k, v]) => [k, sec(v)]),
) as Record<keyof typeof CUE_SECONDS, number>;

export const DURATION_IN_FRAMES = CUE.loopVideoEnd;
