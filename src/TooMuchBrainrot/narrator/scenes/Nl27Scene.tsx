import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {BoldLabel} from '../BoldLabel';
import {RED} from '../palette';

// "Not finished." A bordered box scales/fades in fast — firm ease-in, no
// overshoot — feels like an interruption.
export const Nl27Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const enter = interpolate(frame, [0, fps * 0.22], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: (t) => t * t,
	});
	const scale = interpolate(enter, [0, 1], [0.85, 1]);

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			<g transform={`translate(${CENTER_X} ${CENTER_Y}) scale(${scale})`} opacity={enter}>
				<rect x={-260} y={-110} width={520} height={220} rx={0} fill="none" stroke={RED} strokeWidth={10} />
				<foreignObject x={-260} y={-50} width={520} height={100}>
					<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
						<BoldLabel color={RED} size={54}>
							Not yet
						</BoldLabel>
					</div>
				</foreignObject>
			</g>
		</svg>
	);
};
