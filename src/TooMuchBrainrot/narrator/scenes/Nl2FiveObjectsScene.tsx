import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {YELLOW} from '../palette';

const TARGETS = [
	{x: -460, y: -220},
	{x: -460, y: 220},
	{x: 0, y: -320},
	{x: 460, y: -220},
	{x: 460, y: 220},
];

// "...five other things instead." A central icon splits into 5 icons flying
// outward to fixed positions, each with a thin trailing line back to center.
export const Nl2FiveObjectsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const staggerFrames = fps * 0.1;

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			{TARGETS.map((t, i) => {
				const startAt = i * staggerFrames;
				const progress = interpolate(frame, [startAt, startAt + fps * 0.4], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const x = CENTER_X + t.x * progress;
				const y = CENTER_Y + t.y * progress;

				return (
					<React.Fragment key={i}>
						<line
							x1={CENTER_X}
							y1={CENTER_Y}
							x2={x}
							y2={y}
							stroke={YELLOW}
							strokeWidth={2}
							opacity={progress * 0.4}
						/>
						<rect
							x={x - 26}
							y={y - 26}
							width={52}
							height={52}
							rx={8}
							fill={YELLOW}
							opacity={0.4 + progress * 0.6}
						/>
					</React.Fragment>
				);
			})}
			<rect
				x={CENTER_X - 30}
				y={CENTER_Y - 30}
				width={60}
				height={60}
				rx={10}
				fill={YELLOW}
				opacity={0.25}
			/>
		</svg>
	);
};
