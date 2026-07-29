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

const spanOf = (fromName: string, toName: string): Window => ({
	start: clip(fromName).from,
	end: clip(toName).from + clip(toName).durationInFrames,
});

// --- Narrator image windows -------------------------------------------------
// Explicit per the spec: nl-2 through nl-outro only. nl-intro is untouched.
export const IMAGE_WINDOWS = {
	'narrator-img-nl2-phone-reach.png': spanOf('nl-2', 'nl-4'),
	'narrator-img-nl3-rebuilding.png': spanOf('nl-5', 'nl-6'),
	'narrator-img-nl23-anticipation.png': windowOf('nl-23'),
	'narrator-img-nl26-quiet-strength.png': windowOf('nl-26'),
	// Longest linger: extend through the 15f pause after nl-32 up to nl-33's start.
	'narrator-img-nl32-crossroads.png': {start: clip('nl-32').from, end: clip('nl-33').from},
	'narrator-img-nl34-open-path.png': windowOf('nl-34'),
} as const;

// --- Motion visual windows ---------------------------------------------------
// INFERRED from narrative context against schedule.ts (no transcript was
// available — see build report). Each maps to the VO clip that structurally
// matches its quoted line: exercise "setup" clips (the ones immediately
// preceding that exercise's hold) for visuals that foreshadow a mechanic,
// and post-hold "reflection" clips for the two check-in/tension beats.
export const MOTION_WINDOWS = {
	attentionDeclineGraph: windowOf('nl-7'), // last intro line before ex1's setup
	dotFormation: windowOf('nl-8'), // ex1 setup line
	breathingPulse: spanOf('nl-14', 'nl-16'), // post-ex4-hold "check-in", 3-line span
	splitFocusCircles: windowOf('nl-17'), // ex5 setup line
	soundRipple: windowOf('nl-20'), // ex6 setup line
	hourglassPatience: windowOf('nl-22'), // ex7 setup line
	tensionVignette: windowOf('nl-27'), // last ex9 pause line, right before ex10 setup
	motionTrailPreview: windowOf('nl-28'), // ex10 setup line
	mirroredDotFormation: windowOf('nl-29'), // ex11 setup line
} as const;
