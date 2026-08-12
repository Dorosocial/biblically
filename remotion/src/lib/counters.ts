import {interpolate} from 'remotion';
import {commas} from './format';

/** Exponential count, e.g. 1 -> 1e6 across a shot's local progress (0..1). */
export const expCount = (progress: number, fromPow: number, toPow: number): number =>
	Math.round(Math.pow(10, interpolate(progress, [0, 1], [fromPow, toPow], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})));

export const expCountLabel = (progress: number, fromPow: number, toPow: number): string => commas(expCount(progress, fromPow, toPow));

/** Simple 1-per-second counter (whole seconds elapsed since shot start, min 1). */
export const secondsCount = (localSeconds: number): number => Math.max(1, Math.floor(localSeconds) + 1);

/**
 * A big number that keeps visibly climbing (cosmetic — not a literal count),
 * used where the brief calls for "the counter remains" without a precise
 * target. Deterministic so it's stable across re-renders.
 */
export const flavorClimbingCount = (localSeconds: number, base: number): number => {
	const jitter = Math.sin(localSeconds * 37.1) * 1500 + Math.sin(localSeconds * 91.7) * 400;
	return Math.max(0, Math.round(base + localSeconds * 48000000 + jitter));
};
