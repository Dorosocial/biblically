import {interpolate} from 'remotion';

// Keyframed grid/base palette per round, with a short crossfade window at
// each hand-off (rather than a hard cut) plus an "amplitude" channel that
// turns on the Round 3/4 hue-wobble + opacity pulse and turns it back off
// again as the cooldown settles.
interface Stop {
	frame: number;
	baseH: number;
	baseS: number;
	baseL: number;
	gridH: number;
	gridS: number;
	gridL: number;
	gridOpacity: number;
	amplitude: number;
}

const CALM = {
	baseH: 206,
	baseS: 38,
	baseL: 6,
	gridH: 189,
	gridS: 88,
	gridL: 62,
	gridOpacity: 0.12,
	amplitude: 0,
};

const PURPLE = {
	baseH: 276,
	baseS: 46,
	baseL: 7,
	gridH: 284,
	gridS: 82,
	gridL: 66,
	gridOpacity: 0.16,
	amplitude: 0,
};

const DYNAMIC = {
	baseH: 338,
	baseS: 52,
	baseL: 8,
	gridH: 344,
	gridS: 92,
	gridL: 64,
	gridOpacity: 0.2,
	amplitude: 1,
};

const STOPS: Stop[] = [
	{frame: 0, ...CALM},
	{frame: 2100, ...CALM},
	{frame: 2350, ...PURPLE},
	{frame: 4200, ...PURPLE},
	{frame: 4450, ...DYNAMIC},
	{frame: 9000, ...DYNAMIC},
	{frame: 9800, ...CALM},
	{frame: 10800, ...CALM},
];

const FRAMES = STOPS.map((s) => s.frame);
const fieldValues = (key: keyof Stop) => STOPS.map((s) => s[key]);

const interp = (frame: number, key: keyof Stop) =>
	interpolate(frame, FRAMES, fieldValues(key), {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

export interface BackgroundState {
	baseH: number;
	baseS: number;
	baseL: number;
	gridH: number;
	gridS: number;
	gridL: number;
	gridOpacity: number;
}

export const getBackgroundState = (frame: number): BackgroundState => {
	const amplitude = interp(frame, 'amplitude');
	const baseH = interp(frame, 'baseH');
	const baseS = interp(frame, 'baseS');
	const baseL = interp(frame, 'baseL') + amplitude * 1.6 * Math.sin(frame * 0.07 + 2.1);
	const gridH = interp(frame, 'gridH') + amplitude * 16 * Math.sin(frame * 0.045);
	const gridS = interp(frame, 'gridS');
	const gridL = interp(frame, 'gridL');
	const gridOpacity = Math.max(
		0.04,
		interp(frame, 'gridOpacity') + amplitude * 0.05 * Math.sin(frame * 0.11 + 1.3)
	);

	return {baseH, baseS, baseL, gridH, gridS, gridL, gridOpacity};
};
