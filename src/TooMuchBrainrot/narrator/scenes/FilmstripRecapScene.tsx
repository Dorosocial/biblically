import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {WHITE} from '../palette';

const EXERCISE_COUNT = 9; // ex1 through ex9 are complete by this point in the video

// Placed once, right after nl-26, before the Speed Remix — a fast "look how
// far you've come" beat. One tile per exercise completed so far.
export const FilmstripRecapScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const stagger = fps * 0.12;

	const tileW = 96;
	const gap = 14;
	const totalW = EXERCISE_COUNT * tileW + (EXERCISE_COUNT - 1) * gap;
	const left = CENTER_X - totalW / 2;

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			{Array.from({length: EXERCISE_COUNT}).map((_, i) => {
				const startAt = i * stagger;
				const appear = interpolate(frame, [startAt, startAt + fps * 0.2], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const x = left + i * (tileW + gap);
				const scale = interpolate(appear, [0, 1], [0.7, 1]);

				return (
					<g key={i} transform={`translate(${x + tileW / 2} ${CENTER_Y}) scale(${scale})`} opacity={appear}>
						<rect x={-tileW / 2} y={-tileW / 2} width={tileW} height={tileW} rx={10} fill="none" stroke={WHITE} strokeWidth={3} />
						<text x={0} y={14} fontSize={38} fontWeight={800} fill={WHITE} textAnchor="middle">
							{i + 1}
						</text>
					</g>
				);
			})}
		</svg>
	);
};
