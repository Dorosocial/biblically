import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {driftValue} from '../drift';

export const NextVideoThumbnail: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({frame, fps, config: {damping: 16, mass: 0.7}});
	const slideIn = interpolate(entrance, [0, 1], [220, 0]);
	const breathe = driftValue(frame, fps * 2.9, 5, 2.2);

	return (
		<div
			style={{
				position: 'absolute',
				right: -slideIn + breathe,
				bottom: 80,
				width: 260,
				borderRadius: 12,
				overflow: 'hidden',
				opacity: entrance,
				boxShadow: '0 10px 26px rgba(0,0,0,0.5)',
			}}
		>
			<div style={{width: '100%', height: 146, backgroundColor: '#20242E'}} />
			<div style={{padding: 10, backgroundColor: '#14171E'}}>
				<div style={{width: '80%', height: 10, borderRadius: 4, backgroundColor: '#525C6C', marginBottom: 6}} />
				<div style={{width: '50%', height: 8, borderRadius: 4, backgroundColor: '#3A4250'}} />
			</div>
			<div
				style={{
					position: 'absolute',
					bottom: 62,
					right: 10,
					padding: '2px 6px',
					borderRadius: 4,
					backgroundColor: 'rgba(0,0,0,0.75)',
					color: 'white',
					fontFamily: 'sans-serif',
					fontSize: 12,
				}}
			>
				NEXT
			</div>
		</div>
	);
};
