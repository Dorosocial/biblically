import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {driftValue} from '../../drift';
import {CREAM} from '../palette';

const BLOCKS = [
	{w: 150, h: 46},
	{w: 130, h: 42},
	{w: 110, h: 40},
	{w: 90, h: 38},
];

// Deliberate, steady construction — the calm counterpart to nl-2's chaos.
export const Nl3Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const perBlock = fps * 1.6;
	let stackTop = 0;
	const placedBlocks = BLOCKS.map((block, i) => {
		const localT = frame - i * perBlock;
		const settle = interpolate(localT, [0, perBlock * 0.7], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});
		const y = CENTER_Y + 160 - stackTop - block.h * settle;
		stackTop += block.h;
		return {...block, y, opacity: interpolate(localT, [-10, 0], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})};
	});

	const activeIndex = Math.min(Math.floor(frame / perBlock), BLOCKS.length - 1);
	const handY = placedBlocks[activeIndex].y - 10;
	const handSway = driftValue(frame, 40, 4);

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			{placedBlocks.map((b, i) => (
				<rect
					key={i}
					x={CENTER_X - b.w / 2}
					y={b.y}
					width={b.w}
					height={b.h}
					rx={6}
					fill={CREAM}
					opacity={b.opacity}
				/>
			))}
			<g transform={`translate(${CENTER_X - 90 + handSway}, ${handY})`} opacity={0.9}>
				<circle r={26} fill={CREAM} />
			</g>
			<g transform={`translate(${CENTER_X + 90 - handSway}, ${handY})`} opacity={0.9}>
				<circle r={26} fill={CREAM} />
			</g>
		</svg>
	);
};
