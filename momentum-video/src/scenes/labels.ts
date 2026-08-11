import {cueById} from './cues';

export type LabelSpec = {
	text: string;
	inFrame: number;
	outFrame: number;
	x: number;
	y: number;
	size?: number;
	color?: string;
	weight?: number;
};

export type CounterSpec = {
	inFrame: number;
	outFrame: number;
	from: number;
	to: number;
	x: number;
	y: number;
	prefix?: string;
	suffix?: string;
	size?: number;
};

const s3 = cueById('S3');
const s4 = cueById('S4');
const s6 = cueById('S6');
const s8 = cueById('S8');
const s10 = cueById('S10');
const s11 = cueById('S11');
const s12 = cueById('S12');
const s13 = cueById('S13');
const s15 = cueById('S15');
const s17 = cueById('S17');
const s21 = cueById('S21');
const s22 = cueById('S22');
const s26 = cueById('S26');

// Short overlay labels only — matches "HEAVY, FAST, 100x MASS, 1x MASS,
// MOMENTUM = CONSTANT" style from the brief. The precise "momentum" framing
// (never the audio's "hit harder") is carried by these labels throughout.
export const LABELS: LabelSpec[] = [
	// S3 — "But watch this closely."
	{text: 'HEAVY', inFrame: s3.start + 6, outFrame: s3.end, x: 26, y: 34, size: 46},
	{text: 'FAST', inFrame: s3.start + 6, outFrame: s3.end, x: 74, y: 34, size: 46},

	// S4 — "The big ball is heavier,"
	{text: '100× MASS', inFrame: s4.start, outFrame: s4.end + 6, x: 26, y: 30, size: 40, color: '#8fb8ff'},
	{text: '1× MASS', inFrame: s4.start, outFrame: s4.end + 6, x: 74, y: 30, size: 40, color: '#ffd166'},

	// S8 — impact + "P = P"
	{
		text: 'P = P',
		inFrame: s8.start + 24,
		outFrame: s8.end,
		x: 50,
		y: 24,
		size: 64,
		weight: 900,
	},

	// S10 — "Double the tiny ball's speed,"
	{text: '1× → 2×', inFrame: s10.start + 6, outFrame: s10.end + 8, x: 68, y: 22, size: 42, color: '#ffd166'},

	// S11 — "and its momentum doubles."
	{text: '1P → 2P', inFrame: s11.start, outFrame: s11.end + 6, x: 66, y: 20, size: 46, color: '#ffd166'},

	// S12 — "Try to double it again."
	{text: '2× → 4×', inFrame: s12.start + 4, outFrame: s12.end + 6, x: 58, y: 20, size: 42, color: '#ffd166'},

	// S13 — "...four times the momentum..."
	{text: '4× MOMENTUM', inFrame: s13.start + 14, outFrame: s13.end, x: 50, y: 18, size: 44},

	// S15/16/17 — "MASS x VELOCITY" equation, fades away during S17
	{text: 'MASS × VELOCITY', inFrame: s15.start, outFrame: s17.start + 16, x: 50, y: 50, size: 58},

	// S21 — before/after transfer labels
	{text: 'FAST → SLOW', inFrame: s21.start + 4, outFrame: s21.end, x: 72, y: 22, size: 38, color: '#ffd166'},
	{text: 'SLOW → FAST', inFrame: s21.start + 4, outFrame: s21.end, x: 26, y: 22, size: 38, color: '#8fb8ff'},

	// S22 — "and the total momentum stays the same."
	{
		text: 'TOTAL MOMENTUM = CONSTANT',
		inFrame: s22.start + 8,
		outFrame: s22.end + 10,
		x: 50,
		y: 16,
		size: 34,
	},
];

export const COUNTERS: CounterSpec[] = [
	// S6 — "It's moving ridiculously fast," — climbing speed counter
	{
		inFrame: s6.start + 4,
		outFrame: s6.end,
		from: 12,
		to: 341,
		x: 50,
		y: 14,
		suffix: ' m/s',
		size: 40,
	},
	// S26 — "...judge an object's momentum by its size." — speed climbing
	{
		inFrame: s26.start,
		outFrame: s26.end,
		from: 40,
		to: 512,
		x: 78,
		y: 20,
		suffix: ' m/s',
		size: 34,
	},
];
