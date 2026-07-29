import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {SOFT_BLUE_WHITE} from '../palette';

// A single outward ripple, under 1 second, like a sound wave visualization.
export const SoundRipple: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const rippleFrames = Math.min(fps * 0.85, 26);
	const progress = interpolate(frame, [0, rippleFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const radius = 20 + progress * 150;
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
				border: `3px solid ${SOFT_BLUE_WHITE}`,
				opacity,
			}}
		/>
	);
};
