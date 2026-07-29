import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {SOFT_GRAY} from '../palette';

interface Props {
	durationInFrames: number;
}

// One single breath across the full span of both lines — full-frame scale.
export const Nl1516Scene: React.FC<Props> = ({durationInFrames}) => {
	const frame = useCurrentFrame();

	const breath = Math.sin(Math.PI * Math.min(Math.max(frame / durationInFrames, 0), 1));
	const radius = 260 + breath * 340;

	return (
		<div
			style={{
				position: 'absolute',
				left: CENTER_X - radius,
				top: CENTER_Y - radius,
				width: radius * 2,
				height: radius * 2,
				borderRadius: '50%',
				background: `radial-gradient(circle, ${SOFT_GRAY}22 0%, transparent 68%)`,
			}}
		/>
	);
};
