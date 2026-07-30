import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {BoldLabel} from '../BoldLabel';
import {RED} from '../palette';

// "That's the habit we're testing." A target/crosshair animates in — outer
// rings draw first, center dot locks with a snap scale-pulse.
export const Nl6Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const ringsDraw = interpolate(frame, [0, fps * 0.5], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const lockProgress = interpolate(frame, [fps * 0.45, fps * 0.6], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	// Snap: overshoot then settle.
	const dotScale = interpolate(lockProgress, [0, 0.6, 1], [0, 1.35, 1]);
	const labelOpacity = interpolate(frame, [fps * 0.6, fps * 0.85], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const outerR = 190 * ringsDraw;
	const midR = 120 * ringsDraw;

	return (
		<>
			<svg width="100%" height="100%" style={{position: 'absolute'}}>
				<circle cx={CENTER_X} cy={CENTER_Y} r={outerR} fill="none" stroke={RED} strokeWidth={4} opacity={0.55} />
				<circle cx={CENTER_X} cy={CENTER_Y} r={midR} fill="none" stroke={RED} strokeWidth={4} opacity={0.75} />
				<circle cx={CENTER_X} cy={CENTER_Y} r={54 * dotScale} fill={RED} />
			</svg>
			<div style={{position: 'absolute', left: CENTER_X - 90, top: CENTER_Y + 210}}>
				<BoldLabel color={RED} size={30} opacity={labelOpacity}>
					Testing
				</BoldLabel>
			</div>
		</>
	);
};
