import {VO_CLIPS} from '../schedule';

const clip = (name: string) => {
	const c = VO_CLIPS.find((v) => v.name === name);
	if (!c) {
		throw new Error(`Unknown VO clip: ${name}`);
	}
	return c;
};

export interface Window {
	start: number;
	end: number;
}

const windowOf = (name: string): Window => {
	const c = clip(name);
	return {start: c.from, end: c.from + c.durationInFrames};
};

/** Splits a clip's own window into sub-beats at the given fractions (0..1), timed to the words, not evenly spliced. */
const splitBeats = (name: string, fractions: number[]): Window[] => {
	const c = clip(name);
	const points = fractions.map((f) => c.from + Math.round(c.durationInFrames * f));
	const windows: Window[] = [];
	for (let i = 0; i < points.length - 1; i++) {
		windows.push({start: points[i], end: points[i + 1]});
	}
	return windows;
};

// --- Narrator-owned lines (full-scene treatment) -----------------------------
// nl-2: 4 beats timed to "...felt different lately" / "...lose it" / "...phone
// without deciding to" / "...five other things instead".
const nl2Beats = splitBeats('nl-2', [0, 0.32, 0.5, 0.72, 1]);
export const NL2_WINDOWS = {
	standingAlone: nl2Beats[0],
	thought: nl2Beats[1],
	phoneReach: nl2Beats[2],
	fiveObjects: nl2Beats[3],
};

// nl-23: 3 beats — "look away / right before it happened" / "interesting
// part... not bored" / "expect a reward, hasn't arrived yet".
const nl23Beats = splitBeats('nl-23', [0, 0.33, 0.62, 1]);
export const NL23_WINDOWS = {
	headTurn: nl23Beats[0],
	alertPosture: nl23Beats[1],
	leanForward: nl23Beats[2],
};

// nl-26: 2 beats — "hardest one so far... worth remembering" / "proved you
// can hold attention" — then the filmstrip recap fills the tail before nl-27.
const nl26Beats = splitBeats('nl-26', [0, 0.45, 0.75, 1]);
export const NL26_WINDOWS = {
	seatedStill: nl26Beats[0],
	centered: nl26Beats[1],
	filmstripRecap: nl26Beats[2],
};

export const NARRATOR_WINDOWS = {
	nl3: windowOf('nl-3'),
	nl4: windowOf('nl-4'),
	nl5: windowOf('nl-5'),
	nl6: windowOf('nl-6'),
	nl7: windowOf('nl-7'),
	nl9: windowOf('nl-9'),
	nl12: windowOf('nl-12'),
	nl14: windowOf('nl-14'),
	nl15: windowOf('nl-15'),
	nl16: windowOf('nl-16'),
	nl18: windowOf('nl-18'),
	nl19: windowOf('nl-19'),
	nl21: windowOf('nl-21'),
	nl27: windowOf('nl-27'),
	nl30: windowOf('nl-30'),
	nl31: windowOf('nl-31'),
	nl32: windowOf('nl-32'),
	nl33: windowOf('nl-33'),
	nl34: windowOf('nl-34'),
} as const;

// Out of this rebuild's scope, kept only so NarratorLayer can reference its
// exact window without hand-typing frame numbers — content is untouched.
export const NL_OUTRO_WINDOW = windowOf('nl-outro');

// --- Exercise-setup lines (existing preview-panel treatment, unchanged) -----
export const PREVIEW_WINDOWS = {
	ex1: windowOf('nl-8'),
	ex2: windowOf('nl-10'),
	ex3: windowOf('nl-11'),
	ex4: windowOf('nl-13'),
	ex5: windowOf('nl-17'),
	ex6: windowOf('nl-20'),
	ex7: windowOf('nl-22'),
	ex8: windowOf('nl-24'),
	ex9: windowOf('nl-25'),
	ex10: windowOf('nl-28'),
	ex11: windowOf('nl-29'),
} as const;

// --- Transition-flash fix ----------------------------------------------------
// AUTO-DERIVED by merging every narrator + preview + exercise-hold window
// into one chronological timeline and checking gap-before at each step (see
// build report for the full diagnostic table). Every one of the 21 real gaps
// found is exactly 15 frames and sits immediately after a narrator-owned
// line's own content window — never after a preview panel or a hold, since
// those always transition directly with zero gap by construction.
//
// The fix: each narrator scene's opaque background Sequence extends to the
// start of whatever comes next (closing the gap), while the scene's own
// content animation still uses its original, unextended duration — so
// entrance/exit timing relative to the spoken words is unchanged.
//
// nl-2's trailing gap is closed by nl-2's LAST beat (fiveObjects). nl-23's by
// its LAST beat (leanForward). nl-26's by its LAST beat (filmstripRecap).
// The gap before nl-2 (after nl-intro) and the gap after nl-34 (before
// nl-outro) are deliberately left untouched — both nl-intro and nl-outro are
// out of this rebuild's scope.
export const NARRATOR_EXTENDED_END: Record<string, number> = {
	standingAlone: NL2_WINDOWS.standingAlone.end,
	thought: NL2_WINDOWS.thought.end,
	phoneReach: NL2_WINDOWS.phoneReach.end,
	fiveObjects: 670,
	nl3: 948,
	nl4: 1091,
	nl5: 1370,
	nl6: 1566,
	nl7: 1649,
	nl9: 2243,
	nl12: 3699,
	nl14: 4219,
	nl15: 4408,
	nl16: 4541,
	headTurn: NL23_WINDOWS.headTurn.end,
	alertPosture: NL23_WINDOWS.alertPosture.end,
	leanForward: 7759,
	nl18: 5453,
	nl19: 5579,
	nl21: 6447,
	seatedStill: NL26_WINDOWS.seatedStill.end,
	centered: NL26_WINDOWS.centered.end,
	filmstripRecap: 9522,
	nl27: 9584,
	nl30: 10680,
	nl31: 10880,
	nl32: 11096,
	nl33: 11409,
	nl34: 11643,
};
