import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y, DOT_COLOR, DOT_RADIUS} from '../constants';
import {driftValue} from '../drift';

// A translucent duplicate of the primary dot's focal area, drifting on its
// own independent, slightly faster cycle, so the eye has to compare two
// moving targets instead of one.
export const GhostDouble: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const x = CENTER_X + driftValue(frame, fps * 4.6, 150, 3.1);
	const y = CENTER_Y + driftValue(frame, fps * 3.9, 90, 0.4);
	const opacity = 0.22 + driftValue(frame, fps * 5.1, 0.1, 1.2);

	return (
		<div
			style={{
				position: 'absolute',
				left: x - DOT_RADIUS,
				top: y - DOT_RADIUS,
				width: DOT_RADIUS * 2,
				height: DOT_RADIUS * 2,
				borderRadius: '50%',
				border: `2px solid ${DOT_COLOR}`,
				backgroundColor: 'transparent',
				opacity,
			}}
		/>
	);
};
