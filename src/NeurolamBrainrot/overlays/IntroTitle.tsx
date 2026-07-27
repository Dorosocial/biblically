import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {WIDTH} from '../constants';

export const IntroTitle: React.FC = () => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [15, 45, 230, 280], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				top: 300,
				left: 0,
				width: WIDTH,
				textAlign: 'center',
				opacity,
				padding: '0 90px',
			}}
		>
			<div
				style={{
					fontFamily: '"Helvetica Neue", Arial, sans-serif',
					fontWeight: 800,
					fontSize: 60,
					lineHeight: 1.2,
					color: '#F2F4F8',
					letterSpacing: '-0.01em',
				}}
			>
				TOO MUCH BRAINROT CONTENT
				<br />
				WILL MAKE YOU FAIL THIS
			</div>
		</div>
	);
};
