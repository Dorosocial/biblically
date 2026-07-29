/**
 * Slow continuous oscillation, pure function of frame. Never settles, never
 * random — the same frame always produces the same value, and the value is
 * never constant for more than an instant (only at the sine's zero-crossing).
 */
export const driftValue = (
	frame: number,
	periodFrames: number,
	amplitude: number,
	phase = 0,
): number => Math.sin((frame / periodFrames) * Math.PI * 2 + phase) * amplitude;
