import {createRng, randInt, choice} from '../NeurolamBrainrot/rng';
import {DOT_FLASH_SEED} from './constants';

// A palette of colors clearly distinct from red, so the single test moment
// in Round 4 reads unambiguously as a color change.
const FLASH_COLORS = ['#3BE8FF', '#FFE23C', '#39FF7A', '#FFFFFF'];

// Computed once at module load from a fixed seed: same unpredictable-but-
// deterministic frame on every render. Not tied to any round boundary or
// obvious midpoint, and never referenced by the distractor schedule or the
// background state, so nothing else in the video telegraphs it.
export const DOT_FLASH = (() => {
	const rng = createRng(DOT_FLASH_SEED);
	const startFrame = randInt(rng, 7500, 8700);
	const duration = randInt(rng, 6, 10);
	const color = choice(rng, FLASH_COLORS);
	return {startFrame, duration, color};
})();
