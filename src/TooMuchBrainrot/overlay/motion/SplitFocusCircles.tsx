import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {CREAM} from '../palette';

interface Props {
	durationInFrames: number;
}

// Two equal circles, both opaque at first. The right one fades toward near-0
// timed to land at the end of this VO line (where "disappears" would sit in
// the audio). The left stays solid the whole time.
export const SplitFocusCircles: React.FC<Props> = ({durationInFrames}) => {
	const frame = useCurrentFrame();

	const rightOpacity = interpolate(frame, [durationInFrames * 0.55, durationInFrames * 0.95], [1, 0.05], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const radius = 60;
	const gap = 180;

	return (
		<>
			<div
				style={{
					position: 'absolute',
					left: CENTER_X - gap / 2 - radius,
					top: CENTER_Y - radius,
					width: radius * 2,
					height: radius * 2,
					borderRadius: '50%',
					backgroundColor: CREAM,
					opacity: 1,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: CENTER_X + gap / 2 - radius,
					top: CENTER_Y - radius,
					width: radius * 2,
					height: radius * 2,
					borderRadius: '50%',
					backgroundColor: CREAM,
					opacity: rightOpacity,
				}}
			/>
		</>
	);
};
