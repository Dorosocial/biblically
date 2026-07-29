import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {PALE_GOLD} from '../palette';

// Full-frame minimal hourglass — gentle continuous rotation, large scale.
export const Nl21Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const rotation = (frame / (fps * 6)) * 360;
	const size = 130;

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			<g transform={`translate(${CENTER_X}, ${CENTER_Y}) rotate(${rotation})`}>
				<polygon points={`${-size},${-size} ${size},${-size} 0,0`} fill={PALE_GOLD} opacity={0.85} />
				<polygon points={`${-size},${size} ${size},${size} 0,0`} fill={PALE_GOLD} opacity={0.85} />
			</g>
		</svg>
	);
};
