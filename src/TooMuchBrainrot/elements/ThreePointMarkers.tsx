import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {CENTER_X, CENTER_Y} from '../constants';

// Three markers rotating continuously around a shared circle, 120deg apart.
export const ThreePointMarkers: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const baseAngle = (frame / (fps * 6)) * Math.PI * 2;
	const orbitRadius = 220;

	return (
		<>
			{[0, 1, 2].map((i) => {
				const angle = baseAngle + (i * Math.PI * 2) / 3;
				const x = CENTER_X + Math.cos(angle) * orbitRadius;
				const y = CENTER_Y + Math.sin(angle) * orbitRadius;

				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x - 9,
							top: y - 9,
							width: 18,
							height: 18,
							borderRadius: '50%',
							backgroundColor: '#B98CFF',
						}}
					/>
				);
			})}
		</>
	);
};
