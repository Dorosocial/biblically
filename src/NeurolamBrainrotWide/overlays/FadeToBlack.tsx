import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {DURATION, HEIGHT, WIDTH} from '../constants';

const LAST_FRAME = DURATION - 1;
const FADE_START = LAST_FRAME - 140;

export const FadeToBlack: React.FC = () => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [FADE_START, LAST_FRAME], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: WIDTH,
				height: HEIGHT,
				background: '#000000',
				opacity,
				pointerEvents: 'none',
			}}
		/>
	);
};
