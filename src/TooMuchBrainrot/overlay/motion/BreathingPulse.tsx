import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {SOFT_BLUE_WHITE} from '../palette';

interface Props {
	durationInFrames: number;
}

// One single breath: a soft radial glow expands then contracts once across
// the full span it's mounted for (a half sine cycle, not a repeating loop).
export const BreathingPulse: React.FC<Props> = ({durationInFrames}) => {
	const frame = useCurrentFrame();

	const breath = Math.sin(Math.PI * Math.min(Math.max(frame / durationInFrames, 0), 1));
	const radius = 90 + breath * 130;

	return (
		<div
			style={{
				position: 'absolute',
				left: CENTER_X - radius,
				top: CENTER_Y - radius,
				width: radius * 2,
				height: radius * 2,
				borderRadius: '50%',
				background: `radial-gradient(circle, ${SOFT_BLUE_WHITE}33 0%, transparent 70%)`,
				opacity: 0.5 + breath * 0.3,
			}}
		/>
	);
};
