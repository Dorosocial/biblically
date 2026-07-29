import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y, DOT_COLOR} from '../../constants';

interface Props {
	durationInFrames: number;
	/** Ex11's echo of this visual: particles disperse outward instead of converging. */
	mirrored?: boolean;
}

const PARTICLE_COUNT = 5;
const ORBIT_RADIUS = 130;

// Three-to-five small particles drift from the periphery and converge onto
// the primary dot's position, foreshadowing the test. Mirrored, they start
// converged and drift back outward — rhyming with, not repeating, the first.
export const DotFormation: React.FC<Props> = ({durationInFrames, mirrored = false}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const progress = interpolate(frame, [fps * 0.3, durationInFrames - fps * 0.3], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const travel = mirrored ? progress : 1 - progress;

	return (
		<>
			{Array.from({length: PARTICLE_COUNT}).map((_, i) => {
				const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
				const x = CENTER_X + Math.cos(angle) * ORBIT_RADIUS * travel;
				const y = CENTER_Y + Math.sin(angle) * ORBIT_RADIUS * travel;
				const opacity = mirrored ? 1 - progress * 0.7 : 0.15 + progress * 0.55;
				const size = 8 - travel * 3;

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
							backgroundColor: DOT_COLOR,
							opacity,
						}}
					/>
				);
			})}
		</>
	);
};
