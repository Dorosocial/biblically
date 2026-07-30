import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {BLUE} from '../palette';

// Points forming a simple checkmark shape once connected.
const DOTS: [number, number][] = [
	[-220, -20],
	[-60, 140],
	[260, -180],
];

// Payoff line — "connect the dots" reveal. Dots animate connecting lines
// between them, forming a clear shape by the end. Slightly more weight.
export const Nl31Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const perDot = fps * 0.5;

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			{DOTS.slice(1).map((p, i) => {
				const [x1, y1] = DOTS[i];
				const [x2, y2] = p;
				const startAt = (i + 1) * perDot;
				const lineDraw = interpolate(frame, [startAt, startAt + perDot * 0.8], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				return (
					<line
						key={i}
						x1={CENTER_X + x1}
						y1={CENTER_Y + y1}
						x2={CENTER_X + x1 + (x2 - x1) * lineDraw}
						y2={CENTER_Y + y1 + (y2 - y1) * lineDraw}
						stroke={BLUE}
						strokeWidth={5}
						strokeLinecap="round"
					/>
				);
			})}
			{DOTS.map(([x, y], i) => {
				const startAt = i * perDot;
				const appear = interpolate(frame, [startAt, startAt + fps * 0.25], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				return (
					<circle
						key={i}
						cx={CENTER_X + x}
						cy={CENTER_Y + y}
						r={16 * appear}
						fill={BLUE}
					/>
				);
			})}
		</svg>
	);
};
