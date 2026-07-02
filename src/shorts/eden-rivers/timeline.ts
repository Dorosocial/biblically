import {interpolate} from 'remotion';

// Global-frame offsets for each scene's own <Sequence>. useCurrentFrame()
// inside a Sequence is local to that Sequence, so animations that must
// stay continuous *across* a scene boundary (rather than reset) need to
// convert back to a global frame using these.
export const SCENE_STARTS = {
	scene1: 0,
	scene2: 288,
	scene3: 462,
	scene4: 603,
	scene5: 894,
	scene6: 1185,
	scene7: 1515,
	scene8: 1842,
	scene9: 2091,
	scene10: 2241,
	scene11: 2451,
} as const;

// Cush region highlight: begins in Scene 5 (1000-1100, reaches a partial
// value), holds through Scene 5's remainder, then completes in Scene 6
// (1185-1300).
export const cushProgress = (globalFrame: number) =>
	interpolate(globalFrame, [1000, 1100, 1185, 1300], [0, 0.6, 0.6, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
