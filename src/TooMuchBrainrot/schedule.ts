export type Exercise =
	| 'intro'
	| 'ex1'
	| 'ex2'
	| 'ex3'
	| 'ex4'
	| 'ex5'
	| 'ex6'
	| 'ex7'
	| 'ex8'
	| 'ex9'
	| 'ex10'
	| 'ex11'
	| 'outro';

interface VoClip {
	name: string;
	file: string;
	exercise: Exercise;
	from: number;
	durationInFrames: number;
	gapType: 'pause' | 'hold' | 'end';
	gapFrames: number | null;
}

// AUTO-DERIVED from ffprobe-measured VO clip lengths (30fps) against the fixed
// hold/pause spec. `from` and `durationInFrames` are measured, not estimated —
// do not hand-edit without re-running ffprobe against the source mp3s.
export const VO_CLIPS: readonly VoClip[] = [
	{name: 'nl-intro', file: 'nl-intro.mp3', exercise: 'intro', from: 0, durationInFrames: 264, gapType: 'pause', gapFrames: 15},
	{name: 'nl-2', file: 'nl-2.mp3', exercise: 'intro', from: 279, durationInFrames: 376, gapType: 'pause', gapFrames: 15},
	{name: 'nl-3', file: 'nl-3.mp3', exercise: 'intro', from: 670, durationInFrames: 263, gapType: 'pause', gapFrames: 15},
	{name: 'nl-4', file: 'nl-4.mp3', exercise: 'intro', from: 948, durationInFrames: 128, gapType: 'pause', gapFrames: 15},
	{name: 'nl-5', file: 'nl-5.mp3', exercise: 'intro', from: 1091, durationInFrames: 264, gapType: 'pause', gapFrames: 15},
	{name: 'nl-6', file: 'nl-6.mp3', exercise: 'intro', from: 1370, durationInFrames: 181, gapType: 'pause', gapFrames: 15},
	{name: 'nl-7', file: 'nl-7.mp3', exercise: 'intro', from: 1566, durationInFrames: 68, gapType: 'pause', gapFrames: 15},
	{name: 'nl-8', file: 'nl-8.mp3', exercise: 'ex1', from: 1649, durationInFrames: 65, gapType: 'hold', gapFrames: 300},
	{name: 'nl-9', file: 'nl-9.mp3', exercise: 'ex1', from: 2014, durationInFrames: 214, gapType: 'pause', gapFrames: 15},
	{name: 'nl-10', file: 'nl-10.mp3', exercise: 'ex2', from: 2243, durationInFrames: 274, gapType: 'hold', gapFrames: 450},
	{name: 'nl-11', file: 'nl-11.mp3', exercise: 'ex3', from: 2967, durationInFrames: 143, gapType: 'hold', gapFrames: 450},
	{name: 'nl-12', file: 'nl-12.mp3', exercise: 'ex3', from: 3560, durationInFrames: 124, gapType: 'pause', gapFrames: 15},
	{name: 'nl-13', file: 'nl-13.mp3', exercise: 'ex4', from: 3699, durationInFrames: 103, gapType: 'hold', gapFrames: 360},
	{name: 'nl-14', file: 'nl-14.mp3', exercise: 'ex4', from: 4162, durationInFrames: 42, gapType: 'pause', gapFrames: 15},
	{name: 'nl-15', file: 'nl-15.mp3', exercise: 'ex4', from: 4219, durationInFrames: 174, gapType: 'pause', gapFrames: 15},
	{name: 'nl-16', file: 'nl-16.mp3', exercise: 'ex4', from: 4408, durationInFrames: 118, gapType: 'pause', gapFrames: 15},
	{name: 'nl-17', file: 'nl-17.mp3', exercise: 'ex5', from: 4541, durationInFrames: 185, gapType: 'hold', gapFrames: 450},
	{name: 'nl-18', file: 'nl-18.mp3', exercise: 'ex5', from: 5176, durationInFrames: 262, gapType: 'pause', gapFrames: 15},
	{name: 'nl-19', file: 'nl-19.mp3', exercise: 'ex5', from: 5453, durationInFrames: 111, gapType: 'pause', gapFrames: 15},
	{name: 'nl-20', file: 'nl-20.mp3', exercise: 'ex6', from: 5579, durationInFrames: 310, gapType: 'hold', gapFrames: 450},
	{name: 'nl-21', file: 'nl-21.mp3', exercise: 'ex6', from: 6339, durationInFrames: 93, gapType: 'pause', gapFrames: 15},
	{name: 'nl-22', file: 'nl-22.mp3', exercise: 'ex7', from: 6447, durationInFrames: 309, gapType: 'hold', gapFrames: 540},
	{name: 'nl-23', file: 'nl-23.mp3', exercise: 'ex7', from: 7296, durationInFrames: 448, gapType: 'pause', gapFrames: 15},
	{name: 'nl-24', file: 'nl-24.mp3', exercise: 'ex8', from: 7759, durationInFrames: 299, gapType: 'hold', gapFrames: 450},
	{name: 'nl-25', file: 'nl-25.mp3', exercise: 'ex9', from: 8508, durationInFrames: 226, gapType: 'hold', gapFrames: 450},
	{name: 'nl-26', file: 'nl-26.mp3', exercise: 'ex9', from: 9184, durationInFrames: 323, gapType: 'pause', gapFrames: 15},
	{name: 'nl-27', file: 'nl-27.mp3', exercise: 'ex9', from: 9522, durationInFrames: 47, gapType: 'pause', gapFrames: 15},
	{name: 'nl-28', file: 'nl-28.mp3', exercise: 'ex10', from: 9584, durationInFrames: 258, gapType: 'hold', gapFrames: 300},
	{name: 'nl-29', file: 'nl-29.mp3', exercise: 'ex11', from: 10142, durationInFrames: 114, gapType: 'hold', gapFrames: 360},
	{name: 'nl-30', file: 'nl-30.mp3', exercise: 'ex11', from: 10616, durationInFrames: 49, gapType: 'pause', gapFrames: 15},
	{name: 'nl-31', file: 'nl-31.mp3', exercise: 'outro', from: 10680, durationInFrames: 185, gapType: 'pause', gapFrames: 15},
	{name: 'nl-32', file: 'nl-32.mp3', exercise: 'outro', from: 10880, durationInFrames: 201, gapType: 'pause', gapFrames: 15},
	{name: 'nl-33', file: 'nl-33.mp3', exercise: 'outro', from: 11096, durationInFrames: 298, gapType: 'pause', gapFrames: 15},
	{name: 'nl-34', file: 'nl-34.mp3', exercise: 'outro', from: 11409, durationInFrames: 234, gapType: 'pause', gapFrames: 15},
	{name: 'nl-outro', file: 'nl-outro.mp3', exercise: 'outro', from: 11658, durationInFrames: 78, gapType: 'end', gapFrames: null},
];

