import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {HEIGHT, WIDTH} from '../constants';

interface Props {
	corner: 'topLeft' | 'bottomRight';
}

// A shape anchored in a corner that slowly reaches toward center and retreats
// on a continuous cycle (never a static corner ornament).
export const CornerReachShape: React.FC<Props> = ({corner}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const reach = (Math.sin((frame / (fps * 4.8)) * Math.PI * 2) + 1) / 2;
	const travel = 90 * reach;

	const baseLeft = corner === 'topLeft' ? -40 : WIDTH - 100;
	const baseTop = corner === 'topLeft' ? -40 : HEIGHT - 100;
	const dx = corner === 'topLeft' ? travel : -travel;
	const dy = corner === 'topLeft' ? travel : -travel;

	return (
		<div
			style={{
				position: 'absolute',
				left: baseLeft + dx,
				top: baseTop + dy,
				width: 140,
				height: 140,
				borderRadius: 28,
				transform: 'rotate(45deg)',
				backgroundColor: '#FF6B35',
				opacity: 0.35 + reach * 0.35,
			}}
		/>
	);
};
