import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y, HEIGHT, WIDTH} from '../../constants';
import {RED} from '../palette';

// "Did you look at the corner?" A wide frame outline, a marker slides into
// one corner and pulses once, a thin dotted line traces from center to it.
export const Nl30Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const cornerX = WIDTH * 0.88;
	const cornerY = HEIGHT * 0.16;

	const slideIn = interpolate(frame, [0, fps * 0.4], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const pulse = interpolate(frame, [fps * 0.4, fps * 0.55, fps * 0.7], [1, 1.5, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const traceDraw = interpolate(frame, [fps * 0.15, fps * 0.5], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const markerX = CENTER_X + (cornerX - CENTER_X) * slideIn;
	const markerY = CENTER_Y + (cornerY - CENTER_Y) * slideIn;

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			<rect
				x={WIDTH * 0.06}
				y={HEIGHT * 0.08}
				width={WIDTH * 0.88}
				height={HEIGHT * 0.84}
				fill="none"
				stroke="#5A5A5A"
				strokeWidth={2}
			/>
			<line
				x1={CENTER_X}
				y1={CENTER_Y}
				x2={CENTER_X + (cornerX - CENTER_X) * traceDraw}
				y2={CENTER_Y + (cornerY - CENTER_Y) * traceDraw}
				stroke={RED}
				strokeWidth={2}
				strokeDasharray="6 8"
				opacity={0.6}
			/>
			<circle cx={markerX} cy={markerY} r={18 * pulse} fill={RED} opacity={slideIn} />
		</svg>
	);
};
