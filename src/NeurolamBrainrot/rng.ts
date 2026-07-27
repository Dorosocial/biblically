// Deterministic PRNG (mulberry32) so every distractor's "random" parameters
// are identical across studio preview, still renders, and final render.
export type Rng = () => number;

export const createRng = (seed: number): Rng => {
	let a = seed | 0;
	return () => {
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
};

export const randRange = (rng: Rng, min: number, max: number): number =>
	min + rng() * (max - min);

export const randInt = (rng: Rng, min: number, max: number): number =>
	Math.floor(randRange(rng, min, max + 1));

export const choice = <T,>(rng: Rng, arr: readonly T[]): T =>
	arr[Math.floor(rng() * arr.length)];

export const chance = (rng: Rng, probability: number): boolean =>
	rng() < probability;
