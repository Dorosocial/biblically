/**
 * Timing table for "A Second vs a Billion Years".
 *
 * Derived from a Whisper (openai-whisper, `base` model, word_timestamps=true)
 * transcription of the real narration file (public/audio/narration.mp3).
 * True audio duration (ffprobe): 66.768938s.
 *
 * IMPORTANT: the shot list in the original brief carried pacing references
 * (e.g. "18-21s", "89-97s") written against a much longer imagined ~100s cut.
 * The real recorded narration is a continuous ~66.8s read of the whole
 * script, so every shot below is compressed proportionally and placed at
 * the *real* word timestamps below — the composition's duration is locked
 * to this real audio length, not to the brief's placeholder numbers.
 */

export const FPS = 30;

// Exact ffprobe duration of public/audio/narration.mp3
export const AUDIO_DURATION_S = 66.768938;

export const DURATION_IN_FRAMES = Math.round(AUDIO_DURATION_S * FPS);

export const secToFrames = (s: number): number => Math.round(s * FPS);

export type ShotId =
	| 'billionSecondsForever'
	| 'only31Years'
	| 'seriously31Years'
	| 'meaningCounting'
	| 'oneEverySecond'
	| 'need31_7Years'
	| 'alreadyInsane' // punctuated pause 1
	| 'compareBillionYears'
	| 'notJustLongTime'
	| 'thirtyOneMillionTimes'
	| 'justThinkAboutThat' // punctuated pause 2
	| 'spendLifeCounting'
	| 'wouldntComeClose'
	| 'overBillionYears'
	| 'continentsCanMove'
	| 'mountainsRiseErode'
	| 'speciesAppear'
	| 'evenDisappear'
	| 'earthUnrecognizable'
	| 'numbersHardToImagine'
	| 'secondVsMinute'
	| 'understandOneYear'
	| 'butBillionYears'
	| 'timescaleEnormous'
	| 'brainsNoIntuition';

export interface Shot {
	id: ShotId;
	start: number; // seconds
	end: number; // seconds
	text: string;
	isPause?: boolean;
}

// Shot boundaries snapped to Whisper word timestamps; gaps between spoken
// segments are split at their midpoint so cuts land in the middle of the
// breath, keeping visuals contiguous across [0, AUDIO_DURATION_S] with no
// dead/black frame between shots.
export const SHOTS: Shot[] = [
	{id: 'billionSecondsForever', start: 0.0, end: 2.97, text: "A billion seconds sounds like forever… isn't it?"},
	{id: 'only31Years', start: 2.97, end: 5.34, text: "But it's only about 31 years."},
	{id: 'seriously31Years', start: 5.34, end: 7.73, text: 'Seriously, just 31 years.'},
	{id: 'meaningCounting', start: 7.73, end: 10.38, text: 'Meaning, if you started counting right now…'},
	{id: 'oneEverySecond', start: 10.38, end: 11.86, text: 'one number every second…'},
	{id: 'need31_7Years', start: 11.86, end: 16.03, text: "you'd need about 31.7 years to reach one billion."},
	{id: 'alreadyInsane', start: 16.03, end: 17.54, text: "That's already insane.", isPause: true},
	{id: 'compareBillionYears', start: 17.54, end: 21.33, text: 'But now I want you to compare that with a billion years.'},
	{id: 'notJustLongTime', start: 21.33, end: 24.58, text: "A billion years isn't just 'a really long time.'"},
	{id: 'thirtyOneMillionTimes', start: 24.58, end: 29.94, text: "It's about 31.5 million times longer than a billion seconds."},
	{id: 'justThinkAboutThat', start: 29.94, end: 31.5, text: 'Just think about that.', isPause: true},
	{id: 'spendLifeCounting', start: 31.5, end: 34.37, text: 'You could spend your entire life counting…'},
	{id: 'wouldntComeClose', start: 34.37, end: 37.56, text: "and you still wouldn't even come close to a billion years."},
	{id: 'overBillionYears', start: 37.56, end: 39.59, text: 'You see, over a billion years…'},
	{id: 'continentsCanMove', start: 39.59, end: 40.76, text: 'continents can move.'},
	{id: 'mountainsRiseErode', start: 40.76, end: 43.1, text: 'Mountain ranges can rise and erode.'},
	{id: 'speciesAppear', start: 43.1, end: 44.85, text: 'Entire species can appear…'},
	{id: 'evenDisappear', start: 44.85, end: 46.36, text: 'and even disappear.'},
	{id: 'earthUnrecognizable', start: 46.36, end: 49.67, text: 'And the Earth can become almost unrecognizable.'},
	{id: 'numbersHardToImagine', start: 49.67, end: 54.61, text: "That's why numbers like a million, a billion, and a trillion are so hard to imagine."},
	{id: 'secondVsMinute', start: 54.61, end: 58.05, text: 'We understand the difference between one second and one minute.'},
	{id: 'understandOneYear', start: 58.05, end: 60.31, text: 'We can even understand one year.'},
	{id: 'butBillionYears', start: 60.31, end: 61.44, text: 'But a billion years?'},
	{id: 'timescaleEnormous', start: 61.44, end: 63.65, text: "That's a timescale so enormous…"},
	{id: 'brainsNoIntuition', start: 63.65, end: AUDIO_DURATION_S, text: "that our brains don't really have an intuition for it."},
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