// Total = last clip's `from` + its length. Verified against the sum of every
// clip length + every pause (15f) + every hold below.
export const TOTAL_DURATION_FRAMES =
	VO_CLIPS[VO_CLIPS.length - 1].from + VO_CLIPS[VO_CLIPS.length - 1].durationInFrames;

export interface ExerciseWindow {
	exercise: Exercise;
	/** Frame range of the long "hold" after this exercise's VO line — where distractors/native elements play. */
	start: number;
	end: number;
}

// Derived, not hand-authored: one window per VO clip whose gap is a "hold".
export const EXERCISE_HOLD_WINDOWS: readonly ExerciseWindow[] = VO_CLIPS.filter(
	(c) => c.gapType === 'hold',
).map((c) => ({
	exercise: c.exercise,
	start: c.from + c.durationInFrames,
	end: c.from + c.durationInFrames + (c.gapFrames as number),
}));

export const getExerciseHoldWindow = (exercise: Exercise): ExerciseWindow | undefined =>
	EXERCISE_HOLD_WINDOWS.find((w) => w.exercise === exercise);

// Full span of the intro section (from frame 0 up to ex1's first VO line),
// used to place the two intro-only distractor videos.
export const INTRO_SPAN = {
	start: 0,
	end: VO_CLIPS.find((c) => c.exercise === 'ex1')!.from,
};

// The single reserved screen-shake moment in the whole video, placed inside
// ex10's hold window (Speed Remix — the spec's suggested candidate).
const ex10Window = getExerciseHoldWindow('ex10')!;
export const EX10_SHAKE_WINDOW = {
	start: ex10Window.start + Math.round((ex10Window.end - ex10Window.start) * 0.4),
	durationInFrames: 24,
};

// The only two whoosh moments in the video: the cut into ex10 (Speed Remix),
// and the cut out of ex11's hold into its reveal line (nl-30 — "did you look
// at the corner?").
export const EX10_CUT_FRAME = ex10Window.start;
export const EX11_REVEAL_CUT_FRAME = VO_CLIPS.find((c) => c.name === 'nl-30')!.from;
