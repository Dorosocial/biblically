import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../constants';
import {WARM_GLOW} from './palette';

interface Props {
	/** 0-1, how present the breathing glow is. Keeps every "minimal" beat from reading as a dead frame. */
	intensity?: number;
}

// Shared by every narrator line that's a plain bridge/pause: a slow,
// continuous, very restrained breathing glow — present enough to satisfy
// the no-freeze motion floor, calm enough to stay out of the way.
export const MinimalBeat: React.FC<Props> = ({intensity = 0.5}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const breath = (Math.sin((frame / (fps * 3.6)) * Math.PI * 2) + 1) / 2;
	const radius = 220 + breath * 70 * intensity;

	return (
		<div
			style={{
				position: 'absolute',
				left: CENTER_X - radius,
				top: CENTER_Y - radius,
				width: radius * 2,
				height: radius * 2,
				borderRadius: '50%',
				background: `radial-gradient(circle, ${WARM_GLOW}${Math.round(
					14 * intensity,
				).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
			}}
		/>
	);
};
