import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {WIDTH} from '../constants';
import {driftValue} from '../drift';

const FRAGMENTS = ['wait what', '3.2M watching', 'you sure?', '#1 trending'];

export const RogueTextFragment: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const index = Math.floor(frame / (fps * 1.6)) % FRAGMENTS.length;
	const x = WIDTH * 0.5 + driftValue(frame, fps * 3.3, 120, 0.8);
	const y = 260 + driftValue(frame, fps * 2.7, 30, 1.9);
	const opacity = 0.55 + driftValue(frame, fps * 1.3, 0.35, 0.2);

	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: 'translateX(-50%) rotate(-4deg)',
				fontFamily: 'sans-serif',
				fontSize: 30,
				fontWeight: 700,
				color: '#F5F5F5',
				opacity,
				textShadow: '0 0 12px rgba(0,0,0,0.6)',
			}}
		>
			{FRAGMENTS[index]}
		</div>
	);
};
