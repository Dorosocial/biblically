import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CENTER_X, CENTER_Y, DOT_COLOR, DOT_RADIUS, FPS} from './constants';
import {driftValue} from './drift';

// The dot is mounted for the entire video and is the motion floor: even when
// nothing else is animating, this alone guarantees the frame is never fully
// static. Two independent sine pairs (different periods, non-harmonic so they
// never lock into a visible repeat) keep the drift feeling organic instead of
// like an obvious loop.
export const PrimaryDot: React.FC = () => {
	const frame = useCurrentFrame();

	const x =
		CENTER_X +
		driftValue(frame, FPS * 11, 70) +
		driftValue(frame, FPS * 4.3, 16, 1.7);
	const y =
		CENTER_Y +
		driftValue(frame, FPS * 8.5, 44, 0.6) +
		driftValue(frame, FPS * 3.1, 12, 2.4);
	const scale = 1 + driftValue(frame, FPS * 6.2, 0.045, 0.9);

	return (
		<div
			style={{
				position: 'absolute',
				left: x - DOT_RADIUS,
				top: y - DOT_RADIUS,
				width: DOT_RADIUS * 2,
				height: DOT_RADIUS * 2,
				borderRadius: '50%',
				backgroundColor: DOT_COLOR,
				transform: `scale(${scale})`,
				boxShadow: `0 0 ${24 + driftValue(frame, FPS * 6.2, 10, 0.9)}px ${DOT_COLOR}`,
			}}
		/>
	);
};
