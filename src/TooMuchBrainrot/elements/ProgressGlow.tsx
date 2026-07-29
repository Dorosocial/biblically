import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {WIDTH} from '../constants';

interface Props {
	durationInFrames: number;
}

// A build-up bar tied to progress through the window, with a fine sine
// riding on top so it never reads as a frozen linear ramp mid-frame.
export const ProgressGlow: React.FC<Props> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const shimmer = (Math.sin((frame / (fps * 0.5)) * Math.PI * 2) + 1) / 2;

	return (
		<div
			style={{
				position: 'absolute',
				left: WIDTH * 0.3,
				bottom: 120,
				width: WIDTH * 0.4,
				height: 14,
				borderRadius: 7,
				backgroundColor: 'rgba(255,255,255,0.08)',
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					width: `${progress * 100}%`,
					height: '100%',
					backgroundColor: '#7CE38B',
					opacity: 0.65 + shimmer * 0.35,
					boxShadow: `0 0 ${8 + shimmer * 10}px #7CE38B`,
				}}
			/>
		</div>
	);
};
