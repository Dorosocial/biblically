import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {SECTIONS, WIDTH} from '../constants';

export const OutroLine: React.FC = () => {
	const frame = useCurrentFrame();
	const local = frame - SECTIONS.outro.start;
	const opacity = interpolate(local, [10, 40, 230, 270], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				top: 860,
				left: 0,
				width: WIDTH,
				textAlign: 'center',
				opacity,
			}}
		>
			<div
				style={{
					fontFamily: '"Helvetica Neue", Arial, sans-serif',
					fontWeight: 700,
					fontSize: 40,
					color: '#F2F4F8',
					letterSpacing: '0.02em',
				}}
			>
				STAY FOCUSED.
			</div>
		</div>
	);
};
