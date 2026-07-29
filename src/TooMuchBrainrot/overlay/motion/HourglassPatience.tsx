import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {PALE_GOLD} from '../palette';

// A minimal abstract hourglass (two mirrored triangles), slowly and
// continuously rotating for the line's duration.
export const HourglassPatience: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const rotation = (frame / (fps * 5)) * 360;
	const size = 26;

	return (
		<div
			style={{
				position: 'absolute',
				left: CENTER_X - size,
				top: CENTER_Y - size * 2,
				transform: `rotate(${rotation}deg)`,
				opacity: 0.8,
			}}
		>
			<div
				style={{
					width: 0,
					height: 0,
					borderLeft: `${size}px solid transparent`,
					borderRight: `${size}px solid transparent`,
					borderTop: `${size * 1.4}px solid ${PALE_GOLD}`,
				}}
			/>
			<div
				style={{
					width: 0,
					height: 0,
					borderLeft: `${size}px solid transparent`,
					borderRight: `${size}px solid transparent`,
					borderBottom: `${size * 1.4}px solid ${PALE_GOLD}`,
				}}
			/>
		</div>
	);
};
