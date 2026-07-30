import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {BoldLabel} from '../BoldLabel';
import {YELLOW} from '../palette';

// "Protect that ability." A padlock's shackle drops into place with a
// click scale-pulse, then fills solid.
export const Nl33Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const shackleDrop = interpolate(frame, [0, fps * 0.35], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: (t) => t * t,
	});
	const click = interpolate(frame, [fps * 0.35, fps * 0.45, fps * 0.6], [1, 1.2, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const labelOpacity = interpolate(frame, [fps * 0.55, fps * 0.8], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const shackleY = -70 + (1 - shackleDrop) * -50;

	return (
		<>
			<svg width="100%" height="100%" style={{position: 'absolute'}}>
				<g transform={`translate(${CENTER_X} ${CENTER_Y}) scale(${click})`}>
					<path
						d={`M -38 ${shackleY + 20} L -38 -70 A 38 38 0 0 1 38 -70 L 38 ${shackleY + 20}`}
						fill="none"
						stroke={YELLOW}
						strokeWidth={14}
						opacity={shackleDrop}
					/>
					<rect x={-64} y={-20} width={128} height={110} rx={12} fill={YELLOW} />
				</g>
			</svg>
			<div style={{position: 'absolute', left: CENTER_X - 90, top: CENTER_Y + 140}}>
				<BoldLabel color={YELLOW} size={30} opacity={labelOpacity}>
					Protect
				</BoldLabel>
			</div>
		</>
	);
};
