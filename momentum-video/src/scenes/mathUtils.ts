export type Vec3 = [number, number, number];

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [
	lerp(a[0], b[0], t),
	lerp(a[1], b[1], t),
	lerp(a[2], b[2], t),
];

// cubic in-out
export const easeInOut = (t: number) =>
	t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t: number) => t * t * t;

// Remap `frame` from [inMin, inMax] to [outMin, outMax], clamped, with an
// optional easing curve applied to the 0-1 progress before remapping.
export const remap = (
	frame: number,
	inMin: number,
	inMax: number,
	outMin: number,
	outMax: number,
	easing: (t: number) => number = (t) => t,
) => {
	const t = clamp01((frame - inMin) / Math.max(1, inMax - inMin));
	return outMin + (outMax - outMin) * easing(t);
};

export const remapVec3 = (
	frame: number,
	inMin: number,
	inMax: number,
	outMin: Vec3,
	outMax: Vec3,
	easing: (t: number) => number = (t) => t,
): Vec3 => {
	const t = clamp01((frame - inMin) / Math.max(1, inMax - inMin));
	return lerp3(outMin, outMax, easing(t));
};

export const orbit = (
	center: Vec3,
	radius: number,
	angleRad: number,
	height: number,
): Vec3 => [
	center[0] + Math.sin(angleRad) * radius,
	center[1] + height,
	center[2] + Math.cos(angleRad) * radius,
];
