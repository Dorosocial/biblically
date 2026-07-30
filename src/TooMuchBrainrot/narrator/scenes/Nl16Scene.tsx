import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {BoldLabel} from '../BoldLabel';
import {RED} from '../palette';

// "Make it harder." A needle sweeps from EASY to HARD across a semicircular
// dial, with a slight overshoot before settling.
export const Nl16Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const sweep = interpolate(frame, [0, fps * 0.5, fps * 0.6], [0, 1.08, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	// Semicircle from 180deg (EASY, left) to 0deg (HARD, right).
	const angle = Math.PI - sweep * Math.PI;
	const r = 220;
	const needleX = CENTER_X + Math.cos(angle) * r;
	const needleY = CENTER_Y + Math.sin(angle) * r;

	return (
		<>
			<svg width="100%" height="100%" style={{position: 'absolute'}}>
				<path
					d={`M ${CENTER_X - r} ${CENTER_Y} A ${r} ${r} 0 0 1 ${CENTER_X + r} ${CENTER_Y}`}
					fill="none"
					stroke="#8A8A8A"
					strokeWidth={3}
				/>
				<line
					x1={CENTER_X}
					y1={CENTER_Y}
					x2={needleX}
					y2={needleY}
					stroke={RED}
					strokeWidth={7}
					strokeLinecap="round"
				/>
				<circle cx={CENTER_X} cy={CENTER_Y} r={14} fill={RED} />
			</svg>
			<div style={{position: 'absolute', left: CENTER_X - r - 40, top: CENTER_Y + 26}}>
				<BoldLabel color="#8A8A8A" size={24}>
					Easy
				</BoldLabel>
			</div>
			<div style={{position: 'absolute', left: CENTER_X + r - 60, top: CENTER_Y + 26}}>
				<BoldLabel color={RED} size={24}>
					Hard
				</BoldLabel>
			</div>
		</>
	);
};
