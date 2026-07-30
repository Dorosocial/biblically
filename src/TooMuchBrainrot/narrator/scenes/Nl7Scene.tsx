import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {HEIGHT, WIDTH} from '../../constants';
import {RED} from '../palette';

interface Props {
	durationInFrames: number;
}

// "Sit the way you normally sit." A pulsing rec-dot in one corner, a thin
// flat baseline drawn slowly across the frame — a quiet resting state.
export const Nl7Scene: React.FC<Props> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const pulse = (Math.sin((frame / (fps * 0.8)) * Math.PI * 2) + 1) / 2;
	const draw = interpolate(frame, [0, durationInFrames * 0.9], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const lineY = HEIGHT * 0.58;
	const lineW = WIDTH * 0.6;
	const lineLeft = (WIDTH - lineW) / 2;

	return (
		<>
			<div
				style={{
					position: 'absolute',
					left: WIDTH * 0.12,
					top: HEIGHT * 0.14,
					width: 20,
					height: 20,
					borderRadius: '50%',
					backgroundColor: RED,
					opacity: 0.5 + pulse * 0.5,
				}}
			/>
			<svg style={{position: 'absolute', left: lineLeft, top: lineY, width: lineW, height: 4, overflow: 'visible'}}>
				<line
					x1={0}
					y1={2}
					x2={lineW * draw}
					y2={2}
					stroke="#8A8A8A"
					strokeWidth={2}
					opacity={0.7}
				/>
			</svg>
		</>
	);
};
