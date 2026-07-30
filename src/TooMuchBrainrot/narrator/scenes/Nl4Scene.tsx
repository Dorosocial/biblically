import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {HEIGHT, WIDTH} from '../../constants';
import {BoldLabel} from '../BoldLabel';
import {RED} from '../palette';

// "...what you're up against." An undefined, faceless dark shape rises from
// the right; a red question mark fades in on top after a delay.
export const Nl4Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const shapeIn = interpolate(frame, [0, fps * 0.6], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const riseY = interpolate(shapeIn, [0, 1], [140, 0]);
	const qOpacity = interpolate(frame, [fps * 0.5, fps * 0.9], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<>
			<div
				style={{
					position: 'absolute',
					right: WIDTH * 0.14,
					bottom: -riseY,
					width: 420,
					height: 640,
					borderRadius: '50% 50% 0 0 / 30% 30% 0 0',
					backgroundColor: '#1C1C1C',
					opacity: shapeIn,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					right: WIDTH * 0.14 + 420 / 2 - 60,
					top: HEIGHT * 0.3,
					opacity: qOpacity,
				}}
			>
				<BoldLabel color={RED} size={140} style={{letterSpacing: 0}}>
					?
				</BoldLabel>
			</div>
		</>
	);
};
