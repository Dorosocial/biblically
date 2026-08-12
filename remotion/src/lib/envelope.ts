import {interpolate} from 'remotion';
import {Shot, secToFrames} from './timing';

/**
 * Crossfade-in/out envelope (0..1) for a shot's HTML overlay content,
 * evaluated at an absolute frame. Neighboring shots' envelopes overlap by
 * `padFrames` on each side of a cut, so every transition is a short
 * crossfade instead of a hard cut/dead frame.
 */
export const shotEnvelope = (frame: number, shot: Shot, padFrames = 8): number => {
	const startF = secToFrames(shot.start);
	const endF = secToFrames(shot.end);
	if (frame < startF - padFrames || frame > endF + padFrames) return 0;
	const fadeIn = interpolate(frame, [startF - padFrames, startF + padFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const fadeOut = interpolate(frame, [endF - padFrames, endF + padFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return Math.min(fadeIn, fadeOut);
};
