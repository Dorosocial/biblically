import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {CREAM} from '../palette';

interface Props {
	durationInFrames: number;
}

// Full-frame: two large circles. Right fades to near-0 timed to land as
// "disappears" would in the audio (~end of the line).
export const Nl18Scene: React.FC<Props> = ({durationInFrames}) => {
	const frame = useCurrentFrame();

	const rightOpacity = interpolate(frame, [durationInFrames * 0.6, durationInFrames * 0.94], [1, 0.04], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const radius = 170;
	const gap = 420;

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			<circle cx={CENTER_X - gap / 2} cy={CENTER_Y} r={radius} fill={CREAM} opacity={1} />
			<circle cx={CENTER_X + gap / 2} cy={CENTER_Y} r={radius} fill={CREAM} opacity={rightOpacity} />
		</svg>
	);
};
