import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {HEIGHT, WIDTH} from '../constants';

// A continuously breathing color wash, not a hard strobe — opacity rides a
// sine so the overlay is never held at a single fixed value.
export const ColorFlashOverlay: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const pulse = (Math.sin((frame / (fps * 0.6)) * Math.PI * 2) + 1) / 2;
	const opacity = 0.06 + pulse * 0.16;

	return (
		<div
			style={{
				position: 'absolute',
				width: WIDTH,
				height: HEIGHT,
				backgroundColor: '#3AA0FF',
				mixBlendMode: 'screen',
				opacity,
			}}
		/>
	);
};
