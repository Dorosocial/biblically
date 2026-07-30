import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {BoldLabel} from '../BoldLabel';
import {YELLOW} from '../palette';

// "Feel familiar." A looping arrow draws a full circular path, pulses once
// on completion.
export const Nl12Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const loopFrames = fps * 0.8;
	const draw = interpolate(frame, [0, loopFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const pulse = interpolate(frame, [loopFrames, loopFrames + 10, loopFrames + 20], [1, 1.15, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const labelOpacity = interpolate(frame, [loopFrames, loopFrames + 12], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const r = 130;
	const circumference = 2 * Math.PI * r;

	return (
		<>
			<svg width="100%" height="100%" style={{position: 'absolute'}}>
				<g transform={`translate(${CENTER_X} ${CENTER_Y}) scale(${pulse})`}>
					<circle
						cx={0}
						cy={0}
						r={r}
						fill="none"
						stroke={YELLOW}
						strokeWidth={7}
						strokeLinecap="round"
						strokeDasharray={circumference}
						strokeDashoffset={circumference * (1 - draw)}
						transform="rotate(-90)"
					/>
					<polygon
						points={`${r},0 ${r - 22},-14 ${r - 22},14`}
						fill={YELLOW}
						opacity={draw > 0.98 ? 1 : 0}
					/>
				</g>
			</svg>
			<div style={{position: 'absolute', left: CENTER_X - 70, top: CENTER_Y + 170}}>
				<BoldLabel color={YELLOW} size={30} opacity={labelOpacity}>
					Again
				</BoldLabel>
			</div>
		</>
	);
};
