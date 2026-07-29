import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../constants';
import {driftValue} from '../drift';

const ECHOES = 5;
const ECHO_SPACING_FRAMES = 2;

// Fast-cut trail: several ghost copies sampled at slightly earlier frames
// along a fast circular path, fading out with distance from the head.
export const MotionTrail: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const posAt = (f: number) => ({
		x: CENTER_X + driftValue(f, fps * 0.9, 260, 0),
		y: CENTER_Y + driftValue(f, fps * 0.7, 150, 1.6),
	});

	return (
		<>
			{Array.from({length: ECHOES}).map((_, i) => {
				const {x, y} = posAt(frame - i * ECHO_SPACING_FRAMES);
				const opacity = 0.5 * (1 - i / ECHOES);
				const size = 30 - i * 4;

				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x - size / 2,
							top: y - size / 2,
							width: size,
							height: size,
							borderRadius: '50%',
							backgroundColor: '#3AA0FF',
							opacity,
						}}
					/>
				);
			})}
		</>
	);
};
