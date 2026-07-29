import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {driftValue} from '../../drift';
import {PALE_GOLD} from '../palette';

const ECHOES = 4;
const ECHO_SPACING_FRAMES = 3;

// A softer, slower cousin of the Speed Remix's own MotionTrail — previewing
// the visual rhythm of ex10 without reusing its exact fast motion.
export const MotionTrailPreview: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const posAt = (f: number) => ({
		x: CENTER_X + driftValue(f, fps * 1.6, 150, 0),
		y: CENTER_Y + driftValue(f, fps * 1.3, 90, 1.2),
	});

	return (
		<>
			{Array.from({length: ECHOES}).map((_, i) => {
				const {x, y} = posAt(frame - i * ECHO_SPACING_FRAMES);
				const opacity = 0.35 * (1 - i / ECHOES);
				const size = 20 - i * 3;

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
							backgroundColor: PALE_GOLD,
							opacity,
						}}
					/>
				);
			})}
		</>
	);
};
