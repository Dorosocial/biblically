import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {HEIGHT, WIDTH} from '../../constants';

// Tension vignette — the validated fix from the previous build (a black
// inset shadow reads as invisible against a near-black background; a dark
// maroon radial gradient shifts hue as well as brightness).
export const Nl27Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const pulseFrames = Math.min(fps * 0.9, 27);
	const intensity = interpolate(
		frame,
		[0, pulseFrames * 0.45, pulseFrames],
		[0, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
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
