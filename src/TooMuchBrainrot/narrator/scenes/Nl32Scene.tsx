import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {GRAY, YELLOW} from '../palette';

interface Props {
	durationInFrames: number;
}

// Core-thesis beat: two thin diverging light-trails split from a single
// point; one brightens and solidifies (the "chosen" path), the other dims
// and fades — deciding, and keeping that decision. Longest linger.
export const Nl32Scene: React.FC<Props> = ({durationInFrames}) => {
	const frame = useCurrentFrame();

	const split = interpolate(frame, [0, durationInFrames * 0.35], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const commit = interpolate(frame, [durationInFrames * 0.35, durationInFrames * 0.7], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const chosenOpacity = 0.55 + commit * 0.45;
	const chosenWidth = 4 + commit * 5;
	const fadedOpacity = 0.45 * (1 - commit * 0.85);

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			<line
				x1={CENTER_X}
				y1={CENTER_Y}
				x2={CENTER_X - 640 * split}
				y2={CENTER_Y - 260 * split}
				stroke={YELLOW}
				strokeWidth={chosenWidth}
				strokeLinecap="round"
				opacity={chosenOpacity}
			/>
			<line
				x1={CENTER_X}
				y1={CENTER_Y}
				x2={CENTER_X + 640 * split}
				y2={CENTER_Y - 180 * split}
				stroke={GRAY}
				strokeWidth={4}
				strokeLinecap="round"
				opacity={fadedOpacity}
			/>
			<circle cx={CENTER_X} cy={CENTER_Y} r={14} fill={YELLOW} opacity={0.9} />
		</svg>
	);
};
