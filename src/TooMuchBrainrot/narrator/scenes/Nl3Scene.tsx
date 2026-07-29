import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, HEIGHT} from '../../constants';
import {driftValue} from '../../drift';
import {CREAM} from '../palette';

const BLOCKS = [
	{w: 460, h: 130},
	{w: 400, h: 118},
	{w: 340, h: 110},
	{w: 280, h: 100},
];

// Deliberate, steady construction, large and central — the calm counterpart
// to nl-2's chaos.
export const Nl3Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const perBlock = fps * 1.6;
	const baseline = HEIGHT * 0.86;
	let stackTop = 0;
	const placedBlocks = BLOCKS.map((block, i) => {
		const localT = frame - i * perBlock;
		const settle = interpolate(localT, [0, perBlock * 0.7], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});
		const y = baseline - stackTop - block.h * settle;
		stackTop += block.h;
		return {
			...block,
			y,
			opacity: interpolate(localT, [-10, 0], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
		};
	});

	const activeIndex = Math.min(Math.floor(frame / perBlock), BLOCKS.length - 1);
	const handY = placedBlocks[activeIndex].y - 20;
	const handSway = driftValue(frame, 40, 10);

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			{placedBlocks.map((b, i) => (
				<rect
					key={i}
					x={CENTER_X - b.w / 2}
					y={b.y}
					width={b.w}
					height={b.h}
					rx={14}
					fill={CREAM}
					opacity={b.opacity}
				/>
			))}
			<g transform={`translate(${CENTER_X - 260 + handSway}, ${handY})`} opacity={0.9}>
				<circle r={78} fill={CREAM} />
			</g>
			<g transform={`translate(${CENTER_X + 260 - handSway}, ${handY})`} opacity={0.9}>
				<circle r={78} fill={CREAM} />
			</g>
		</svg>
	);
};
