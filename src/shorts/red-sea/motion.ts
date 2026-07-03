// Every scene needs continuous subtle motion, even while "holding" — no
// scene should ever go more than 1-2s fully static. These helpers produce
// small continuous sine-driven offsets from a scene-local frame. A tiny
// phase discontinuity at each scene's Sequence boundary is acceptable
// (amplitude is small enough that it reads as invisible), so callers can
// just pass their own useCurrentFrame() without cross-scene bookkeeping.

/** Slow "breathing" scale oscillation, e.g. for idle holds. */
export const breathe = (frame: number, fps: number, amplitude = 0.018, hz = 0.2) =>
	1 + amplitude * Math.sin((frame / fps) * 2 * Math.PI * hz);

/** Slow vertical drift in pixels, e.g. for idle holds or mist layers. */
export const driftY = (frame: number, fps: number, amplitude = 5, hz = 0.16) =>
	amplitude * Math.sin((frame / fps) * 2 * Math.PI * hz);

/** Slow horizontal drift in pixels, e.g. for mist/fog layers. */
export const driftX = (frame: number, fps: number, amplitude = 6, hz = 0.13) =>
	amplitude * Math.sin((frame / fps) * 2 * Math.PI * hz);

/** Faster pulse, e.g. for a glow or marker that should read as "alive". */
export const pulse = (frame: number, fps: number, amplitude = 0.08, hz = 1.1) =>
	1 + amplitude * Math.sin((frame / fps) * 2 * Math.PI * hz);

/** Slow continuous push-in across a scene's own duration (a Ken Burns creep). */
export const pushIn = (frame: number, durationInFrames: number, from = 1, to = 1.035) =>
	from + ((to - from) * Math.min(frame, durationInFrames)) / durationInFrames;
