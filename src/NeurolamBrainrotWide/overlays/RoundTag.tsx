import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {WIDTH} from '../constants';

export const RoundTag: React.FC<{label: string; startFrame: number}> = ({
	label,
	startFrame,
}) => {
	const frame = useCurrentFrame();
	const local = frame - startFrame;
	const opacity = interpolate(local, [0, 15, 55, 75], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	if (local < -5 || local > 90) {
		return null;
	}

	return (
		<div
			style={{
				position: 'absolute',
				top: 24,
				left: 0,
				width: WIDTH,
				textAlign: 'center',
				opacity,
			}}
		>
			<div
				style={{
					display: 'inline-block',
					fontFamily: '"Helvetica Neue", Arial, sans-serif',
					fontWeight: 700,
					fontSize: 26,
					letterSpacing: '0.3em',
					color: '#9FB4FF',
					textTransform: 'uppercase',
					borderTop: '2px solid #9FB4FF',
					borderBottom: '2px solid #9FB4FF',
					padding: '8px 22px',
				}}
			>
				{label}
			</div>
		</div>
	);
};
