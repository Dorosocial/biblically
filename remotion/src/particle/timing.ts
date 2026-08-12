/**
 * Timing table for "How Can One Particle Be in Two Places at the Same Time?"
 *
 * Derived from a Whisper (openai-whisper, `base` model, word_timestamps=true)
 * transcription of the real narration file
 * (public/audio/particle-narration.mp3). True audio duration (ffprobe):
 * 72.803250s.
 *
 * As with the other video in this repo, the brief's shot-list timestamps
 * (2-4s, 31-35s, 39-42s, etc.) are pacing references against an imagined
 * cut and do not match the real ~72.8s recording — every shot below is
 * placed at the real transcribed word times instead. Notably:
 *   - the "punctuated pause" ("It already sounds impossible.") lands at
 *     ~3.1-4.5s, not 2-4s
 *   - "the results can form an interference pattern" lands at ~26.6-28.7s,
 *     not 31-35s
 *   - "did it actually split into two particles?" lands at ~32.0-34.5s,
 *     not 39-42s
 */

export const FPS = 30;

export const AUDIO_DURATION_S = 72.80325;

export const DURATION_IN_FRAMES = Math.round(AUDIO_DURATION_S * FPS);

export const secToFrames = (s: number): number => Math.round(s * FPS);

export type ShotId =
	| 'howCanOneParticle'
	| 'alreadySoundsImpossible' // punctuated pause
	| 'ifYouPutABallHere'
	| 'cantAlsoBeOverThere'
	| 'tinyParticlesDontBehave'
	| 'letMeExplain'
	| 'particleCanExistSuperposition'
	| 'getsReallyStrange'
	| 'imagineSendingParticle'
	| 'chooseLeftOrRight'
	| 'dontMeasureWhichPath'
	| 'resultsFormInterferencePattern'
	| 'almostWentThroughBothPaths'
	| 'didItSplitIntoTwo'
	| 'noSingleParticle'
	| 'strangestPartWaveFunction'
	| 'spreadMultiplePossibilities'
	| 'tryFindWhichPath'
	| 'measureIt'
	| 'interferenceDisappears'
	| 'oneDefiniteResult'
	| 'meaningNotLiterallyBall'
	| 'somethingStranger'
	| 'beforeMeasurement'
	| 'describeMultipleOutcomes'
	| 'quantumWorldDifferent'
	| 'becauseAtThatScale'
	| 'realityGetsWeird';

export interface Shot {
	id: ShotId;
	start: number;
	end: number;
	text: string;
	isPause?: boolean;
}

export const SHOTS: Shot[] = [
	{id: 'howCanOneParticle', start: 0.0, end: 3.13, text: 'How can one particle be in two places at the same time?'},
	{id: 'alreadySoundsImpossible', start: 3.13, end: 4.52, text: 'It already sounds impossible.', isPause: true},
	{id: 'ifYouPutABallHere', start: 4.52, end: 6.34, text: 'because if you put a ball here,'},
	{id: 'cantAlsoBeOverThere', start: 6.34, end: 7.91, text: "it can't also be over there."},
	{id: 'tinyParticlesDontBehave', start: 7.91, end: 10.71, text: "But tiny particles don't always behave like that."},
	{id: 'letMeExplain', start: 10.71, end: 11.5, text: 'Let me explain.'},
	{
		id: 'particleCanExistSuperposition',
		start: 11.5,
		end: 16.69,
		text: 'In quantum physics, quantum mechanics can describe a particle in a superposition of different possible states,',
	},
	{id: 'getsReallyStrange', start: 16.69, end: 18.07, text: 'and that gets really strange.'},
	{id: 'imagineSendingParticle', start: 18.07, end: 21.29, text: 'Imagine sending a single particle toward two openings.'},
	{id: 'chooseLeftOrRight', start: 21.29, end: 24.32, text: 'You might expect it to choose one, left, or right.'},
	{id: 'dontMeasureWhichPath', start: 24.32, end: 26.59, text: "But when you don't measure which path it takes…"},
	{id: 'resultsFormInterferencePattern', start: 26.59, end: 28.7, text: 'The results can form an interference pattern.'},
	{id: 'almostWentThroughBothPaths', start: 28.7, end: 32.02, text: "That's almost like the particle somehow went through both paths."},
	{id: 'didItSplitIntoTwo', start: 32.02, end: 34.53, text: 'So did it actually split into two particles?'},
	{id: 'noSingleParticle', start: 34.53, end: 37.39, text: "No. There's still only one particle."},
	{
		id: 'strangestPartWaveFunction',
		start: 37.39,
		end: 42.41,
		text: 'And the strangest part of all this is that quantum mechanics describes it using a wave function,',
	},
	{id: 'spreadMultiplePossibilities', start: 42.41, end: 44.86, text: 'which can spread across multiple possibilities.'},
	{id: 'tryFindWhichPath', start: 44.86, end: 48.3, text: 'But now, try to find out exactly which path it took.'},
	{id: 'measureIt', start: 48.3, end: 49.1, text: 'Measure it…'},
	{id: 'interferenceDisappears', start: 49.1, end: 51.42, text: 'and that interference completely disappears.'},
	{id: 'oneDefiniteResult', start: 51.42, end: 53.9, text: 'The particle gives you one definite result,'},
	{
		id: 'meaningNotLiterallyBall',
		start: 53.9,
		end: 59.47,
		text: "meaning the particle isn't literally a tiny ball sitting in two places like a normal object.",
	},
	{id: 'somethingStranger', start: 59.47, end: 61.05, text: "It's something much stranger."},
	{id: 'beforeMeasurement', start: 61.05, end: 62.22, text: 'Before measurement…'},
	{id: 'describeMultipleOutcomes', start: 62.22, end: 65.82, text: 'quantum mechanics can describe multiple possible outcomes at once.'},
	{id: 'quantumWorldDifferent', start: 65.82, end: 69.55, text: "And that's why the quantum world doesn't behave the way our everyday world does."},
	{id: 'becauseAtThatScale', start: 69.55, end: 71.22, text: 'Because at that scale…'},
	{id: 'realityGetsWeird', start: 71.22, end: AUDIO_DURATION_S, text: 'reality gets weird.'},
];

export const shotFrameRange = (shot: Shot): [number, number] => [secToFrames(shot.start), secToFrames(shot.end)];

export const getShotAtFrame = (frame: number): Shot => {
	const t = frame / FPS;
	for (const shot of SHOTS) {
		if (t >= shot.start && t < shot.end) return shot;
	}
	return SHOTS[SHOTS.length - 1];
};

export const getShotIndex = (id: ShotId): number => SHOTS.findIndex((s) => s.id === id);
