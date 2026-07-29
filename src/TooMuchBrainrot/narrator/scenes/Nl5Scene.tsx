import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {HEIGHT, WIDTH} from '../../constants';
import {CREAM} from '../palette';

// Full-frame — spans most of the width/height, not a small centered chart.
export const Nl5Scene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();

	const w = WIDTH * 0.74;
	const h = HEIGHT * 0.46;
	const left = (WIDTH - w) / 2;
	const top = (HEIGHT - h) / 2;

	const points: [number, number][] = [
		[0, h * 0.1],
		[w * 0.28, h * 0.3],
		[w * 0.52, h * 0.48],
		[w * 0.78, h * 0.8],
		[w, h * 0.94],
	];
	const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
	const pathLength = 1500;

	const draw = interpolate(frame, [0, durationInFrames * 0.85], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<svg
			style={{position: 'absolute', left, top, width: w, height: h, overflow: 'visible'}}
			viewBox={`0 0 ${w} ${h}`}
		>
			<path
				d={path}
				fill="none"
				stroke={CREAM}
				strokeWidth={6}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeDasharray={pathLength}
				strokeDashoffset={pathLength * (1 - draw)}
				opacity={0.9}
			/>
		</svg>
	);
};
