import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {BLUE} from '../palette';

interface Props {
	durationInFrames: number;
}

// Split-focus: two equal panels side by side. Over the line, the right
// panel fades to a dotted outline while the left stays solid with a glow.
export const Nl18Scene: React.FC<Props> = ({durationInFrames}) => {
	const frame = useCurrentFrame();

	const fade = interpolate(frame, [durationInFrames * 0.15, durationInFrames * 0.85], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const panelW = 420;
	const panelH = 560;
	const gap = 60;

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			<rect
				x={CENTER_X - gap / 2 - panelW}
				y={CENTER_Y - panelH / 2}
				width={panelW}
				height={panelH}
				rx={14}
				fill={BLUE}
				opacity={0.9}
				style={{filter: `drop-shadow(0 0 24px ${BLUE}88)`}}
			/>
			<rect
				x={CENTER_X + gap / 2}
				y={CENTER_Y - panelH / 2}
				width={panelW}
				height={panelH}
				rx={14}
				fill={BLUE}
				opacity={0.9 * (1 - fade)}
			/>
			<rect
				x={CENTER_X + gap / 2}
				y={CENTER_Y - panelH / 2}
				width={panelW}
				height={panelH}
				rx={14}
				fill="none"
				stroke={BLUE}
				strokeWidth={3}
				strokeDasharray="10 10"
				opacity={fade}
			/>
		</svg>
	);
};
