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

// Every window below is the VO clip's own window — verified against
// schedule.ts's `exercise` tag for each clip against the quoted-text spec
// (see build report). nl-intro and every exercise HOLD window are
// deliberately absent here — this module only ever describes narrator-line
// and exercise-setup-line windows.
export const NARRATOR_WINDOWS = {
	nl2: windowOf('nl-2'),
	nl3: windowOf('nl-3'),
	nl4: windowOf('nl-4'),
	nl5: windowOf('nl-5'),
	nl6: windowOf('nl-6'),
	nl7: windowOf('nl-7'),
	nl9: windowOf('nl-9'),
	nl12: windowOf('nl-12'),
	nl14: windowOf('nl-14'),
	nl1516: spanOf('nl-15', 'nl-16'),
	nl18: windowOf('nl-18'),
	nl19: windowOf('nl-19'),
	nl21: windowOf('nl-21'),
	nl23: windowOf('nl-23'),
	nl26: windowOf('nl-26'),
	nl27: windowOf('nl-27'),
	nl30: windowOf('nl-30'),
	nl31: windowOf('nl-31'),
	nl32: windowOf('nl-32'),
	nl33: windowOf('nl-33'),
	nl34: windowOf('nl-34'),
	nlOutro: windowOf('nl-outro'),
} as const;

// Exercise-setup-line windows — a preview scene fills this exact VO clip's
// own window, then the Sequence ends and the (untouched) exercise hold
// window takes over immediately.
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

// nl-2's four internal sub-beats, as fractions of its own window — timed to
// the words, not evenly spliced. Durations sum to the full clip.
const nl2 = clip('nl-2');
export const NL2_BEATS = {
	settledMan: {start: 0, end: Math.round(nl2.durationInFrames * 0.32)},
	thoughtSpark: {
		start: Math.round(nl2.durationInFrames * 0.32),
		end: Math.round(nl2.durationInFrames * 0.5),
	},
	phoneReach: {
		start: Math.round(nl2.durationInFrames * 0.5),
		end: Math.round(nl2.durationInFrames * 0.72),
	},
	fiveObjects: {start: Math.round(nl2.durationInFrames * 0.72), end: nl2.durationInFrames},
};
