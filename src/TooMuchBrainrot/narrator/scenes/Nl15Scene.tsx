import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {YELLOW} from '../palette';

const SEGMENT_COUNT = 4;

// "Four exercises in..." Step tracker: four segments fill left to right,
// staggered; the 4th pulses/glows on landing ("you are here").
export const Nl15Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const stagger = fps * 0.3;

	const segW = 190;
	const gap = 24;
	const totalW = SEGMENT_COUNT * segW + (SEGMENT_COUNT - 1) * gap;
	const left = CENTER_X - totalW / 2;

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			{Array.from({length: SEGMENT_COUNT}).map((_, i) => {
				const startAt = i * stagger;
				const fill = interpolate(frame, [startAt, startAt + fps * 0.25], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const isLast = i === SEGMENT_COUNT - 1;
				const glow = isLast
					? (Math.sin((Math.max(frame - startAt - 8, 0) / (fps * 0.6)) * Math.PI * 2) + 1) / 2
					: 0;
				const x = left + i * (segW + gap);

				return (
					<rect
						key={i}
						x={x}
						y={CENTER_Y - 22}
						width={segW}
						height={44}
						rx={8}
						fill={fill > 0 ? YELLOW : '#3A3A3A'}
						opacity={fill > 0 ? 0.5 + fill * 0.5 + glow * 0.3 : 1}
					/>
				);
			})}
		</svg>
	);
};
