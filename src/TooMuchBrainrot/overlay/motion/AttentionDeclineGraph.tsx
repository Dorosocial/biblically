import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {CREAM} from '../palette';

interface Props {
	durationInFrames: number;
}

// A gentle downward line drawing itself left-to-right. No axis labels, no
// fabricated numbers — just the shape of decline.
export const AttentionDeclineGraph: React.FC<Props> = ({durationInFrames}) => {
	const frame = useCurrentFrame();

	const width = 420;
	const height = 160;
	const left = CENTER_X - width / 2;
	const top = CENTER_Y - height / 2 - 60;

	const points: [number, number][] = [
		[0, height * 0.15],
		[width * 0.3, height * 0.35],
		[width * 0.55, height * 0.5],
		[width * 0.8, height * 0.78],
		[width, height * 0.92],
	];
	const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');

	// Rough path length estimate for a natural draw-on speed.
	const pathLength = 620;
	const draw = interpolate(frame, [0, durationInFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<svg
			style={{position: 'absolute', left, top, width, height, overflow: 'visible'}}
			viewBox={`0 0 ${width} ${height}`}
		>
			<path
				d={path}
				fill="none"
				stroke={CREAM}
				strokeWidth={3}
				strokeLinecap="round"
				strokeDasharray={pathLength}
				strokeDashoffset={pathLength * (1 - draw)}
				opacity={0.85}
			/>
		</svg>
	);
};
