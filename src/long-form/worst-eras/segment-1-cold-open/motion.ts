// Continuous-motion helpers — per this segment's fingerprint, nothing may
// ever be fully static. Every shot layers at least one of these on top of
// its held pose: a slow push-in/zoom, idle breathing, subtle drift, or a
// pulsing glow. A tiny phase discontinuity at each shot's Sequence boundary
// is acceptable (amplitude is small enough to read as invisible).

/** Slow "breathing" scale oscillation, e.g. for idle holds. */
export const breathe = (frame: number, fps: number, amplitude = 0.012, hz = 0.18) =>
	1 + amplitude * Math.sin((frame / fps) * 2 * Math.PI * hz);

/** Slow vertical drift in pixels, e.g. for idle holds. */
export const driftY = (frame: number, fps: number, amplitude = 4, hz = 0.14) =>
	amplitude * Math.sin((frame / fps) * 2 * Math.PI * hz);

/** Slow horizontal drift in pixels, e.g. for idle holds. */
export const driftX = (frame: number, fps: number, amplitude = 5, hz = 0.12) =>
	amplitude * Math.sin((frame / fps) * 2 * Math.PI * hz);

/** Faster pulse, e.g. for a glow that should read as "alive". */
export const pulse = (frame: number, fps: number, amplitude = 0.1, hz = 0.45) =>
	1 + amplitude * Math.sin((frame / fps) * 2 * Math.PI * hz);

/** Slow continuous push-in/zoom across a shot's own duration (a Ken Burns creep). */
export const pushIn = (frame: number, durationInFrames: number, from = 1, to = 1.05) =>
	from + ((to - from) * Math.min(Math.max(frame, 0), durationInFrames)) / durationInFrames;
