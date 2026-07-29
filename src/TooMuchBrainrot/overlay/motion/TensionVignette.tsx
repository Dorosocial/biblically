import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {HEIGHT, WIDTH} from '../../constants';

// Screen edges darken and tighten briefly, then release. Under 1 second.
export const TensionVignette: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const pulseFrames = Math.min(fps * 0.9, 27);
	const intensity = interpolate(
		frame,
		[0, pulseFrames * 0.45, pulseFrames],
		[0, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	// A black vignette reads as nearly invisible against the already
	// near-black background (measured: corner luminance moved by ~2/255) —
	// a dark maroon tint shifts the corner hue instead of just its
	// brightness, so the tighten/release is actually perceptible.
	const edgeStop = 55 - intensity * 25;

	return (
		<div
			style={{
				position: 'absolute',
				width: WIDTH,
				height: HEIGHT,
				background: `radial-gradient(circle at 50% 50%, transparent ${edgeStop}%, rgba(46,6,6,${
					intensity * 0.95
				}) 100%)`,
			}}
		/>
	);
};
