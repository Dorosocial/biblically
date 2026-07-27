import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {SECTIONS, WIDTH} from '../constants';

export const EndCard: React.FC = () => {
	const frame = useCurrentFrame();
	const local = frame - SECTIONS.finalHold.start;
	const opacity = interpolate(local, [0, 40], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				top: 850,
				left: 0,
				width: WIDTH,
				textAlign: 'center',
				opacity,
			}}
		>
			<div
				style={{
					fontFamily: '"Helvetica Neue", Arial, sans-serif',
					fontWeight: 900,
					fontSize: 52,
					letterSpacing: '0.08em',
					color: '#F2F4F8',
				}}
			>
				NEUROLAM
			</div>
			<div
				style={{
					marginTop: 12,
					fontFamily: '"Helvetica Neue", Arial, sans-serif',
					fontWeight: 500,
					fontSize: 20,
					letterSpacing: '0.12em',
					color: '#7C8AA6',
				}}
			>
				TRAIN YOUR ATTENTION
			</div>
		</div>
	);
};
