import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CENTER_X, CENTER_Y, DOT_COLOR, DOT_RADIUS} from './constants';
import {DOT_FLASH} from './dotFlash';

// Position is fixed via left/top + translate(-50%,-50%) and never changes.
// Only opacity (intro fade), scale (intro settle + flash pulse), and color
// (single Round 4 flash) ever animate.
export const CenterDot: React.FC = () => {
	const frame = useCurrentFrame();

	const opacity = interpolate(frame, [0, 60], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const settleScale = interpolate(frame, [0, 40, 60], [0.4, 1.08, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const flashEnd = DOT_FLASH.startFrame + DOT_FLASH.duration;
	const isFlashing = frame >= DOT_FLASH.startFrame && frame < flashEnd;
	const color = isFlashing ? DOT_FLASH.color : DOT_COLOR;

	return (
		<div
			style={{
				position: 'absolute',
				left: CENTER_X,
				top: CENTER_Y,
				width: DOT_RADIUS * 2,
				height: DOT_RADIUS * 2,
				borderRadius: '50%',
				background: color,
				transform: `translate(-50%, -50%) scale(${settleScale})`,
				opacity,
				boxShadow: `0 0 40px ${color}66`,
			}}
		/>
	);
};
