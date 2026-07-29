import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X} from '../constants';
import {driftValue} from '../drift';

interface Props {
	/** Length of the hold window this graphic lives in, so the delay/reveal is proportional, not a magic number. */
	durationInFrames: number;
}

// Stays hidden for the first third of the window, then wipes/fades in and
// keeps a slow breathing motion once visible.
export const DelayedRevealGraphic: React.FC<Props> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const revealStart = durationInFrames * 0.35;
	const revealEnd = revealStart + fps * 0.8;
	const reveal = interpolate(frame, [revealStart, revealEnd], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const breathe = driftValue(frame, fps * 3.4, 10, 1.5);

	return (
		<div
			style={{
				position: 'absolute',
				left: CENTER_X - 130,
				top: 700 + breathe,
				width: 260,
				height: 130,
				borderRadius: 16,
				border: '3px solid #7CE38B',
				opacity: reveal,
				transform: `scale(${0.85 + reveal * 0.15})`,
			}}
		/>
	);
};
