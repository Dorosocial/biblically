import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {YELLOW} from '../palette';

// "...different: patience." An hourglass with sand falling slowly and
// continuously — the slowest, calmest animation in the whole set.
export const Nl21Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const size = 150;
	const fallCycle = fps * 4;
	const fallT = (frame % fallCycle) / fallCycle;

	const streamHeight = interpolate(fallT, [0, 1], [0, size * 0.9]);
	const pileHeight = interpolate(fallT, [0, 1], [4, size * 0.35]);

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			<g transform={`translate(${CENTER_X} ${CENTER_Y})`}>
				<polygon
					points={`${-size},${-size} ${size},${-size} 0,0`}
					fill="none"
					stroke={YELLOW}
					strokeWidth={4}
				/>
				<polygon
					points={`${-size},${size} ${size},${size} 0,0`}
					fill="none"
					stroke={YELLOW}
					strokeWidth={4}
				/>
				{/* Falling stream */}
				<rect x={-3} y={-streamHeight * 0.15} width={6} height={streamHeight * 0.7} fill={YELLOW} opacity={0.8} />
				{/* Settling pile at the bottom */}
				<polygon
					points={`${-pileHeight * 0.9},${size} ${pileHeight * 0.9},${size} 0,${size - pileHeight}`}
					fill={YELLOW}
					opacity={0.9}
				/>
			</g>
		</svg>
	);
};
