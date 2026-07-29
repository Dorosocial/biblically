import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {driftValue} from '../drift';

export const FakeUIPopup: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({frame, fps, config: {damping: 14, mass: 0.6}});
	const breathe = driftValue(frame, fps * 2.4, 4);
	const y = interpolate(entrance, [0, 1], [40, 0]) + breathe;

	return (
		<div
			style={{
				position: 'absolute',
				right: 90,
				top: 130 + y,
				width: 300,
				padding: '16px 18px',
				borderRadius: 14,
				backgroundColor: '#171C26',
				border: '1px solid #2C3646',
				opacity: entrance,
				transform: `scale(${0.9 + entrance * 0.1})`,
				boxShadow: '0 12px 30px rgba(0,0,0,0.45)',
			}}
		>
			<div style={{width: '60%', height: 12, borderRadius: 4, backgroundColor: '#4E5A6E', marginBottom: 8}} />
			<div style={{width: '90%', height: 10, borderRadius: 4, backgroundColor: '#333E4E'}} />
		</div>
	);
};
