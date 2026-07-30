import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {BLUE} from '../palette';

// Post-Ex.1 reveal. A simple checkmark only — no numbers, no stat block.
export const Nl9Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const circleDraw = interpolate(frame, [0, fps * 0.4], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const checkDraw = interpolate(frame, [fps * 0.35, fps * 0.7], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const r = 110;
	const circumference = 2 * Math.PI * r;
	const checkLength = 160;

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			<circle
				cx={CENTER_X}
				cy={CENTER_Y}
				r={r}
				fill="none"
				stroke={BLUE}
				strokeWidth={6}
				strokeLinecap="round"
				strokeDasharray={circumference}
				strokeDashoffset={circumference * (1 - circleDraw)}
				transform={`rotate(-90 ${CENTER_X} ${CENTER_Y})`}
			/>
			<path
				d={`M ${CENTER_X - 46} ${CENTER_Y + 4} L ${CENTER_X - 14} ${CENTER_Y + 36} L ${CENTER_X + 50} ${
					CENTER_Y - 40
				}`}
				fill="none"
				stroke={BLUE}
				strokeWidth={8}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeDasharray={checkLength}
				strokeDashoffset={checkLength * (1 - checkDraw)}
			/>
		</svg>
	);
};
