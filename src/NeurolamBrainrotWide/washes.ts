import {createRng, randInt, randRange} from '../NeurolamBrainrot/rng';
import {WASH_SEED} from './constants';

// Brief full-color wash flashes, seeded so they're deterministic across
// renders. Confined to the Round 3 / Round 4 window (the "most dynamic
// point" of the video).
export interface WashEvent {
	startFrame: number;
	duration: number;
	hue: number;
	peakOpacity: number;
}

export const generateWashSchedule = (): WashEvent[] => {
	const rng = createRng(WASH_SEED);
	const events: WashEvent[] = [];
	let cursor = 4300 + randInt(rng, 0, 200);
	const end = 8850;
	while (cursor < end) {
		events.push({
			startFrame: cursor,
			duration: randInt(rng, 10, 18),
			hue: randRange(rng, 0, 360),
			peakOpacity: randRange(rng, 0.14, 0.24),
		});
		cursor += randInt(rng, 320, 620);
	}
	return events;
};
