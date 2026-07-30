import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CENTER_X, CENTER_Y} from '../../constants';
import {RED} from '../palette';

const BAR_COUNT = 26;

// "...harder to ignore: sound." An irregular, chaotic waveform visualizer —
// not a clean musical beat.
export const Nl19Scene: React.FC = () => {
	const frame = useCurrentFrame();

	const barW = 22;
	const gap = 10;
	const totalW = BAR_COUNT * barW + (BAR_COUNT - 1) * gap;
	const left = CENTER_X - totalW / 2;

	return (
		<svg width="100%" height="100%" style={{position: 'absolute'}}>
			{Array.from({length: BAR_COUNT}).map((_, i) => {
				// Irregular: mix of a few non-harmonic sine waves per bar, seeded by index.
				const seed = i * 7.31;
				const h =
					60 +
					Math.abs(Math.sin(frame * 0.31 + seed) * 140) +
					Math.abs(Math.sin(frame * 0.17 + seed * 2.1) * 90);
				const x = left + i * (barW + gap);

				return (
					<rect
						key={i}
						x={x}
						y={CENTER_Y - h / 2}
						width={barW}
						height={h}
						rx={4}
						fill={RED}
						opacity={0.85}
					/>
				);
			})}
		</svg>
	);
};
