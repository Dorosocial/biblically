// Real, Whisper-transcribed (medium.en, word-level timestamps) narration
// timing for src/audio/narration.mp3. Source transcript kept alongside the
// project at whisper-transcript.json / .srt for reference.
//
// NOTE ON THE ACTUAL RECORDING vs. THE SHOT-LIST SCRIPT:
// The recorded narration's opening line says "This tiny ball can hit harder
// than this giant one" (not "...can have more momentum..."). Per user
// decision, we keep the audio as-is (required for exact sync/duration) and
// carry the precise momentum framing entirely through on-screen labels —
// "MOMENTUM", "P = P", "MASS x VELOCITY", "MOMENTUM = CONSTANT" — which never
// repeat the imprecise "hit harder" phrasing. See S1 in shots.tsx.
//
// A few script lines were delivered as single merged clauses (e.g. "It's two
// things, mass and speed." instead of two separate sentences). Those are
// split below at their real word boundary so every shot-list beat still gets
// its own timing window, straight from the word-level transcript.
export const FPS = 30;
export const AUDIO_DURATION = 55.719125; // seconds, ffprobe-measured, ground truth

// Silent, wordless hook before any narration plays (see shots.tsx OPENING).
// This is the one deliberate departure from "audio starts at frame 0": the
// brief carries no narration, so nothing about sync accuracy is affected —
// the transcript's own frame-accurate timing is preserved starting the
// instant the narration begins.
export const INTRO_SECONDS = 2.5;
export const INTRO_FRAMES = Math.round(INTRO_SECONDS * FPS); // 75

export const TOTAL_DURATION_SECONDS = INTRO_SECONDS + AUDIO_DURATION;
export const TOTAL_FRAMES = Math.round(TOTAL_DURATION_SECONDS * FPS); // 1747

// frame numbers below are already composition-absolute (offset by INTRO_FRAMES)
export type Cue = {id: string; start: number; end: number; text: string};

export const CUES: Cue[] = [
	{id: 'S1', start: 75, end: 151, text: 'This tiny ball can hit harder than this giant one.'},
	{id: 'S2', start: 156, end: 198, text: "It sounds wrong, isn't it?"},
	{id: 'S3', start: 204, end: 238, text: 'But watch this closely.'},
	{id: 'S4', start: 242, end: 283, text: 'The big ball is heavier,'},
	{id: 'S5', start: 287, end: 317, text: 'and so it barely moves.'},
	{id: 'S6', start: 325, end: 404, text: "But this tiny ball? It's moving ridiculously fast,"},
	{id: 'S7', start: 404, end: 433, text: 'and when they collide,'},
	{
		id: 'S8',
		start: 442,
		end: 545,
		text: 'the tiny ball can have just as much momentum as the giant one.',
	},
	{id: 'S9', start: 550, end: 602, text: 'It sounds crazier when you do this.'},
	{id: 'S10', start: 607, end: 647, text: "Double the tiny ball's speed,"},
	{id: 'S11', start: 651, end: 685, text: 'and its momentum doubles.'},
	{id: 'S12', start: 693, end: 723, text: 'Try to double it again.'},
	{
		id: 'S13',
		start: 729,
		end: 853,
		text: 'and now that little ball is carrying four times the momentum it had at the beginning.',
	},
	{id: 'S14', start: 858, end: 922, text: 'So, what actually determines momentum?'},
	{id: 'S15', start: 922, end: 950, text: "It's two things,"},
	{id: 'S16', start: 958, end: 996, text: 'mass and speed.'},
	{id: 'S17', start: 1001, end: 1048, text: "But there's something even more important."},
	{id: 'S18', start: 1052, end: 1097, text: 'When these two objects collide,'},
	{id: 'S19', start: 1105, end: 1156, text: "the momentum doesn't just vanish,"},
	{id: 'S20', start: 1164, end: 1198, text: 'it rather moves.'},
	{id: 'S21', start: 1205, end: 1285, text: 'One slows down, while the other speeds up.'},
	{id: 'S22', start: 1289, end: 1346, text: 'and the total momentum stays the same.'},
	{id: 'S23', start: 1351, end: 1421, text: 'So, a tiny object moving fast enough'},
	{
		id: 'S24',
		start: 1421,
		end: 1520,
		text: 'can have more momentum than something hundreds of times heavier.',
	},
	{id: 'S25', start: 1527, end: 1552, text: "And that's why"},
	{
		id: 'S26',
		start: 1552,
		end: 1647,
		text: "you should never judge an object's momentum by its size.",
	},
	{id: 'S27', start: 1651, end: 1691, text: 'Because that tiny ball'},
	{id: 'S28', start: 1691, end: 1740, text: 'might be the dangerous one here.'},
];

export const cueById = (id: string): Cue => {
	const cue = CUES.find((c) => c.id === id);
	if (!cue) throw new Error(`Unknown cue id ${id}`);
	return cue;
};
