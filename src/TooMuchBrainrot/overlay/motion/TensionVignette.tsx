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

	return (
		<div
			style={{
				position: 'absolute',
				width: WIDTH,
				height: HEIGHT,
				boxShadow: `inset 0 0 ${140 + intensity * 120}px ${40 + intensity * 60}px rgba(0,0,0,${
					intensity * 0.65
				})`,
			}}
		/>
	);
};
