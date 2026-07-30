import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {WHITE} from '../palette';

// "Let's pause." A large pause symbol scales in fast and holds — a hard
// stop, not a soft fade.
export const Nl14Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = interpolate(frame, [0, fps * 0.3], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: (t) => 1 - (1 - t) ** 3,
	});

	const barW = 46;
	const barH = 170;
	const gap = 38;

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			<g transform={`translate(${CENTER_X} ${CENTER_Y}) scale(${scale})`}>
				<rect x={-gap / 2 - barW} y={-barH / 2} width={barW} height={barH} rx={8} fill={WHITE} />
				<rect x={gap / 2} y={-barH / 2} width={barW} height={barH} rx={8} fill={WHITE} />
			</g>
		</svg>
	);
};
