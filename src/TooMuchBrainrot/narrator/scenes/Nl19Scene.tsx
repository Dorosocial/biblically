import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {SOFT_GRAY} from '../palette';

// Full-frame ripple: one clean outward wave from center, quick.
export const Nl19Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const rippleFrames = fps * 0.9;
	const progress = interpolate(frame, [0, rippleFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const radius = 40 + progress * 640;
	const opacity = 1 - progress;

	return (
		<div
			style={{
				position: 'absolute',
				left: CENTER_X - radius,
				top: CENTER_Y - radius,
				width: radius * 2,
				height: radius * 2,
				borderRadius: '50%',
				border: `5px solid ${SOFT_GRAY}`,
				opacity,
			}}
		/>
	);
};
