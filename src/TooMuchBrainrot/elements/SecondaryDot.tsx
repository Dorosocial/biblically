import React from 'react';
import {useCurrentFrame} from 'remotion';
import {DOT_COLOR, FPS, HEIGHT, WIDTH} from '../constants';
import {driftValue} from '../drift';

interface Props {
	/** Which quadrant to drift within, so it stays clear of the primary dot's focal area. */
	corner: 'topRight' | 'bottomLeft';
}

export const SecondaryDot: React.FC<Props> = ({corner}) => {
	const frame = useCurrentFrame();
	const radius = 14;

	const anchorX = corner === 'topRight' ? WIDTH * 0.78 : WIDTH * 0.22;
	const anchorY = corner === 'topRight' ? HEIGHT * 0.24 : HEIGHT * 0.76;

	const x = anchorX + driftValue(frame, FPS * 5.4, 36, 0.3);
	const y = anchorY + driftValue(frame, FPS * 4.1, 26, 2.1);
	const opacity = 0.55 + driftValue(frame, FPS * 3.6, 0.25, 0.5);

	return (
		<div
			style={{
				position: 'absolute',
				left: x - radius,
				top: y - radius,
				width: radius * 2,
				height: radius * 2,
				borderRadius: '50%',
				backgroundColor: DOT_COLOR,
				opacity,
			}}
		/>
	);
};
